/**
 * Service that controls the CRUD and HTTP methods
 * for the system users
 *
 * @author Fran Martín
 * @since 0.1
 */

const Pool = require('pg').Pool
const bcrypt = require('bcrypt')
const config = require('../config.js')
const { db: { user, host, database, password, port } } = config

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port
})

class UserService {
  /**
     * Class that controls the sign in
     *
    */
  post (request, response) {
    const userMail = request.body.mail
    const userPass = request.body.pass
    const userGen = request.body.gen
    const userAge = request.body.age

    bcrypt.hash(userPass, 10, (err, hash) => {
      if (err) {
        console.log(err)
        return
      }

      const layerQuery = `INSERT INTO pedestrian (mail, pass, gen, age)
            VALUES ('${userMail}', '${hash}', '${userGen}', ${userAge})`

      pool.query(layerQuery, (err, res) => {
        if (err) {
          console.error('Error registring the user. ', err.stack)
          return response.json({
            mensaje: 'Ops! Sorry, there has been an error registring the user into the system'
          })
        }
      })
      console.log('POST USER OK')
    })
  }
}

module.exports = { UserService }
