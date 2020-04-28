const express = require('express');
const router = express.Router();

const geomController = require('../core/Geometry/geom-controller.js');

// Retrieve geometries
router.get('/pedestrians/:pedestrian_id/:layer', geomController.getGeoJson)

module.exports = router;