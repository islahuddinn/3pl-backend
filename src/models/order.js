// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true,
    },
    objectId: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        unique: true,
    },
    durationTerms: {
        type: String,
        required: true,
    },
    arrivesBy: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    sellerCompany: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
    },
    companyContactNo: {
        type: String,
        required: true,
    },
    dateOrderSubmitted: {
        type: Date,
        required: true,
    },
    dateOrderShippedOut: {
        type: Date,
    },
    state: {
        type: String,
        required: true,
    },
    dateOfDelivery: {
        type: Date,
    },
    fulfillmentWorkerId: {
        type: String,
        required: true,
    },
    fulfillmentWorkerName: {
        type: String,
        required: true,
    },
    courierCompany: {
        type: String,
        required: true,
    },
    trackingNumber: {
        type: String,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
