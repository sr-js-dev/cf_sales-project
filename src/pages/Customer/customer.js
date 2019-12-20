import React, {Component} from 'react'
import { Form,Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Addcustomerform from './addcustomerform';
import Customerdocument from './customerdocument';
import Updatecustomerform from './updatecustomerform';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import history from '../../history';
import Createtask from '../Tasks/taskform'
import * as Auth from '../../components/auth'
import SweetAlert from 'sweetalert';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Userregister extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            customerData:[],
            flag:'',
            userUpdateData:[],
            loading:true,
            arrayFilename: []
        };
      }
    componentDidMount() {
        this._isMounted=true
        this.getCustomerData()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getCustomerData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetCustomerData, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({customerData:result.data.Items})
                this.setState({loading:false})
                $('#example').dataTable().fnDestroy();
                $('#example').DataTable(
                    {
                      "language": {
                          "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
                          "zeroRecords": "Nothing found - sorry",
                          "info": trls("Show_page")+" _PAGE_ of _PAGES_",
                          "infoEmpty": "No records available",
                          "infoFiltered": "(filtered from _MAX_ total records)",
                          "search": trls('Search'),
                          "paginate": {
                            "previous": trls('Previous'),
                            "next": trls('Next')
                          }
                      }
                    }
                  );
            }
        });
    }
    viewCustomerDetail = (event) => {
        let customerId = event.currentTarget.id;
        history.push({
            pathname: '/customer/detail/'+customerId,
          })
    }

    customerUpdate = (event) => {
        this._isMounted = true;
        let customerId=event.currentTarget.id;
        let params = {
            customerid:customerId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerById, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({customerUpdateData: result.data.Items})
                this.setState({modalupdateShow:true, customerId: customerId})
            }
        });
    }
    createTask = (newId) => {
        this.setState({modalcreateTaskShow: true, taskflag: true, customerId: newId})

    }

    onHide = () => {
        this.setState({modalcreateTaskShow: false});
        this.getCustomerData();
    }

    detailmode = () =>{
        this.setState({taskflag: false})
    }

    openUploadFile = (e) =>{
        this.setState({attachtaskId:e.currentTarget.id});
        $('#inputFile').show();
        $('#inputFile').focus();
        $('#inputFile').click();
        $('#inputFile').hide();
    }
    
    onChangeFileUpload = (e) => {
        let filename = [];
        let arrayFilename = this.state.arrayFilename
        filename.key = this.state.attachtaskId;
        filename.name = "Open";
        arrayFilename.push(filename)
        this.setState({arrayFilename: arrayFilename})
        this.setState({filename: e.target.files[0].name})
        this.setState({file:e.target.files[0]})
        this.fileUpload(e.target.files[0])
        this.setState({uploadflag:1})
    }
    
    fileUpload(file){
        var formData = new FormData();
        formData.append('file', file);// file from input
        var headers = {
            "headers": {
                "Authorization": "Bearer "+Auth.getUserToken(),
            }
        }
        Axios.post(API.PostFileUpload, formData, headers)
        .then(result => {
            if(result.data.Id){
                this.postDocuments(result.data.Id);
            }
        })
        .catch(err => {
        });
    }
    
    postDocuments = (docuId) => {
        this._isMounted = true;
        let params = {
            customerid: this.state.attachtaskId,
            documentid: docuId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostCustomerDocuments, params, headers)
        .then(result => {
            if(this._isMounted){    
                SweetAlert({
                    title: trls('Success'),
                    icon: "success",
                    button: "OK",
                  });
            }
        })
        .catch(err => {
            SweetAlert({
                title: trls('Fail'),
                icon: "warning",
                button: "OK",
              });
        });
    }

    getTaskDocuments = (event) =>{
        this._isMounted = true;
        let taskData=event.currentTarget.id;
        let arrayData = [];
        arrayData = taskData.split(',');
        let params = {
            customerid:parseInt(arrayData[0])
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerDocuments, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({modaldocumentShow: true})
                this.setState({documentData: result.data.Items})
                this.setState({documentHeader: arrayData})
            }
        });
    }
    // viewUserData = (event) => {
    //     this._isMounted = true;
    //     var headers = SessionManager.shared().getAuthorizationHeader();
    //     Axios.get(API.GetUserDataById+event.currentTarget.id, headers)
    //     .then(result => {
    //         if(this._isMounted){
    //             this.setState({userUpdateData: result.data})
    //             this.setState({modalShow:true, mode:"view", flag:true})
    //         }
    //     });
    // }
    // userDelete = () => {
    //     var headers = SessionManager.shared().getAuthorizationHeader();
    //     Axios.delete("https://cors-anywhere.herokuapp.com/"+API.DeleteUserData+this.state.userId, headers)
    //     .then(result => {
    //         this.setState({loading:true})
    //         this.getUserData();               
    //     });
    // }
    // userDeleteConfirm = (event) => {
    //     this.setState({userId:event.currentTarget.id})
    //     confirmAlert({
    //         title: 'Confirm',
    //         message: 'Are you sure to do this.',
    //         buttons: [
    //           {
    //             label: 'Delete',
    //             onClick: () => {
    //                this.userDelete()
    //             }
    //           },
    //           {
    //             label: 'Cancel',
    //             onClick: () => {}
    //           }
    //         ]
    //       });
    // }
    render () {
        let customerData=this.state.customerData;
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('Customer')}</h2>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Form inline style={{width:"100%"}}>
                            {!this.state.loading?(
                                // <Button variant="primary" onClick={this.customerUpdate}>{trls('Add_Customer')}</Button> 
                                <Button variant="primary" onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}>{trls('Add_Customer')}</Button>
                            ):
                            // <Button variant="primary" disabled onClick={this.customerUpdate}>{trls('Add_Customer')}</Button>
                                <Button variant="primary" disabled onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}>{trls('Add_Customer')}</Button>
                            }
                            <Addcustomerform
                                show={this.state.modalShow}
                                onHide={() => this.setState({modalShow: false})}
                                onGetCustomer={()=> this.getCustomerData()}
                                createTask={(newId)=> this.createTask(newId)}
                            />
                            <Updatecustomerform
                                show={this.state.modalupdateShow}
                                onHide={() => this.setState({modalupdateShow: false})}
                                customerData={this.state.customerUpdateData}
                                customerId={this.state.customerId}
                                onGetCustomer={()=> this.getCustomerData()}
                            /> 
                            <Createtask
                                show={this.state.modalcreateTaskShow}
                                detailmode={this.detailmode}
                                taskflag={this.state.taskflag}
                                customerId={this.state.customerId}
                                onHide={() => this.onHide()}
                                customerNewCreate={true}
                            />  
                            <Customerdocument
                                show={this.state.modaldocumentShow}
                                onHide={() => this.setState({modaldocumentShow: false})}
                                documentData = {this.state.documentData}
                                documentHeader = {this.state.documentHeader}
                            />
                        </Form>
                    </div>
                    <div className="table-responsive">
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('CustomerName')}</th>
                                <th>{trls('Address')}</th>
                                <th>{trls('Postcode')}</th>
                                <th>{trls('City')}</th>
                                <th>{trls('Country')}</th>
                                <th>{trls('Attachment')}</th>
                                <th>{trls('Action')}</th>
                            </tr>
                        </thead>
                        {customerData && !this.state.loading &&(<tbody >
                            {
                                customerData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>
                                            <div id={data.id} style={{cursor: "pointer", color:'#004388', fontSize:"15px", fontWeight:'bold'}} onClick={this.viewCustomerDetail}>{data.CustomerName}</div>
                                        </td>
                                        <td>{data.Address}</td>
                                        <td>{data.Zipcode}</td>
                                        <td>{data.City}</td>
                                        <td>{data.Country}</td>
                                        <td>
                                            <Row style={{justifyContent:"center"}}>
                                                <i id={data.id} className="fas fa-file-upload" style={{fontSize:20, cursor: "pointer", paddingLeft: 10, paddingRight:20}} onClick={this.openUploadFile}></i>
                                                <div id={data.id+','+data.CustomerName+','+data.Address+','+data.City+','+data.Country} style={{color:"#069AF8", fontWeight:"bold", cursor: "pointer", textDecoration:"underline"}} onClick={this.getTaskDocuments}>{trls('View')}</div>
                                                <input id="inputFile" type="file"  required accept="*.*" onChange={this.onChangeFileUpload} style={{display: "none"}} />
                                            </Row>
                                        </td>
                                        <td >
                                            <Row style={{justifyContent:"center"}}>
                                                <i id={data.id} className="fas fa-edit statu-item" onClick={this.customerUpdate}></i>
                                            </Row>
                                        </td>
                                    </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                        { this.state.loading&& (
                            <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                                <BallBeat
                                    color={'#222A42'}
                                    loading={this.state.loading}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
        };
  }
    
  export default connect(mapStateToProps, mapDispatchToProps)(Userregister);
