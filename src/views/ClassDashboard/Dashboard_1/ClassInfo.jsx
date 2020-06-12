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
import SubjectDomain from "../DescripitiveData/SubjectDomain";
import MinimumPercentage from "../DescripitiveData/MinimumPercentage";
import HelpIcon from "../../../components/HelpIcon/HelpIcon.jsx";

import { ResourcesChart, ResourcesChartChild } from "../Chart/ResourcesChart/ResourcesChart.jsx";
import { ReachStatisticsChart, ReachStatisticsChild } from "../Chart/ReachStatisticsChart/ReachStatisticsChart.jsx";
import { PerformanceChart } from "../Chart/PerformanceChart/PerformanceChart.jsx";

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
          <SubjectDomain courseId={ courseId } classroomId={ classroomId } curriculumId={ curriculumId }/>
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
                    <div className="text-center">Progresso de Interação da Turma com os Recursos</div>
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
            id = "4" icon = "fa fa-info-circle" title = "Interação da Turma com os Recursos"
            help = {
              <div className="text-center">
                Este gráfico mostra a quantidade de alunos que 
                interagiram com sucesso, que não interagiram com 
                sucesso e alunos que não interagiram com cada recurso 
                adicionado pelo professor no plano de atividades deste assunto.
              </div>
            }
            content = {
              <ResourcesChart classroomId={ classroomId } curriculumId={ curriculumId } courseId={ courseId }/>
            }
            contentchild = {
              <ResourcesChartChild classroomId={ classroomId } curriculumId={ curriculumId } courseId={ courseId }/>
            }
          />
        </Col>
      </Row>
      <center>
            <NavLink className="text-dark" to={{pathname: "/dashboardQuestions", state: {DashboardID: 1}}} > 
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
