const mongoose = require('mongoose');

const saleRecordSchema = new mongoose.Schema({
    region: String,
    country: String,
    itemType: String,
    salesChannel: String,
    orderPriority: String,
    orderDate: Date,
    orderId: {
        type: Number,
        unique: true,
    },
    shipDate: Date,
    unitsSold: Number,
    unitPrice: Number,
    unitCost: Number,
    totalRevenue: Number,
    totalCost: Number,
    totalProfit: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const SaleRecord = mongoose.model('SaleRecord', saleRecordSchema);

module.exports = SaleRecord;