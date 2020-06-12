import React from "react";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import axios from 'axios';

import { Col } from "reactstrap";

const baseUrl = (process.env.REACT_APP_API_URL+process.env.PORT)  || "http://localhost:4000";

/* 
    * Component responsible for updating and rendering Class Interaction Progress with Resources 
    *
    * @version 0.1
*/
class PerformanceChart extends React.Component {
    // Construtor(props) to use this.state where the chart is built using Highcharts
    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            // Chart Settings
            chartOptions: {
                chart: {
                    type: "areaspline"
                },
                title: {
                    text: ""
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    tickInterval: 25,
                    title: {
                        text: ""
                        //'Média das Porcentages de Interação da Turma com os Recursos do Assunto',
                    },
                    labels: {
                        formatter: function () {
                            return this.value + "%";
                        }
                    }
                },
                tooltip: {
                    shared: false,
                    formatter: function (tooltip) {
                        if (
                            this.series.name === "Período previsto para o domínio desse assunto"
                        ) {
                            return (
                                "<b>" +
                                "<br>" +
                                '<span style="color:{series.color}">' +
                                this.series.name +
                                "</span> <b>" +
                                "</b>" +
                                "<br/>"
                            );
                        } else {
                            return (
                                "<b>" +
                                "<br>" +
                                '<span style="color:{series.color}">' +
                                this.series.name +
                                "</span>: <b>" +
                                this.point.y +
                                "</b>" +
                                "%" +
                                "<br/>"
                            );
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    },
                    column: {
                        stacking: "percent",
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    line: {
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                series: [
                    {
                        name: "Porcentagem mínima necessária para avançar para o próximo assunto",
                        lineWidth: 3,
                        color: "#52bf90",
                        //dashStyle: 'ShortDashDot',
                        data: []
                    },
                    {
                        name: "Porcentagem média da interação diária da turma",
                        dataLabels: {
                            enabled: true,
                            format: "{y}%"
                        },
                        lineWidth: 3,
                        data: [],
                        color: "#273746"
                    },
                    {
                        name: "Período previsto para o domínio desse assunto",
                        data: [],
                        lineWidth: 7,
                        color: "#ffdc73"
                    }
                ]
            },
            Render: true
        }
    }

    /** @param start: Chart start date */
    /** @param end: Chart end date */
    /** @param startExpectedDate: Beginning of expected date for students to master a subject */
    /** @param endExpectedDate: End of expected date for students to master a subject */
    /** @param cumulativeAvg: Array with days when the class interacted with the resources of a subject */
    /** @return returns a array with three sub-arrays, 
     * where the first is the text below the graph with the days and month, 
     * the second is the predicted period for the subject domain, 
     * and the last is the graph itself with the percentages of each day. */
    getDateArray(start, end, startExpectedDate, endExpectedDate, cumulativeAvg) {
        // Arrays that will be returned
        var dateArray = [], expectedArray = [], cumulativeArray = [];
        // Loop Variables
        var currentDate = start, position_cumulative = 0;

        // Interaction with each day of the date range
        while (currentDate <= end) {
            // Pushes a string into each array in day / month format and the Date
            dateArray.push({ string: currentDate.getDate() + "/" + (currentDate.getMonth() + 1), date: new Date(currentDate) });

            // Check if array is empty in position "i"
            if (cumulativeAvg[position_cumulative] && cumulativeAvg.length > 0) {
                // Creates a date variable for the last interaction day
                let lastdate = new Date(cumulativeAvg[cumulativeAvg.length - 1].DATE.replace(/-/g, '/'));
                // Creates a date variable for the current interaction day
                let currentDateCumulative = new Date(cumulativeAvg[position_cumulative].DATE.replace(/-/g, '/'))

                // If interacted on the current day, then add the percentage in the array to be returned: cumulativeArray
                if (currentDateCumulative.getTime() === currentDate.getTime()) {
                    // Pushes on array the current percentage
                    cumulativeArray.push(Math.round(cumulativeAvg[position_cumulative].cumulativeAverage * 100) / 100);
                    position_cumulative++;
                    // If not interacted, put the previous value in the array
                } else if (lastdate.getTime() >= currentDate.getTime()) {
                    if (cumulativeArray[cumulativeArray.length - 1]) {
                        // Pushes on array the previous percentage
                        cumulativeArray.push(cumulativeArray[cumulativeArray.length - 1]);
                    } else {
                        // Pushes array zero if no previous percentage
                        cumulativeArray.push(0);
                    }
                }
            }

            // If there is a start and end date, a zero is placed at
            if (startExpectedDate && endExpectedDate) {
                if ((currentDate.getTime() >= startExpectedDate.getTime() && currentDate.getTime() <= endExpectedDate.getTime())) {
                    expectedArray.push(0);
                } else {
                    expectedArray.push(null);
                }
            } else {
                expectedArray.push(null);
            }

            // Next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Returns the array
        return [dateArray, expectedArray, cumulativeArray];
    }

    fetchData(curriculumId) {
        // Props
        const classroomId = this.props.classroomId;
        const courseId = this.props.courseId;

        // Variables with url to method get 
        const url_percentage = baseUrl + "/course/getMinimumPercentage/" + curriculumId;
        const url_date = baseUrl + "/course/getExpectedDate/" + curriculumId + "/" + courseId + "/" + classroomId;
        const url_interaction = baseUrl + "/course/getFirstLastClassInteraction/" + classroomId + "/" + curriculumId;
        const url_cumulativeAvg = baseUrl + "/course/getCumulativeClassAverage/" + courseId + "/" + classroomId + "/" + curriculumId;
        const url_getMissionInfo = baseUrl + "/course/getMissionInfo/" + courseId + "/" + classroomId + "/" + curriculumId;

        axios.all([
            axios.get(url_percentage, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_date, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_interaction, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_cumulativeAvg, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_getMissionInfo, { cancelToken: this.cancelTokenSource.token })
        ])
        .then(axios.spread((minPercentage, date, interaction, cumulativeAvg, getMissionInfo) => {
            // Checks if have data
            if (minPercentage.data && date.data && interaction.data && cumulativeAvg.data && getMissionInfo.data) {
                let percentage = 0;
                let startDate, endDate, expectedStartDate, expectedEndDate, dateArray;
                let firstInteraction, lastInteraction;
                let missions_for_render = [];

                // Checks if have interaction data
                if (interaction.data[0].firstInteraction && interaction.data[0].lastInteraction) {
                    // If it exists, add in the variables
                    firstInteraction = new Date(interaction.data[0].firstInteraction.replace(/-/g, '/'));
                    lastInteraction = new Date(interaction.data[0].lastInteraction.replace(/-/g, '/'));
                }

                // Checks if have for minimum interaction percentage
                if (minPercentage.data && minPercentage.data.length > 0) {
                    // If it exists, add in the variables
                    percentage = minPercentage.data[0].percentage
                }

                // Checks if have start and end date of predicted period for the subject domain
                if (date.data[0].startDate && date.data[0].endDate) {
                    // If it exists, add in the variables
                    startDate = new Date(date.data[0].startDate.replace(/-/g, '/'));
                    endDate = new Date(date.data[0].endDate.replace(/-/g, '/'));

                    expectedStartDate = startDate;
                    expectedEndDate = endDate;

                    if ((firstInteraction < startDate) && firstInteraction) {
                        startDate = firstInteraction;
                    }

                    if ((lastInteraction > endDate) && lastInteraction) {
                        endDate = lastInteraction;
                    }

                    // Renders the chart only if this information exists
                    this.setState({
                        Render: true
                    })

                } else {
                    startDate = firstInteraction;
                    endDate = lastInteraction;

                    // Don't renders the chart if this information don't exists
                    if (!(startDate && endDate)) {
                        this.setState({
                            Render: false
                        })
                    }
                }

                // Call function getDateArray()
                dateArray = this.getDateArray(startDate, endDate, expectedStartDate, expectedEndDate, cumulativeAvg.data);

                // Set sub-arrays
                const DateArray = dateArray[0];
                const expectedArray = dateArray[1];
                const cumulativeArray = dateArray[2];

                // Putting the missions on the chart
                for (let i = 0; i < getMissionInfo.data.length; i++) {
                    // Get date from current position in array
                    let current_date = new Date(getMissionInfo.data[i].startDate.replace(/-/g, '/'));

                    // Get position for rendering on chart
                    let position_inarray = DateArray.findIndex(x => x.date.getTime() === current_date.getTime());

                    // Push new mission in array to render on chart if in range of chart
                    if (position_inarray !== -1)
                        missions_for_render.push(
                            {
                                type: "line",
                                dashStyle: "ShortDashDot",
                                name: getMissionInfo.data[i].nameMission,
                                lineWidth: 2.3,
                                dataLabels: {
                                    enabled: false
                                },

                                data: [
                                    {
                                        x: position_inarray,
                                        y: 0
                                    },
                                    {
                                        x: position_inarray,
                                        y: 100
                                    }
                                ],
                                marker: {
                                    radius: 2
                                }
                            }
                        );
                }

                // Assigns the information on the chart
                this.setState({
                    chartOptions: {
                        xAxis: {
                            categories: DateArray.map(x => x.string)
                        },
                        series: [
                            { data: [...Array(DateArray.length).fill(percentage)] },
                            { data: cumulativeArray },
                            { data: expectedArray },
                            ...missions_for_render
                        ]
                    }
                });
            }
            else {
                alert("Error web service");
            }
        }))
        .catch(error => {
            //alert("Error server " + error);
            if (axios.isCancel(error)) {
                console.log('Request canceled');
            } else {
                console.log("Error server " + error);
            }
        })
    }

    componentDidMount() {
        this.fetchData(this.props.curriculumId);
    }

    componentDidUpdate(prevProps) {
        //  If change curriculum, update all data.
        if (this.props.curriculumId !== prevProps.curriculumId) {
            this.fetchData(this.props.curriculumId);
        }
    }

    componentWillUnmount () {
        this.cancelTokenSource.cancel();
    }
    
    render() {
        const { chartOptions, Render } = this.state;
        return (
            <React.Fragment>
                {Render ? (
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                ) : (
                    <Col>
                        <div>A data inicial e final esperada para os alunos dominarem esse assunto não foram definidas pelo professor e nenhuma interação dos alunos com os recursos ocorreu ainda</div>
                    </Col>
                )}
            </React.Fragment>
        );
    }
};

export { PerformanceChart };