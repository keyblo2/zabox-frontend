// backend/controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/authMiddleware'); // <-- Import

// ... باقي الكود ...

// @desc    Get all orders for a user
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).populate('vendorId', 'businessName');
    res.json(orders);
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('vendorId', 'businessName location')
      .populate('driverId', 'userId');

    if (order) {
      // Make sure user is owner of order
      if (order.customerId._id.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error in getOrderById:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      paymentMethod,
      deliveryFee,
      tax,
      totalAmount,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      // Here you would get vendor details from the first item
      // For simplicity, we'll assume all items are from the same vendor
      const vendorId = orderItems[0].vendorId;
      const vendor = await Vendor.findById(vendorId);

      const order = new Order({
        customerId: req.user.id, // من التوكن
        vendorId,
        items: orderItems,
        deliveryFee: deliveryFee || 0,
        tax: tax || 0,
        totalAmount,
        paymentMethod,
        locations: {
          vendor: vendor.location,
          customer: deliveryAddress,
        },
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('Error in addOrderItems:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getMyOrders,
  getOrderById,
  addOrderItems,
  // نصدر الـ middleware
  protectOrder: protect
};