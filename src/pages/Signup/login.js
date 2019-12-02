import { Link } from 'react-router-dom';
import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import ListErrors from '../../components/listerrors';
import { trls } from '../../components/translate';
import Select from 'react-select';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    authLogin: (params) =>
              dispatch(authAction.fetchLoginData(params)),
    changeLan: (params) =>
              dispatch(authAction.changeLan(params)),
});

class Login extends React.Component {
  constructor() {   
    super();
    this.state = {  
      roles:[{"value":"en_US","label":"English"},{"value":"nl_BE","label":"Dutch"}],
      selectrolvalue:window.localStorage.getItem('cf_sales_lang'),
      selectrollabel:window.localStorage.getItem('cf_sales_label'),
    };
  };

  changeLangauge = (val) => {
    this.setState({selectrolvalue:val.value, selectrollabel: val.label});
    this.props.changeLan(val)
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    this.props.authLogin(data);
  }
  render() {
    
    return (
      <div className="auth-page" style={{height:"100%"}}>
        <div className="container login-page">
          <div className="row addQuestion">
            <div className="col-md-5 offset-md-1 col-xs-12  vertical-center">
                <Row style={{height:"100%",width:"100%"}}>
                  <div className="login-side-div">
                    <img src={require('../../assets/images/img_admin_side.png')} alt="appzmakerz" className="login-side-grad"></img>
                  </div>
                  <Col  className="login-form-div">
                    <img src={require('../../assets/images/imgpsh_fullsize_anim.png')} alt="appzmakerz" style={{marginTop:"40px", height:"125px"}}></img>
                    <Form className="container login-form" onSubmit = { this.handleSubmit }>
                        <ListErrors errors={this.props.error} />
                        <Form.Group as={Row} controlId="form" style={{textAlign:'left'}}>
                            <Select
                                name="lan"
                                options={this.state.roles}
                                className="login-select-lang-class"
                                value={{"label":this.state.selectrollabel,"value":this.state.selectrolvalue}}
                                onChange={val => this.changeLangauge(val)}
                            />
                        </Form.Group>
                        <Form.Group as={Row} controlId="form">
                            <Form.Control type="text" name="username" className="login-input-email" placeholder={trls("Username")}/>
                        </Form.Group>
                        <Form.Group as={Row} controlId="form">
                            <Form.Control type="password" name="password" className="login-input-password" placeholder={trls("Password")}/>
                        </Form.Group>
                        <p className="text-xs-center">
                            <Link to="/register" style={{color:"rgb(84, 79, 79)"}}>
                              {trls("Forgot_password")}
                            </Link>
                        </p>
                        <button type="submit" className="btn-small place-and-orders__add-row-btn add-row sign-in">{trls("Sign_in")}</button>
                    </Form>
                  </Col>
                </Row>
                
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
