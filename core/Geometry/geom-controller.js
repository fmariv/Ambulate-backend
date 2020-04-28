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

const getGeoJson = (request, response) => {
    let pedestrian_id = request.params.pedestrian_id;
    let layer = request.params.layer;
    let layerQuery = ``


    // Define the query depending on the layer to retrieve
    if (layer == 'route') {
        layerQuery = `SELECT ST_AsGeoJSON(t.geom) FROM gemott.route AS t WHERE pedestrian_id = ${pedestrian_id};`
    }
    else if (layer == 'form') {
        layerQuery = `select ST_AsGeoJSON(t.*)
                FROM (select 
                t1.answer, t2.answer, t3.geom from gemott.quest1 as t1, gemott.quest2 as t2, gemott.form as t3 
                where t2.form_id = t3.id 
                and t1.form_id = t3.id 
                and t3.pedestrian_id = ${pedestrian_id})
                as T(ans1, ans2, geom);`
    }
    else {
        console.error(`The layer ${layer} does not exist in the database`)
        return response.json({
            mensaje: `Ops! The layer ${layer} does not exist in the database!`
        })
    }
    
    // Query the geometries
    pool.query(layerQuery, (err, res) => {
        if (err) {
            console.error('Error running the query. ', err.stack)
            return response.json({
                mensaje: 'Ops! Sorry, there has been an error running the query'
            })
        }
        // Omit the 'geom' value
        let geoms = [];
        res.rows.forEach(element => {
            let row = _.omit(element, 'geom');
            geoms.push(JSON.parse(row.st_asgeojson));

        });

        // Parse and send the geoJSON
        let geojson;
        if (layer == 'route') {
            geojson = GeoJSON.parse(geoms, {LineString: 'coordinates'})
        }
        else if (layer == 'form') {
            geojson = GeoJSON.parse(geoms, {Point: 'coordinates'})
        }
        response.json(geojson)
    });
}


module.exports = { getGeoJson }