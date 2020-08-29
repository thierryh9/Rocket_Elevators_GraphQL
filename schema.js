//----------Dependencies-----------//
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');


//-----------------------------------------------CONNECTIONS------------------------------------------//
//----------POSTGRES-----------//
const {Client} = require('pg')
const client = new Client({
    host: 'codeboxx-postgresql.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
    user: 'codeboxx',
    password: 'Codeboxx1!',
    database: 'ThierryHarvey'
});
client.connect(function(error){
    if (!!error) {
        console.log("Unable to connect to PSQL database.")
    } else {
        console.log("You are connected to PSQL database.")
    }
});

//----------MYSQL-----------//
var mysql = require('mysql');
//const { resolve } = require('path');
var connectio = mysql.createConnection({
    host: 'codeboxx.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
    user: 'codeboxx'  ,
    password: 'Codeboxx1!',
    database: 'ThierryHarvey'  

});
connectio.connect(function(error){
    if (!!error) {
        console.log("Unable to connect to mySQL database.");
    } else {
        console.log("You are connected to mySQL database.");
    }
});

//-----------------------------------------SCHEMA CREATION---------------------------------------------//
var schema = buildSchema(`
    scalar DateTime
    
    type Query {
        interventions(building_id: Int!): Intervention
        buildings(id: Int!): Building
        employees(id: Int!): Employee
        customers(email:String!): Customer
        customerId(email: String!): Customer
        buildingByCustomer(email: String!): [Building]
        batteries(email: String!): [Battery]
        columns(email: String!): [Column]
        elevators(email: String!): [Elevator]
        elevatorsByColumn(id: Int!): [Elevator]
    }
    type Elevator {
        serialNumber: String
        elevator_model: String
        building_type: String
        status: String
        installDate: String
        inspectionDate: String
        certificat: String
        information: String
        notes: String
        created_at: String
        updated_at: String
        column_id: Int
    }
    type Intervention {
        building_id: Int
        building_details: [Building_detail]
        start_intervention: DateTime
        end_intervention: DateTime
        employee_id: Int
        address: Address
    }
    type Building {
        id: Int
        fullName: String
        address: Address
        customer: Customer
        building_details: [Building_detail]
        interventions: [Intervention]
    }
    type Battery {
        id: Int!
        building_id: Int
        status: String
        employee_id: Int
        installdate: DateTime
        inspectionDate: DateTime
        information: String
        notes: String
    }
    type Column {
        id: Int!
        battery_id: Int
        numberFloor: Int
        status: String
        information: String
        notes: String
    }
    type Address {
        street: String
        suite: String
        city: String
        postalCode: String
        country: String
    }
    type Customer {
        entrepriseName: String
        authorityName: String
        email: String
    }
    type Employee {
        id: Int
        firstName: String
        lastName: String
        building_details: [Building_detail]
        interventions: [Intervention]
    }
    type Building_detail {
        building_id: Int
        infoKey: String
        infoValue: String
    }
`);

//-----------------------------------------Queries---------------------------------------------//
var root = {
    // 1
    interventions: getInterventions,
    // 2
    buildings: getBuildings,
    // 3
    employees: getEmployees,

    customers: getCustomer,

    customerId: getCustomerId,
    
    buildingByCustomer: getBuildingsByCustomer,
    
    elevatorsByColumn: getElevatorsByColumn,
    
    batteries: getBatteries,
    
    columns: getColumns,
    
    elevators: getElevators
};

//-----------------------------------------Resolve---------------------------------------------//
async function getInterventions({building_id}) {
    // get intervention
    var intervention = await querypg('SELECT * FROM factintervention WHERE id = ' + building_id)
    resolve = intervention[0]
    console.log (intervention[0])
    // get address
    address = await query('SELECT a.street, a.suite, a.city, a.postalCode, a.country FROM buildings b JOIN addresses a ON a.id=b.address_id WHERE b.id=' + intervention[0].building_id)
    //building details
    building_details = await query('SELECT * FROM building_details WHERE building_id = ' + intervention[0].building_id)
    
    resolve['address']= address[0];
    resolve['building_details']= building_details;

    return resolve
};

async function getBuildings({id}) {
    // get building
    var buildings = await query('SELECT * FROM buildings WHERE id = ' + id )
    resolve = buildings[0]

    // get interventions
    interventions = await querypg('SELECT * FROM factintervention WHERE building_id = ' + id)
    console.log (interventions)
    // get customer
    customer = await query('SELECT * FROM customers WHERE id = ' + resolve.customer_id)

    resolve['customer']= customer[0];
    resolve['interventions']= interventions;

    return resolve
};

async function getEmployees({id}) {
    // get employee
    var employees = await query('SELECT * FROM employees WHERE id = ' + id )
    resolve = employees[0]
    
    // get interventions
    interventions = await querypg('SELECT * FROM factintervention WHERE employee_id = ' + id)
    result = interventions[0]
    //console.log(interventions)


    // get building details
    var i;
    for (i = 0; i < interventions.length; i++){
        building_details = await query('SELECT * FROM building_details WHERE building_id = ' + interventions[i].building_id)
        interventions[i]['building_details']= building_details;
        console.log(building_details)
    }   
    resolve['interventions']= interventions;

    return resolve
};

async function getCustomer({email}) {

    var email = await query(` SELECT * FROM customers WHERE email = "${email}" `)
    resolve = email[0]
    console.log(email)
    
 
    return resolve
 
 };

 async function getBatteries({email}) {

    var email = await query(`
        SELECT a.id, a.building_id, a.status, a.installdate, a.inspectionDate, a.information, a.notes 
        FROM batteries a JOIN buildings b ON a.building_id = b.id JOIN customers c ON b.customer_id = c.id WHERE c.email = "${email}"`)
    
    resolve = email
    return resolve
};

async function getColumns({email}){
    var email = await query(
        `SELECT d.id, d.battery_id, d.numberFloor, d.status, d.information, d.notes
        FROM batteries a JOIN buildings b ON a.building_id = b.id JOIN columns d ON a.id = d.battery_id JOIN customers c ON b.customer_id = c.id WHERE c.email = "${email}"`)
    
    resolve = email
    return resolve
};

async function getElevatorsByColumn({id}){

    var elevators = await query(`SELECT e.id, e.column_id FROM elevators e JOIN columns c ON e.column_id = c.id WHERE c.id = "${id}"`)

    resolve = elevators
    return resolve
};

async function getCustomerId({email}) {

    customer = await query(`SELECT * FROM customers WHERE email = "${email}"`)

    resolve= customer[0];

    return resolve
};

async function getBuildingsByCustomer({email}) {
    
    var buildings = await query(`SELECT b.id FROM buildings b JOIN customers c ON b.customer_id = c.id WHERE c.email = "${email}"` )
    resolve = buildings


    return resolve
};

async function getElevators({email}){

    var elevators = await query(
        `SELECT e.id, e.column_id, e.building_type, e.serialNumber, e.model, e.status, e.installDate, e.inspectionDate, e.certificat, e.information, e.notes
        FROM batteries a JOIN buildings b ON a.building_id = b.id JOIN columns d ON a.id = d.battery_id JOIN elevators e ON d.id = e.column_id JOIN customers c ON b.customer_id = c.id WHERE c.email = "${email}"`)
    
    resolve = elevators
    return resolve


};

//-----------------------------------------Queries functions---------------------------------------------//
function query (queryString) {
    console.log(queryString)
    return new Promise((resolve, reject) => {
        connectio.query(queryString, function(err, result) {
            if (err) {
                return reject(err);
            } 
            return resolve(result)
        })
    })
};
function querypg(queryString) {
    return new Promise((resolve, reject) => {
        client.query(queryString, function(err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result.rows)
        })
    })
};
//-----------------------------------------Express Server---------------------------------------------//
var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Express GraphQL server is running");
});


