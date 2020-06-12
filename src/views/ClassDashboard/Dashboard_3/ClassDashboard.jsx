import React from "react";

import { Redirect } from 'react-router-dom';

import {
    Row,
    Col
} from "reactstrap";

import Curriculum from "../Curriculum.jsx";

class ClassDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classroomId: "",
            teacherId: "",
            courseId: "",
            render: false
        }
    }

    componentWillMount() {
        let participant_info = JSON.parse(sessionStorage.getItem('participant')).dashboard_sequence;
        if(participant_info.indexOf(3) == -1 || participant_info[0] == 3){
            this.setState({ render: true });
        }
    }

    render() {
        let participant_info = JSON.parse(sessionStorage.getItem('participant'));
        return (
            this.state.render ? (
                <>
                    <div className="content" style={{paddingBottom: "15px"}}>
                    <Row></Row>
                    <Row></Row>
                    <Row> <Col><h2>Painel - Interação com os Recursos de Aprendizagem e Elementos de Jogos</h2></Col></Row> 
                    <Row className = "border-bottom">
                        <Col>
                            <button className="btn-link text-dark font-weight-bold border-bottom border-dark">Turma</button>
                        </Col>
                    </Row>
                    <Row></Row>
                    <br/>
                    <div>
                        <Curriculum teacherId={this.props.match.params.teacherId} classroomId = {this.props.match.params.id} courseId = {this.props.match.params.courseId} renderDate={true} DashboardID={3}/>
                    </div>
                    <br/>
                    </div>
                </>
            ) : (
                <Redirect to={{pathname:"/admin/classDashboard_" + participant_info.dashboard_sequence[0] + "/7/345/32"}}/>
            )
        );
    }
}
export default ClassDashboard;