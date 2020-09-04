const Pool = require('pg').Pool
const passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const config = require('../db/config.js');
const { db: { user, host, database, password, port } } = config;

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
})
    
const local_strategy = new LocalStrategy((mail, password, done) => {
    sql_query = `SELECT id, mail, pass FROM pedestrian WHERE mail=${mail};`
    pool.query(sql_query, (err, result) => {
        if(err) {
        winston.error('Error when selecting user on login', err)
        return done(err)
        }
    
        if(result.rows.length > 0) {
        const data = result.rows[0]
        bcrypt.compare(password, data.password, (err, res) => {
            if(res) {
            done(null, { id: data.id, mail: data.mail })
            } else {
            done(null, false)
            }
            })
        } else {
            done(null, false)
        }
    })
})


module.exports = local_strategy;
