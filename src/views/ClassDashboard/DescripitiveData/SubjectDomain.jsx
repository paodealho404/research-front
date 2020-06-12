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

class SubjectDomain extends React.Component {

    constructor(props) {
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            Date: ''
        }
    }

    componentDidMount() {
        const courseId = this.props.courseId;
        const curriculumId = this.props.curriculumId;
        const classroomId = this.props.classroomId;

        const url = baseUrl + "/course/getExpectedDate/" + curriculumId + "/" + courseId + "/" + classroomId;

        axios.get(url, { cancelToken: this.cancelTokenSource.token })
            .then(res => {
                if (res.data) {
                    const Date_Values = res.data[0];

                    let startDate = new Date(Date_Values.startDate.replace(/-/g, '/'));
                    let endDate = new Date(Date_Values.endDate.replace(/-/g, '/'));

                    this.setState({
                        Date: startDate.getDate() + "/" + (startDate.getMonth() + 1) + " a " + endDate.getDate() + "/" + (endDate.getMonth() + 1)
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
        const { Date } = this.state;
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
                                <p className="card-category">Período previsto para o Domínio desse assunto</p>
                                <div style={{ fontSize: 45 }}>
                                    <CardTitle tag="p">{Date}</CardTitle>
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

export default SubjectDomain;
