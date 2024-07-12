let AWS = require("aws-sdk")
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

    let connId = event.requestContext.connectionId;

    let params = {
        TableName: "WebSocketClientsId",
        Item: {
            Id: connId
        }
    }



    try {

        await db.put(params).promise();
        console.log("ID stored")
        return {
            statusCode: 200,
            body: "Client connected with id: " + connId
        }


    } catch (error) {
        return {
            statusCode: 500,
            body: "Server Error: " + error
        }
    }



};