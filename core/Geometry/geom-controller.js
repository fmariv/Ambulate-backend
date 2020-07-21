const Pool = require('pg').Pool
const GeoJSON = require('geojson');
const config = require('../../config.js');
const { db: { user, host, database, password, port } } = config;

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
})

class RouteService {

    get(request, response) {
        let pedestrian_id = request.params.pedestrian_id;
        let layerQuery = `SELECT ST_AsGeoJSON(t.geom) FROM gemott.route AS t WHERE pedestrian_id = ${pedestrian_id};`
        
        // Query the geometries
        pool.query(layerQuery, (err, res) => {
            if (err) {
                console.error('Error running the query. ', err.stack)
                return response.json({
                    mensaje: 'Ops! Sorry, there has been an error running the query'
                })
            }
            let data = [];
            res.rows.forEach(element => {
                data.push(JSON.parse(element.st_asgeojson));
            });

            // Parse and send the geoJSON
            let geojson = GeoJSON.parse(data, {LineString: 'coordinates'})
            response.json(geojson)
        });
    }


}

class FormService {

    // revisar la respuesta
    get(request, response) {
        let pedestrian_id = request.params.pedestrian_id;
        let layerQuery = `select ST_AsGeoJSON(t.*)
                    FROM (select 
                    t1.answer, t2.answer, t3.geom from gemott.quest1 as t1, gemott.quest2 as t2, gemott.form as t3 
                    where t2.form_id = t3.id 
                    and t1.form_id = t3.id 
                    and t3.pedestrian_id = ${pedestrian_id})
                    as T(ans1, ans2, geom);`
        
        // Query the geometries
        pool.query(layerQuery, (err, res) => {
            if (err) {
                console.error('Error running the query. ', err.stack)
                return response.json({
                    mensaje: 'Ops! Sorry, there has been an error running the query'
                })
            }
            let data = [];
            res.rows.forEach(element => {
                data.push(JSON.parse(element.st_asgeojson));

            });

            // Parse and send the geoJSON
            let geojson = GeoJSON.parse(data, {GeoJSON: 'geometry'})
            response.json(geojson)
        });
    }

}




module.exports = { RouteService, FormService }