import React, {Component} from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
// import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import GaugeChart from 'react-gauge-chart'
import 'font-awesome/css/font-awesome.min.css';
import { trls } from '../../components/translate';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import Contactpanel from './contactpanel';
import Modalpanel from './modalpanel';
import Products from './products';
import Orders from './orders';
import Competitor from './competitor';
import Priceagree from './price-agree';
import Quotation from './quotation';
import Mold from './mold.js'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Userregister extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            customerId:'',
            flag:'',
            customerDetailData:[],
            customerFinancialData: [],
            loading:true,
            gaugepercent: 0,
            percent: 0
        };
      }
    componentDidMount() {
        this._isMounted=true
        let pathname = window.location.pathname;
        let pathArray = pathname.split('/')
        let customerId = pathArray.pop();
        this.setState({customerId: customerId})
        this.getCustomerDetailData(customerId)
        this.getCustomerFinancialDetails(customerId);
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getCustomerDetailData (value) {
        this._isMounted = true;
        let params = {
            customerid : value
        }
        this.setState({customerId: value})
        this.setState({loadingvalue:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerDetailData, params,  headers)
        .then(result => {
            if(this._isMounted){
                this.setState({customerDetailData: result.data.Items})
            }
        });
    }

    getCustomerFinancialDetails (value) {
        this._isMounted = true;
        let params = {
            customerid : value
        }
        let currentRevenue=0;
        let lastRevenue=0;
        this.setState({customerId: value})
        this.setState({loadingvalue:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerFinancialDetailData, params,  headers)
        .then(result => {
            var date = new Date();
            var curyear = date.getFullYear();    
            if(this._isMounted){
                let detailData=result.data.Items
                if(detailData){
                    detailData.map((data, index) => {
                        if(data.Year===curyear){
                            this.setState({customerFinancialData4: data})
                            currentRevenue=data.Revenue
                        }else if(data.Year===curyear-1){
                            this.setState({customerFinancialData3: data})
                            lastRevenue=data.Revenue
                        }else if(data.Year===curyear-2){
                            this.setState({customerFinancialData2: data})
                        }else if(data.Year===curyear-3){
                            this.setState({customerFinancialData1: data})
                        }
                        return detailData;
                    })
                }
                if(currentRevenue&&lastRevenue){
                    this.setState({gaugepercent:(lastRevenue/currentRevenue)/2});
                    this.setState({percent:(lastRevenue/currentRevenue)*100})
                }
            }
        });
    }
    userDeleteConfirm = (event) => {
        this.setState({userId:event.currentTarget.id})
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Delete',
                onClick: () => {
                   this.userDelete()
                }
              },
              {
                label: 'Cancel',
                onClick: () => {}
              }
            ]
          });
    }
    formatNumber = (num) => {
        var value = num.toFixed(2);
        return  "€" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    formatNumberPercent = (num) => {
        var value = num.toFixed(2);
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    detailmode = () =>{
        this.setState({customerId: ""})
    }
    render () {
        let customerDetailData=this.state.customerDetailData[0];
        let customerFinancialData4=this.state.customerFinancialData4;
        let customerFinancialData3=this.state.customerFinancialData3;
        let customerFinancialData2=this.state.customerFinancialData2;
        let customerFinancialData1=this.state.customerFinancialData1;
        let paymentterm=''
        if(customerDetailData){
             paymentterm = customerDetailData.paymentterm;
        }
            
        return (
            <Container className="card-container">
                <Row className="customer-detail">
                    <Col sm={3}className="card-container-col">
                        <Card>
                            <Card.Header><i className="fa fa-user" style={{paddingRight:"5px", fontSize:"18px"}}></i>{trls("Codex_SAS")}</Card.Header>
                                <Card.Body>
                                        <div className="codex-content">
                                            <i className="fas fa-address-card" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                            <div className="codex-address">
                                                <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Address")}:</div>
                                                {customerDetailData&&(
                                                    <div>{customerDetailData.Address}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="codex-content">
                                            <i className="fas fa-barcode" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                            <div className="codex-address">
                                                <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Postcode")}:</div>
                                                {customerDetailData&&(
                                                    <div>{customerDetailData.Zipcode}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="codex-content">
                                            <i className="fas fa-location-arrow" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                            <div className="codex-address">
                                                <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Location")}:</div>
                                                {customerDetailData&&(
                                                    <div>{customerDetailData.City}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="codex-content">
                                            <i className="fas fa-map-marker-alt" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                            <div className="codex-address">
                                                <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Country")}:</div>
                                                {customerDetailData&&(
                                                    <div>{customerDetailData.Country}</div>
                                                )}
                                            </div>
                                        </div>
                                </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={3}className="card-container-col">
                        <Card>
                            <Card.Header><i className="fa fa-info-circle" style={{paddingRight:"5px", fontSize:"18px"}}></i>{trls("Extra_information")}</Card.Header>
                                <Card.Body>
                                    <div className="codex-content">
                                        <i className="fas fa-phone" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                        <div className="codex-address">
                                            <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Telephone")}:</div>
                                            {customerDetailData&&(
                                                <div>{customerDetailData.Phone}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="codex-content">
                                        <i className="fas fa-envelope" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                        <div className="codex-address">
                                            <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("E_mail")}:</div>
                                            {customerDetailData&&(
                                                <div>{customerDetailData.Email}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="codex-content">
                                        <i className="fas fa-globe" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                        <div className="codex-address">
                                            <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Website")}:</div>
                                            {customerDetailData&&(
                                                <div>{customerDetailData.Website}</div>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={6} className="card-container-col-finance">
                        <Card>
                            <Card.Header><i className="fas fa-money-check-alt" style={{paddingRight:"5px", fontSize:"18px"}}></i>{trls("Financial")}</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col sm={6} >
                                            <div className="codex-content">
                                                <div className="codex-address">
                                                    <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Turnover_current_year")}:</div>
                                                    {customerFinancialData4&&(
                                                        <div>{this.formatNumber(customerFinancialData4.Revenue)}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="codex-content">
                                                <div className="codex-address">
                                                    <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Turnover_last_year")}:</div>
                                                    {customerFinancialData3&&(
                                                        <div>{this.formatNumber(customerFinancialData3.Revenue)}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="codex-content">
                                                <div className="codex-address">
                                                    <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Revenue_for_the_year")} 2017:</div>
                                                    {customerFinancialData2&&(
                                                        <div>{this.formatNumber(customerFinancialData2.Revenue)}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="codex-content">
                                                <div className="codex-address">
                                                    <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Revenue_for_the_year")} 2016:</div>
                                                    {customerFinancialData1&&(
                                                        <div>{this.formatNumber(customerFinancialData1.Revenue)}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={3} style={{textAlign:"center", fontSize:"13px"}}>
                                            <div style={{color:"rgba(21, 132, 247, 1)", paddingBottom:"10px"}}>{trls("Progress")}</div>
                                                <div>
                                                    <GaugeChart 
                                                        id="gauge-chart1111111111"
                                                        colors={["#FA0505","#6AAB5F"]} 
                                                        hideText={true}
                                                        needleColor={"red"}
                                                        nrOfLevels={2} 
                                                        arcPadding={0} 
                                                        cornerRadius={0} 
                                                        percent={this.state.gaugepercent}
                                                        arcWidth={0.3} 
                                                    />
                                                </div>
                                            <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Payment_term")}</div>
                                            {paymentterm?(
                                                <div>{paymentterm+" "+trls("days")}</div>
                                            ):<div>{"0 "+trls("days")}</div>}
                                        </Col>
                                        <Col sm={3}>
                                                {this.state.percent?(
                                                    <p style={{marginTop:"50px"}}>
                                                        {this.formatNumberPercent(this.state.percent)+"%"}
                                                    </p>   
                                                ):<p style={{marginTop:"50px"}}>
                                                    {this.formatNumberPercent(this.state.percent)+"%"}
                                                </p>}
                                        </Col>
                                    </Row>
                                </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <div className="panel-collapse">
                    <Contactpanel
                        title={trls("Contacts")}
                        customerId={this.state.customerId}
                        detailmode={this.detailmode}
                    />
                </div>
                <div className="panel-collapse">
                    <Modalpanel
                        title={trls("Models")}
                        customerId={this.state.customerId}
                        detailmode={this.detailmode}
                    />
                </div>
                <div className="panel-collapse">
                    <Products
                        title={trls("Articles")}
                        customerId={this.state.customerId}
                        detailmode={this.detailmode}
                    />
                </div>
                <div className="panel-collapse">
                    <Orders
                        title={trls("Orders")}
                        customerId={this.state.customerId}
                        detailmode={this.detailmode}
                    />
                </div>
                <div className="panel-collapse">
                    <Competitor
                        title={trls("Competitor_models")}
                        customerId={this.state.customerId}
                        detailmode={this.detailmode}
                    />
                </div>
                <div className="panel-collapse">
                    <Priceagree
                        title={trls("Price_agreements")}
                        customerId={this.state.customerId}
                        detailmode={this.detailmode}
                    />
                </div>
                <div className="panel-collapse">
                    <Quotation
                        title={trls("Quotations")}
                        customerId={this.state.customerId}
                        detailmode={this.detailmode}
                    />
                </div>
                <div className="panel-collapse">
                    <Mold
                        title={trls("Mold")}
                        customerId={this.state.customerId}
                        detailmode={this.detailmode}
                    />
                </div>
            </Container>
        )
        };
  }
    
  export default connect(mapStateToProps, mapDispatchToProps)(Userregister);
