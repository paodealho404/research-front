import React from "react";
import axios from 'axios';

import {
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col
} from "reactstrap";

const baseUrl = (process.env.REACT_APP_API_URL+process.env.PORT) || "http://localhost:4000";

class AverageStudentsPoints extends React.Component {

    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            Average: null
        }
    }

    componentDidMount() {
        const classroomId = this.props.classroomId;

        const url = baseUrl + "/course/getStudentesLevel/" + classroomId;

        axios.get(url, { cancelToken: this.cancelTokenSource.token })
            .then(res => {
                if (res.data) {
                    const data = res.data;
                    let Average = 0;

                    for(let i = 0; i < data.length; i++){
                        Average += data[i].currentPoints;
                    }

                    Average /= data.length;
                    Average = parseInt(Average);

                    this.setState({
                        Average: Average
                    });
                } else {
                    alert("Error web service");
                }
            })
            .catch(error => {
                //alert("Error server " + error);
                if (axios.isCancel(error)) {
                    console.log('Request canceled');
                } else {
                    console.log("Error server " + error);
                }
            })
    }

    componentWillUnmount() {
        this.cancelTokenSource.cancel();
    }

    render() {
        const { Average } = this.state;
        return (
            <Card className="card-stats">
                <CardBody>
                    <Row>
                        <Col md="3" xs="5">
                            <div className="icon-big text-center icon-warning">
                                <i className="fas fa-video" />
                            </div>
                        </Col>
                        <Col md="9" xs="5">
                            <div className="numbers">
                                <p className="card-category">Média aritmética da pontuação dos Alunos da Turma</p>
                                <div style={{ fontSize: 45 }}>
                                    <CardTitle tag="p">{Average}</CardTitle>
                                </div>
                                <p />
                            </div>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                </CardFooter>
            </Card>
        )
    }
}

export default AverageStudentsPoints;
