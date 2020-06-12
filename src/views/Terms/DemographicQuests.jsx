import React from 'react';

import { Redirect } from 'react-router-dom';

import {
    Col,
    Form,
    Button,
} from 'reactstrap';

import PopUp from '../PopUp';
import Checkbox from "./components/Checkbox";
import TextArea from "./components/TextArea";
import Header from "./components/Header";
import axios from 'axios';

const baseUrl = (process.env.REACT_APP_API_URL+process.env.PORT+'/course') || "http://localhost:4000/course";

class FormContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            participant: {
                id: null,
                gender: '',
                age: '',
                educational_level: '',
                state: '',
                technical_level: '',
                dashboard_sequence: null
            },
            accepted: true,
            component: '',
            failed: false,
            redirect: false,
            age_valid: false,
            gender_valid: false,
            educational_level_valid: false,
            technical_level_valid: false,
            state_valid: false,
            formErrors: { state: '', age: '', educational_level: '', gender: '', technical_level_valid: '' },
            formValid: false,
            technical_level_options: ['Baixo', 'Médio', 'Alto'],
            ageOptions: ['Inferior a 18 anos', '18 a 25 anos', '26 a 40 anos', '41 a 65 anos', 'Superior a 65 anos'],
            genderOptions: ['Feminino', 'Masculino', 'Outros'],
            educational_levelOptions: ['Ensino Médio', 'Ensino Técnico', 'Ensino Superior', 'Mestrado', 'Doutorado'],
        }
        this.handleTextArea = this.handleTextArea.bind(this);
        this.handleCheckBoxAge = this.handleCheckBoxAge.bind(this);
        this.handleCheckBoxGender = this.handleCheckBoxGender.bind(this);
        this.handleCheckBoxTechnicalLevel = this.handleCheckBoxTechnicalLevel.bind(this);
        this.handleCheckBoxEducacationalLevel = this.handleCheckBoxEducacationalLevel.bind(this);
    }

    handleCheckBoxTechnicalLevel(e) {
        const value = e.target.value;
        this.setState(prevState => (
            {
                participant: {
                    ...prevState.participant, technical_level: value
                }
            }
        ), () => { this.validateField('technical_level', value) })
    }
    
    handleCheckBoxAge(e) {
        const value = e.target.value;
        this.setState(prevState => ({
            participant:
            {
                ...prevState.participant, age: value
            }
        }), () => { this.validateField('age', value) })
    }

    handleCheckBoxGender(e) {
        const value = e.target.value;
        this.setState(prevState => ({
            participant:
            {
                ...prevState.participant, gender: value
            }
        }), () => { this.validateField('gender', value) })
    }

    handleCheckBoxEducacationalLevel(e) {
        const value = e.target.value;
        this.setState(prevState => ({
            participant:
            {
                ...prevState.participant, educational_level: value
            }
        }), () => { this.validateField('educational_level', value) })
    }

    handleTextArea(e) {
        let name = e.target.name;
        let value = e.target.value;
        this.setState(prevState => ({
            participant: {
                ...prevState.participant, [name]: value
            }
        }), () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        //let nameValid = this.state.nameValid;
        let age_valid = this.state.age_valid;
        let gender_valid = this.state.gender_valid;
        let educational_level_valid = this.state.educational_level_valid;
        let technical_level_valid = this.state.technical_level_valid;
        let state_valid = this.state.state_valid;
        switch (fieldName) {
            case 'age':
                age_valid = value.length > 0;
                fieldValidationErrors.age = age_valid ? '' : 'notValid';
                break;
            case 'gender':
                gender_valid = value.length > 0;
                fieldValidationErrors.gender = gender_valid ? '' : 'notValid';
                break;
            case 'educational_level':
                educational_level_valid = value.length > 0;
                fieldValidationErrors.educational_level = educational_level_valid ? '' : 'notValid';
                break;
            case 'state':
                state_valid = value.length > 0;
                fieldValidationErrors.state_valid = state_valid ? '' : 'notValid';
                break;
            case 'technical_level':
                technical_level_valid = value.length > 0;
                fieldValidationErrors.technical_level_valid = technical_level_valid ? '' : 'notValid';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            //nameValid: nameValid,
            age_valid: age_valid,
            educational_level_valid: educational_level_valid,
            state_valid: state_valid,
            gender_valid: gender_valid,
            technical_level_valid: technical_level_valid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid:
                this.state.educational_level_valid && this.state.age_valid && this.state.gender_valid && this.state.state_valid && this.state.technical_level_valid
        })
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    componentDidMount() {
        if (!sessionStorage.getItem('accepted')) {
            this.setState({ accepted: false })
        }
    }

    redirect() {
        axios.get(baseUrl + '/getParticipants')
            .then((res) => {
                const participant_id = res.data[0].count + 1;
                const dashboard_perm = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]];
                const perm = dashboard_perm[(participant_id - 1) % dashboard_perm.length];
                this.setState(prevState => ({
                    participant: {
                        ...prevState.participant, id: participant_id, dashboard_sequence: perm
                    },
                    failed: false
                }), () => {
                    sessionStorage.setItem('participant', JSON.stringify(this.state.participant));
                    this.setState({ redirect: true });
                });
            })
            .catch(error => {//Sujeito a melhoras
                console.log(baseUrl);
                this.setState({
                    failed: true
                });
                const component = (this.state.failed) ? (PopUp.showMessage("error", "Perdão, o banco de dados está temporariamente desativado, nos contate.")) : (<div></div>);
                this.setState({
                    component: component
                });
                console.log(this.state.failed);
            });
    }

    render() {
        return (
            this.state.accepted ? (
                <div>
                    <Header />
                    <Col>
                        <p className=" text-center font-weight-bold " style={{ fontFamily: 'Calibri', fontSize: '25px', color: '#6c757d' }}> Questionário Demográfico </p> <br />
                        <Form className="container" >
                            <div className="panel panel-default">
                                {/* <FormErrors formErrors={this.state.formErrors} /> */}
                            </div>
                            {/* <div className={`form-group ${this.errorClass(this.state.formErrors.name)}`}>
                                    <TextArea
                                        title={'Informe seu nome:'}
                                        rows={1}
                                        value={this.state.participant.name}
                                        name={'name'}
                                        handleChange={this.handleTextArea}/>
                                </div> */}
                            <Checkbox title={'Informe sua idade:'}
                                name={'age'}
                                options={this.state.ageOptions}
                                selectedOptions={this.state.participant.age}
                                value={this.state.participant.age}
                                handleChange={this.handleCheckBoxAge} />
                            <br />
                            <Checkbox title={'Selecione seu gênero:'}
                                name={'gender'}
                                options={this.state.genderOptions}
                                selectedOptions={this.state.participant.gender}
                                value={this.state.participant.gender}
                                handleChange={this.handleCheckBoxGender} />
                            <br />
                            <br />
                            <Checkbox title={'Selecione seu nível de habilidade técnica:'}
                                name={'technical_level'}
                                options={this.state.technical_level_options}
                                selectedOptions={this.state.participant.technical_level}
                                value={this.state.participant.technical_level}
                                handleChange={this.handleCheckBoxTechnicalLevel} />
                            <br />
                            <br />
                            <TextArea
                                title={'Informe qual nível educacional você leciona:'}
                                rows={1}
                                name={'educational_level'}
                                // value={this.state.educational_levelOptions}
                                // selectedOptions = {this.state.participant.educational_level}
                                value={this.state.participant.educational_level}
                                handleChange={this.handleCheckBoxEducacationalLevel} />
                            <br />
                            <br />
                            <TextArea
                                title={'Informe seu Estado: '}
                                rows={1}
                                name={'state'}
                                // value={this.state.educational_levelOptions}
                                // selectedOptions = {this.state.participant.educational_level}
                                value={this.state.participant.state}
                                handleChange={this.handleTextArea} />
                            <br />
                            <br />
                            <Col sm={{ span: 10, offset: 5 }}>
                                <Button color="#C0B283" disabled={!this.state.formValid} onClick={() => this.redirect()}>
                                    <span className="text-white"> Próxima Etapa </span>
                                </Button>
                            </Col>
                        </Form>
                        {this.state.redirect ? (<Redirect push to={{ pathname: "/projecttutorial" }} />) : (this.state.component)}
                    </Col>
                </div>
            ) : (
                <Redirect to={{ pathname: '/' }} />
            )
        )
    }
}

export default FormContainer;