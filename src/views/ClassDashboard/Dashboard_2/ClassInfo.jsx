import React from "react";

import { NavLink } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  ButtonGroup,
  Col
} from "reactstrap";

import Dropdown from "../../../components/Dropdown/Dropdown.jsx";
import StudentsRegistered from "../DescripitiveData/StudentsRegistered";
import AverageStudentsPoints from "../DescripitiveData/AverageStudentsPoints";
import MinimumPercentage from "../DescripitiveData/MinimumPercentage";
import HelpIcon from "../../../components/HelpIcon/HelpIcon.jsx";

import { LevelChart, LevelChartChild } from "../Chart/LevelChart/LevelChart.jsx";
import { PerformanceChart } from "../Chart/PerformanceChart/PerformanceChart.jsx";
import { MissionChart, MissionChartChild } from "../Chart/MissionChart/MissionChart.jsx";

class ClassInfo extends React.Component{ 
render() {
  const { courseId, classroomId, curriculumId, optionSelected } = this.props;
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
          <Card tag = "h5">
            <CardHeader>
              <CardTitle>
                <div className = "d-flex justify-content-end mx-3"> 
                  <div className = "mr-auto p-2">
                    <div className="text-center">Impacto das Missões na Interação da Turma com os Recursos.</div>
                  </div>
                  <div className = "p-2">
                      <ButtonGroup>
                          <Col>
                            <HelpIcon id = "1" icon = "fa fa-info-circle" 
                            help = {
                              <div className="text-center">
                                Este gráfico mostra o progresso 
                                da turma com o passar do tempo 
                                e o impacto das missões criadas na 
                                porcentagem da interação da 
                                turma com os recursos.
                              </div>
                            }/>
                          </Col>
                          <Col>
                            { optionSelected === "Dinâmicas" ? (
                                <HelpIcon id = "2" icon = "fa fa-exclamation-triangle" color="red"
                                help = {
                                  <div className="text-center">
                                    Está faltando 2 dias para para o período previsto para o domínio deste assunto finalizar e ainda 50% dos alunos não alcançaram a porcentagem mínima de interação com os recursos. Você pode criar uma missão para motivar esses alunos.
                                  </div>
                                }/>
                              ) : (
                                <HelpIcon id = "2" icon = "fa fa-exclamation-triangle"
                                help = {
                                  <div className="text-center">
                                    Nenhum alerta para este assunto.
                                  </div>
                                }/>
                              )
                            }
                          </Col>
                      </ButtonGroup>
                  </div>  
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div style = {{ borderTop: "0.1em solid grey", opacity: "0.3", margin: "0 0.5em 1em 0.5em" }}></div>
                <div>
                  <PerformanceChart classroomId={ classroomId } curriculumId={ curriculumId } courseId={ courseId }/>
                </div>
            </CardBody>
            <CardFooter>
            </CardFooter>
          </Card>
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
