const express = require('express');
const router = express.Router();

const { RouteService, FormService } = require('../core/Geometry/geom-controller.js');
const { StatService } = require('../core/Statistics/stats-controller.js');

const routes = new RouteService()
const forms = new FormService()
const stats = new StatService()

// Get geometries and data
router.get('/pedestrians/:pedestrian_id/routes', routes.get)
router.get('/pedestrians/:pedestrian_id/forms', forms.get)
// Get statistics
router.get('/pedestrians/:pedestrian_id/stats-recount', stats.recount)

module.exports = router;