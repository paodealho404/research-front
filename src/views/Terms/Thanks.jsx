import React from 'react';

import { Redirect } from 'react-router-dom';

import axios from 'axios';

import Header from "./components/Header";

import { parseCommandLine } from 'typescript';

const baseUrl = ((process.env.REACT_APP_API_URL) || "http://localhost:4000") + '/course';

class Thanks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            last_id: null,
            redirect: false
        }
    }

    componentDidMount() {
        if(sessionStorage.getItem('accepted')&&sessionStorage.getItem('participant')&&sessionStorage.getItem('survey1')&&sessionStorage.getItem('survey2')&&sessionStorage.getItem('survey3')) {
        let participant_info = JSON.parse(sessionStorage.getItem('participant'));
        axios.post(baseUrl + '/createParticipant', participant_info)
            .then((res) => {
                this.setState(prevState => ({
                    ...prevState, last_id: res.data.id
                }), () => {
                    let participant = JSON.parse(sessionStorage.getItem('participant'));
        
                    axios.post(baseUrl + '/createParticipant', participant)
                    .then( resp => 
                    {
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
                            responses.forEach(res=> console.log('Saved'));

                            sessionStorage.clear();
                        }))
                        .catch(error=>{
                            console.log(error);
                        })
                    })
                    .catch(error=> console.log(error));
                });
            })
            .catch(error => {
                //alert("Error server " + error);
                if (axios.isCancel(error)) {
                    console.log('Request canceled');
                } else {
                    console.log("Error server " + error);
                }
            });
        } else {
            this.redirect();
        }
    }

    redirect() {
        this.setState({
            redirect: true
        });
    }

    render() {
        return(
            <div>
                <Header/>
                <center className="col" style={{height: '585px', flexDirection: 'column', justifyContent: 'center', display: 'flex'}}>
                    <p style={{color: "#000000", fontSize: '22px'}}>Este é o final da pesquisa. Muito obrigado pela colaboração!</p>
                    {this.state.redirect ? (<Redirect to={{ pathname:"/"}}/>) : <div></div>}
                </center>
            </div>
        )
    }

}

export default Thanks;