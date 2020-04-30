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

const getRecount = (request, response) => {
    let pedestrian_id = request.params.pedestrian_id;

    let query = `SELECT
                    (SELECT COUNT(*) as forms_count
                    FROM gemott.form
                    where pedestrian_id = ${pedestrian_id}  
                    ),
                    (SELECT COUNT(*) as routes_count
                    FROM gemott.route
                    where pedestrian_id = ${pedestrian_id});
                `
    pool.query(query, (err, res) => {
        if (err) {
            console.error('Error running the query. ', err.stack)
            return response.json({
                mensaje: 'Ops! Sorry, there has been an error running the query'
            })
        }
        let data = res.rows[0]
        response.json(data)
    })
};

const getDistance = (request, response) => {
    let pedestrian_id = request.params.pedestrian_id;
    // call getRouteGeoJSON
}


module.exports = { getRecount }