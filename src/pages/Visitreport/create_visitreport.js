import React, {Component} from 'react'
import { connect } from 'react-redux';
import { Container, Button, Form } from 'react-bootstrap';
import { trls } from '../../components/translate';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import * as Auth from '../../components/auth'
import history from '../../history';

const mapStateToProps = state => ({
     ...state.auth,
});

const mapDispatchToProps = dispatch => ({

}); 
class Creatvisitreport extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            val1:''
        };
      }
componentDidMount() {
    this.getCustomerDropdownData();
}

getCustomerDropdownData = () => {
    let params = {
        customerId: Auth.getUserName()
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerDropdown, params, headers)
        .then(result => {
            this.setState({customer: result.data.Items});
    });
}

handleSubmit = (event) => {
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    let params = {
        visitDate:data.visitdate,
        customerId:data.customer,
        username: Auth.getUserName()
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.post(API.CreateVisitereportHeader, params, headers)
    .then(result => {
        history.push({
            pathname: '/visit-report/create-question',
            state: { newId:result.data.NewId, updateFlag: false}
        })
    });
}

render () {
    let customer = [];
    if(this.state.customer){
        customer = this.state.customer.map( s => ({value:s.key,label:s.value}) );
    }
    return(
        <Container>
            <div className="craete-visitreport-row">
                <div className="create-report-header"><i className="fas fa-plus" style={{marginRight:"10px", marginTop:"4px"}}></i>{trls('Create_a_new_report')}</div>
                {/* <Button variant="primary" onClick={this.createVisitReport} style={{width:"100%"}}><div style={{display:"flex", justifyContent:"flex-start"}}><i className="fas fa-plus" style={{marginRight:"10px", marginTop:"4px"}}></i>{trls('Create_a_new_report')}</div></Button>    */}
                <Form className="create-visitreport-form" onSubmit = { this.handleSubmit }>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{fontWeight:"bold"}}>{trls('Select_Customer')}<span className="required-asterisk">*</span></Form.Label>
                        <Select
                            name="customer"
                            options={customer}
                            onChange={val => this.setState({val1:val})}
                        />
                        {!this.props.disabled && (
                            <input
                                onChange={val=>console.log()}
                                tabIndex={-1}
                                autoComplete="off"
                                style={{ opacity: 0, height: 0 }}
                                value={this.state.val1}
                                required
                                />
                            )}
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label style={{fontWeight:"bold"}}>{trls('Visit_Date')}<span className="required-asterisk">*</span></Form.Label>
                        {!this.state.orderdate ? (
                            <DatePicker name="visitdate" className="myDatePicker" selected={new Date()} onChange={date =>this.setState({orderdate:date})} />
                        ) : <DatePicker name="visitdate" className="myDatePicker" selected={this.state.orderdate} onChange={date =>this.setState({orderdate:date})} />
                        } 
                    </Form.Group>
                    <Button variant="success" type="submit" style={{float:"right", width:100, marginTop:"20px"}}>
                        {trls('Further')}
                    </Button>
                </Form>
            </div>
        </Container>
    )
};
}
export default connect(mapStateToProps, mapDispatchToProps)(Creatvisitreport);
