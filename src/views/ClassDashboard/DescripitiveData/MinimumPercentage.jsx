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

class StudentsReachedPercentage extends React.Component {

    constructor(props){
        super(props);
        this.cancelTokenSource = new axios.CancelToken.source();
        this.state = {
            totalStudents: '' 
        }
    }

    componentDidMount(){
        const curriculumId = this.props.curriculumId;
        const classroomId = this.props.classroomId;
        const url = baseUrl+"/course/getNumbersStudentsReachedPercentage/"+classroomId+"/"+curriculumId
        axios.get(url, { cancelToken: this.cancelTokenSource.token })
        .then(res=>{
          if (res.data) {
            this.setState({
                totalStudents: res.data[0].quant
            });
          }
          else {
            alert("Error web service");
          }
        })
        .catch(error=>{
          //alert("Error server "+error);
          if (axios.isCancel(error)) {
            console.log('Request canceled');
          } else {
              console.log("Error server " + error);
          }
        })
    }

    componentWillUnmount () {
      this.cancelTokenSource.cancel();
    }

    render () {
        return(
            <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-check" />
                  </div>
                </Col>
                <Col md="8" xs="5">
                  <div className="numbers">
                    <p className="card-category">Total de alunos que alcançaram porcentagem mínima</p>
                    <div style={{ fontSize: 45 }}>
                        <CardTitle tag="p"> {this.state.totalStudents} </CardTitle>
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

export default StudentsReachedPercentage;
