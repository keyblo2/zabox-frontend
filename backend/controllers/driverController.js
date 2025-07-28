// backend/controllers/driverController.js
const Driver = require('../models/Driver');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all available drivers
// @route   GET /api/drivers
// @access  Public (أو Private للـ Admin)
const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ status: 'available' }).populate('userId', 'name email phone');
    res.json(drivers);
  } catch (error) {
    console.error('Error in getDrivers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get driver by ID
// @route   GET /api/drivers/:id
// @access  Public
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('userId', 'name email phone');
    
    if (driver) {
      res.json(driver);
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (error) {
    console.error('Error in getDriverById:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update driver location
// @route   PUT /api/drivers/location
// @access  Private (للطيار)
const updateDriverLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Validation
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Find driver by userId (from token)
    let driver = await Driver.findOne({ userId: req.user.id });

    if (driver) {
      // Update location
      driver.currentLocation = { lat, lng };
      const updatedDriver = await driver.save();
      res.json(updatedDriver);
    } else {
      res.status(404).json({ message: 'Driver profile not found' });
    }
  } catch (error) {
    console.error('Error in updateDriverLocation:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update driver status
// @route   PUT /api/drivers/status
// @access  Private (للطيار)
const updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validation
    if (!status || !['available', 'delivering', 'offline'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required (available, delivering, offline)' });
    }

    // Find driver by userId (from token)
    let driver = await Driver.findOne({ userId: req.user.id });

    if (driver) {
      // Update status
      driver.status = status;
      const updatedDriver = await driver.save();
      res.json(updatedDriver);
    } else {
      res.status(404).json({ message: 'Driver profile not found' });
    }
  } catch (error) {
    console.error('Error in updateDriverStatus:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDrivers,
  getDriverById,
  updateDriverLocation,
  updateDriverStatus,
  protectDriver: protect // نصدر الـ middleware
};