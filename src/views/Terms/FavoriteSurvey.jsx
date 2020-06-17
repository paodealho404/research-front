import React from 'react';

import { Redirect } from 'react-router-dom';

import {
    Col,
    Button,
    Form
} from 'reactstrap';

import Header from "./components/Header";

import Dashboard1 from '../../assets/img/Dashboard_1.png';
import Dashboard2 from '../../assets/img/Dashboard_2.png';
import Dashboard3 from '../../assets/img/Dashboard_3.png';

class FavoriteSurvey extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            dashboard: '',
            redirect: false,
            formValid: false,
            submit: false,
            formErrors: '',
        }
        
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount()
    {
        if(!(sessionStorage.getItem('survey1')&&sessionStorage.getItem('survey2')&&sessionStorage.getItem('survey3')))
        {
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

        let participant = JSON.parse(sessionStorage.getItem('participant'));

        participant.favorite_dashboard = best_dashboard;

        sessionStorage.setItem('participant', JSON.stringify(participant));

        this.setState({
            submit: true
        });
    }

    redirect(){
        this.setState({
            redirect: true
        });
    }

    render() {
        let participant_info = JSON.parse(sessionStorage.getItem('participant'));
        return( (sessionStorage.getItem('accepted') && sessionStorage.getItem('participant')) ? (
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
                        </div></
                        div>
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
                </Col>
            </div>
            ) : (
                <Redirect to={{ pathname:"/"}}/>
            )
        )
    }
}
export default FavoriteSurvey;