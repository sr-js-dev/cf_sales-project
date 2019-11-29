
import React from 'react';
import '../../assets/css/collapsepanel.scss';
import { trls } from '../../components/translate';
import { Form, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import 'datatables.net';
import { BallBeat } from 'react-pure-loaders';
import Addcontactform from './addcontactform';
import Updatecontact from './updatecontact';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Contactspanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
        showCheckFlag:''
    };
  }
  render () {
    return (
      <div {...{ className: 'wrapper' }}>
        <ul {...{ className: 'accordion-list' }}>
                <AccordionItem {...this.props} />
        </ul>
      </div>
    )
  }
}

class AccordionItem extends React.Component {
  state = {
    opened: false,
  }
    componentDidMount() {
        this._isMounted=true
        let pathname = window.location.pathname;
        let pathArray = pathname.split('/')
        let customerId = pathArray.pop();
        this.setState({customerId: customerId})
        this.setState({loading: true})
    }
    getCustomerData (flag) {
        this._isMounted = true;
        let params = {
            customerid : this.state.customerId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerContacts, params, headers)
        .then(result => {
            if(this._isMounted){
                let tempArray = [];
                let contactArray = [];
                tempArray = result.data.Items;
                tempArray.map((data, index) => {
                    if(!flag){
                        if(data.Active){
                            contactArray.push(data)
                        }
                    }else{
                        contactArray.push(data)
                    }
                    
                    return tempArray;
                })
                this.setState({customerContacts:contactArray})
                this.props.detailmode();
                this.setState({loading:false})
                $('#example-contacts').dataTable().fnDestroy();
                $('#example-contacts').DataTable(
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

    getCustomerDatafronadd = () =>{
        this.setState({loading: true})
        this.getCustomerData()
    }
    componentDidUpdate(){
        if(this.props.customerId){
            this.getCustomerData()
        }
    }
    contactUpdate = (event) => {
        this._isMounted = true;
        let contactId=event.currentTarget.id;
        let params = {
            contactId:contactId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetContact, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({contactUpdateData: result.data.Items})
                this.setState({modalupdateShow:true, contactId: contactId})
            }
        });
    }
    showActiveContacts = () => {
        
        if(this.state.showCheckFlag){
            this.setState({loading: true})
            this.setState({showCheckFlag:false})
            this.getCustomerData(false);
        }else{
            this.setState({loading: true})
            this.setState({showCheckFlag:true})
            this.getCustomerData(true);
        }

    }
    
    render () {
        let customerContacts=this.state.customerContacts;
        const {
        props: {
            title
        },
        state: {
            opened
        }
        } = this
        return (
        <div
            {...{
            className: `accordion-item, ${opened && 'accordion-item--opened'}`,
            }}
        >
            <div {...{ className: 'accordion-item__line', onClick: () => { this.setState({ opened: !opened }) } }}>
            <h3 {...{ className: 'accordion-item__title' }}>
                {title}
            </h3>
            <span {...{ className: 'accordion-item__icon' }}/>
            </div>
            <div {...{ className: 'accordion-item__inner' }} style={{borderTop: "1px solid rgba(0,0,0,.125)"}}>
                <div {...{ className: 'accordion-item__content' }}>
                    <div className="contact-detail-header">
                        <Form.Check type="checkbox" name="ncham" label={trls("All_contacts")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} onChange={this.showActiveContacts}/>
                        <Button type="button" onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}>{trls('Add_contacts')}</Button>
                        <Addcontactform
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                            onGetContact={(val)=> this.getCustomerDatafronadd(val)}
                            coustomerId={this.props.customerId}
                        />
                        <Updatecontact
                            show={this.state.modalupdateShow}
                            onHide={() => this.setState({modalupdateShow: false})}
                            contactUpdateData={this.state.contactUpdateData}
                            contactId={this.state.contactId}
                            onGetContact={(val)=> this.getCustomerDatafronadd(val)}
                        /> 
                    </div>
                    <div className="table-responsive credit-history">
                        <table id="example-contacts" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('FirstName')}</th>
                                <th>{trls('LastName')}</th>
                                <th>{trls('Telephone_work')}</th>
                                <th>{trls('Mobile')}</th>
                                <th>{trls('E_mail')}</th>
                                <th>{trls('Status')}</th>
                                <th>{trls('Active')}</th>
                            </tr>
                        </thead>
                        {customerContacts && !this.state.loading &&(<tbody >
                            {
                                customerContacts.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.FirstName}</td>
                                        <td>{data.LastName}</td>
                                        <td>{data.PhoneWork}</td>
                                        <td>{data.PhoneMobile}</td>
                                        <td>{data.Email}</td>
                                        {data.Active?(
                                            <td>
                                                <Row style={{justifyContent:"center"}}>
                                                <i className="fas fa-circle active-icon"></i><div>Active</div>
                                                </Row>
                                            </td>
                                        ):
                                            <td >
                                                <Row style={{justifyContent:"center"}}>
                                                <i className="fas fa-circle inactive-icon"></i><div>Inactive</div>
                                                </Row>
                                            </td>
                                        }
                                        
                                        <td >
                                            <Row style={{justifyContent:"center"}}>
                                                <img src={require("../../assets/images/icon-draft.svg")} id={data.Id} className="statu-item" onClick={this.contactUpdate} alt="Draft"/>
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
        </div>
        )
    }
    }
    export default connect(mapStateToProps, mapDispatchToProps)(Contactspanel);
