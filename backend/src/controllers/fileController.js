const csvQueue = require('../queues/csvQueue');
const Job = require('../models/jobModel');

exports.uploadFile = async (req, res) => {
    try {
        // The auth middleware gives us req.user
        // The multer middleware gives us req.file
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Add a job to the queue
        const job = await csvQueue.add('process-csv', {
            filePath: req.file.path,//from multer middleware
            userId: req.user._id, // From our auth middleware
            originalFilename: req.file.originalname,
        });

        //create record for this job in mongodb
        await Job.create({
            jobId: job.id,
            originalFilename: req.file.originalname,
            user: req.user._id,
        });

        // Respond immediately to the user
        res.status(202).json({
            status: 'success',
            message: 'File uploaded and is now being processed.',
            jobId: job.id,
        });

    } catch (error) {
        console.error('Error adding job to queue:', error);
        res.status(500).json({ status: 'error', message: 'Failed to queue the file for processing.' });
    }
};