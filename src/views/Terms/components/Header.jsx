import React from 'react';

import {
    Col
} from 'reactstrap';

import logo_ufal from "../../../assets/img/logo_ufal_.png";
import logo_nees from "../../../assets/img/nees.png";

class Header extends React.Component {
    render() {
        return (
            <div>
                <Col style={{ marginBottom: '2em' }}>
                    <br />
                    <p style={{ color: '#C0B283', fontSize: '40px', textAlign: 'center' }} >
                        <strong>Avaliação de Diferentes Painéis de Dados para Apoio no Processo de Tomada de Decisão por Professores</strong>
                        <br />
                        <img src={logo_nees} alt="nees-logo" align="center" width="110" height="100" hspace="20" />
                        <img src={logo_ufal} alt="ufal-logo" align="center" width="60" height="100" />
                    </p>
                </Col>
                <hr style={{ backgroundColor: "#C0B283" }} />
            </div>
        )
    }
}

export default Header;