var mysql = require('mysql');
const { reject } = require('core-js/fn/promise');
const { resolve } = require('path');
var connection = mysql.createConnection({
    host: 'codeboxx.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
    user: 'codeboxx'  ,
    password: 'Codeboxx1!',
    database: 'my_app2'  

});

connection.connect();

function query(queryString) {
    return new Promise((resolve, reject) => {
        connection.query(queryString, function(err, result) {
            if (err) {
                return reject(err);
            } 
            return resolve(result)
        })
    })
}



module.exports = query