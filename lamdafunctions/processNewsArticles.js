const AWS = require("aws-sdk")
const axios = require ('axios');
const db = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1",

})

//trigger function to process data being inserted into DynamoDB table
exports.handler = async (event) => {

for(let record of event.Records){


    //check if the event has is triggered by an INSERT operation on DynamoDB table
    if(event.Records[0].eventName === "INSERT"){


        const teamName = record.dynamodb.NewImage.TeamName.S;
        const PublishedDate = record.dynamodb.NewImage.PublishedDate.S;
        const Title = record.dynamodb.NewImage.Title.S;

        //perform and store result of sentiment analysis
        const sentimentresult = await sentiment(Title)

        const params = {
            TableName: "SentimentResult",
            Item: {
                TeamName:teamName,
                Title:Title,
                Date:PublishedDate,
                Result: sentimentresult
            }
        }

        await db.put(params).promise();

        console.log("Sentiment Result: ", sentimentresult)

    }

}


    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
};

//receives a text and sends it to the url endpoint for sentiment analysis
async function sentiment(text){
    let url = `http://text-processing.com/api/sentiment/`;

    let response = await axios.post(url, {
        text: text
    },{
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })


    return response.data
}