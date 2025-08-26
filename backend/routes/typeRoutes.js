const express = require('express');
const router = express.Router();

const {packagetype,getAllPackages, deletePackages, allPackages, editPackages} = require('../controllers/PackageController');

router.post('/package-type',packagetype);
router.get('/all-packages',getAllPackages);
router.delete('/:id',deletePackages);
router.get('/allpackages',allPackages)
router.put('/edit-package/:id', editPackages);

module.exports = router;