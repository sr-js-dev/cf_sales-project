import React from 'react';
import '../../assets/css/collapsepanel.scss';
import { trls } from '../../components/translate';
import { connect } from 'react-redux';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import 'datatables.net';
import Qutatedetailform from './quotation-detailform';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Quotation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
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
  constructor(props) {
    var date = new Date();
    var curyear = date.getFullYear(); 
    super(props);
    this.state = {  
        lastYear2 : curyear-2,
        lastYear3 : curyear-3
    };
  }
    componentDidMount() {
        this._isMounted=true
        this.setState({loading:true})
    }
    getCustomerData (value) {
        
        this._isMounted = true;
        let params = {
            customerid : 0
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerQuotes, params, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({customerQuotes:result.data.Items})
                this.props.detailmode();
                this.setState({loading:false})
                $('#example-quotation').dataTable().fnDestroy();
                $('#example-quotation').DataTable(
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
                      },
                    }
                  );
            }
        });
    }
    componentDidUpdate(){
        if(this.props.customerId){
            this.getCustomerData(this.props.customerId)
        }
    }
    viewDetail = (event) => {
        this.setState({Number: event.currentTarget.id})
        this.setState({modalShow: true})
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
    formatNumber = (num) => {
        if(num){
            var value = num.toFixed(2);
            return  "€" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }else{
            return "€ 0.00" 
        }
       
    }
    formatOrderNum = (num) => {
        if(num){
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }else{
            return 0 
        }
       
    }
    formatNumberPercent = (num) => {
        if(num){
            var value = num.toFixed(2);
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }else{
            return "0.00" 
        }
        
    }
    onHiden = () =>{
        this.setState({modalShow:false})
    }
    detailmode = () =>{
        this.setState({Number: ""})
    }
    render () {
        let customerQuotes=this.state.customerQuotes;
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
                    <div className="table-responsive credit-history">
                        <table id="example-quotation" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Quotation_Number')}</th>
                                <th>{trls('Date')}</th>
                                <th>{trls('Amount')}</th>
                                <th>{trls('Reference')}</th>
                                <th>{trls('Delivery')}</th>
                                <th>{trls('Approved')}</th>
                            </tr>
                        </thead>
                        {customerQuotes && !this.state.loading &&(<tbody >
                            {
                                customerQuotes.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>
                                            <div id={data.Number} style={{cursor: "pointer", color:'#004388', fontSize:"16px", fontWeight:'bold'}} onClick={this.viewDetail}>{data.Number}</div>
                                        </td>
                                        <td>{this.formatDate(data.Date)}</td>
                                        <td>{this.formatNumber(data.Revenue)}</td>
                                        <td>{data.Reference ? data.Reference : ''}</td>
                                        <td>{data.Delivery ? data.Delivery: ''}</td>
                                        {data.Approved?(
                                            <td>{trls('Approved')}</td>
                                        ):<td>{trls('Not_Approved')}</td>}
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
                    <Qutatedetailform
                        show={this.state.modalShow}
                        number={this.state.Number}
                        orderflag={this.state.flag}
                        onHide={this.onHiden}
                        detailmode={this.detailmode}
                    /> 
                    </div>
                </div>
            </div>
        </div>
        )
    }
    }
    export default connect(mapStateToProps, mapDispatchToProps)(Quotation);
