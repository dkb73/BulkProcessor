const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    jobId: { type: String, required: true, unique: true },
    originalFilename: { type: String, required: true },
    // Let's add more descriptive statuses
    status: {
        type: String,
        enum: ['queued', 'processing', 'completed', 'completed_with_errors', 'failed'],
        default: 'queued',
    },
    // --- NEW FIELDS ---
    processedCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    // This will store the actual rows that failed and why
    errorDetails: [{
        rowData: mongoose.Schema.Types.Mixed, // To store the original row object
        errorMessage: String,
    }],
    // --- END OF NEW FIELDS ---
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;