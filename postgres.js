const {Client} = require('pg')
var client = new Client({
    host: 'codeboxx-postgresql.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
    user: 'codeboxx',
    password: 'Codeboxx1!',
    database: 'my_app2'
});

function postGres_query() {
    return new Promise((resolve, reject) => {
        client.connect(function(err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result)
        })
    })
} 

function postGres_query(queryString) {
    return new Promise((resolve, reject) => {
        client.query(queryString,function(err, result){
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
}

module.exports = {
    postGres_query,
    postGres_query
}