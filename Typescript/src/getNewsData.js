"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
require("dotenv").config();
aws_sdk_1.default.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
});
var db = new aws_sdk_1.default.DynamoDB.DocumentClient();
var teams = ["Arsenal", "Chelsea", "Manchester Utd", "Liverpool", "Manchester City"];
//function to retrieve news articles from the api endpoint for each team
function getNews() {
    return __awaiter(this, void 0, void 0, function () {
        var i, response, data, j, params, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < teams.length)) return [3 /*break*/, 10];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, axios_1.default.get("https://premier-league-news2.p.rapidapi.com/", {
                            params: {
                                country: 'gb',
                                query: "(title:(".concat(teams[i], "))")
                            },
                            headers: {
                                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                                'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
                            }
                        })
                        //save data fetched from the response
                    ];
                case 3:
                    response = _a.sent();
                    data = response.data.response.data;
                    console.log(data.length);
                    j = 0;
                    _a.label = 4;
                case 4:
                    if (!(j < data.length)) return [3 /*break*/, 7];
                    params = {
                        TableName: "Articles",
                        Item: {
                            TeamName: "".concat(teams[i]).concat(j + 1),
                            Title: data[j].title,
                            PublishedDate: data[j].published
                        }
                    };
                    return [4 /*yield*/, db.put(params).promise()];
                case 5:
                    _a.sent();
                    console.log("Data Stored");
                    _a.label = 6;
                case 6:
                    j++;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.log("Error:", error_1);
                    return [3 /*break*/, 9];
                case 9:
                    i++;
                    return [3 /*break*/, 1];
                case 10: return [2 /*return*/];
            }
        });
    });
}
getNews();
//# sourceMappingURL=getNewsData.js.map