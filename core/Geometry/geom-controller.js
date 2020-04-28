const Pool = require('pg').Pool
const GeoJSON = require('geojson');
const config = require('../../config.js');
const { db: { user, host, database, password, port } } = config;
const _ = require('underscore');

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
})

const getRoutesGeoJson = (request, response) => {
    let pedestrian_id = request.params.pedestrian_id;
    let routeQuery = `SELECT ST_AsGeoJSON(t.geom) FROM gemott.route AS t WHERE pedestrian_id = ${pedestrian_id};`

    pool.query(routeQuery, (err, res) => {
        if (err) {
            console.error('Error running the query. ', err.stack)
            return response.json({
                mensaje: `Ops! Sorry, there has been an error running the query`
            })
        }
        // Omit the 'geom' value
        let routes = [];
        res.rows.forEach(element => {
            let row = _.omit(element, 'geom');
            routes.push(JSON.parse(row.st_asgeojson));

        });

        let routesGeojson = GeoJSON.parse(routes, {LineString: 'coordinates'})
        response.json(routesGeojson)
    });
}


module.exports = { getRoutesGeoJson }