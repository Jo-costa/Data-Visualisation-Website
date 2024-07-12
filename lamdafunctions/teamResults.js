const AWS = require("aws-sdk")
const db = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1"
})

exports.handler = async (event) => {

    const parse = JSON.parse(event.body)
    const team = parse.team

    //Send response back to the client
    const connectionId = event.requestContext.connectionId;
    const connectionURL = "https://3ub2mayu5m.execute-api.us-east-1.amazonaws.com/production";
    const apiGatewaymanagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: connectionURL
    })

    let homeTeamResults = await retrieveHomeTeam(team);
    let awayTeamResults = await retrieveAwayTeam(team);
    let data = []
    let teamResults = {
        "action": "teamResults"
    }
    data.push({
        home: homeTeamResults
    })
    data.push({
        away: awayTeamResults
    })
    data.push(teamResults)

    try {


        await apiGatewaymanagementApi.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(data)
        }).promise();

        console.log("Response1", data)
        return {
            "statusCode": 200,
            "message": JSON.stringify({
                error: "Data sent"
            })
        }


    } catch (error) {
        console.log("Error: " + error)
        return {
            "statusCode": 500,
            "body": JSON.stringify({
                error: "Failed to send"
            })
        }

    }





};


const retrieveHomeTeam = (team) => {


    const params = {

        TableName: "TeamResults",
        KeyConditionExpression: "#partitionKey = :partitionKeyValue", //placeholders for the actual values
        ExpressionAttributeNames: {
            "#partitionKey": "HomeTeam"
        },
        ExpressionAttributeValues: {
            ":partitionKeyValue": team
        }
    }

    return db.query(params).promise()
        .then(data => {
            console.log("Successful")
            return data
        })
        .catch(error => {
            console.log("Error while querying the table - ", JSON.stringify(error))
        })

}

const retrieveAwayTeam = (team) => {

    const params = {

        TableName: "TeamResults",
        IndexName: "Away-index",
        KeyConditionExpression: "#pk = :partitionKeyValue", //placeholders for the actual values
        ExpressionAttributeNames: {
            "#pk": "AwayTeam",
        },
        ExpressionAttributeValues: {
            ":partitionKeyValue": team,
        }
    }

    return db.query(params).promise()
        .then(data => {
            console.log("Successful")
            return data
        })
        .catch(error => {
            console.log("Error while querying the table - ", JSON.stringify(error))
        })

}