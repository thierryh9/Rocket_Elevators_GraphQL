# Rocket_Elevators_GraphQL


Implementation using Node.js and Express to create a GraphQL Api. The API is deployed on heroku
Here's the link to the Heroku website:
https://rocketelevators89.herokuapp.com/graphql

TEAM MEMBERS

* Thierry Harvey

* Alexandre Lévesque

* John Freud

This week, we used GraphQL to restore the data coming from two separate data sources in the same request.
Source 1: The Postgres decision database
Source 2: The MySQL operational database


QUESTIONS
  
  Question #1
* Retrieving the address of the building, the beginning and the end of the intervention for a specific intervention.
  What you need to put in Postman for the 1st Post.
    
    There is the Query you need to enter in Postman:
    
    {
    interventions(building_id: 3){
        employee_id
        start_intervention
        end_intervention
        building_details{
            building_id
            infoValue
            infoKey
        }
        address{
            city
        }
    }
}
      *You just need to change the building_id and send it to see the changes
  
  Question #2
* Retrieving customer information and the list of interventions that took place for a specific building
  What you need to put in Postman for the 2nd Post.  
    
      There is the Query you need to enter in Postman:
      
    { 
    buildings(id: 2){ 
    customer { 
        entrepriseName 
        authorityName
} 
    interventions{ building_id } 
        } 
    }
 
      *You just need to change the building_id and send it to see the changes
      
  Question #3
* Retrieval of all interventions carried out by a specified employee with the buildings associated with these interventions including the details (Table BuildingDetails)      associated with these buildings.
  What you need to put in Postman for the 2nd Post.
      
      There is the Query you need to enter in Postman:
      
    { employees(id: 3) { 
    firstName 
    lastName 
    interventions{ building_id building_details {  
        infoKey 
        infoValue 
        }  } 
    
    } 
}
      
      *You just need to change the employees_id and send it to see the changes


