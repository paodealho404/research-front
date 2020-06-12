import React from "react";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import axios from 'axios';

import {
    Nav,
    NavItem,
    NavLink,
    Collapse,
    Row,
    Col
} from "reactstrap";

//import { Link } from "react-router-dom";


const baseUrl = (process.env.REACT_APP_API_URL+process.env.PORT)  || "http://localhost:4000";

/* 
    * Component responsible for updating and rendering Minimum Percent Range
    *
    * @version 0.1
*/
class ReachStatisticsChart extends React.Component {
    // construtor(props) to use this.state where the chart is built using Highcharts
    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            // Chart Settings
            chartOptions: {
                chart: {
                    type: "bar",
                    height: 150
                },
                title: {
                    text: " "
                },
                xAxis: {
                    lineColor: "transparent",
                    categories: [""],
                    labels: {
                        enabled: false,
                        tickInterval: 2
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: " "
                    },
                    gridLineColor: "transparent",
                    labels: {
                        enabled: false
                    }
                },
                tooltip: {
                    pointFormat:
                        '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> estudantes ({point.percentage:.0f}%)<br/>',
                    shared: false
                },
                legend: {
                    reversed: true
                },
                plotOptions: {
                    visible: false,
                    series: {
                        stacking: "normal",
                        pointWidth: 35,
                        groupPadding: 0.1
                    }
                },
                series: [
                    {
                        name: "Alunos que não atingiram a porcentagem mínima",
                        data: [],
                        color: "#34495E ",
                        borderRadius: 2
                    },
                    {
                        name: "Alunos que atingiram a porcentagem mínima",
                        data: [],
                        borderRadius: 2,
                        color: "#52bf90"
                    }
                ]
            },
        }
    }

    fetchData(curriculumId) {
        // Props
        const classroomId = this.props.classroomId;
        const courseId = this.props.courseId;

        // Variables with url to method get 
        const url_studentsreached = baseUrl + "/course/getNumbersStudentsReachedPercentage/" + classroomId + "/" + curriculumId;
        const url_totalstudents = baseUrl + "/course/totalStudents/" + courseId + "/" + classroomId;

        axios.all([
            axios.get(url_studentsreached, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_totalstudents, { cancelToken: this.cancelTokenSource.token })
        ])
            .then(axios.spread((reached, total) => {
                // Checks if have data
                if (reached.data && total.data) {
                    this.setState({
                        chartOptions: {
                            series: [
                                { data: [total.data[0].count - reached.data[0].quant] },
                                { data: [reached.data[0].quant] }
                            ]
                        }
                    });
                } else {
                    alert("Error web service");
                }
            }))
            .catch(error => {
                //alert("Error server "+error);
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
        if (this.props.curriculumId !== prevProps.curriculumId) {
            this.fetchData(this.props.curriculumId);
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource.cancel();
    }

    render() {
        const { chartOptions } = this.state;
        return (
            <React.Fragment>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </React.Fragment>
        );
    }
}

/* 
    * Component responsible for updating and rendering Minimum Percent Range Childe
    *
    * @version 0.1
*/
class ReachStatisticsChild extends React.Component {
    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            studentsnotreached: [],
            studentsreached: [],
            isOpen: [true, false],
            isOpenClass: ["active", ""]
        }
    }

    toggleCollapse = (id) => {
        let Update = [false, false];
        let UpdateClass = ["", ""];

        UpdateClass[id] = "active";
        Update[id] = true;
        
        this.setState({
            isOpen: Update,
            isOpenClass: UpdateClass
        })
    }

    fetchData(curriculumId) {
        // Props
        const courseId = this.props.courseId;
        const classroomId = this.props.classroomId;

        // Variables with url to method get 
        const url_allstudents = baseUrl + "/course/getStudents/" + courseId + "/" + classroomId
        const url_studentsreached = baseUrl + "/course/getStudentsReachedPercentage/" + classroomId + "/" + curriculumId;

        axios.all([
            axios.get(url_allstudents, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_studentsreached, { cancelToken: this.cancelTokenSource.token })
        ])
            .then(axios.spread((Res1, Res2) => {
                // Checks if have data
                if (Res1.data && Res2.data) {
                    let data_allstudents = Res1.data;
                    let data_studentsreached = Res2.data;

                    // with the filter it is possible to know how many students did not reach based on the total
                    let filterdata_notreached = data_allstudents.filter(x => !data_studentsreached.some(el => el['user_id'] === x.id));

                    this.setState({
                        studentsnotreached: filterdata_notreached,
                        studentsreached: data_studentsreached
                    });
                } else {
                    alert("Error web service");
                }
            }))
            .catch(error => {
                //alert("Error server "+error);
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
        if (this.props.curriculumId !== prevProps.curriculumId) {
            this.fetchData(this.props.curriculumId);
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource.cancel();
    }

    render() {
        const { studentsnotreached, studentsreached, isOpen, isOpenClass } = this.state;
        return (
            <React.Fragment>
                <Nav tabs className="d-flex justify-content-around" style={{ fontSize: "0.85em" }}>
                    <NavItem>
                        <NavLink className={"" + isOpenClass[0]} onClick={() => this.toggleCollapse(0)} style={{ cursor: "pointer" }}>
                            Alunos que alcançaram
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={"" + isOpenClass[1]} onClick={() => this.toggleCollapse(1)} style={{ cursor: "pointer" }}>
                            Alunos que não alcançaram
                        </NavLink>
                    </NavItem>
                </Nav>
                <Collapse isOpen={isOpen[0]}>
                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                        {(studentsreached && studentsreached.length > 0) ? (
                            <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                {studentsreached.map(data => (
                                    <Col sm="2" key={data.user_id}>
                                        <div className="d-flex flex-column" style={{ margin: "1em 0 0 0" }}>
                                            <i className="far fa-user-circle fa-3x align-self-center" />
                                            <div className="align-self-center" style={{ fontSize: "0.85em" }}>
                                                {data.name}
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Row>
                                <Col style={{ margin: "1em 1em 0 1em", textAlign: "center" }}>
                                    <div>Nenhum aluno alcançou a porcentagem mínima</div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Collapse>
                <Collapse isOpen={isOpen[1]}>
                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                        <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                            {studentsnotreached.map(data => (
                                <Col sm="2" key={data.id}>
                                    <div className="d-flex flex-column" style={{ margin: "1em 0 0 0" }}>
                                        <i className="far fa-user-circle fa-3x align-self-center" />
                                        <div className="align-self-center" style={{ fontSize: "0.85em" }}>
                                            {data.name}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Collapse>
            </React.Fragment>
        );
    }
}

export { ReachStatisticsChart, ReachStatisticsChild };