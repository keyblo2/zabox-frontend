// backend/controllers/vendorController.js
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware'); // <-- Import

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Public
const getVendors = async (req, res) => {
  try {
    console.log('جاري جلب البائعين من قاعدة البيانات...'); // <-- إضافة للـ log
    const vendors = await Vendor.find({ isActive: true }).populate('userId', 'name email');
    console.log('البائعين اتجابوا بنجاح:', vendors); // <-- إضافة للـ log
    res.json(vendors);
  } catch (error) {
    console.error('خطأ في دالة getVendors:', error); // <-- تعديل الرسالة علشان تظهر في الـ Terminal
    // إرجاع رسالة أكثر تفصيلاً في الـ JSON
    res.status(500).json({ 
      message: 'Server Error - ' + error.message,
      // stack: error.stack // ممكن تضيف الـ stack trace علشان تفهم الخطأ أكتر (بس في الإنتاج ممكن تمسحه)
    });
  }
};

// @desc    Get vendor by ID
// @route   GET /api/vendors/:id
// @access  Public
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('userId', 'name email');
    
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    console.error('Error in getVendorById:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new vendor (for admin or user becoming vendor)
// @route   POST /api/vendors
// @access  Private
const createVendor = async (req, res) => {
  try {
    const { businessName, description, location, deliveryRadius, deliveryFee, openingHours, categories } = req.body;

    // Validation
    if (!businessName || !location) {
      return res.status(400).json({ message: 'Please include business name and location' });
    }

    // Create vendor
    const vendor = new Vendor({
      userId: req.user.id, // من التوكن
      businessName,
      description,
      location,
      deliveryRadius,
      deliveryFee,
      openingHours,
      categories
    });

    const createdVendor = await vendor.save();
    res.status(201).json(createdVendor);
  } catch (error) {
    console.error('Error in createVendor:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  // نصدر الـ middleware علشان نستخدمه في الـ route
  protectVendor: protect
};