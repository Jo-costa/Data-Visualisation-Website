let AWS = require("aws-sdk")
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) =>{

    console.log("Event: " + JSON.stringify(event))
    let connId = event.requestContext.connectionId;

    console.log("Event1:" + event + "RequestID: "+ event.requestContext.connectionId)

    let params = {
        TableName: "WebSocketClientsId",
        Key: {
            Id: connId
        }
    }

    try {

        console.log("---------------------")

         await db.delete(params).promise();

        console.log("--------------------")

        return {
            statusCode:200,
            body:"Client Disconnected!"
        }

    }catch (error) {
        return {
            statusCode:500,
            body: "Server Error " + error
        }
    }
}