import React, {Component} from 'react'
import { Form,Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Addcustomerform from './addcustomerform';
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
            loading:true
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
    componentWillReceiveProps() {
        // $('#example').dataTable().fnDestroy();
        // $('#example').dataTable(
        //   {
        //     "language": {
        //         "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
        //         "zeroRecords": "Nothing found - sorry",
        //         "info": trls("Show_page")+" _PAGE_ of _PAGES_",
        //         "infoEmpty": "No records available",
        //         "infoFiltered": "(filtered from _MAX_ total records)",
        //         "search": trls('Search'),
        //         "paginate": {
        //           "previous": trls('Previous'),
        //           "next": trls('Next')
        //         }
        //     }
        //   }
        // );
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
                        </Form>
                    </div>
                    <div className="table-responsive credit-history">
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('CustomerName')}</th>
                                <th>{trls('Address')}</th>
                                <th>{trls('Postcode')}</th>
                                <th>{trls('City')}</th>
                                <th>{trls('Country')}</th>
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
                                        <td >
                                            <Row style={{justifyContent:"center"}}>
                                                <img src={require("../../assets/images/icon-draft.svg")} id={data.id} className="statu-item" onClick={this.customerUpdate} alt="Draft"/>
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
