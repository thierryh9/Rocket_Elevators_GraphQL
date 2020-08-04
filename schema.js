var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var express = require('express');
var mysql = require('mysql');
var database = require('./database');
const { Server } = require('http');

var query = require('./mySQL.js');
var { pgquery, pgconnection } = require('./postgres.js');

//--------------------SCHEMA---------------------------------//

const EmployeeType = new GraphQLObjectType({
    name: 'employee',
    fields: () =>({
        id: {type: GraphQLInt},
        lastName: {type: GraphQLString},
        firstName: {type: GraphQLString},  
        email: {type: GraphQLString}
    })
})

const ElevType = new GraphQLObjectType({
    name: 'elevator',
    fields: () => ({
        id: {type: GraphQLInt},
        serial_number: {type: GraphQLString},
        status: {type: GraphQLString},
        column_id: {type: GraphQLInt},
    })
})

//---------------------GRAPHQL------------------------------//

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        elevator:{            
            type: ElevatorType,
            args: {id:{type: GraphQLInt}},
            resolve(parent, args){
                fetchElevators()               
                return _.find(elevators, {id: args.id});
            }
        },
        elevators: {
            type: new GraphQLList(ElevatorType),
            resolve(parent, args){
                fetchElevators()                
                return elevators
            }
        },
        employee:{
            type: EmployeeType,
            args: {id:{type: GraphQLInt}},
            resolve(parent, args){
                fetchEmployees()
                return _.find(employees, {id: args.id});
            }
        },
        employees: {
            type: new GraphQLList(EmployeeType),
            resolve(parent, args){
                fetchEmployees()
                return employees
            }
        },
        elevators: {
            type: new GraphQLList(ElevatorType),
            args: {status:{type: GraphQLString}},
            resolve(parent, args){
                fetchElevators()
                return _.filter(elevators,  e => e.status != args.status)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})


const app = express();
app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);