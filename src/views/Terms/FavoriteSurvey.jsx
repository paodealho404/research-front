import React from 'react';

import { Redirect } from 'react-router-dom';

import {
    Col,
    Button,
    Form
} from 'reactstrap';

import Header from "./components/Header";

import axios from 'axios';

import Auth from "../Auth";

import Dashboard1 from '../../assets/img/Dashboard_1.png';
import Dashboard2 from '../../assets/img/Dashboard_2.png';
import Dashboard3 from '../../assets/img/Dashboard_3.png';

const baseUrl = ((process.env.REACT_APP_API_URL) || "http://localhost:4000") + '/course';

class FavoriteSurvey extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            dashboard: '',
            redirect: false,
            redirect_bd: false,
            formValid: false,
            submit: false,
            formErrors: '',
            last_id: null,
        };
        
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!(Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey1'))) && Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey2'))) && Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey3'))))) {
            this.redirect();
        }
    }
    
    handleChange(event) {
        let value = event.target.value;
        this.setState({ dashboard: value });
        this.setState({ formValid: true });
    }

    submit() {
        let best_dashboard = parseInt(this.state.dashboard);

        let participant_info = JSON.parse(sessionStorage.getItem('participant'));

        participant_info.favorite_dashboard = best_dashboard;

        sessionStorage.setItem('participant', JSON.stringify(participant_info));

        if(Auth.authenticate_participant(participant_info) && sessionStorage.getItem('accepted') && Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey1'))) && Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey2'))) && Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey3')))) {
            axios.post(baseUrl + '/createParticipant', participant_info)
                .then((res) => {
                    this.setState(prevState => ({
                        ...prevState, last_id: res.data.id
                    }), () => {
                        let i, req = [];
                        for(i = 1; i <= 3; i++)
                        {
                            let survey = JSON.parse(sessionStorage.getItem('survey' + i));
                            survey.participant_id = this.state.last_id;
                            let promise = axios({
                                method: 'post',
                                url: baseUrl+'/createSurvey',
                                data: survey
                            });
                            req.push(promise);
                        }
                        axios.all(req)
                            .then(axios.spread((...responses)=>{
                                responses.forEach(res => {});
        
                                this.setState({
                                    submit: true
                                });
                            }))
                            .catch(error=>{
                                console.log(error);
                            });
                    });
                })
                .catch(error => {
                    //alert("Error server " + error);
                    if (axios.isCancel(error)) {
                        //console.log('Request canceled');
                    } else {
                        console.log("Error server " + error);
                        this.redirect_bd();
                    }
                });
            } else {
                this.redirect();
            }
    }

    redirect(){
        this.setState({
            redirect: true
        });
    }

    redirect_bd(){
        this.setState({
            redirect_bd: true
        });
    }

    render() {
        let participant_info = JSON.parse(sessionStorage.getItem('participant'));
        
        return( (sessionStorage.getItem('participant') && sessionStorage.getItem('accepted')) ? (
            <div>
                <Header/>
                <Col>
                    <p className= " text-center font-weight-bold " style={{fontFamily: 'Calibri', fontSize: '25px', color: '#6c757d'}}> Qual dos três painéis interagidos anteriormente melhor te auxiliaria no processo de tomada de decisões durante o processo de ensino/aprendizagem? </p> <br/>
                    <Form className="container">
                        <div className="radio" aria-label="dashboard" name="dashboard" value={this.state.dashboard} onChange={this.handleChange}>
                            <div style={{overflow: 'hidden', height: '1200px', borderRadius: '15px'}}>
                                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} alt="Imagem do dashboard 1" src={Dashboard1}/>
                            </div>
                            <br/>
                            <br/>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <label>
                                    <input className="text-secondary" style={{marginRight: '0.75em', transform: 'scale(1.5)', verticalAlign: 'middle', position: 'relative'}} id="1" value="1" name="dashboard-select" type="radio" />
                                    <div style={{fontSize: '2em', display: 'inline', verticalAlign: 'middle', position: 'relative'}}>Painel - Interação com os Recursos de Aprendizagem</div>
                                </label>
                            </div>
                            <br/>
                            <br/>
                            <div style={{overflow: 'hidden', height: '1200px', borderRadius: '15px'}}>
                                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} alt="Imagem do dashboard 2" src={Dashboard2}/>
                            </div>
                            <br/>
                            <br/>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <label>
                                    <input className="text-secondary" style={{marginRight: '0.75em', transform: 'scale(1.5)', verticalAlign: 'middle', position: 'relative'}} id="2" value="2" name="dashboard-select" type="radio" />
                                    <div style={{fontSize: '2em', display: 'inline', verticalAlign: 'middle', position: 'relative'}}>Painel - Interação com os Elementos de Jogos</div>
                                </label>
                            </div>
                            <br/>
                            <br/>
                            <div style={{overflow: 'hidden', height: '1200px', borderRadius: '15px'}}>
                                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} alt="Imagem do dashboard 3" src={Dashboard3}/>
                            </div>
                            <br/>
                            <br/>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <label>
                                    <input className="text-secondary" style={{marginRight: '0.75em', transform: 'scale(1.5)', verticalAlign: 'middle', position: 'relative'}} id="3" value="3" name="dashboard-select" type="radio" />
                                    <div style={{fontSize: '2em', display: 'inline', verticalAlign: 'middle', position: 'relative'}}>Painel - Interação com os Recursos de Aprendizagem e Elementos de Jogos</div>
                                </label>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <Col>
                            <Button color="#C0B283" style={{display: 'flex', marginRight: 'auto', marginLeft: 'auto'}} disabled={!this.state.formValid} onClick={() => this.submit()}> 
                                <span className="text-white">Submeter</span>     
                                {this.state.submit ? (<Redirect to={{ pathname:"/thanks"}}/>) : <div></div>}  
                            </Button>
                        </Col>
                    </Form>
                    {this.state.redirect ? (<Redirect to={{pathname:"/admin/classDashboard_" + participant_info.dashboard_sequence[0] + "/7/345/32"}}/>) : (<div></div>)}
                    {this.state.redirect_bd ? (<Redirect to={{ pathname:"/", state: {message: 'Perdão, houve um problema durante o envio dar informações ao banco. Tente novamente mais tarde.'}}}/>) : <div></div>}
                </Col>
            </div>
            ) : (
                <Redirect to={{ pathname:"/", state: {message: 'Perdão, houve um problema durante a confirmação do termo de consentimento.'}}}/>
            )
        )
    }
}

export default FavoriteSurvey;