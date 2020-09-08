const Pool = require('pg').Pool
const Request = require('request');
const lengthCalculator = require('@turf/length').default;
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
        let pedestrianId = request.params.pedestrian_id;
    
        let sqlQuery = `SELECT
                        (SELECT COUNT(*) as forms_count
                        FROM gemott.form
                        where pedestrian_id = ${pedestrianId}  
                        ),
                        (SELECT COUNT(*) as routes_count
                        FROM gemott.route
                        where pedestrian_id = ${pedestrianId});
                    `
        pool.query(sqlQuery, (err, res) => {
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
        let pedestrianId = request.params.pedestrian_id;
        let requestOptions = {
            url: `http://localhost:8080/api.ambulate/v0/pedestrians/${pedestrianId}/routes`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };

        Request(requestOptions, (err, res, body) => {
            let json = JSON.parse(body)
            let routeLength = lengthCalculator(json, {units: 'kilometers'}).toFixed(2)
            
            response.json({"length": routeLength})
        });
    }
}


module.exports = { StatService }