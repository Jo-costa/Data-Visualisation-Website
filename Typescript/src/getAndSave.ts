import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import csvParser from "csv-parser";
require("dotenv").config();

//AWS configuration to access AWS Services
AWS.config.update({
    region:	"us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken:process.env.AWS_SESSION_TOKEN
});


//interface representing csv file data
interface TeamStatsData {
    HomeTeamSeason:string
    Season:string
    MatchDate:string
    HomeTeam:string
    HomeGoals:number
    AwayGoals:number
    AwayTeam:string
}

//Init a new instance of DocumentClient
const db = new AWS.DynamoDB.DocumentClient();

const filePath = "../dataset/premier-league-matches.csv";
const tableName = "TeamStats";


//function to convert date from "dd/mm/yyyy" format to "yyyy-mm-dd"
const convertDate = (date:string):string =>{
    //split date
    const dateArr: string[] = date.split("/");

    if(dateArr.length !== 3)
        throw `Incorrect Date format ${date}`

    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
}

//retrieve data from spreadsheet and save in DynamoDB table
const getData:()=> void  = ()=>{

    let teams: string[] = ['Liverpool', 'Manchester City', 'Arsenal', 'Manchester United', 'Chelsea']

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data',
            (data: TeamStatsData) => {

                //check if the line being read, includes the teams
                if(teams.includes(data.HomeTeam) || teams.includes(data.AwayTeam)) {

                    const date: string = convertDate(data.MatchDate);

                    //create parameters for inserting a record into DynamoDB table
                    const params = {
                        TableName: tableName,
                        Item: {
                            HomeTeamSeason:data.HomeTeam+"_"+data.Season,
                            Season: data.Season,
                            MatchDate: date,
                            HomeGoals: data.HomeGoals,
                            HomeTeam: data.HomeTeam,
                            AwayGoals: data.AwayGoals,
                            AwayTeam: data.AwayTeam,

                        }
                    }

                    //insert data into DynamoDB table
                    db.put(params, (err, data)=>{

                        if(err) {
                            console.log("Error inserting data" + err)
                        }else {
                        console.log("Data Inserted- " + params.Item + " -Data: "+ data)

                        }
                    })
                }

            })
        .on('end', ()=>{
            console.log("End of File reading")
        })
        .on('error', (error)=>{
            console.error(error)
        })

}

getData();


