const { Worker } = require("bullmq");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const IORedis = require("ioredis");

const connectDB = require("../config/db");
const SaleRecord = require("../models/saleRecordModel");
const Job = require("../models/jobModel");

connectDB();

const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
};

const publisher = new IORedis(redisOptions);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processor = async (job) => {
  console.log(
    `Starting to process job ${job.id} for file ${job.data.originalFilename}...`
  );
  const { filePath, userId } = job.data;
  const allRows = [];
  const validRows = [];
  const failedRows = [];

  // Step 1: Read all rows from CSV into memory
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(filePath))
      .pipe(csv())
      .on("data", (data) => allRows.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  // Step 2: Validate all rows and separate them
  for (const row of allRows) {
    try {
      if (!row["Order ID"] || isNaN(parseInt(row["Order ID"])))
        throw new Error("Missing or invalid Order ID");
      const saleRecord = {
        region: row["Region"],
        country: row["Country"],
        itemType: row["Item Type"],
        salesChannel: row["Sales Channel"],
        orderPriority: row["Order Priority"],
        orderDate: new Date(row["Order Date"]),
        orderId: parseInt(row["Order ID"]),
        shipDate: new Date(row["Ship Date"]),
        unitsSold: parseInt(row["Units Sold"]),
        unitPrice: parseFloat(row["Unit Price"]),
        unitCost: parseFloat(row["Unit Cost"]),
        totalRevenue: parseFloat(row["Total Revenue"]),
        totalCost: parseFloat(row["Total Cost"]),
        totalProfit: parseFloat(row["Total Profit"]),
        user: userId,
      };
      for (const key in saleRecord) {
        if (typeof saleRecord[key] === "number" && isNaN(saleRecord[key])) {
          throw new Error(`Invalid number format in column: ${key}`);
        }
      }
      validRows.push(saleRecord);
    } catch (error) {
      failedRows.push({ rowData: row, errorMessage: error.message });
    }
  }
  console.log(
    `Validation complete. Valid rows: ${validRows.length}, Failed rows: ${failedRows.length}`
  );

  // --- THIS IS THE CORRECTED BATCH PROCESSING LOGIC ---
  // Step 3: Process the VALID rows in batches to insert/update in DB
  const batchSize = 100;
  let rowsUpserted = 0;
  for (let i = 0; i < validRows.length; i += batchSize) {
    const batch = validRows.slice(i, i + batchSize);
    const bulkOps = batch.map((record) => ({
      updateOne: {
        filter: { orderId: record.orderId },
        update: { $set: record },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await SaleRecord.bulkWrite(bulkOps);
    }

    rowsUpserted += batch.length;

    // Report and publish progress
    const progress = {
      processed: rowsUpserted,
      total: validRows.length,
      failed: failedRows.length,
    };
    await job.updateProgress(progress);
    publisher.publish(
      "job-updates",
      JSON.stringify({ jobId: job.id, progress, status: "active" })
    );
    console.log(
      `Progress for job ${job.id}: ${rowsUpserted} / ${validRows.length} rows processed.`
    );

    await delay(200); // A smaller delay is fine now
  }
  // --- END OF CORRECTED LOGIC ---

  // Step 4: Update our Job model in MongoDB with the final status and errors
  const finalStatus =
    failedRows.length > 0 ? "completed_with_errors" : "completed";
  const finalResult = {
    jobId: job.id,
    status: finalStatus,
    processedCount:validRows.length,
    errorCount:failedRows.length,
    progress :{
        processed: validRows.length,
        total:allRows.length,
    }
  };

  await Job.findOneAndUpdate(
    { jobId: job.id },
    { ...finalResult, errorDetails: failedRows, completedAt: new Date() }
  );

  // Step 5: Publish the final update via WebSocket
  publisher.publish("job-updates", JSON.stringify(finalResult));
  console.log(`Job ${job.id} finished with status: ${finalStatus}`);

  fs.unlinkSync(filePath);
  return finalResult;
};

const worker = new Worker("csv-processing-queue", processor, {
  connection: redisOptions,
  concurrency: 5,
});

worker.on("completed", (job, result) => {
  // Now the result will be correctly passed from the processor's return value
  console.log(
    `Job ${job.id} has completed in BullMQ! Final Status: ${result?.status}`
  );
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} has failed in BullMQ with ${err.message}`);
});

console.log("Worker is listening for jobs...");
