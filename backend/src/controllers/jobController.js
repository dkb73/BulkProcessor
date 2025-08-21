const csvQueue = require('../queues/csvQueue');
const Job = require('../models/jobModel');
const { Parser } = require('json2csv');

exports.getJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await csvQueue.getJob(id);

        if (!job) {
            return res.status(404).json({ status: 'fail', message: 'Job not found' });
        }

        const state = await job.getState();
        const progress = job.progress;
        const returnValue = job.returnvalue;
        const failedReason = job.failedReason;

        res.status(200).json({
            status: 'success',
            data: {
                jobId: job.id,
                state,
                progress,
                result: returnValue,
                error: failedReason,
            },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Could not fetch job status' });
    }
};

exports.downloadErrorReport = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ jobId: id, user: req.user._id });

        if (!job) {
            return res.status(404).json({ status: 'fail', message: 'Job not found' });
        }

        if (job.errorCount === 0 || !job.errorDetails) {
            return res.status(400).json({ status: 'fail', message: 'No errors to report for this job.' });
        }

        // We want to include the original data columns plus our new error message column
        const fields = Object.keys(job.errorDetails[0].rowData).concat('errorMessage');
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(job.errorDetails.map(err => ({
            ...err.rowData,
            errorMessage: err.errorMessage
        })));
        
        res.header('Content-Type', 'text/csv');
        res.attachment(`error-report-job-${id}.csv`);
        res.send(csv);

    } catch (error) {
        console.error("Download error:", error)
        res.status(500).json({ status: 'error', message: 'Could not generate error report' });
    }
}