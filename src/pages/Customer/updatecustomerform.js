import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

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
            value: ''
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {

    }
    componentWillReceiveProps() {
        if(this.props.customerData){
            this.setState({value:this.props.customerData[0].Phone})
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            name: data.name,
            website: data.website,
            email: data.email,
            address: data.address,
            zipcode: data.zipcode,
            city: data.city,
            phone: data.phone,
            customerid: this.props.customerId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PutCustomer, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.onGetCustomer();
        });
    }
    render(){
        let customerData = [];
        if(this.props.customerData){
            customerData = this.props.customerData[0]
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
                    {trls('Edit_Customer')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                        {trls('Name')}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {customerData&&(
                                <Form.Control type="text" name="name" required defaultValue={customerData.Name} placeholder={trls('CustomerName')} />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                        {trls('Website')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {customerData&&(
                                <Form.Control type="text" name="website" required defaultValue={customerData.Website} placeholder={trls('Website')} />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Email')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {customerData&&(
                                <Form.Control type="email" name="email" required defaultValue={customerData.Email} placeholder={trls('Email')} />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Address')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {customerData&&(
                                <Form.Control type="text" name="address" required defaultValue={customerData.Address} placeholder={trls('Address')} /> 
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Zipcode')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {customerData&&(
                                <Form.Control type="text" name="zipcode" required defaultValue={customerData.Zipcode} placeholder={trls('Zipcode')} />
                            )}
                             
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('City')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {customerData&&(
                                <Form.Control type="text" name="city" required defaultValue={customerData.City} placeholder={trls('City')} />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Phone')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {customerData&&(
                                <PhoneInput
                                placeholder="Enter phone number"
                                value={ this.state.value }
                                name="phone"
                                onChange={ value => this.setState({value: value }) } />
                            )}
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