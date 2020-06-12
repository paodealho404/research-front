import React, { Component } from 'react';

import axios from 'axios';

import {
  Container,
  Row, 
  Col, 
  Form,
  FormGroup, 
  Label, 
  Input, 
  Alert, 
  Button
} from 'reactstrap';

import Auth from './Auth.js';

import logo from '../assets/img/logo.svg';

class Login extends Component {
  constructor() {
    super()
    this.state = {
      login: '',
      password: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      login: this.state.login,
      password: this.state.password
    }

    const login = user => {
      return axios
        .post('users/login', {
          login: user.login,
          password: user.password
        })
        .then(response => {
          sessionStorage.setItem('usertoken', response.data)         
          return response.data
        })
        .catch(err => {
          console.log(err.response)
        })
    }

    login(user).then(res => {
      if(res){
        Auth.authenticate();
        Auth.setRedirect(false);
        this.props.history.push('/classes');
      } else{
        this.setState({ error: "Preencha o seu login e senha corretamente!" });
      }
    })
  }

  render() {
    const isRedirected = Auth.getRedirect();
    return (
      
      
      <Container className="App" ><br/>
      
      <div className="d-flex justify-content-center"><br/>
      {
        isRedirected ? 
        (<Row><Col><Alert>Você precisa estar autenticado para acessar esta rota!</Alert></Col></Row>) : 
        null
      }
      </div>
      <div className="d-flex justify-content-center">
        <Row>
      <Form className="form" noValidate onSubmit={this.onSubmit}>
        <div className="logo-img">
          <center><img src={logo} alt="logo" width="160px" height="160px"/></center> <br/>
        </div> 
        <Col>
          <FormGroup >
            <center><h3 className="h3 mb-2 font-weight">Visualização de Dados - Professores</h3></center><br />
            <Label>Login</Label>
            <Input
              type="login"
              className="form-control"
              name="login"
              placeholder="Enter login"
              value={this.state.login}
              onChange={this.onChange}
            />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label for="examplePassword">Senha</Label>
            <Input
               type="password"
               className="form-control"
               name="password"
               placeholder="Password"
               value={this.state.password}
               onChange={this.onChange}
            />
          </FormGroup>
        </Col>
        <center><p><b>Acesso Restrito a Professores</b></p></center><br/>
        <center>{this.state.error && <p className="text-danger">{this.state.error}</p>}</center>
        <Button type="submit"
              className="btn btn-lg btn-primary btn-block"
        >Entrar
        </Button>
      </Form>
      </Row>
      </div>
    </Container>
    )
  }
}

export default Login;