import React from 'react';
import Header from "./components/Header";
import { Redirect } from 'react-router';
import {Col, Button} from 'reactstrap';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dashboard1 from '../../assets/img/Dashboard1.png';
import Dashboard2 from '../../assets/img/Dashboard2.png';
import Dashboard3 from '../../assets/img/Dashboard3.png';

class FavoriteSurvey extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            dashboard: '',
            redirect: false,
            formValid: false,
            formErrors: '',
        }
        
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount()
    {
        if(!sessionStorage.getItem('accepted')&&sessionStorage.getItem('participant')&&sessionStorage.getItem('survey1')&&sessionStorage.getItem('survey2')&&sessionStorage.getItem('survey3'))
        {
            this.redirect();
        }
        
    }

    handleChange(event) {
        let value = event.target.value;
        this.setState({ dashboard: value });
        this.setState({ formValid: true });
    }

    redirect(){
        if((this.state.dashboard === '1') || (this.state.dashboard === '2') || (this.state.dashboard === '3')){

            let participant_info = JSON.parse(sessionStorage.getItem('participant'));

            let newParticipantInfo = {
                'id' : participant_info.id,
                'gender' : participant_info.gender,
                'age' : participant_info.age,
                'educational_level' : participant_info.educational_level,
                'state' : participant_info.state,
                'technical_level' : participant_info.technical_level,
                'dashboard_sequence' : participant_info.dashboard_sequence,
                'favorite_dashboard' : this.state.dashboard
            };

            sessionStorage.setItem('participant', JSON.stringify(newParticipantInfo));

            this.setState({
                redirect: true
            });
        }
    }

    render()
    {
        return !this.state.redirect ? 
        (<>
            <Header/>
            <p className= " text-center font-weight-bold " style={{fontFamily: 'Calibri', fontSize: '25px', color: '#6c757d'}}> Quais dos painéis de dados que você interagiu anteriormente melhor te auxiliaria no processo de tomada de decisões durante o processo de ensino/aprendizagem? </p>
            <FormControl component="fieldset">
                <RadioGroup aria-label="dashboard" name="dashboard" value={this.state.dashboard} onChange={this.handleChange}>
                    <img height="700px" alt="Imagem do dashboard 1" src={Dashboard1}/>
                    <FormControlLabel value="1" control={<Radio />} label="Dashboard 1" />
                    <img height="700px" alt="Imagem do dashboard 2" src={Dashboard2}/>
                    <FormControlLabel value="2" control={<Radio />} label="Dashboard 2" />
                    <img height="700px" alt="Imagem do dashboard 3" src={Dashboard3}/>
                    <FormControlLabel value="3" control={<Radio />} label="Dashboard 3" />
                </RadioGroup>
            </FormControl>
                <Col>
                <Button color="#C0B283" disabled={!this.state.formValid} onClick={() => this.redirect()}> 
                    <span className="text-white">Submeter</span>       
                </Button></Col>
                </>):(<><Redirect to='/thanks'/></>);
        
    }
}
export default FavoriteSurvey;