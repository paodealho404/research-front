import React from 'react';

import { Redirect } from 'react-router-dom';

import {
  Form,
  Button,
  Col
} from 'reactstrap';

import Checkbox from "./components/Checkbox";
import Header from "./components/Header";
import LargeTextArea from "./components/LargeTextArea";

const baseUrl = (process.env.REACT_APP_API_URL+'/course') || "http://localhost:4000/course";

class DashboardQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            questionAnswers: {
                participant_id: null,
                q1: '',
                q2: '',
                q3: '',
                q4: '',
                q5: '',
                q6: '',
                q7: '',
                q8: '',
                q9: '',
                openQuestion1: '',
                openQuestion2: '',
                survey_type: null
            },
            accepted: true,
            formErrors: { 
                q1: '',
                q2: '',
                q3: '',
                q4: '',
                q5: '',
                q6: '',
                q7: '',
                q8: '',
                q9: ''
            },
            credibility: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            possibleOptions: ['Discordo totalmente', 'Discordo', 'Discordo Parcialmente', 'Neutro', 'Concordo Parcialmente', 'Concordo', 'Concordo totalmente']
        } 
        this.redirect = this.redirect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }  
    componentWillMount()
    {
        if(!sessionStorage.getItem('accepted') || !sessionStorage.getItem('participant'))
        {
            this.setState({accepted: false});
        }
    }
    redirect(){
        let participant_info = JSON.parse(sessionStorage.getItem('participant'));

        let survey_type = parseInt(this.props.location.state.DashboardID);
        let surveyName = 'survey' + survey_type; 
        this.setState(prevState => ({ questionAnswers: {...prevState.questionAnswers, participant_id: participant_info.id, survey_type: survey_type}}), () => {
            sessionStorage.setItem(surveyName, JSON.stringify(this.state.questionAnswers));
            
            this.setState({redirect: true});

            const index = participant_info.dashboard_sequence.indexOf(survey_type);
            if (index > -1) {
                participant_info.dashboard_sequence.splice(index, 1);
            }

            sessionStorage.setItem('participant', JSON.stringify(participant_info));
        });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let q1AnswerValid = this.state.q1Valid;
        let q2AnswerValid = this.state.q2Valid;
        let q3AnswerValid = this.state.q3Valid;
        let q4AnswerValid = this.state.q4Valid;
        let q5AnswerValid = this.state.q5Valid;
        let q6AnswerValid = this.state.q6Valid;
        let q7AnswerValid = this.state.q7Valid;
        let q8AnswerValid = this.state.q8Valid;
        let q9AnswerValid = this.state.q9Valid;
  
        switch(fieldName) {
            case 'q1':
                q1AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q1 = q1AnswerValid ? '' : 'notValid';
                break;
            case 'q2':
                q2AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q2 = q2AnswerValid ? '' : 'notValid';
                break;
            case 'q3':
                q3AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q3 = q3AnswerValid ? '' : 'notValid';
                break;
            case 'q4':
                q4AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q4 = q4AnswerValid ? '' : 'notValid';
                break;
            case 'q5':
                q5AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q5 = q5AnswerValid ? '' : 'notValid';
                break;
            case 'q6':
                q6AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q6 = q6AnswerValid ? '' : 'notValid';
                break;
            case 'q7':
                q7AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q7 = q7AnswerValid ? '' : 'notValid';
                break;
            case 'q8':
                q8AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q8 = q8AnswerValid ? '' : 'notValid';
                break;
            case 'q9':
                q9AnswerValid = value.length>0 ? true : false;
                fieldValidationErrors.q9 = q9AnswerValid ? '' : 'notValid';
                break;
        }

        this.setState({formErrors: fieldValidationErrors, q1Valid: q1AnswerValid, q2Valid: q2AnswerValid, q3Valid: q3AnswerValid, q4Valid: q4AnswerValid, q5Valid: q5AnswerValid, q6Valid: q6AnswerValid, q7Valid: q7AnswerValid, q8Valid: q8AnswerValid, q9Valid: q9AnswerValid}, this.validateForm);
    }
    
    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState(prevState => ({ questionAnswers : {...prevState.questionAnswers, [name]: [value]}}), ()=>{this.validateField(name,value)});
    }

    validateForm()
    {
        this.setState({formValid: (this.state.q1Valid && this.state.q2Valid && this.state.q3Valid && this.state.q4Valid && this.state.q5Valid && this.state.q6Valid && this.state.q7Valid && this.state.q8Valid && this.state.q9Valid)});
    }

    render()
    {
        let participant_info = JSON.parse(sessionStorage.getItem('participant'));
        return(
            this.state.accepted ? (
                <div>
                    <Header/>
                    <p className= " text-center font-weight-bold " style={{fontFamily: 'Calibri', fontSize: '25px', color: '#6c757d'}}> Responda as seguintes questões sobre a sua experiência com o painel apresentado: </p>
                    <br/> 
                    <Form className="container">
                        <Checkbox title={'Eu entendi o que as informações estatísticas no dashboard implicam.'} 
                            name={'q1'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q1}
                            value = {this.state.questionAnswers.q1}
                            handleChange = {this.handleChange}/>
                        <br/>

                        <Checkbox title={'Eu entendi o que as informações visuais no dashboard implicam.'} 
                            name={'q2'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q2}
                            value = {this.state.questionAnswers.q2}
                            handleChange = {this.handleChange}/>
                        <br/>

                        <Checkbox title={'Entendi o status da turma imediatamente através do dashboard.'} 
                            name={'q3'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q3}
                            value = {this.state.questionAnswers.q3}
                            handleChange = {this.handleChange}/>
                        <br/>
                        
                        <Checkbox title={'As informações que estão no dashboard são as que eu quero saber.'} 
                            name={'q4'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q4}
                            value = {this.state.questionAnswers.q4}
                            handleChange = {this.handleChange}/>
                        <br/>

                        <Checkbox title={'O dashboard inclui apenas informações essenciais.'} 
                            name={'q5'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q5}
                            value = {this.state.questionAnswers.q5}
                            handleChange = {this.handleChange}/>
                        <br/>

                        <Checkbox title={'O dashboard pode me ajudar a monitorar atividades relacionadas a metas.'} 
                            name={'q6'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q6}
                            value = {this.state.questionAnswers.q6}
                            handleChange = {this.handleChange}/>
                        <br/>
                        
                        <Checkbox title={'O dashboard pode me ajudar a mudar as estratégias de gerenciamento de recursos para turma.'} 
                            name={'q7'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q7}
                            value = {this.state.questionAnswers.q7}
                            handleChange = {this.handleChange}/>
                        <br/>

                        <Checkbox title={'O dashboard pode me ajudar a alcançar os objetivos de desempenho desejado para a turma.'} 
                            name={'q8'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q8}
                            value = {this.state.questionAnswers.q8}
                            handleChange = {this.handleChange}/>
                        <br/>

                        <Checkbox title={'Ficarei motivado a me engajar no uso da plataforma ao revisar o dashboard.'} 
                            name={'q9'}
                            options={this.state.possibleOptions}
                            selectedOptions = {this.state.questionAnswers.q9}
                            value = {this.state.questionAnswers.q9}
                            handleChange = {this.handleChange}/>
                        <br/>

                        <LargeTextArea
                            title={'Por favor, descreva aqui um ponto negativo sobre esta versão da ferramenta apresenta.'}
                            rows={3}
                            value={this.state.questionAnswers.openQuestion1}
                            name={'openQuestion1'}
                            handleChange={this.handleChange}/>
                        <br/>

                        <LargeTextArea
                            title={'Por favor, descreva aqui um ponto positivo sobre esta versão da ferramenta apresenta.'}
                            rows={3}
                            value={this.state.questionAnswers.openQuestion2}
                            name={'openQuestion2'}
                            handleChange={this.handleChange}/>
                        <br/>

                        <Col sm={{ span: 10, offset: 5 }}>
                            <Button color="#C0B283" disabled={!this.state.formValid} onClick={() => this.redirect()}> 
                                <span className="text-white">Submeter</span>       
                            </Button>
                            {participant_info.dashboard_sequence.length > 0 ? (
                                <div>
                                    {this.state.redirect ? (<Redirect to={{pathname:"/admin/classDashboard_" + participant_info.dashboard_sequence[0] + "/7/345/32"}}/>) : (<div></div>)}
                                </div>
                            ) : (
                                <Redirect to={{pathname:"/thanks"}}/>
                            )}
                        </Col>
                    </Form>
                </div>  
            ) : (
                <Redirect to={{pathname: '/'}}/>
            )        
        )      
    }
}
export default DashboardQuestions;