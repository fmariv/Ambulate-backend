const express = require('express');
const router = express.Router();

const geomController = require('../core/Geometry/geom-controller.js');
const statsController = require('../core/Statistics/stats-controller.js')

// Get geometries and data
router.get('/pedestrians/:pedestrian_id/routes', geomController.getRoutesGeoJson)
router.get('/pedestrians/:pedestrian_id/forms', geomController.getFormsGeoJson)
// Get statistics
router.get('/pedestrians/:pedestrian_id/stats-recount', statsController.getRecount)

module.exports = router;