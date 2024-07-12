const AWS = require("aws-sdk")
const axios = require ('axios');
const db = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1",

})




exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const connectionURL = "https://3ub2mayu5m.execute-api.us-east-1.amazonaws.com/production";
    const apiGatewaymanagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: connectionURL
    })

    const parse = JSON.parse(event.body)
    const getTeam = parse.team


    console.log("Parse: ", parse)

    let sentimentText = [];
    let sendSentimentAction = {"action": "sentimentText"}

    for(let i = 0 ; i < 99; i++){

        const getSentimentText = await retrieveSentiment(getTeam + (i+1))
        console.log("Sentiment Text", getSentimentText)
        sentimentText.push(getSentimentText)

    }


        try {


            await apiGatewaymanagementApi.postToConnection({
                ConnectionId: connectionId,
                Data: JSON.stringify({sendSentimentAction, sentimentText})
            }).promise();

            console.log("Response1", sentimentText)
            return {
                "statusCode": 200,
                "headers":{
                    "Content-type": "application/json"
                },
                "body": JSON.stringify({
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


const retrieveSentiment = (team) => {


    const params = {

        TableName: "SentimentResult",
        KeyConditionExpression: "#partitionKey = :partitionKeyValue", //placeholders for the actual values
        ExpressionAttributeNames: {
            "#partitionKey": "TeamName"
        },
        ExpressionAttributeValues: {
            ":partitionKeyValue": team
        }
    }

    return db.query(params).promise()
        .then(data => {
            console.log("Successful", data)
            return data
        })
        .catch(error => {
            console.log("Error while querying the table - ", JSON.stringify(error))
        })

}

