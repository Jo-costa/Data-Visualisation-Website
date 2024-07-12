const AWS = require("aws-sdk")
const db = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1"
})

exports.handler = async (event) => {

    const parse = JSON.parse(event.body)
    const season = parse.season
    const team = parse.team

    //Send response back to the client
    const connectionId = event.requestContext.connectionId;
    const connectionURL = "https://3ub2mayu5m.execute-api.us-east-1.amazonaws.com/production";
    const apiGatewaymanagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: connectionURL
    })

    let homeTeamData = await retrieveHomeTeam(team, season);
    let awayTeamData = await retrieveAwayTeam(team, season);
    let data = []
    let teamsstats = {
        "action": "teamstats"
    }
    data.push({
        home: homeTeamData
    })
    data.push({
        away: awayTeamData
    })
    data.push(teamsstats)

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


const retrieveHomeTeam = (team, season) => {


    const params = {

        TableName: "TeamStats",
        KeyConditionExpression: "#partitionKey = :partitionKeyValue", //placeholders for the actual values
        ExpressionAttributeNames: {
            "#partitionKey": "HomeTeamSeason"
        },
        ExpressionAttributeValues: {
            ":partitionKeyValue": team+"_"+season
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

const retrieveAwayTeam = (team, season) => {

    const params = {

        TableName: "TeamStats",
        IndexName: "AwayTeamSeason-index",
        KeyConditionExpression: "#pk = :partitionKeyValue AND #sortKey = :sortKeyValue", //placeholders for the actual values
        ExpressionAttributeNames: {
            "#pk": "AwayTeam",
            "#sortKey": "Season"
        },
        ExpressionAttributeValues: {
            ":partitionKeyValue": team,
            ":sortKeyValue": season
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