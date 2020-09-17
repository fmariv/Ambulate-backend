/**
 * Services that control the CRUD and HTTP methods
 * for the stats data
 * @author Fran Martín
 * @since 0.1
 */

const Pool = require('pg').Pool
const Request = require('request')
const lengthCalculator = require('@turf/length').default
const config = require('../../db/config.js')
const { db: { user, host, database, password, port } } = config

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port
})

class StatService {
  /**
     * Class that controls the functions for retrieving
     * the pedestrian statistics
     *
    */
  recount (request, response) {
    /**
         * Function that makes a recount of the total
         * routes walked and forms answered by the
         * pedestrian
         */
    const pedestrianId = request.params.pedestrian_id

    const sqlQuery = `SELECT
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
          mensaje: 'Ops! Sorry, there has been an error running the recount query'
        })
      }
      const data = res.rows[0]
      response.json(data)
    })
  };

  distance (request, response) {
    /**
         * Function that calculates the total distance
         * walked by a pedestrian
         */
    const pedestrianId = request.params.pedestrian_id
    const requestOptions = {
      url: `http://localhost:8080/api.ambulate/v0/pedestrians/${pedestrianId}/routes`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Charset': 'utf-8'
      }
    }

    Request(requestOptions, (_err, res, body) => {
      const json = JSON.parse(body)
      const routeLength = lengthCalculator(json, { units: 'kilometers' }).toFixed(2)

      response.json({ length: routeLength })
    })
  }
}

module.exports = { StatService }
