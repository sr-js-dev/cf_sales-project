import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as Auth from '../../components/auth'
import DatePicker from "react-datepicker";
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css'


const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Taskform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            orderdate: '', 
            val1: '',
            val2: '',
            val3: '',
            selectCustomerValue: '',
            selectCustomerLabel: '',
            taskType: [],
            customer: [],
            employee: [],
            employeeSelectData: []
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
    }

    componentDidUpdate(){
        if(this.props.taskflag){
            this.setState({updateTask: this.props.updateTask, taskId: this.props.taskId})
            this.getCustomer();
            this.getEmployee();
            this.getTaskType();
        }
    }

    getTaskType = () => {
        this.props.detailmode()
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTaskType, headers)
        .then(result => {
            this.setState({taskType: result.data.Items});
        });
    }

    getCustomer = () => {
        this.props.detailmode()
        let customerId = this.props.customerId;
        let params = {
            customerId: Auth.getUserName()
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomer, params, headers)
        .then(result => {
            let tempArray = [];
            tempArray = result.data.Items;
            tempArray.map((data, index) => {
                if(data.key===parseInt(customerId)){
                    this.setState({selectCustomerLabel: data.value, selectCustomerValue: data.key})
                }
                return tempArray;
            })
            this.setState({customer: result.data.Items});
        });
    }

    getEmployee = () => {
        this.props.detailmode()
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetEmployee, headers)
        .then(result => {
            this.setState({employee: result.data.Items});
        });
    }

    changeCustomer = (val) => {
        this.setState({selectCustomerLabel: val.label})
        this.setState({selectCustomerValue: val.value})
        this.setState({val2:val.value});
    }

    changeEmployee = (val) =>{
        this.setState({employeeSelectData:val})
        this.setState({val3:1});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        let employeeData=this.state.employeeSelectData;
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let tempArray = [];
        let params = [];
        let k=0;
        let employeelength = employeeData.length
        tempArray = employeeData;
        tempArray.map((employee, index) => {
            params = {
                customer: data.customer,
                employee: employee.value,
                deadline: data.deadline,
                subject: data.subject,
                tasktype: data.tasktype,
                username: Auth.getUserName()
            }
            var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.PostTask, params, headers)
            .then(result => {
                k++
                if(k===employeelength){
                    this.props.onHide();
                    if(!this.props.customerNewCreate){
                        this.props.onGetTask();
                    }
                    this.setState({selectCustomerLabel:"", selectCustomerValue:"", orderdate: ''})
                }
            });
            return tempArray;
        })
    }
    render(){
        let taskType = [];
        let customer = [];
        let employee = [];
        if(this.state.taskType){
            taskType = this.state.taskType.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.state.customer){
            customer = this.state.customer.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.state.employee){
            employee = this.state.employee.map( s => ({value:s.key,label:s.value}) );
        }
        return (
            <Modal
            show={this.props.show}
            onHide={this.props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop= "static"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Creat_Task')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Form.Label column sm="3">
                            {trls('Task_Type')}
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto"}}>
                            <Select
                                name="tasktype"
                                options={taskType}
                                placeholder={trls('Select')}
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
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Form.Label column sm="3">
                            {trls('Customer')}
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto"}}>
                            {this.state.selectCustomerValue?(
                                <Select
                                    name="customer"
                                    placeholder={trls('Select')}
                                    value={{"label":this.state.selectCustomerLabel,"value":this.state.selectCustomerValue}}
                                    options={customer}
                                    onChange={val => this.changeCustomer(val)}
                                />
                            ):<Select
                                name="customer"
                                placeholder={trls('Select')}
                                options={customer}
                                onChange={val => this.changeCustomer(val)}
                            />}
                            
                            
                            {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val2}
                                    required
                                    />
                                )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Form.Label column sm="3">
                            {trls('Employee')}
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto"}}>
                            <Select
                                name="employee"
                                placeholder={trls('Select')}
                                options={employee}
                                onChange={val => this.changeEmployee(val)}
                                isMulti={true}
                            />
                            {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    multiple
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val3}
                                    required
                                    />
                                )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                        {trls('Deadline')}  
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto", paddingBottom:20}}>
                            {!this.state.orderdate ? (
                                <DatePicker name="deadline" className="myDatePicker" selected={new Date()} onChange={date =>this.setState({orderdate:date})} />
                            ) : <DatePicker name="deadline" className="myDatePicker" selected={this.state.orderdate} onChange={date =>this.setState({orderdate:date})} />
                            } 
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                        {trls('Subject')}   
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto"}}>
                            <Form.Control type="text" name="subject" required placeholder={trls('Subject')} />
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Taskform);