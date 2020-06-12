import React from "react";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
//import { Link } from "react-router-dom";

import {
    UncontrolledTooltip,
    Nav,
    Collapse,
    UncontrolledDropdown, 
    DropdownItem, 
    DropdownToggle, 
    DropdownMenu,
    Row,
    Col,
    Container
} from "reactstrap";

import axios from 'axios';

const baseUrl = (process.env.REACT_APP_API_URL+process.env.PORT) || "http://localhost:4000";

/* 
    * Component responsible for updating and rendering Interaction with Missions
    *
    * @version 0.1
*/
class MissionChart extends React.Component {
    // construtor(props) to use this.state where the chart is built using Highcharts
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
                    categories: [],
                    labels: {
                        useHTML: true,
                        formatter: function (data) {
                            var tip = '<div id="tooltip_mission-' + data.pos + '">' + data.value + '</div>';
                            return tip;
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Número de Estudantes"
                    }
                },
                tooltip: {
                    pointFormat:
                        '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> students ({point.percentage:.0f}%)<br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: "normal"
                    }
                },
                series: [
                    {
                        name: "Mission Alcançada",
                        color: "#52bf90",
                        data: []
                    },
                    {
                        name: "Missião não Alcançada",
                        color: "#ffdc73",
                        data: []
                    },
                    {
                        name: "Missão não Tentada",
                        color: "#273746",
                        data: []
                    }
                ]
            },
            Render: true,
            missionInfo: []
        }
    }

    fetchData(curriculumId) {
        // Props
        const classroomId = this.props.classroomId;
        const courseId = this.props.courseId;

        // Variables with url to method get
        const url_missionInfo = baseUrl + "/course/getMissionInfo/" + courseId + "/" + classroomId + "/" + curriculumId;
        const url_missionStatus = baseUrl + "/course/getClassMissionStatus/" + courseId + "/" + classroomId + "/" + curriculumId;

        axios.all([
            axios.get(url_missionInfo, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_missionStatus, { cancelToken: this.cancelTokenSource.token })
        ])
        .then(axios.spread((missionInfo, missionStatus) => {
            // Checks if have data
            if (missionInfo.data && missionStatus.data) {
                const missionInfo_data = missionInfo.data;
                const missionStatus_data = missionStatus.data;

                // Possible states of the created missions
                const states_missions = ["achieved", "notAchieved", "notAttempted"];

                // (data_names) have names of all missions, (achieved_missions), (notAchieved_missions), (notAttempted_missions) have the data to render
                var data_names = [], achieved_missions = [], notAchieved_missions = [], notAttempted_missions = [];

                // Checks for interaction
                if (missionStatus_data.length > 0) {
                    for (let i = 0; i < missionInfo_data.length; i++) {
                        // Array with all missions names
                        data_names.push(missionInfo_data[i].nameMission);

                        for (let j = 0; j < 3; j++) {
                            let manystudents = 0;
                            // Get data based in ID and States
                            let element = missionStatus_data.filter(x => (x.missionId === missionInfo_data[i].ID) && (x.studentStatus === states_missions[j]));

                            if (element.length > 0)
                                manystudents = element[0].totalStudents;

                            // Push data in arrays
                            switch (j) {
                                case 0:
                                    achieved_missions.push(manystudents);
                                    break;
                                case 1:
                                    notAchieved_missions.push(manystudents);
                                    break;
                                case 2:
                                    notAttempted_missions.push(manystudents);
                                    break;
                                default:
                            }
                        }
                    }

                    this.setState({
                        chartOptions: {
                            xAxis: {
                                categories: data_names
                            },
                            series: [
                                { data: achieved_missions },
                                { data: notAchieved_missions },
                                { data: notAttempted_missions }
                            ]
                        },
                        Render: true,
                        missionInfo: missionInfo_data
                    });
                } else {
                    this.setState({
                        Render: false
                    });
                }
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
        if (this.props.curriculumId !== prevProps.curriculumId) {
            this.fetchData(this.props.curriculumId);
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource.cancel();
    }

    /** @param date_string: A date in format: yyyy-mm-dd */
    /** @return returns a date in format day / month */
    convert_date(date_string) {
        let date = new Date(date_string.replace(/-/g, '/'));

        return ((date.getDate()) + "/" + (date.getMonth() + 1));
    }

    render() {
        const { chartOptions, Render, missionInfo } = this.state;
        return (
            <React.Fragment>
                {Render ? (
                    <div>
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                        {missionInfo.map((data, index) => (
                            <UncontrolledTooltip key={"missionchart-" + data.ID} placement="bottom" target={"tooltip_mission-" + index} style={{ fontSize: "0.85em" }}>
                                {"Missão disponível entre "}
                                <br />
                                {this.convert_date(data.startDate) + " a " + this.convert_date(data.endDate)}
                                <br />
                                {data.awardPoints !== "null" ? (
                                    "Recompensa da missão: " + data.awardPoints + " pts"
                                ) : (
                                        "Recompensa da missão: " + data.awardGrade + " pts"
                                    )}
                            </UncontrolledTooltip>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">Nenhuma missão criada pelo professor nesse assunto</div>
                )}
            </React.Fragment>
        );
    }
};

class MissionChartChild extends React.Component {
    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            Missions_info: [],
            IsOpen: [],
            Mission_Students: [],
            Render: false
        }
    }

    // Select a nav item
    toggleCollapse = (id, opt) => {
        // Get number of missions
        const length = this.state.Missions_info.length;
        // Array for update
        let Update = [];

        for(let i = 0; i < length; i++){
            // Start array clean
            Update.push([{ Class: "", status: false }, { Class: "", status: false }, { Class: "", status: false }]);
        }

        // Active element
        Update[id][opt] = { Class: "active", status: true };

        this.setState({
            IsOpen: Update
        });
    }

    fetchData(curriculumId) {
        // Props
        const classroomId = this.props.classroomId;
        const courseId = this.props.courseId;

        // Variables with url to method get
        const url_missionInfo = baseUrl + "/course/getMissionInfo/" + courseId + "/" + classroomId + "/" + curriculumId;
        const url_missionStatus = baseUrl + "/course/getClassMissionStatus/" + courseId + "/" + classroomId + "/" + curriculumId;
        const url_missionStudents = baseUrl + "/course/getStudentsMissionStatus/" + courseId + "/" + classroomId + "/" + curriculumId;

        axios.all([
            axios.get(url_missionInfo, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_missionStatus, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_missionStudents, { cancelToken: this.cancelTokenSource.token })
        ])
        .then(axios.spread((missionInfo, missionStatus, missionStudents) => {
            // Checks if have data
            if (missionInfo.data && missionStatus.data && missionStudents.data) {
                const missionInfo_data = missionInfo.data;
                const missionStatus_data = missionStatus.data;

                // Array to control all Collapses
                var IsOpen = []

                if (missionStatus_data.length > 0) {
                    for (let i = 0; i < missionInfo_data.length; i++) {
                        // Starts collapses with one open
                        if(i === 0){
                            IsOpen.push([{ Class: "active", status: true }, { Class: "", status: false }, { Class: "", status: false }]);
                        } else {
                            IsOpen.push([{ Class: "", status: false }, { Class: "", status: false }, { Class: "", status: false }]);
                        }
                    }
                    
                    this.setState({
                        Missions_info: missionInfo_data,
                        IsOpen: IsOpen,
                        Mission_Students: missionStudents.data,
                        Render: true
                    });
                } else {
                    this.setState({
                        Render: false
                    });
                }
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
        if (this.props.curriculumId !== prevProps.curriculumId) {
            this.fetchData(this.props.curriculumId);
        }
    }

    componentWillUnmount () {
        this.cancelTokenSource.cancel();
    }
    
    render() {
        const { Missions_info, IsOpen, Mission_Students, Render } = this.state;
        return (
            <React.Fragment>
                { Render ? (
                    <div>
                        <Nav tabs className="d-flex justify-content-around" style={{ fontSize: "0.85em" }}>
                            { Missions_info.map((data, index) => (
                                <UncontrolledDropdown key={"missionchartchild-" + data.ID} style={{ cursor: "pointer" }} nav inNavbar>
                                    <DropdownToggle tag="a" className={"nav-link " + IsOpen[index][0].Class + IsOpen[index][1].Class + IsOpen[index][2].Class} nav caret>
                                        { data.nameMission }
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem className={"" + IsOpen[index][0].Class} onClick={() => this.toggleCollapse(index, 0)} style={{ cursor: "pointer", borderRadius: 0 }}>Alunos que alcançaram</DropdownItem>
                                        <DropdownItem className={"" + IsOpen[index][1].Class} onClick={() => this.toggleCollapse(index, 1)} style={{ cursor: "pointer" }}>Alunos que não alcançaram</DropdownItem>
                                        <DropdownItem className={"" + IsOpen[index][2].Class} onClick={() => this.toggleCollapse(index, 2)} style={{ cursor: "pointer" }}>Alunos que não tentaram</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            ))}
                        </Nav>
                        { Missions_info.map((data, index) => (
                            <Container fluid={true} style={{ margin: "1em 1em 0 1em", textAlign: "center" }} key={"missionchartchild_collapse-" + data.ID}>
                                <Collapse isOpen={ IsOpen[index][0].status } key={"missionchartchild_collapse-" + data.ID + "-0"}>
                                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                                        <div>Alunos que alcançaram</div>
                                        <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                            { (Mission_Students.filter(element => (element.missionId === data.ID) && (element.studentStatus === "achieved")).length > 0) ? (
                                                Mission_Students.filter(element => (element.missionId === data.ID) && (element.studentStatus === "achieved")).map((data_student) => (
                                                    <Col sm="2" key={"missionchart_child-" + data_student.userId}>
                                                        <div className="d-flex flex-column" style={{ margin: "1em 0 0 0" }}>
                                                            <i className="far fa-user-circle fa-3x align-self-center"/>
                                                            <div className="align-self-center" style={{ fontSize: "0.85em" }}>
                                                                {data_student.userName}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))
                                            ) : (
                                                <Col style={{ margin: "1em 1em 0 1em", textAlign: "center" }}>
                                                    <div>Nenhum aluno nesse status</div>
                                                </Col>
                                            )}
                                        </Row>
                                    </Col>
                                </Collapse>
                                <Collapse isOpen={ IsOpen[index][1].status } key={"missionchartchild_collapse-" + data.ID + "-1"}>
                                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                                        <div>Alunos que não alcançaram</div>
                                        <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                            { (Mission_Students.filter(element => (element.missionId === data.ID) && (element.studentStatus === "notAchieved")).length > 0) ? (
                                                Mission_Students.filter(element => (element.missionId === data.ID) && (element.studentStatus === "notAchieved")).map((data_student) => (
                                                    <Col sm="2" key={"missionchart_child-" + data_student.userId}>
                                                        <div className="d-flex flex-column" style={{ margin: "1em 0 0 0" }}>
                                                            <i className="far fa-user-circle fa-3x align-self-center" />
                                                            <div className="align-self-center" style={{ fontSize: "0.85em" }}>
                                                                {data_student.userName}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))
                                            ) : (
                                                <Col style={{ margin: "1em 1em 0 1em", textAlign: "center" }}>
                                                    <div>Nenhum aluno nesse status</div>
                                                </Col>
                                            )}
                                        </Row>
                                    </Col>
                                </Collapse>
                                <Collapse isOpen={ IsOpen[index][2].status } key={"missionchartchild_collapse-" + data.ID + "-2"}>
                                    <Col style={{ textAlign: "center", paddingLeft: "0" }}>
                                        <div>Alunos que não tentaram</div>
                                        <Row className="overflow-auto" style={{ maxHeight: "12em" }}>
                                            { (Mission_Students.filter(element => (element.missionId === data.ID) && (element.studentStatus === "notAttempted")).length > 0) ? (
                                                Mission_Students.filter(element => (element.missionId === data.ID) && (element.studentStatus === "notAttempted")).map((data_student) => (
                                                    <Col sm="2" key={"missionchart_child-" + data_student.userId}>
                                                        <div className="d-flex flex-column" style={{ margin: "1em 0 0 0" }}>
                                                            <i className="far fa-user-circle fa-3x align-self-center" />
                                                            <div className="align-self-center" style={{ fontSize: "0.85em" }}>
                                                                {data_student.userName}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))
                                            ) : (
                                                <Col style={{ margin: "1em 1em 0 1em", textAlign: "center" }}>
                                                    <div>Nenhum aluno nesse status</div>
                                                </Col>
                                            )}
                                        </Row>
                                    </Col>
                                </Collapse>
                            </Container>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">Sem dados dos estudantes</div>
                )}
            </React.Fragment>
        );
    }
};

export { MissionChart, MissionChartChild };