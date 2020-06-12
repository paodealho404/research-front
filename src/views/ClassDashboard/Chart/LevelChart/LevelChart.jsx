import React from "react";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
//import { Link } from "react-router-dom";
import axios from 'axios';

import {
    Nav,
    NavItem,
    NavLink,
    Collapse,
    Row,
    Col
} from "reactstrap";

const baseUrl = (process.env.REACT_APP_API_URL+process.env.PORT) || "http://localhost:4000";

/* 
    * Component responsible for updating and Class Distribution by Level
    *
    * @version 0.1
*/
class LevelChart extends React.Component {
    // Construtor(props) to use this.state where the chart is built using Highcharts
    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            // Chart Settings
            chartOptions: {
                chart: {
                    type: "column"
                },
                title: {
                    text: " "
                },
                xAxis: {
                    categories: [
                        "Nível 1 (0-2957 XP)",
                        "Nível 2 (2958XP-7649 XP)",
                        "Nível 3 (7650-13566 XP)",
                        "Nível 4 (13566-20434 XP)",
                        "Nível 5 (20435-28078 XP)"
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Número de estudantes"
                    }
                },
                tooltip: {
                    pointFormat:
                        '<span style="color:{point.color}">\u25CF</span> <b> {point.y} alunos ({point.percentage:.1f}%)  {point.name} </b><br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: "normal"
                    }
                },
                series: [
                    {
                        name: "Alunos que não estão nesse nível",
                        color: "#374961",
                        data: [0, 0, 0, 0, 0]
                    },
                    {
                        name: "Alunos que estão nesse nível",
                        color: "#52bf90",
                        data: [0, 0, 0, 0, 0]
                    }
                ]
            },
        }
    }

    componentDidMount() {
        // Props
        const classroomId = this.props.classroomId;

        // Variable with url to method get 
        const url_studentsbylevel = baseUrl + "/course/getStudentesByLevel/" + classroomId

        axios.get(url_studentsbylevel, { cancelToken: this.cancelTokenSource.token })
        .then(studentsbylevel => {
            // Checks if have data
            if (studentsbylevel.data) {
                const data = studentsbylevel.data;

                let inlevel = [];
                let outoflevel = [];
                let total = 0;

                // Loop for all five levels
                for (let i = 0; i < 5; i++) {
                    // Get the index
                    let position = data.findIndex(x => x.level_ === (i + 1));

                    // Check if have something in that position
                    if (data[position]) {
                        // Add in total
                        total += data[position].quant;
                        // Add in 'inlevel'
                        inlevel[i] = data[position].quant;
                    } else {
                        // If not, add zero to the 'inlevel'
                        inlevel[i] = 0;
                    }
                }

                // Loop for all five levels
                for (let j = 0; j < 5; j++) {
                    // Add 'outlevel' based on total minus 'inlevel'
                    outoflevel[j] = total - inlevel[j];
                }

                // set values ​​on the chart
                this.setState({
                    chartOptions: {
                        series: [
                            { data: outoflevel },
                            { data: inlevel }
                        ]
                    }
                });
            }
            else {
                alert("Error web service");
            }
        })
        .catch(error => {
            //alert("Error server " + error);
            if (axios.isCancel(error)) {
                console.log('Request canceled');
            } else {
                console.log("Error server " + error);
            }
        })
    }

    componentWillUnmount () {
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
};

/* 
    * Component responsible for updating and Class Distribution by Level Child
    *
    * @version 0.1
*/
class LevelChartChild extends React.Component {
    // Construtor(props) to use this.state where the open and close informations of 'navbar' are updated
    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            students: [[], [], [], [], []],
            isOpen: [true, false, false, false, false],
            isOpenClass: ["active", "", "", "", ""]
        }
    }

    // Select a nav item
    toggleCollapse = (id) => {
        let Update = [false, false, false, false, false];
        let UpdateClass = ["", "", "", "", ""];

        UpdateClass[id] = "active";
        Update[id] = true;
        
        this.setState({
            isOpen: Update,
            isOpenClass: UpdateClass
        })
    }

    fetchData() {
        // Props
        const classroomId = this.props.classroomId;

        // Loop for get students of all levels
        for (let i = 0; i < 5; i++) {
            let url_studentsByLevel = baseUrl + "/course/getNameStudentsByLevel/" + classroomId + "/" + (i + 1)
            
            axios.get(url_studentsByLevel, { cancelToken: this.cancelTokenSource.token })
            .then(res => {
                if (res.data) {
                    // all data
                    let data = this.state.students;
                    // new data for add
                    let newdata = res.data;
                    
                    data[i] = newdata;

                    this.setState({
                        students: data
                    })
                }
                else {
                    alert("Error web service");
                }
            })
            .catch(error => {
                //alert("Error server " + error);
                if (axios.isCancel(error)) {
                    console.log('Request canceled');
                } else {
                    console.log("Error server " + error);
                }
            })
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount () {
        this.cancelTokenSource.cancel();
    }

    render() {
        const { students, isOpen, isOpenClass } = this.state;
        return (
            <React.Fragment>
                <Nav tabs className="d-flex justify-content-around" style={{ fontSize: "0.85em" }}>
                    <NavItem>
                        <NavLink className={"" + isOpenClass[0]} onClick={() => this.toggleCollapse(0)} style={{ cursor: "pointer" }}>
                            Nível 1
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={"" + isOpenClass[1]} onClick={() => this.toggleCollapse(1)} style={{ cursor: "pointer" }}>
                            Nível 2
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={"" + isOpenClass[2]} onClick={() => this.toggleCollapse(2)} style={{ cursor: "pointer" }}>
                            Nível 3
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={"" + isOpenClass[3]} onClick={() => this.toggleCollapse(3)} style={{ cursor: "pointer" }}>
                            Nível 4
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={"" + isOpenClass[4]} onClick={() => this.toggleCollapse(4)} style={{ cursor: "pointer" }}>
                            Nível 5
                        </NavLink>
                    </NavItem>
                </Nav>
                <Collapse isOpen={isOpen[0]}>
                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                        {(students[0] && students[0].length) ? (
                            <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                {students[0].map(data => (
                                    <Col sm="2" key={"levelchart-" + data.id}>
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
                                    <div>Não há nenhum aluno neste nível de gamificação</div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Collapse>
                <Collapse isOpen={isOpen[1]}>
                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                        {(students[1] && students[1].length) ? (
                            <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                {students[1].map(data => (
                                    <Col sm="2" key={"levelchart-" + data.id}>
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
                                    <div>Não há nenhum aluno neste nível de gamificação</div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Collapse>
                <Collapse isOpen={isOpen[2]}>
                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                        {(students[2] && students[2].length) ? (
                            <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                {students[2].map(data => (
                                    <Col sm="2" key={"levelchart-" + data.id}>
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
                                    <div>Não há nenhum aluno neste nível de gamificação</div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Collapse>
                <Collapse isOpen={isOpen[3]}>
                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                        {(students[3] && students[3].length) ? (
                            <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                {students[3].map(data => (
                                    <Col sm="2" key={"levelchart-" + data.id}>
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
                                    <div>Não há nenhum aluno neste nível de gamificação</div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Collapse>
                <Collapse isOpen={isOpen[4]}>
                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                        {(students[4] && students[4].length) ? (
                            <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                {students[4].map(data => (
                                    <Col sm="2" key={"levelchart-" + data.id}>
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
                                    <div>Não há nenhum aluno neste nível de gamificação</div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Collapse>
            </React.Fragment>
        );
    }
};

export { LevelChart, LevelChartChild };