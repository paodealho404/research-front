import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route,  Redirect } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.1.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "sweetalert2/dist/sweetalert2.js";

import AdminLayout from "layouts/Admin.jsx";
import ClassDashboard_1 from "views/ClassDashboard/Dashboard_1/ClassDashboard.jsx";
import ClassDashboard_2 from "views/ClassDashboard/Dashboard_2/ClassDashboard.jsx";
import ClassDashboard_3 from "views/ClassDashboard/Dashboard_3/ClassDashboard.jsx";
import StarterTerm from "views/Terms/StarterTerm.jsx";
import DemographicQuests from "views/Terms/DemographicQuests.jsx";
//import FinalQuests from 'views/Terms/FinalQuests.jsx';
import Thanks from 'views/Terms/Thanks.jsx';
import ProjectTutorial from 'views/Terms/ProjectTutorial';
import DashboardQuestions from 'views/Terms/DashboardQuestions';

ReactDOM.render(
<BrowserRouter>
    <Switch>
        <Route exact path="/" component = {StarterTerm}/>
        <Route path="/demographicquest" component = {DemographicQuests}/>
        <Route path="/projecttutorial" component = {ProjectTutorial}/>
        <Route path="/admin" component={ props=> <AdminLayout {...props} />}/>
        <Route path="/admin/classdashboard_1" render={props => <AdminLayout {...props} component={ClassDashboard_1}/>}/>
        <Route path="/admin/classdashboard_2" render={props => <AdminLayout {...props} component={ClassDashboard_2}/>}/>
        <Route path="/admin/classdashboard_3" render={props => <AdminLayout {...props} component={ClassDashboard_3}/>}/>
        <Route path="/dashboardQuestions" component={DashboardQuestions}/>
        <Route path="/thanks" component={Thanks}/>
        <Redirect to="/"/>
    </Switch>
</ BrowserRouter>, document.getElementById('root'));
registerServiceWorker();