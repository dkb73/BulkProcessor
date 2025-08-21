const SaleRecord = require('../models/saleRecordModel');

exports.getSalesData = async (req, res) => {
    try {
        // --- 1. FILTERING: Ensure users only get their own data ---
        // We get req.user from our 'protect' middleware
        const filter = { user: req.user._id };

        // --- 2. PAGINATION: Get page and limit from query string, with defaults ---
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50; // Show 50 records per page by default
        const skip = (page - 1) * limit; // Calculate the number of records to skip

        // --- 3. SORTING: Get sort field from query string, with a default ---
        const sort = req.query.sort || '-orderDate'; // Default sort by newest order date

        // --- 4. EXECUTE THE QUERY ---
        // First, get the records for the current page
        const salesData = await SaleRecord.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Second, get the total count of records matching the filter (for calculating total pages)
        const totalRecords = await SaleRecord.countDocuments(filter);
        const totalPages = Math.ceil(totalRecords / limit);

        // --- 5. SEND THE RESPONSE ---
        res.status(200).json({
            status: 'success',
            results: salesData.length,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
            },
            data: salesData,
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve sales data.',
            error: error.message,
        });
    }
};