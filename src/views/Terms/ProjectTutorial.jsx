import React from "react";

import {
    Button,
    Col
} from "reactstrap";

import { Redirect } from 'react-router-dom';

import Header from "./components/Header";

import YouTube from 'react-youtube';

class ProjectTutorial extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            accepted: true
        }
        this.redirect = this.redirect.bind(this);
        this._onReady = this._onReady.bind(this);
    }
    componentDidMount() {
        if (!sessionStorage.getItem('accepted') || !sessionStorage.getItem('participant')) {
            this.setState({ accepted: false }, console.log('N'));
        }
    }
    redirect() {
        this.setState({ redirect: true });
    }

    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: {
                autoplay: 1
            }
        }

        const participant_info = JSON.parse(sessionStorage.getItem('participant'));
        return (
            <div>
                <Header />
                <Col sm="50" md={{ size: 8, offset: 2 }} className="text-justify">
                    <p className=" text-center font-weight-bold " style={{ fontFamily: 'Calibri', fontSize: '30px' }}>Tutorial da Ferramenta</p>
                    <center><p>Por favor, assista o seguinte vídeo tutorial referente a utilização da ferramenta a qual se baseia no modelo explicado anteriormente.</p></center>
                    <br />
                    <center>
                        <YouTube
                            videoId="oZpnWOCI0L0"
                            opts={opts}
                        />
                    </center>
                    <br />
                    <center>
                        <Button color="#C0B283" type="button" onClick={this.redirect}>
                            Visualizar Ferramenta
                        </Button>
                        {this.state.redirect ? (<Redirect push to={{ pathname: "/admin/classDashboard_" + participant_info.dashboard_sequence[0] + "/7/345/32" }} />) : (<div></div>)}
                        {this.state.accepted ? <div></div> : <Redirect to={{ pathname: '/' }} />}
                    </center>
                    <br />
                </Col>
            </div>
        );
    }
}

export default ProjectTutorial;