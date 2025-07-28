// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// تكوين التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // مجلد حفظ الصور
  },
  filename: (req, file, cb) => {
    // اسم الملف: تاريخ_اسم-الملف-الأصلي
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// تحقق من نوع الملف
const fileFilter = (req, file, cb) => {
  // السماح بالصور فقط
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// تكوين رفع الملفات
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

module.exports = upload;