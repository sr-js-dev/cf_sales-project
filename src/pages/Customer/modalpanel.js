
import React from 'react';
import '../../assets/css/collapsepanel.scss';
import { trls } from '../../components/translate';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import GaugeChart from 'react-gauge-chart'
import 'datatables.net';
const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Modalpanel extends React.Component {
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
    start: 0,
    end: 0
  }
    componentDidMount() {
        this._isMounted=true
    }
    getCustomerData (value) {
        
        this._isMounted = true;
        let params = {
            customerid : value
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerModels, params, headers)
        .then(result => {
            if(this._isMounted){
                var date = new Date();
                var curyear = date.getFullYear(); 
                let modelData=result.data.Items
                let model='';
                let modelArray=[];
                let tempArray=[];
                let currentYear=0;
                let lastYear=0;
                let progress=0;
                modelData.map((data, index) => {
                    if(model!==data.Model){
                        model=data.Model;
                        if(!tempArray.currentYear){
                            tempArray.currentYear=0
                        }
                        if(!tempArray.lastYear){
                            tempArray.lastYear=0
                        }
                        if(!tempArray.progress){
                            tempArray.progress=0
                        }
                        if(!tempArray.gaugepercent){
                            tempArray.gaugepercent=0
                        }
                        tempArray = JSON.parse(JSON.stringify(tempArray))
                        modelArray.push(tempArray);
                    }
                    tempArray.Model=data.Model;
                    tempArray.Type=data.Type;
                    tempArray.Size=data.Size;
                    if(model===data.Model&&curyear===data.Year){
                        currentYear=data.Revenue;
                        tempArray.currentYear=currentYear;
                    }else if(model===data.Model&&curyear-1===data.Year){
                        lastYear=data.Revenue;
                        tempArray.lastYear=lastYear;
                    }
                    if(currentYear&&lastYear){
                        progress=(currentYear/lastYear)*100;
                        tempArray.progress=progress;
                        tempArray.gaugepercent=(currentYear/lastYear)/2;
                    }
                    return modelData;
                })
                this.setState({customerModels:modelArray})
                this.props.detailmode();
                this.setState({loading:false})
                $('#example-modal').dataTable().fnDestroy();
                $('#example-modal').DataTable(
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
                      columnDefs: [
                        { "width": "250px", "targets": [5] }
                      ]
                    }
                  );
                  let info = $('#example-modal').DataTable().page.info();
                  if (info) this.setState({start: info.start, end: info.length});
                  const self = this;
                  $('#example-modal').on( 'page.dt', function () {
                    let info = $('#example-modal').DataTable().page.info();
                    self.setState({start: info.start, end: info.end});
                    
                  });
            }
        });
    }
    componentDidUpdate(){
        if(this.props.customerId){
            this.getCustomerData(this.props.customerId)
        }
    }
    formatNumber = (num) => {
        if(num){
            var value = num.toFixed(2);
            return  "€" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }else{
            return "€ 0.00" 
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
    render () {
        let customerModels=this.state.customerModels;
        const {
        props: {
            title
        },
        state: {
            opened,
        }
        } = this
        let tableData;

        if (customerModels && !this.state.loading) {
            tableData = customerModels.map((data,i) =>(
                <tr id={i} key={i}>
                    <td>{data.Model}</td>
                    <td>{data.Type}</td>
                    <td>{data.Size}</td>
                    <td>{this.formatNumber(data.currentYear)}</td>
                    <td>{this.formatNumber(data.lastYear)}</td>
                    <td>
                        <Row >
                            <Col sm={5} style={{textAlign:"center", fontSize:"13px"}}>
                                <GaugeChart 
                                    id={"gauge-chart"+i}
                                    colors={["#FA0505","#6AAB5F"]} 
                                    hideText={true}
                                    needleColor={"red"}
                                    nrOfLevels={2} 
                                    arcPadding={0} 
                                    cornerRadius={0} 
                                    percent={data.gaugepercent}
                                    arcWidth={0.4} 
                                />
                            </Col>
                            <Col sm={3} style={{paddingLeft:"0px"}}>
                                <p>{this.formatNumberPercent(data.progress)+"%"}</p>
                            </Col>
                        </Row>
                    </td>
                </tr>
            ))
        }
        return (
        <div
            {...{
            className: `accordion-item, ${opened && 'accordion-item--opened'}`,
            }}
        >
            <div style={{backgroundColor:"rgba(154,142,142,.13)"}} {...{ className: 'accordion-item__line', onClick: () => { this.setState({ opened: !opened }) } }}>
            <h3 {...{ className: 'accordion-item__title' }}>
                {title}
            </h3>
            <span {...{ className: 'accordion-item__icon' }}/>
            </div>
            <div {...{ className: 'accordion-item__inner' }} style={{borderTop: "1px solid rgba(0,0,0,.125)"}}>
                <div {...{ className: 'accordion-item__content' }}>
                    <div className="table-responsive credit-history">
                        <table id="example-modal" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Model')}</th>
                                <th>{trls('Type')}</th>
                                <th>{trls('Size')}</th>
                                <th>{trls('Turnover_last_year')}</th>
                                <th>{trls('Turnover_current_year')}</th>
                                <th>{trls('Progress')}</th>
                            </tr>
                        </thead>
                        {customerModels && !this.state.loading &&(<tbody >
                            {
                                tableData
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
    export default connect(mapStateToProps, mapDispatchToProps)(Modalpanel);
