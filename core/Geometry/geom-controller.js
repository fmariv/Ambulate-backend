/**
 * Services that control the CRUD and HTTP methods
 * for the geometry data
 * 
 * @author Fran Martín
 * @since 0.1
 */


const Pool = require('pg').Pool
const GeoJSON = require('geojson');
const config = require('../../db/config.js');
const { db: { user, host, database, password, port } } = config;

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
})

class RouteService {
    /** 
     * Class that controls the functions of persistent storage 
     * and retrieving of routes
     * 
    */

    get(request, response) {
        /**
         * Function that retrieves a GeoJSON that contains
         * the geometry of all the routes walked by
         * a pedestrian
         */
        let pedestrianId = request.params.pedestrian_id;
        let layerQuery = `SELECT ST_AsGeoJSON(t.geom) FROM gemott.route AS t WHERE pedestrian_id = ${pedestrianId};`
        
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
            let geoJson = GeoJSON.parse(data, {LineString: 'coordinates'})
            response.json(geoJson)
        });
    }

    insert(request, response) {
        /**
         * Function that inserts a route currently walked
         * by a pedestrian into the database and returns
         * the ID
         */
        let pedestrianId = request.params.pedestrian_id
        let sqlQuery = `INSERT INTO gemott.route (pedestrian_id)
                        VALUES(${pedestrianId})
                        RETURNING id;
                        `

        pool.query(sqlQuery, (err, res) => {
            if (err) {
                console.error('Error running the query. ', err.stack)
                return response.json({
                mensaje: 'Ops! Sorry, there has been an error running the query'
            })
            }
            let json = res.rows[0]
            response.json(json)
        })
    }

    post(request, response) {      
        /**
         * Function that posts a route walked
         * by a pedestrian into the database
         */
        let pedestrianId = request.params.pedestrian_id 
        let routeId = request.body.properties.route_id
        let geometry = JSON.stringify(request.body.geometry)
        let geoJson = request.body
        let layerQuery = `UPDATE gemott.route
                          SET geom = ST_TRANSFORM(ST_GeomFromGeoJSON('${geometry}'), 25831)
                          WHERE id=${routeId} AND pedestrian_id=${pedestrianId}
                          ;`
        
        pool.query(layerQuery, (err, res) => {
        if (err) {
            console.log(layerQuery)
            console.error('Error running the query. ', err.stack)
            return response.json({
                mensaje: 'Ops! Sorry, there has been an error running the query'
            })
        }
        response.json(geoJson)
        });
    }
}

class FormService {
    /**
     * Class that controls the functions of persistent storage
     * and retrieving of forms
     */

    get(request, response) {
        /**
         * Function that retrieves a GeoJSON that contains
         * the geometry of all the forms answered by
         * a pedestrian
         */
        let pedestrianID = request.params.pedestrian_id;
        let layerQuery = `select ST_AsGeoJSON(t.*)
                    FROM (select 
                    t1.answer, t2.answer, t3.geom from gemott.quest1 as t1, gemott.quest2 as t2, gemott.form as t3 
                    where t2.form_id = t3.id 
                    and t1.form_id = t3.id 
                    and t3.pedestrian_id = ${pedestrianID})
                    as T(ans1, ans2, geom);`
        
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
            let geoJson = GeoJSON.parse(data, {GeoJSON: 'geometry'})
            response.json(geoJson)
        });
    };

    post(request, response) {
        /**
         * Function that posts a form answered
         * by a pedestrian into the database
         */
        let pedestrianId = request.params.pedestrian_id;
        let routeId = request.body.properties.route_id
        let ans1 = request.body.properties.ans1
        let ans2Arr = request.body.properties.ans2
        let geometry = JSON.stringify(request.body.geometry)
        let geoJson = request.body
        let formId, ans2Query

        let formQuery = `INSERT INTO gemott.form (pedestrian_id, route_id, geom)
                        VALUES (${pedestrianId}, ${routeId}, ST_TRANSFORM(ST_GeomFromGeoJSON('${geometry}'), 25831))
                        RETURNING id;
                        `
        
        pool.query(formQuery, (err, res) => {
            if (err) {
                console.error('Error running the query. ', err.stack)
                return response.json({
                    mensaje: 'Ops! Sorry, there has been an error running the query'
                })
            }
            formId = res.rows[0].id
            
            let ans1Query = `INSERT INTO gemott.quest1 (form_id, answer)
                        VALUES (${formId}, ${ans1});
                        `

            pool.query(ans1Query, (err, res)=> {
                if (err) {
                    console.error('Error running the query. ', err.stack)
                    return response.json({
                        mensaje: 'Ops! Sorry, there has been an error running the query'
                    })
                }
            });

            ans2Arr.forEach(ans2 => {
                ans2Query = `INSERT INTO gemott.quest2 (form_id, answer)
                            VALUES (${formId}, ${ans2});
                            `
                
                pool.query(ans2Query, (err, res) => {
                    if (err) {
                        console.error('Error running the query. ', err.stack)
                        return response.json({
                            mensaje: 'Ops! Sorry, there has been an error running the query'
                        })
                    }   
                })
            })
        });

        response.json(geoJson)
    }
}

module.exports = { RouteService, FormService }