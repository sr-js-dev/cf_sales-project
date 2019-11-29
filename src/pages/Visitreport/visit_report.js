import React, {Component} from 'react'
import { connect } from 'react-redux';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import { Button, Form, Row } from 'react-bootstrap';
import { trls } from '../../components/translate';
import 'datatables.net';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import history from '../../history';
const mapStateToProps = state => ({
     ...state.auth,
});

const mapDispatchToProps = dispatch => ({

}); 
class Visitreport extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading:true,
            visitreports:[]
        };
      }
componentDidMount() {
    this.getTasksData();
}

getTasksData = () => {
    this.setState({loading:true})
    var header = SessionManager.shared().getAuthorizationHeader();
    Axios.get(API.GetVisitReports, header)
    .then(result => {
        this.setState({visitreports:result.data.Items})
        this.setState({loading:false})
        $('#example-visitreport').dataTable().fnDestroy();
        $('#example-visitreport').DataTable(
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
    });
}
componentWillUnmount() {
}
componentWillReceiveProps() {
    $('#example').dataTable().fnDestroy();
    $('#example').dataTable(
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
createVisitReport = () => {
    history.push({
        pathname: '/visit-report/create',
      })
}
updateVisit = (event) => {
    let visitreportid = event.currentTarget.id;
    history.push('/visit-report/create-question',{newId:visitreportid, updateFlag:true});
}
formatDate = (startdate) =>{
        
    var dd = new Date(startdate).getDate();
    var mm = new Date(startdate).getMonth()+1; 
    var yyyy = new Date(startdate).getFullYear();
    var formatDate = '';
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    formatDate = dd+'-'+mm+'-'+yyyy;
    return formatDate;
}
render () {
    let visitreports = this.state.visitreports
    if(visitreports){
        visitreports.sort(function(a, b) {
            return a.id - b.id;
        });
    }
    return (
        <div className="order_div">
            <div className="content__header content__header--with-line">
                <h2 className="title">{trls('Add_VisitReport')}</h2>
            </div>
            <div className="orders">
                <div className="orders__filters justify-content-between">
                    <Form inline style={{width:"100%"}}>
                        <Button variant="primary" onClick={this.createVisitReport}><i className="fas fa-plus" style={{marginRight:"10px"}}></i>{trls('Add_VisitReport')}</Button>   
                    </Form>
                </div>
                <div className="table-responsive">
                    <table id="example-visitreport" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Id')}</th>
                                <th>{trls('Customer')}</th>
                                <th>{trls('Visit_Date')}</th>
                                <th>{trls('CreatedBy')}</th>
                                <th>{trls('Action')}</th>
                            </tr>
                        </thead>
                        {visitreports && !this.state.loading &&(<tbody >
                            {
                                visitreports.map((data,i) =>(
                                <tr id={data.Id} key={i} onClick={this.loadSalesDetail}>
                                    <td>{data.Id}</td>
                                    <td>{data.Customer}</td>
                                    <td>{this.formatDate(data.VisitDate)}</td>
                                    <td>{data.CreatedBy}</td>
                                    <td >
                                        <Row style={{justifyContent:"center"}}>
                                            <img src={require("../../assets/images/icon-draft.svg")} id={data.Id} className="statu-item" onClick={this.updateVisit} alt="Draft"/>
                                        </Row>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                    { this.state.loading && (
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
export default connect(mapStateToProps, mapDispatchToProps)(Visitreport);
