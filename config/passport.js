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

const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
        sql_query = `SELECT id, mail, pass FROM gemott.pedestrian WHERE mail='${email}';`
        pool.query(sql_query, (err, result) => {
            if(err) {
                return done(err)
            }

            if(result.rows.length > 0) {
                const data = result.rows[0]
                bcrypt.compare(password, data.pass, (err, res) => {
                    if(res) {
                        return done(null, { id: data.id, mail: data.mail })
                    } else {
                        return done(null, false)
                    }
                })
            } else {
                done(null, false)
            }
            
    })
});

function serialize(user, done) {
    done(null, user.id)
};

function deserialize(id, done) {
    parsedID = parseInt(id, 10)
    pool.query(`SELECT id, mail FROM gemott.pedestrian WHERE id = ${parsedID}`, (err, results) => {
        if(err) {
        console.log('Error when selecting user on session deserialize', err)
        return done(err)
        }

        done(null, results.rows[0])
    })
};


module.exports = { localStrategy, serialize, deserialize };
