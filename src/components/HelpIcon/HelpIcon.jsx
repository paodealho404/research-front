import React from "react";

import { Tooltip } from "reactstrap";

/* 
    * Tooltip component using icon
    *
    * @version 0.1
*/
class HelpIcon extends React.Component {
    constructor(){
        super()
        this.state = {
            isOn: false
        }
    }

    toggle = () => {
        this.setState({
            isOn: !this.state.isOn
        })
    }

    render(){
        const { id, icon, help, color } = this.props;
        const { isOn } = this.state;
        return(
            <React.Fragment>
                <div>
                    <i className={ icon } id = {"Popover-" + id} style = {{ color: color ? color : "grey" }}/>
                    <Tooltip isOpen={ isOn } toggle={ () => this.toggle() } placement="top-end" target={"Popover-" + id} style = {{ fontSize: "0.85em" }}>
                        { help }
                    </Tooltip>    
                </div>
            </React.Fragment>
        );
    }
};

export default HelpIcon;