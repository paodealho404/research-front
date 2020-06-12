import React from "react";

import {
Collapse,
Card,
CardHeader,
CardBody,
CardFooter,
CardTitle,
ButtonGroup,
Col
} from "reactstrap";

import HelpIcon from "../HelpIcon/HelpIcon.jsx"

/* 
    * Component Dropdown
    *
    * @version 0.1
*/
class Dropdown extends React.Component {
constructor() {
    super()
    this.state = {
        // Variables for control the Collapse
        isOpenCollapse: [true, false],
        rotate: ["up", "down"]
    }
}
    
// Open and close Collapse
toggleCollapse = (id) => { 
    let updateCollapse = this.state.isOpenCollapse;
    let updateRotate = this.state.rotate;
    updateCollapse[id] = !updateCollapse[id];
    updateRotate[id] = (updateRotate[id] === "fa-rotate-180") ? "" : "fa-rotate-180";
    this.setState({
        isOpenCollapse: updateCollapse,
        rotate: updateRotate
    })
}

render(){
    const { rotate, isOpenCollapse } = this.state;
    const { content, contentchild, title } = this.props;
    return(
    <Card tag = "h5">
        <CardHeader>
            <CardTitle>
            <div className = "d-flex justify-content-end mx-3"> 
                <div className = "mr-auto p-2">
                    { title }
                </div>
                <div className = "p-2">
                    <ButtonGroup>
                    <Col><i onClick={ () => this.toggleCollapse(0) } className = { "fa fa-chevron-down fa-sm " + rotate[0] } style = {{ color: "grey", cursor: "pointer" }}/></Col>
                    <Col><HelpIcon {...this.props}/></Col>
                    </ButtonGroup>
                </div>  
            </div>
            </CardTitle>
        </CardHeader>
        <CardBody>
            <div style = {{ borderTop: "0.1em solid grey", opacity: "0.3", margin: "0 1em 1em 1em" }}/>
            <Collapse isOpen = { isOpenCollapse[0] }>
                <div className = "d-flex justify-content-center align-items-center" style = {{ margin: "0 1em 0 1em" }}>
                    <Col>{ content }</Col>
                    <Col xs="auto"><i onClick={ () => this.toggleCollapse(1) } className = { "fa fa-chevron-down fa-lg " + rotate[1] } style = {{ color: "grey", cursor: "pointer" }}/></Col>
                </div>
            </Collapse>
            <Collapse isOpen = { isOpenCollapse[1] && isOpenCollapse[0] }>
            {contentchild && <div style = {{ margin: "1em 0 1em 0" }}/>}
                <div style = {{ margin: "0 1em 0 1em" }}>
                    { contentchild }
                </div>
            </Collapse>
        </CardBody>
        <CardFooter>
        </CardFooter>
    </Card>
    );
}
};

export default Dropdown;