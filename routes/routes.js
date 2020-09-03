const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { RouteService, FormService } = require('../core/Geometry/geom-controller.js');
const { StatService } = require('../core/Statistics/stats-controller.js');

const routes = new RouteService()
const forms = new FormService()
const stats = new StatService()

const jsonParser = bodyParser.json()

// Get geometries and data
router.get('/pedestrians/:pedestrian_id/routes', routes.get)
router.get('/pedestrians/:pedestrian_id/forms', forms.get)
// Post geometries and data
router.post('/pedestrians/route', jsonParser, routes.post)
// Get statistics
router.get('/pedestrians/:pedestrian_id/stats-recount', stats.recount)

module.exports = router;