/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
//import { NavLink } from "react-router-dom";
import { Row, Col, Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import prof_male from "../../assets/img/professor.svg";
import prof_female from "../../assets/img/prof_female.svg";

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
    this.sidebar = React.createRef();
  }

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }

  render() {
    return (
      <div 
        className="sidebar"
        data-color="custom-blue"
        data-active-color={this.props.activeColor}
      >
        <div className="logo">        
            <div className="logo-img">
              {JSON.parse(sessionStorage.getItem('participant')).gender === "Feminino" ? 
              <center>
                <br/> 
                <img src={prof_female} alt="profFemale-logo"/>
                <br/><br/> 
              </center> 
              :
              <img src={prof_male} alt="profMale-logo"/>
              }
            </div>          
            {JSON.parse(sessionStorage.getItem('participant')).gender === "Feminino" ? 
            <Row><Col className=".col-sm-auto .offset-sm-3 text-center text-success" >Bem-Vinda, Professora
              {/*  {sessionStorage.getItem("teacherName")}  */}
              <br/> 
            </Col></Row>        
            : 
            <Row><Col className=".col-sm-auto .offset-sm-3 text-center text-success" >Bem-Vindo, Professor 
              {/* {sessionStorage.getItem("teacherName")}   */}
              <br/>
            </Col></Row>}        
        </div>
        <div className="sidebar-wrapper" ref={this.sidebar}>
        <Nav>
          {/* <Row className="">
          <Col className=".col-sm-auto .offset-sm-3 text-center ">
          <NavLink to= "/admin/classes">
          <p className= " text-center font-weight-bold " style={{fontFamily: 'Calibri', fontSize: '20px'}}>Minhas Turmas</p>
          </NavLink>
          </Col>
          </Row>  */}
        </Nav>
        </div>
      </div>
    );
  }
}

export default Sidebar;
