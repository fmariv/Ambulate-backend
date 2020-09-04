const Pool = require('pg').Pool
const Request = require('request');
const Turf = require('turf');
const config = require('../../db/config.js');
const { db: { user, host, database, password, port } } = config;
const _ = require('underscore');

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
})

class StatService {

    recount(request, response) {
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
    
    distance(request, response) {
        let pedestrian_id = request.params.pedestrian_id;
        let request_options = {
            url: `http://localhost:8080/api.ambulate/v0/pedestrians/${pedestrian_id}/routes`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };

        Request(request_options, (err, res, body) => {
            let json = body
            let length = Turf.length(json, {units: 'kilometers'})
            // Error -> Turf.length is not a function!!
            console.log(length)
        });
    }
}


module.exports = { StatService }