// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const { getMyOrders, getOrderById, addOrderItems, protectOrder } = require('../controllers/orderController');

// Private routes
router.route('/').post(protectOrder, addOrderItems); // <-- استخدام الـ middleware
router.route('/myorders').get(protectOrder, getMyOrders); // <-- استخدام الـ middleware
router.route('/:id').get(protectOrder, getOrderById); // <-- استخدام الـ middleware

module.exports = router;