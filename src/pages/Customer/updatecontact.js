import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import Select from 'react-select';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Updatecustomerform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            value: '',
            status:[{"value":"0","label":"Inactive"},{"value":"1","label":"Active"}],
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {
        let pathname = window.location.pathname;
        let pathArray = pathname.split('/')
        let customerId = pathArray.pop();
        this.setState({customerId: customerId})
    }
    componentWillReceiveProps() {
        if(this.props.contactUpdateData){
            this.setState({phonevalue:this.props.contactUpdateData[0].phone})
            this.setState({mobilevalue:this.props.contactUpdateData[0].mobile})
            if(this.props.contactUpdateData[0].status){
                this.setState({selectrollabel: 'Avtive', selectrolvalue: '1'})
            }else{
                this.setState({selectrollabel: 'InActive', selectrolvalue: '0'})
            }
        }
    }

    changeActive = (val) => {
        this.setState({selectrolvalue:val.value, selectrollabel: val.label});
      }

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            contactid: this.props.contactId,
            firstname: data.firstname,
            achternaam: data.lastname,
            email: data.email,
            phone: data.phone,
            mobile: data.mobile,
            status: data.status
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PutContact, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.onGetContact(this.state.customerId);
        });
    }
    render(){
        let contactData = [];
        if(this.props.contactUpdateData){
            contactData = this.props.contactUpdateData[0]
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
                    {trls('Edit_Contact')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                        {trls('FirstName')}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {contactData&&(
                                <Form.Control type="text" name="firstname" required defaultValue={contactData.firstname} placeholder={trls('CustomerName')} />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                        {trls('LastName')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {contactData&&(
                                <Form.Control type="text" name="lastname" required defaultValue={contactData.lastname} placeholder={trls('Website')} />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Email')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {contactData&&(
                                <Form.Control type="email" name="email" required defaultValue={contactData.email} placeholder={trls('Email')} />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Phone')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {contactData&&(
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    value={ this.state.phonevalue }
                                    name="phone"
                                    onChange={ value => this.setState({phonevalue: value }) } />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Mobile')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {contactData&&(
                                <PhoneInput
                                    placeholder="Enter mobile number"
                                    value={ this.state.mobilevalue }
                                    name="mobile"
                                    onChange={ value => this.setState({mobilevalue: value }) } />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Form.Label column sm="3">
                            {trls('Status')}
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Select
                                name="status"
                                placeholder={trls('Status')}
                                options={this.state.status}
                                onChange={val => this.changeActive(val)}
                                value={{"label":this.state.selectrollabel,"value":this.state.selectrolvalue}}
                            />
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
export default connect(mapStateToProps, mapDispatchToProps)(Updatecustomerform);