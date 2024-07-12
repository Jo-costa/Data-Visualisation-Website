"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var AWS = __importStar(require("aws-sdk"));
var csv_parser_1 = __importDefault(require("csv-parser"));
require("dotenv").config();
//AWS configuration to access AWS Services
AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
});
//Init a new instance of DocumentClient
var db = new AWS.DynamoDB.DocumentClient();
var filePath = "../dataset/premier-league-matches.csv";
var tableName = "TeamStats";
//function to convert date from "dd/mm/yyyy" format to "yyyy-mm-dd"
var convertDate = function (date) {
    //split date
    var dateArr = date.split("/");
    if (dateArr.length !== 3)
        throw "Incorrect Date format ".concat(date);
    return "".concat(dateArr[2], "-").concat(dateArr[1], "-").concat(dateArr[0]);
};
//retrieve data from spreadsheet and save in DynamoDB table
var getData = function () {
    var teams = ['Liverpool', 'Manchester City', 'Arsenal', 'Manchester United', 'Chelsea'];
    fs.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on('data', function (data) {
        //check if the line being read, includes the teams
        if (teams.includes(data.HomeTeam) || teams.includes(data.AwayTeam)) {
            var date = convertDate(data.MatchDate);
            //create parameters for inserting a record into DynamoDB table
            var params_1 = {
                TableName: tableName,
                Item: {
                    HomeTeamSeason: data.HomeTeam + "_" + data.Season,
                    Season: data.Season,
                    MatchDate: date,
                    HomeGoals: data.HomeGoals,
                    HomeTeam: data.HomeTeam,
                    AwayGoals: data.AwayGoals,
                    AwayTeam: data.AwayTeam,
                }
            };
            //insert data into DynamoDB table
            db.put(params_1, function (err, data) {
                if (err) {
                    console.log("Error inserting data" + err);
                }
                else {
                    console.log("Data Inserted- " + params_1.Item + " -Data: " + data);
                }
            });
        }
    })
        .on('end', function () {
        console.log("End of File reading");
    })
        .on('error', function (error) {
        console.error(error);
    });
};
getData();
//# sourceMappingURL=getAndSave.js.map