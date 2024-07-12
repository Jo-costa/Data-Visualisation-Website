import axios from 'axios';
import AWS from 'aws-sdk';
require("dotenv").config();

AWS.config.update({
    region:	"us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken:process.env.AWS_SESSION_TOKEN

});

const db = new AWS.DynamoDB.DocumentClient();

const teams: string[] = ["Arsenal", "Chelsea", "Manchester Utd", "Liverpool", "Manchester City"]



//function to retrieve news articles from the api endpoint for each team
async function getNews(): Promise<void>{

    //iterate through the articles for each team in the teams array
    for(let i =0; i < teams.length; i++){
        try {
            //fetch news for for current team on the iteration
            const response = await axios.get("https://premier-league-news2.p.rapidapi.com/", {
                params: {
                    country: 'gb',
                    query: `(title:(${teams[i]}))`
                },
                headers: {
                    'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
                }
            })
            //save data fetched from the response
            let data = response.data.response.data

            console.log(data.length)


            //loop through each article and store in the dynamodb table
            for(let j = 0; j < data.length; j++){

                const params = {
                    TableName: "Articles",
                    Item: {
                        TeamName:`${teams[i]}${j+1}`,
                        Title:data[j].title,
                        PublishedDate: data[j].published
                    }
                }

                await db.put(params).promise();
                console.log("Data Stored")

            }

        }catch (error){
            console.log("Error:", error)
        }
    }



}


getNews()