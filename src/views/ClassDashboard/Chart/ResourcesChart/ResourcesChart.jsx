import React from "react";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { UncontrolledTooltip } from 'reactstrap';

import axios from 'axios';
//import { Link } from "react-router-dom";

const baseUrl = (process.env.REACT_APP_API_URL+process.env.PORT)|| "http://localhost:4000";

/* 
    * Component responsible for updating and rendering Class Interaction with Resources
    *
    * @version 0.1
*/
class ResourcesChart extends React.Component {
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
                    categories: [
                    ],
                    labels: {
                        useHTML: true,
                        formatter: function (data) {
                            var tip = '<div id="tooltip_resources-' + data.pos + '">' + data.value + '</div>';
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
                        '<span style="color:{point.color}">\u25CF</span> <b> {point.series.name}: {point.y}  ({point.percentage:.1f}%)  {point.name} </b><br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: "normal"
                    }
                },
                series: [
                    {
                        name: "Alunos que ainda não interagiram com esse recurso",
                        //color: '#273746 ',
                        color: "#34495E ",
                        data: []
                    },
                    {
                        name: "Alunos que não interagiram com sucesso com esse recurso",
                        //color: '#ffdc73',
                        color: "#ffdc73",
                        data: []
                    },
                    {
                        name: "Alunos que interagiram com sucesso com esse recurso",
                        color: "#52bf90",
                        data: []
                    }
                ]
            },
            Render: true,
            resource_data: []
        }
    }

    fetchData(curriculumId) {
        // Props
        const classroomId = this.props.classroomId;
        const courseId = this.props.courseId;

        // Variables with url to method get 
        const url_quantbyresource = baseUrl + "/course/getQuantStudentInteractionResources/" + classroomId + "/" + curriculumId;
        const url_allresources = baseUrl + "/course/getResourcesByCurriculum/" + curriculumId;
        const url_totalstudents = baseUrl + "/course/totalStudents/" + courseId + "/" + classroomId;
        const url_correctlyanswered = baseUrl + "/course/getNumberStudentsCorrectlyAnsweredProblems/" + classroomId + "/" + curriculumId;

        axios.all([
            axios.get(url_quantbyresource, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_allresources, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_totalstudents, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_correctlyanswered, { cancelToken: this.cancelTokenSource.token })
        ])
            .then(axios.spread((quantresource, allresources, manystudents, correctlyanswered) => {
                // Checks if have data
                if (quantresource.data && allresources.data && manystudents.data && correctlyanswered.data) {
                    var interactionresources = quantresource.data;
                    var allresources_data = allresources.data;
                    var totalofstudents = manystudents.data[0].count;
                    var correctlyanswered_data = correctlyanswered.data;

                    // Checks if have interaction with resources
                    // Renders the chart only if have data in interaction resources
                    if (interactionresources && interactionresources.length > 0) {
                        // Loop to set values for every resource, for render in Chart
                        for (let i = 0; i < allresources_data.length; i++) {
                            // get position if exist of the current resource in interactions
                            let position = interactionresources.findIndex(x => x.resource_id === allresources_data[i].resource_id);

                            // check if is a valid position
                            if (interactionresources[position]) {
                                // puts the value in the array because exist the position
                                allresources_data[i].quant = interactionresources[position].quant;
                            } else {
                                allresources_data[i].quant = 0;
                            }

                            // get position if exist of the current resource in correctlyanswered_data
                            let position_resource_id = correctlyanswered_data.findIndex(x => x.problem_id === allresources_data[i].resource_id);

                            // check if is a valid position
                            if (correctlyanswered_data[position_resource_id]) {
                                // puts the value of unsuccessfully interaction (interactions - successfully interaction)
                                allresources_data[i].unsuccessfully_interaction = allresources_data[i].quant - correctlyanswered_data[position_resource_id].quantAnsweredCorrectly;
                            } else {
                                allresources_data[i].unsuccessfully_interaction = 0;
                            }
                        }

                        this.setState({
                            chartOptions: {
                                xAxis: {
                                    categories: allresources_data.map(x => x.resource_type)
                                },
                                series: [
                                    { data: allresources_data.map(x => totalofstudents - x.quant) },
                                    { data: allresources_data.map(x => x.unsuccessfully_interaction) },
                                    { data: allresources_data.map(x => x.quant - x.unsuccessfully_interaction) }
                                ]
                            },
                            Render: true,
                            resource_data: allresources_data
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
        // if change curriculum, update all data.
        if (this.props.curriculumId !== prevProps.curriculumId) {
            this.fetchData(this.props.curriculumId);
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource.cancel();
    }

    render() {
        const { chartOptions, Render, resource_data } = this.state;
        return (
            <React.Fragment>
                {Render ? (
                    <div>
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                        {resource_data.map((data, index) => (
                            document.getElementById("tooltip_resources-" + index) ? (
                                <UncontrolledTooltip key={"resourceschart-" + data.resource_id} placement="bottom" target={"tooltip_resources-" + index} style={{ fontSize: "0.85em" }}>
                                    {(data['resource_type'].includes("problem")) ? (
                                        <div className="text-center">
                                            {data.titleProblems}
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            {data.titleResources}
                                        </div>
                                    )}
                                </UncontrolledTooltip>
                            ) : (
                                null
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center">Nenhum estudante desta turma interagiu ainda com os recursos deste assunto</div>
                )}
            </React.Fragment>
        );
    }
};

// Render the Table head with all resources
const TableHead = props => {
    const columns = props.resources.map((resource, index) => {
        if (index === 0) {
            // Render "Alunos"
            return (<th key={"tb_h_resourceschart-" + resource.resource_id} scope="col">{resource}</th>);
        } else {
            // Render resources
            return (<th key={"tb_h_resourceschart-" + resource.resource_id} scope="col" style={{ textAlign: "center" }}>{resource.resource_type} {resource.resource_id}</th>);
        }
    });

    return (
        <thead>
            <tr>
                {columns}
            </tr>
        </thead>
    );
}

// Render the body of the table with the students, and if each of them interacted with the resources
const TableBody = props => {


    // Render the columns
    const columns = (student, students_interaction, resource, status_problems) => resource.map((resource, index) => {
        if (index === 0) {
            // Render student name
            return (<td key={"tb_b_c_resourceschart-" + resource.resource_id}><i className="far fa-user-circle fa-2x" style={{ verticalAlign: "middle", margin: "0 0.5em 0 0" }}/>{student.name}</td>);
        } else {
            // Render if interacted with the resources
            // check if the student interacted
            let current_interaction = students_interaction.find(element => (element.name === student.name) && (element.resource_id === resource.resource_id));

            // if interacted Render green or yellow dot
            if (resource.resource_type === 'problem') {
                // let current_interaction_problem = status_problems.find(element => (element.user_id === student.id) && (element.problem_id === resource.resource_id) && (element.correctly_done.data[0] === 1));
                if (status_problems.find(element => (element.user_id === student.id) && (element.problem_id === resource.resource_id) && (element.correctly_done.data[0] === 1))) {
                    return (<td key={"tb_b_c_resourceschart-" + resource.resource_id} style={{ textAlign: "center" }}><i className="fas fa-circle fa-2x" style={{ color: "#52bf90" }}></i></td>);
                } else if (status_problems.find(element => (element.user_id === student.id) && (element.problem_id === resource.resource_id) && (element.correctly_done.data[0] === 0))) {
                    return (<td key={"tb_b_c_resourceschart-" + resource.resource_id} style={{ textAlign: "center" }}><i className="fas fa-circle fa-2x" style={{ color: "#ffdc73" }}></i></td>);
                } else {
                    return (<td key={"tb_b_c_resourceschart-" + resource.resource_id} style={{ textAlign: "center" }}><i className="fas fa-circle fa-2x" style={{ color: "#34495E" }}></i></td>);
                }
            } else if (current_interaction) {
                return (<td key={"tb_b_c_resourceschart-" + resource.resource_id} style={{ textAlign: "center" }}><i className="fas fa-circle fa-2x" style={{ color: "#52bf90" }}></i></td>);
            } else {
                return (<td key={"tb_b_c_resourceschart-" + resource.resource_id} style={{ textAlign: "center" }}><i className="fas fa-circle fa-2x" style={{ color: "#34495E" }}></i></td>);
            }
        }
    });

    // Render the rows
    const rows = props.students.map((student, index) => {
        return (
            <tr key={"tb_b_r_resourceschart-" + student.id}>
                {columns(student, props.students_interaction, props.resources, props.status_problems)}
            </tr>
        );
    });

    return (
        <tbody>{rows}</tbody>
    );
}

/* 
    * Component responsible for updating and rendering Class Interaction with Resources Child
    *
    * @version 0.1
*/
class ResourcesChartChild extends React.Component {
    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            students: [],
            students_interaction: [],
            resources: [],
            status_problems: [],
            Render: true
        }
    }

    fetchData(curriculumId) {
        // Props
        const courseId = this.props.courseId;
        const classroomId = this.props.classroomId;

        // Variables with url to method get 
        const url_students = baseUrl + "/course/getStudents/" + courseId + "/" + classroomId;
        const url_students_interaction = baseUrl + "/course/getStudentsInteractionResources/" + curriculumId + "/" + classroomId;
        const url_resources = baseUrl + "/course/getResourcesByCurriculum/" + curriculumId;
        const url_status_problems = baseUrl + "/course/getClassStatusProblems/" + classroomId + "/" + curriculumId;

        axios.all([
            axios.get(url_students, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_students_interaction, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_resources, { cancelToken: this.cancelTokenSource.token }),
            axios.get(url_status_problems, { cancelToken: this.cancelTokenSource.token })
        ])
            .then(axios.spread((students, students_interaction, resources, status_problems) => {
                // Checks if have data
                if (students.data && students_interaction.data && resources.data && status_problems.data) {
                    const students_data = students.data;
                    const students_interaction_data = students_interaction.data;
                    const resources_data = resources.data;
                    const status_problems_data = status_problems.data;

                    // Checks if have interaction with resources
                    // Renders the students only if have data in interaction resources
                    if (students_interaction_data && students_interaction_data.length > 0) {
                        // Add at the beginning of the table the word "Alunos"
                        resources_data.unshift("Alunos");

                        // Render students
                        this.setState({
                            students: students_data,
                            students_interaction: students_interaction_data,
                            resources: resources_data,
                            status_problems: status_problems_data,
                            Render: true
                        });
                    } else {
                        // Don't render students
                        this.setState({
                            Render: false
                        });
                    }
                } else {
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

    render() {
        const { resources, students, students_interaction, status_problems, Render } = this.state;

        return (
            <React.Fragment>
                {Render ? (
                    <div className="overflow-auto" style={{ maxHeight: "15em", fontSize: "0.6em" }}>
                        <table className="table">
                            <TableHead resources={resources} />
                            <TableBody students={students} resources={resources} students_interaction={students_interaction} status_problems={status_problems} classroomId={this.props.classroomId} teacherId={this.props.teacherId} courseId={this.props.courseId}/>
                        </table>
                    </div>
                ) : (
                        <div className="text-center">Sem dados de interação</div>
                    )}
            </React.Fragment>
        );
    }
};

export { ResourcesChart, ResourcesChartChild };