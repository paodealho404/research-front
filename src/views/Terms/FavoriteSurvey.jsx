import React from 'react';
import Header from "./components/Header";
import { Redirect } from 'react-router';
import {Col} from 'reactstrap';
class FavoriteSurvey extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            redirect: false
        }
    }
    componentDidMount()
    {
        if(!sessionStorage.getItem('accepted')&&sessionStorage.getItem('participant')&&sessionStorage.getItem('survey1')&&sessionStorage.getItem('survey2')&&sessionStorage.getItem('survey3'))
        {
            this.redirect();
        }
        
    }
    redirect(){
        this.setState({
            redirect: true
        });
    }
    render()
    {
        return this.state.redirect ? 
        (<div>
            <Header/>
            <Col>
            </Col>
        </div>
        ):(<Redirect to='/'/>);
        
    }
}
export default FavoriteSurvey;