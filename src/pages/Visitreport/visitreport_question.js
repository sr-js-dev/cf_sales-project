import React, {Component} from 'react'
import { connect } from 'react-redux';
import { Container, Button, Form } from 'react-bootstrap';
import { trls } from '../../components/translate';
import Select from 'react-select';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import CKEditor from "react-ckeditor-component"
import history from '../../history';
import * as authAction  from '../../actions/authAction';
import Createtask from '../Tasks/taskform'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const mapStateToProps = state => ({
     ...state.auth,
});

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
        dispatch(authAction.blankdispatch()),
}); 
class Creatvisitreport extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            val1:'',
            nextQuestionId:'',
            questionNum:0,
            quesionId:[0],
            selectlabel: '',
            selectvalue: '',
            selectValidation:'',
            nextQuestionIdflag:true,
            submitFlag: true,
            content: '',
        };
      }
componentDidMount() {
    if(!this.props.location.state.updateFlag){
        this.getVisitQuestion();
    }else{
        this.getVisitReportData()
        this.setState({nextQuestionIdflag: false})
    }
    
}

getVisitReportData= () => {
    var headers = SessionManager.shared().getAuthorizationHeader();
    let params = {
        visitreportid: this.props.location.state.newId
    }
    Axios.post(API.GetRemark, params, headers)
    .then(result => {
        this.setState({submitFlag: false})
        this.setState({content: result.data.Items[0].remark})
    });
}

getVisitFirstQuestion = () => {
    var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetVisitFirstQuesion, headers)
        .then(result => {
            this.setState({question: result.data.Items});
            this.getSelectAnswer(result.data.Items[0].questionId)
    });
}

getVisitNextQuestion = (value) => {
    var params = {
        nextQuestionId: value
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetNextQuestion, params, headers)
        .then(result => {
            this.setState({question: result.data.Items});
            this.getSelectAnswer(result.data.Items[0].questionId)
    });
}

getSelectAnswer = (value) => {
    let params = [];
    params = {
        questionId:value
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetSelectAnswer, params, headers)
        .then(result => {
            this.setState({answer:result.data.Items});
            this.setState({selectlabel:trls('Select'), selectvalue:trls('Select')})
            this.setState({selectValidation:''});
            this.setState({nextQuestionIdflag:true})
            this.setState({submitFlag:true})
    });
}
getVisitQuestion = () => {
    if(this.state.quesionId[this.state.questionNum]===0){
        this.getVisitFirstQuestion()
    }else{
        this.getVisitNextQuestion(this.state.quesionId[this.state.questionNum])
    }
}

handleSubmit = (event) => {
    let answerArray= this.state.answer;
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    let params = {
        visitreportId:this.props.location.state.newId,
        questionId:this.state.quesionId[this.state.questionNum],
        answerId: data.answerid,
        remark: data.remark
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
    if(this.state.submitFlag){
        Axios.post(API.PostVisitReportAnswer, params, headers)
        .then(result => {
            answerArray.map((answerdata, index) => {
                if(String(answerdata.answerId)===data.answerid){
                    this.setState({nextQuestionIdflag:answerdata.nextQuestionId})
                    this.state.quesionId.push(answerdata.nextQuestionId);
                    this.setState({questionNum: this.state.questionNum+1})
                }
                return answerArray;
            })
            if(this.state.nextQuestionIdflag){
                this.setState({remarktext: ''})
                this.getVisitQuestion();
            }else{
                this.setState({submitFlag: false})
            }
        });
    }else{
        let params = {
            visitreportId:this.props.location.state.newId,
            remark: this.state.content
        }
        Axios.post(API.AddRemarkTovisitReport, params, headers)
        .then(result => {
            if(!this.props.location.state.updateFlag){
                confirmAlert({
                    title: 'Confirm',
                    message: 'Do you want to create a new task?',
                    buttons: [
                      {
                        label: 'OK',
                        onClick: () => {
                           this.createNewTask();
                        }
                      },
                      {
                        label: 'Cancel',
                        onClick: () => {this.getVisitReport()}
                      }
                    ]
                  });
            }else{
                this.getVisitReport()
            }
            
        });
    }
    
}

getVisitReport = () =>{
    history.push('/visit-report');
    this.props.blankdispatch()
}

createNewTask = () => {
    this.setState({modalcreateTaskShow: true,taskflag: true})

}

componentWillReceiveProps = () => {
    this.setState({selectlabel:trls('Select'), selectvalue:trls('Select')})
}
previousVisitReport = () =>{
    let num = this.state.questionNum-1
    this.setState({questionNum: num})
    this.state.quesionId.pop();
    if(this.state.quesionId[num]!==0){
        this.getVisitNextQuestion(this.state.quesionId[num])
    }else{
        this.getVisitFirstQuestion(this.state.quesionId[num])
    }
    
}

changeremark = (event) =>{
    this.setState({remarktext:event.currentTarget.value})
}

changeSelectQuestion = (value) => {
    this.setState({selectlabel:value.label, selectvalue:value.value})
    this.setState({selectValidation:value.label});
}

onChange = (evt) => {
    var newContent = evt.editor.getData();
    this.setState({content:newContent})
}

detailmode = () =>{
    this.setState({taskflag: false})
}

onHide = () => {
    this.setState({modalcreateTaskShow: false});
    history.push('/visit-report');
    this.props.blankdispatch()
}

render () {
    let answer = [];
    if(this.state.answer){
        answer = this.state.answer.map( s => ({value:s.answerId,label:s.answer}) );
    }
    let question=""
    if(this.state.question){
        question=this.state.question[0].question
    }
    return(
        <Container>
            <div className="craete-visitreport-row">
                {!this.props.location.state.updateFlag?(
                    <div className="create-report-header"><i className="fas fa-plus" style={{marginRight:"10px", marginTop:"4px"}}></i>{trls('Create_a_new_report')}</div>
                ):<div className="create-report-header"><i className="fas fa-plus" style={{marginRight:"10px", marginTop:"4px"}}></i>{trls('Edit_Report')}</div>}
                
                {this.state.nextQuestionIdflag&&(
                    <div className="create-report-header-title"><i className="fas fa-question-circle" style={{marginRight:"20px", marginTop:"4px"}}></i>{question+"  ("+(this.state.questionNum+1)+")"}</div>
                )}
                <Createtask
                    show={this.state.modalcreateTaskShow}
                    detailmode={this.detailmode}
                    taskflag={this.state.taskflag}
                    customerId={this.props.location.state.customerId}
                    onHide={() => this.onHide()}
                    customerNewCreate={true}
                />  
                <Form className="create-visitreport-form" onSubmit = { this.handleSubmit }>
                    <Form.Group controlId="formBasicEmail">
                        {this.state.nextQuestionIdflag&&(
                            <Form.Label style={{fontWeight:"bold"}}>{trls('Select_answer')}<span className="required-asterisk">*</span></Form.Label>
                        )}
                        {this.state.nextQuestionIdflag&&(
                            <Select
                                name="answerid"
                                options={answer}
                                value={{ label: this.state.selectlabel, value: this.state.selectvalue}}
                                onChange={val => this.changeSelectQuestion(val)}
                            />
                        )}
                        {!this.props.disabled && this.state.nextQuestionIdflag && (
                            <input
                                onChange={val=>console.log()}
                                tabIndex={-1}
                                autoComplete="off"
                                style={{ opacity: 0, height: 0 }}
                                value={this.state.selectValidation}
                                required
                                />
                            )}
                        
                    </Form.Group>
                    {this.state.nextQuestionIdflag&&(
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label style={{fontWeight:"bold"}}>{trls('Remarks')}</Form.Label>
                            <Form.Control name="remark" as="textarea" rows="3" value={this.state.remarktext} onChange={this.changeremark} /> 
                        </Form.Group> 
                    )}
                    {!this.state.nextQuestionIdflag&&(
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label style={{fontWeight:"bold"}}>{trls('Remarks')}</Form.Label>
                            <CKEditor 
                                activeClass="p30" 
                                height="100px"
                                content={this.state.content} 
                                config={{
                                    height:"350px" 
                                }}
                                events={{
                                    "change": this.onChange
                                }}
                            />
                        </Form.Group> 
                    )}
                   
                    {this.state.nextQuestionIdflag?(
                        <Button variant="success" type="submit" style={{float:"right", width:100, marginTop:"20px",marginLeft:10}}>
                        {trls('Next')}
                    </Button>
                    ):<Button variant="success" type="submit" style={{float:"right", width:100, marginTop:"20px",marginLeft:10}}>
                        {trls('Submit')}
                    </Button>}
                    {this.state.quesionId[this.state.questionNum]!==0 && !this.props.location.state.updateFlag&&(
                         <Button variant="success" type="button" style={{float:"right", width:100, marginTop:"20px"}} onClick={this.previousVisitReport}>
                            {trls('Previous')}
                        </Button>
                    )}
                    {this.state.quesionId[this.state.questionNum]===0 && !this.props.location.state.updateFlag&&(
                        <Button variant="success" type="button" style={{float:"right", width:100, marginTop:"20px"}} onClick={this.previousVisitReport} disabled>
                        {trls('Previous')}
                        </Button>
                    )}
                    
                </Form>
            </div>
        </Container>
    )
};
}
export default connect(mapStateToProps, mapDispatchToProps)(Creatvisitreport);
