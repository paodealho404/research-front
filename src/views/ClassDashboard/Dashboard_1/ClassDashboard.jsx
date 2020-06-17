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
            courseId: ""
        }
    }

    render() {
        let participant_info = JSON.parse(sessionStorage.getItem('participant'));
        return (
            (participant_info.dashboard_sequence.indexOf(2) === -1 || participant_info.dashboard_sequence[0] === 1) ? (
                <>
                    <div className="content" style={{paddingBottom: "15px"}}>
                    <Row></Row>
                    <Row></Row>
                    <Row> <Col><h2>Painel - Interação com os Recursos de Aprendizagem</h2></Col></Row> 
                    <Row className = "border-bottom">
                        <Col>
                            <button className="btn-link text-dark font-weight-bold border-bottom border-dark">Turma</button>
                        </Col>
                    </Row>
                    <Row></Row>
                    <br/>
                    <div>
                        <Curriculum teacherId={this.props.match.params.teacherId} classroomId = {this.props.match.params.id} courseId = {this.props.match.params.courseId} renderDate={true} DashboardID={1}/>
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