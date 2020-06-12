import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, Redirect } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
//import Footer from "components/Footer/Footer.jsx";

import routes from "routes.jsx";

var ps;

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            accepted: true
        };
        this.mainPanel = React.createRef();
    }

    componentDidMount() {
        if (this.state.accepted) {
            if (navigator.platform.indexOf("Win") > -1) {
                ps = new PerfectScrollbar(this.mainPanel.current);
                document.body.classList.toggle("perfect-scrollbar-on");
            }
        }
    }

    componentWillMount() {
        if (!sessionStorage.getItem('accepted') || !sessionStorage.getItem('participant')) {
            this.setState({ accepted: false });
        }
    }

    componentWillUnmount() {
        if (this.state.accepted) {
            if (navigator.platform.indexOf("Win") > -1) {
                ps.destroy();
                document.body.classList.toggle("perfect-scrollbar-on");
            }
        }
    }

    componentDidUpdate(e) {
        if (e.history.action === "PUSH") {
            this.mainPanel.current.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
        }
    }

    handleActiveClick = color => {
        this.setState({ activeColor: color });
    };

    handleBgClick = color => {
        this.setState({ backgroundColor: color });
    };

    render() {
        return (
            this.state.accepted ? (
                <div className="wrapper">
                    <Sidebar
                        {...this.props}
                        bgColor={this.state.backgroundColor}
                        activeColor={this.state.activeColor}
                    />
                    <div className="main-panel" ref={this.mainPanel}>
                        <DemoNavbar {...this.props} />
                        <Switch>
                            {routes.map((prop, key) => {
                                return (<Route path={prop.layout + prop.path} component={prop.component} key={key}/>);
                            })}
                        </Switch>
                    </div>
                </div>
            ) : (
                <Redirect to={{ pathname: '/' }}/>
            )
        )
    }
}


export default Dashboard;
