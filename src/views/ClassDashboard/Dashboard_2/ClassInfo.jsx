import React from "react";

import { NavLink } from "react-router-dom";

import {
  Row,
  Col
} from "reactstrap";

import Dropdown from "../../../components/Dropdown/Dropdown.jsx";
import StudentsRegistered from "../DescripitiveData/StudentsRegistered";
import AverageStudentsPoints from "../DescripitiveData/AverageStudentsPoints";
import MinimumPercentage from "../DescripitiveData/MinimumPercentage";

import { LevelChart, LevelChartChild } from "../Chart/LevelChart/LevelChart.jsx";
import { ReachStatisticsChart, ReachStatisticsChild } from "../Chart/ReachStatisticsChart/ReachStatisticsChart.jsx";
import { MissionChart, MissionChartChild } from "../Chart/MissionChart/MissionChart.jsx";

class ClassInfo extends React.Component{ 
render() {
  const { courseId, classroomId, curriculumId } = this.props;
  return(
    <div>
      <Row>
        <Col lg="4" md="6" sm="9">
          <StudentsRegistered courseId={ courseId } classroomId={ classroomId }/>
        </Col>
        <Col lg="4" md="6" sm="9">
          <AverageStudentsPoints courseId={ courseId } classroomId={ classroomId } curriculumId={ curriculumId }/>
        </Col>
        <Col lg="4" md="6" sm="9">
          <MinimumPercentage classroomId={ classroomId } curriculumId={ curriculumId }/>
        </Col>
        <Col md="12">
          <Dropdown 
            id = "3" icon = "fa fa-info-circle" title = "Alcance da Porcentagem Mínima"
            help = {
              <div className="text-center">
                Este gráfico mostra a quantidade de alunos 
                que atingiram e não atingiram a porcentagem 
                mínima de interação com os recursos deste assunto.
              </div>
            }
            content = {
              <ReachStatisticsChart classroomId={ classroomId } curriculumId={ curriculumId } courseId={ courseId }/>
            }
            contentchild = {
              <ReachStatisticsChild classroomId={ classroomId } curriculumId={ curriculumId } courseId={ courseId }/>
            }
          />
        </Col>
        <Col md="12">
          <Dropdown 
            id = "5" icon = "fa fa-info-circle" title = "Distribuição da Turma por Nível"
            help = {
              <div className="text-center">
                Este gráfico mostra a distribuição dos 
                alunos em diferente níveis. Os níveis utilizam 
                a pontuação conquistada pelos estudantes através 
                das suas interações com os recursos do sistema.
              </div>
            }
            content = {
              <LevelChart courseId={ courseId } classroomId={ classroomId }/>
            }
            contentchild = {
              <LevelChartChild courseId={ courseId } classroomId={ classroomId }/>
            }
          />
        </Col>
        <Col md="12">
          <Dropdown 
            id = "6" icon = "fa fa-info-circle" title = "Interação com as Missões"
            help = {
              <div className="text-center">
                Este gráfico mostra a quantidade de 
                alunos que alcançaram, não alcançaram 
                e não tentaram alcançar cada missão criada pelo professor.
              </div>
            }
            content = {
              <MissionChart classroomId={ classroomId } curriculumId={ curriculumId } courseId={ courseId }/>
            }
            contentchild = {
              <MissionChartChild classroomId={ classroomId } curriculumId={ curriculumId } courseId={ courseId }/>
            }
          />
        </Col>
      </Row>
      <center>
            <NavLink className="text-dark" to={{pathname:"/dashboardQuestions", state: {DashboardID: 2}}} > 
            <button type="button" style={{marginBottom: '0'}} className="btn btn-primary">
              Avaliar o Painel
            </button>
            </NavLink>
      </center>  
    </div>
    );
  }
}

export default ClassInfo;
