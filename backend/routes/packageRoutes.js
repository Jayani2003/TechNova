const express = require('express');
const router = express.Router();
const upload = require('../middleware/packageUploadMiddleware');
const pkgCtrl = require('../controllers/packageController');

// Admin create package - accept one packageImage and multiple destImages
router.post('/admin/packages', upload.fields([
  { name: 'packageImage', maxCount: 1 },
  { name: 'destImages', maxCount: 20 }
]), pkgCtrl.createPackage);

// Admin list packages for table
router.get('/admin/packages', pkgCtrl.listAdminPackages);

// Public list
router.get('/', pkgCtrl.listPublicPackages);

// Public package detail
router.get('/:id', pkgCtrl.getPackageDetail);

module.exports = router;
