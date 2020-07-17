import React from 'react';

import { Redirect } from 'react-router-dom';

import Header from "./components/Header";

import Auth from "../Auth";

class Thanks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            last_id: null,
            redirect: false,
            redirect_start: false
        };
    }

    componentDidMount() {
        if (!(Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey1'))) && Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey2'))) && Auth.authenticate_survey(JSON.parse(sessionStorage.getItem('survey3'))))) {
            this.redirect();
        } else {
            sessionStorage.clear();

            setTimeout(function() {
                this.setState({
                    redirect_start: true
                });
            }.bind(this), 5000);
        }
    }

    redirect(){
        this.setState({
            redirect: true
        });
    }

    render() {
        let participant_info = JSON.parse(sessionStorage.getItem('participant'));
        
        return( (sessionStorage.getItem('participant') && sessionStorage.getItem('accepted')) ? (
                <div>
                    <Header/>
                    <center className="col" style={{height: '585px', flexDirection: 'column', justifyContent: 'center', display: 'flex'}}>
                        <p style={{color: "#000000", fontSize: '22px'}}>Este é o final da pesquisa. Muito obrigado pela colaboração!</p>
                        {this.state.redirect_start ? (<Redirect to={{ pathname:"/" }}/>) : <div></div>}
                    </center>
                    {this.state.redirect ? (<Redirect to={{pathname:"/admin/classDashboard_" + participant_info.dashboard_sequence[0] + "/7/345/32"}}/>) : (<div></div>)}
                </div>
            ) : (
                <Redirect to={{ pathname:"/", state: {message: 'Perdão, houve um problema durante a confirmação do termo de consentimento.'}}}/>
            )
        )
    }

}

export default Thanks;