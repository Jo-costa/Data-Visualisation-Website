let app = new Vue({
    el: "#app",
    data: {
        //control visibility of different pages
        showTeamStats: true,
        showSentiment: false,
        showResults: false,
        showPredictions: false,

        //websocket connection
        websocket: null,
        //sample synthetic data
        syData: [
            sample = {
                x: [],
                y: [141.25231606781517, 144.7719332094645, 145.0705528684325, 141.65825433893377, 149.34146664817806, 144.88712727187686, 138.82649425199696, 135.3092405619005, 141.51255453569317, 134.51442601972005, 128.42020134371728, 131.52140987514497, 131.33844962124164, 135.38825718363609, 132.90489473697139, 128.5572584185539, 126.0175038381288, 139.12939100950263, 130.4983988206498, 139.3310750720612, 140.63946193351643, 144.83289187737492, 143.23708992095118, 149.60603390973498, 155.4746048222297, 143.27750562560075, 145.41909927666177, 149.95821306732978, 150.36480853251138, 145.44865655655096, 140.63796805175937, 149.70073354863342, 140.584109689614, 138.18058250739054, 139.418132538058, 135.99696747535768, 131.98882004389068, 139.35587164703216, 128.86086731433923, 132.88091715240412, 136.1644972088131, 132.863963542571, 137.8742188753042, 145.09443955283686, 152.1370956523493, 155.16281224668367, 143.34666477471296, 148.63690038364905, 152.87680885442737, 148.1526183455293, 153.80679051472697, 150.96518074171337, 151.3912090470097, 159.42228393205485, 148.10562615950283, 155.55953994097948, 142.1943645611422, 142.74285412123075, 136.91427500967472, 141.81262284655574, 147.2424190067422, 137.93343537178103, 137.66151281812228, 147.77041290217463, 147.05294055953735, 139.59712597225172, 149.18828001136197, 153.0362717761583, 149.5434435725131, 160.42897085605398, 156.78110258844967, 162.71183825289157, 165.12820500017276, 153.7336496147298, 155.43851664052534, 165.28918696592274, 163.8735315289272, 163.0143579584974, 150.93877591750666, 162.30923808342988, 158.7724184964721, 146.6946802663426, 151.06217114665512, 143.31407400959017, 149.1354947611131, 143.84272680203594, 139.5423879870197, 142.05310399049736],
                type: "scatter",
                name: "sample"
            },
            mean = {
                x: [],
                y: [139.7577819824, 138.8683319092, 139.2281799316, 140.3397064209, 143.8786468506, 148.021194458, 152.4562835693, 165.2235870361, 165.1414031982, 169.6745758057, 170.0536956787, 170.5268707275, 167.7975463867, 164.9886322021, 163.7237854004, 159.5773010254, 153.7778930664, 151.967376709, 148.6683197021, 146.176361084, 144.3424224854, 141.2794494629, 140.5324707031, 140.5476074219, 141.3356781006, 136.1840820312, 138.8718414307, 138.1690979004, 144.5924835205, 148.1268310547, 151.5852203369, 161.2959899902, 169.7256774902, 165.5244293213, 165.624420166, 166.5124664307, 165.6809234619, 164.8295898438, 164.7535095215, 163.0337219238, 160.2451324463, 155.2608642578, 152.0985717773, 150.1514282227, 146.5115356445, 144.221206665, 141.7265167236, 139.1188201904, 139.4470672607, 139.1425323486],
                type: "scatter",
                name: "mean"
            }
        ],
        //synthetic data chart layout
        chartLayout: {
            title: "Synthetic Data",
        },
        //synthetic data endpoint for prediction
        syntheticEndpoint: "https://runtime.sagemaker.us-east-1.amazonaws.com/endpoints/Endpoint1/invocations",
        teams: ['Liverpool', 'Manchester City', 'Arsenal', 'Manchester Utd', 'Chelsea'],
        selectedTeamStats: "",
        selectedTeamResults: "",
        selectedTeamSentiment: "",
        sentimentResult: [{
            neg: 0,
            neutral: 0,
            pos: 0
        }],
        sentimentChart: null, //store chart object
        selectedArticle: "",
        articles: [],
        resultsHome: [],
        resultsAway: [],
        seasons: [
            "1993", "1994", "1995", "1996", "2001", "2002", "2003", "2004",
            "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012",
            "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020",
            "2021", "2022", "2023",
        ],
        selectedSeason: "",
        resultSeason: "",
        connectionUrl: "wss://3ub2mayu5m.execute-api.us-east-1.amazonaws.com/production/",
        teamstatsData: [],
        homeChart: null, //store chart object
        resultHomeChart: null,
        resultAwayChart: null,
        homeGoals: [],
        homeMatchDate: [],
        resultsHomeMatchDate: [],
        resultsAwayMatchDate: [],
        awayChart: null, //store chart object
        awayGoals: [],
        awayMatchDate: [],


    },


    mounted() {

        this.plotdata();
    },

    //ini data and websocket connection
    created: function () {


        for (let i = 0; i < this.syData[0].y.length; i++) {
            this.syData[0].x.push(i)
        }
        for (let i = 0; i < this.syData[1].y.length; i++) {
            this.syData[1].x.push(86 + i)
        }



        //create a new websocket object
        this.websocket = new WebSocket(this.connectionUrl);

        //start a new connection
        this.websocket.onopen = function (event) {
            console.log("Connected", event);
        };

        const self = this;

        //handle the response from the server
        this.websocket.onmessage = function (event) {
            const data = JSON.parse(event.data);

            if (data.length > 2 && data[2].action === "teamstats") {
                self.teamstatsData = [];

                self.homeMatchDate = [];
                self.homeGoals = [];

                self.awayMatchDate = [];
                self.awayGoals = [];

                for (let i = 0; i < data[0].home.Items.length; i++) {
                    self.homeMatchDate.push(self.convertDate(data[0].home.Items[i].MatchDate))
                    self.homeGoals.push(data[0].home.Items[i].HomeGoals)

                }

                for (let i = 0; i < data[1].away.Items.length; i++) {
                    self.awayMatchDate.push(self.convertDate(data[1].away.Items[i].MatchDate))
                    self.awayGoals.push(data[1].away.Items[i].AwayGoals)
                }

            } else if (data.length > 2 && data[2].action === "teamResults") {

                // console.log(data[0].home.Items);
                self.resultsHomeMatchDate = [];
                self.resultsHome = [];

                self.resultsAwayMatchDate = [];
                self.resultsAway = []


                console.log("Data: ", self.convertDate(data[0].home.Items[1].MatchDate));
                for (let i = 0; i < data[0].home.Items.length; i++) {
                    self.resultsHomeMatchDate.push(self.convertDate(data[0].home.Items[i].MatchDate))
                    self.resultsHome.push(data[0].home.Items[i].Results)

                }

                console.log("Size: ", data[1]);

                for (let i = 0; i < data[1].away.Items.length; i++) {
                    self.resultsAwayMatchDate.push(self.convertDate(data[1].away.Items[i].MatchDate))
                    self.resultsAway.push(data[1].away.Items[i].Results)

                }


            } else if (data.sendSentimentAction.action === "sentimentText") {


                self.sentimentResult = []
                let totalCount = 0;
                let neg = 0;
                let sumNegative = 0;
                let neutral = 0;
                let sumNeutral = 0;
                let pos = 0;
                let sumPositive = 0;


                for (let i = 0; i < data.sentimentText.length; i++) {

                    totalCount++;

                    sumNegative += Math.round(data.sentimentText[i].Items[0].Result.probability.neg * 100)
                    sumNeutral += Math.round(data.sentimentText[0].Items[0].Result.probability.neutral * 100)
                    sumPositive += Math.round(data.sentimentText[0].Items[0].Result.probability.pos * 100)
                }

                let totalNeg = sumNegative / totalCount
                let totalNeutral = sumNeutral / totalCount
                let totalPos = sumPositive / totalCount

                let addSentiment = totalNeg + totalNeutral + totalPos;

                neg = Math.round((totalNeg / addSentiment) * 100)
                neutral = Math.round((totalNeutral / addSentiment) * 100)
                pos = Math.round((totalPos / addSentiment) * 100)

                self.sentimentResult.push({
                    neg: neg,
                    pos: pos,
                    neutral: neutral
                })


            }

        };


    },
    //whactes to update charts when data changes
    watch: {
        syntheticData: {
            handler() {
                this.plotdata();
            },
            deep: true
        },
        chartLayout: {
            handler() {
                this.plotdata();
            },
            deep: true
        },

        homeGoals: {
            handler() {
                this.getTeamStatsChart();
            },
            deep: true
        },
        homeMatchDate: {
            handler() {
                this.getTeamStatsChart();
            },
            deep: true

        },
        awayGoals: {
            handler() {
                this.getTeamStatsChart();
            },
            deep: true
        },
        awayMatchDate: {
            handler() {
                this.getTeamStatsChart();
            },
            deep: true

        },
        sentimentResult: {
            handler() {
                this.getSentimentChart();
            },
            deep: true
        },
        resultsHomeMatchDate: {
            handler() {
                this.getResultsChart();
            },
            deep: true
        },
        resultsHome: {
            handler() {
                this.getResultsChart();
            },
            deep: true
        }


    },
    methods: {

        plotdata() {

            Plotly.newPlot(this.$refs.synthetic, this.syData, this.chartLayout)

        },

        getSyntheticPrediction() {

            fetch("https://runtime.sagemaker.us-east-1.amazonaws.com/endpoints/Endpoint1/invocations", {
                    method: "POST",
                    body: JSON.stringify(this.syntheticData),
                    headers: {
                        "Content-Type": "application/json"
                    }

                })
                .then(response => response.json())
                .then((json) => console.log(json))

        },

        //send a request for a team sentiment
        getArticles() {
            console.log("Articles");


            this.websocket.send(
                JSON.stringify({
                    action: "sentiment",
                    routeKey: "sentiment",
                    team: this.selectedTeamSentiment,
                    purpose: "getArticles"
                })
            );
            let self = this


            this.selectedArticle = "";
            this.articles = []
            this.sentimentResult = [{
                neg: 0,
                neutral: 0,
                pos: 0
            }]

        },

        //convert date
        convertDate(unix) {


            const date = new Date(unix);

            const convert = date.toLocaleDateString();

            return convert

        },

        //method to display different pages
        showPage(page) {
            this.showMainPage = page === "main";
            this.showTeamStats = page === "team";
            this.showSentiment = page === "sentiment";
            this.showResults = page === "results";
            this.showPredictions = page === "predictions";
        },

        //handle different actions depending on what page is being displayed
        handleFunctions(page) {
            this.showPage(page);
            this.getTeamStatsChart(page);
            this.getResultsChart();
            if (page === "predictions") {
                this.plotdata()
            }
        },

        //send request for team stats data
        getTeamStats() {
            console.log("stats");
            this.websocket.send(
                JSON.stringify({
                    action: "teamstats",
                    routeKey: "teamstats",
                    team: this.selectedTeamStats,
                    season: this.selectedSeason
                })
            );
        },



        //send request for team results data
        getTeamResults() {

            this.websocket.send(
                JSON.stringify({
                    action: "teamresults",
                    routeKey: "teamresults",
                    team: this.selectedTeamResults,
                    season: this.resultSeason
                })
            );

        },

        getSentiment() {
            console.log("Sentiment");

            this.websocket.send(
                JSON.stringify({
                    action: "sentiment",
                    routeKey: "sentiment",
                    team: this.selectedTeamSentiment,
                    articleIndex: this.selectedArticle,
                    purpose: "sentimentResult"
                })
            );
            this.getSentimentChart()
        },

        getTeamStatsChart() {


            if (this.homeChart) {
                this.homeChart.destroy();
            }

            this.homeChart = new Chart("myChart", {
                type: "line",
                data: {
                    labels: this.homeMatchDate,
                    datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgb(225, 225, 225)",
                        borderColor: "rgb(54, 162, 235)",
                        data: this.homeGoals,
                    }, ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,
                                max: 10,
                            },
                        }, ],
                    },
                },
            });


            if (this.awayChart) {
                this.awayChart.destroy();
            }


            this.awayChart = new Chart("myChart1", {
                type: "line",
                data: {
                    labels: this.awayMatchDate,
                    datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgb(225, 225, 225)",
                        borderColor: "rgb(54, 162, 235)",
                        data: this.awayGoals,
                    }, ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,
                                max: 10,
                            },
                        }, ],
                    },
                },
            });


        },

        getResultsChart() {

            if (this.resultHomeChart) {
                this.resultHomeChart.destroy();
            }

            this.resultHomeChart = new Chart("myChart2", {
                type: "line",
                data: {
                    labels: this.resultsHomeMatchDate,
                    datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgb(225, 225, 225)",
                        borderColor: "rgb(54, 162, 235)",
                        data: this.resultsHome,
                    }, ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {

                        yAxes: [{
                            ticks: {
                                min: -10,
                                max: 10,
                            },
                        }, ],
                    },
                },
            });


            if (this.resultAwayChart) {
                this.resultAwayChart.destroy();
            }

            this.resultAwayChart = new Chart("myChart3", {
                type: "line",
                data: {
                    labels: this.resultsAwayMatchDate,
                    datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgb(225, 225, 225)",
                        borderColor: "rgb(54, 162, 235)",
                        data: this.resultsAway,
                    }, ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: -10,
                                max: 10,
                            },
                        }, ],
                    },
                },
            });
        },
        getSentimentChart() {

            if (this.sentimentChart) {
                this.sentimentChart.destroy();
            }

            this.sentimentChart =

                new Chart("sentimentChart", {
                    type: "polarArea",
                    data: {
                        labels: ["Negative", "Neutral", "Positive"],
                        datasets: [{
                            backgroundColor: ["#ed3c28", "#becad4", "#5ee630"],

                            data: [

                                this.sentimentResult[0].neg,

                                this.sentimentResult[0].neutral,

                                this.sentimentResult[0].pos



                            ]

                        }]

                    },

                    // options: {

                    //     scale: {

                    //         ticks: {

                    //             beginAtZero: true,
                    //             fontSize: 10

                    //         }

                    //     }

                    // }
                })




        },

    },

});