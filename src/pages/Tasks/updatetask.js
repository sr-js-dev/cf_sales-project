import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
// import * as salesAction  from '../../actions/salesAction';
import * as Auth from '../../components/auth'
import DatePicker from "react-datepicker";
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
// import history from '../../history';
import { trls } from '../../components/translate';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Updatetask  extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            orderdate: '', 
            val1: '',
            taskType: [],
            customer: [],
            employee: []
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {
       
    }
    getCustomer = () => {
        let updateTask=this.props.updateTask;
        this.props.detailmode()
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {
            customerId: Auth.getUserName()
        }
        Axios.post(API.GetCustomer, params, headers)
        .then(result => {
            let tempArray = [];
            let selectCustomer = [];
            tempArray = result.data.Items;
            tempArray.map((data, index) => {
                if(data.key===updateTask[0].customerid){
                    selectCustomer.value=data.key;
                    selectCustomer.label=data.value;
                }
                return tempArray;
            })
            this.setState({customer: result.data.Items});
            this.setState({selectCustomer: selectCustomer});
        });
    }

    getEmployee = () => {
        this.props.detailmode()
        let updateTask=this.props.updateTask;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetEmployee, headers)
        .then(result => {
            let tempArray = [];
            let selectEmployee = [];
            tempArray = result.data.Items;
            tempArray.map((data, index) => {
                if(data.key===updateTask[0].employeeid){
                    selectEmployee.value=data.key;
                    selectEmployee.label=data.value;
                }
                return tempArray;
            })
            this.setState({employee: result.data.Items});
            this.setState({selectEmployee: selectEmployee});
        });
        this.setState({orderdate:new Date(updateTask[0].Deadline)})
        this.setState({subject:updateTask[0].subject})
    }
  
    componentDidUpdate(){
        if(this.props.taskId){
            this.setState({updateTask: this.props.updateTask, taskId: this.props.taskId})
            this.getCustomer();
            this.getEmployee()
        }
    }

    changeCustomer = (val) => {
        this.setState({selectCustomer:val});
    }

    changeEmployee = (val) => {
        this.setState({selectEmployee:val});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        
        let params = {
            taskid: parseInt(this.state.taskId),
            customerid: parseInt(data.customer),
            employeeid: parseInt(data.employee),
            deadline: data.deadline,
            subject: data.subject,
            Gewijzig: ''
        }
        console.log('3333333333333', params);
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PutTask , params, headers)
        .then(result => {
            console.log('111111111111', result)
            this.props.onHide();
            this.props.onGetTaskData();
        });
    }
    render(){
        let customer = [];
        let employee = [];
        let selectCustomer=[];
        let selectEmployee=[];
        selectCustomer.label="";
        selectCustomer.value="";
        selectEmployee.label="";
        selectEmployee.value="";
        if(this.state.customer){
            customer = this.state.customer.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.state.employee){
            employee = this.state.employee.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.state.selectCustomer){
            selectCustomer = this.state.selectCustomer;
        }
        if(this.state.selectEmployee){
            selectEmployee = this.state.selectEmployee;
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
                    {trls('Edit_Task')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Form.Label column sm="3">
                            {trls('Customer')}
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {selectCustomer&&(
                                <Select
                                name="customer"
                                placeholder={trls('Select')}
                                value={{"label":selectCustomer.label,"value":selectCustomer.value}}
                                options={customer}
                                onChange={val => this.changeCustomer(val)}
                            />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Form.Label column sm="3">
                            {trls('Employee')}
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Select
                                name="employee"
                                placeholder={trls('Select')}
                                options={employee}
                                value={{"label":selectEmployee.label,"value":selectEmployee.value}}
                                onChange={val => this.changeEmployee(val)}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                        {trls('Deadline')}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
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
                        <Col sm="9" className="product-text">
                            <Form.Control type="text" name="subject" defaultValue={this.state.subject} required placeholder={trls('Subject')} />
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
export default connect(mapStateToProps, mapDispatchToProps)(Updatetask);