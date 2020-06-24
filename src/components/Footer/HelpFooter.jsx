import React, { useState } from 'react';

import { Button, Navbar, Container, Modal, ModalHeader, ModalBody } from 'reactstrap';

import YouTube from 'react-youtube';

const HelpFooter = (props) => {
    const {
        buttonLabel = 'Vídeo Tutorial',
        className = 'display: block; width: 1200px; padding-left: 0px;'
    } = props;
    
    const [modal, setModal] = useState(false);
    
    const toggle = () => setModal(!modal);

    const video_dashboard_1 = "K0PkZv8ZLl8";
    const video_dashboard_2 = "_MFM-jQPuYM";
    const video_dashboard_3 = "xEklw7jsieI";

    const opts = {
        height: '390',
        width: '760',
        playerVars: {
            autoplay: 1
        }
    }

    const dashboard_id = props.dashboardID;
    
    return (
        <React.Fragment>
            <Navbar fixed="bottom" color="white" style={{ margin: 0 }}>
                <Container>
                    <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        <p style={{ fontFamily: 'Calibri', fontSize: '20px' }}>Assista um vídeo explicativo referente a este painel de dados</p>
                        <Button color="primary" style={{display: 'block', marginRight: 'auto', marginLeft: 'auto'}} onClick={toggle}>{buttonLabel}</Button>
                        <Modal centered size='lg' isOpen={modal} toggle={toggle} className={className}>
                            <ModalHeader toggle={toggle}>{'Vídeo Tutorial do Dashboard ' + dashboard_id}</ModalHeader>
                            <ModalBody>
                                <center>
                                    {(() => {
                                        switch(dashboard_id) {
                                            case 1:
                                                return <YouTube videoId={video_dashboard_1} opts={opts}/>;
                                            case 2:
                                                return <YouTube videoId={video_dashboard_2} opts={opts}/>;
                                            case 3:
                                                return <YouTube videoId={video_dashboard_3} opts={opts}/>;
                                            default:
                                                return <div>Sem vídeo para este Dashboard</div>
                                        }
                                    })()}
                                </center>
                            </ModalBody>
                        </Modal>
                    </div>
                </Container>
            </Navbar>
        </React.Fragment>
    )
}

export default HelpFooter;