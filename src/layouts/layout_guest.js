import React, {Component} from 'react'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import User from '../pages/User/user_register'
import Tasks from '../pages/Tasks/tasks'
import Visitreport from '../pages/Visitreport/visit_report.js'
import Creatvisitreport from '../pages/Visitreport/create_visitreport'
import Visitreportquestion from '../pages/Visitreport/visitreport_question'
import Customer from '../pages/Customer/customer.js'
import Dashboard from '../pages/Dashboard/dashboard.js'
import Customerdetail from '../pages/Customer/customer-detail.js'
import { Switch,Router, Route } from 'react-router-dom';
import history from '../history';
import '../assets/css/datatable.css';
window.localStorage.setItem('AWT', true);
class Layout extends Component {
  
    render () {
      return (
          <Row style={{height:"100%"}}>
            <Sidebar/>
            <Col style={{paddingLeft:0, paddingRight:0}}>
             <Header/>
                <Router history={history}>
                  <Switch>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/user" component={User}/>
                    <Route path="/tasks" component={Tasks}/>
                    <Route path="/customer/detail" component={Customerdetail}/>
                    <Route path="/customer" component={Customer}/>
                    <Route path="/visit-report/create-question" component={Visitreportquestion}/>
                    <Route path="/visit-report/create" component={Creatvisitreport}/>
                    <Route path="/visit-report" component={Visitreport}/>
                  </Switch>
                </Router>
            </Col>
          </Row>
      )
    };
  }
  export default Layout;
