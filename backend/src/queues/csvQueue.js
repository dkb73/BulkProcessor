const { Queue } = require('bullmq');
require('dotenv').config();

// Redis connection options
const redisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
};

// Create a new queue named 'csv-processing-queue'
const csvQueue = new Queue('csv-processing-queue', {
    connection: redisOptions,
});

module.exports = csvQueue;