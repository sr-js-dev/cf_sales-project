import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import { Container, Row, Col, Button } from 'react-bootstrap';
import SessionManager from '../../components/session_manage';
import Select from 'react-select';
import API from '../../components/api'
import Axios from 'axios';
import * as Auth from '../../components/auth'
import  { Link } from 'react-router-dom';
import * as authAction  from '../../actions/authAction';
import Slider from 'react-bootstrap-slider';
import "bootstrap-slider/dist/css/bootstrap-slider.css"
import Map from './map.js'
// import iplocation from 'iplocation';
// import publicIp  from 'public-ip';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Dashboard extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            tasksnumber: '',
            customerArray: [],
            user_marker: [],
            currentValue: 0
        };
    }
    locationSearch(term) {
        this.setState({center: JSON.stringify(term)});
      }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        setTimeout(this.getLocationIpPosition(), 60000);
        this.getNumberOpenTasks();
        this.getCustomerCoordinates();
        this.getTopCustomer();
        this.getTopItem();
        this.getTopModel();
        this.getCustomerData();
    }
    getLocationIpPosition = () =>{
        // (async () => {
        //     iplocation(await publicIp.v4(), [], (error, res) => {
        //     this.setState({center:{lat: res.latitude, lng:res.longitude }})
        // });
        // })();
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
            
          } else { 
            //   console.log('222222', "Geolocation is not supported by this browser.")
          }
    }

    getCustomerData = () =>{
        let params = {
            customerId: Auth.getUserName()
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomer, params, headers)
        .then(result => {
            this.setState({customer: result.data.Items});
        });
    }

    getCustomerCoordinatesById = (val) =>{
        this.setState({customerId: val.value})
        let params = {
            customerid : val.value
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerCoordinatesById, params, headers)
        .then(result => {
            if(result.data.Items[0].LAT&&result.data.Items[0].LONG){
                this.setState({center:{lat: parseFloat(result.data.Items[0].LAT), lng: parseFloat(result.data.Items[0].LONG)}})
                this.getMarsers()
            }
        });
    }

    showPosition = (position)=>{
        
        this.setState({center:{lat: position.coords.latitude, lng:position.coords.longitude }})
    }

    getCustomerCoordinates = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetCustomerCoordinates, headers)
        .then(result => {
            var date = new Date();
                var curyear = date.getFullYear(); 
                let customerData=result.data.Items
                let CustomerId='';
                let customerArray=[];
                let tempArray=[];
                let currentYear=0;
                let lastYear=0;
                customerData.map((data, index) => {
                    if(CustomerId!==data.CustomerId){
                        CustomerId=data.CustomerId;
                        if(!tempArray.currentYear){
                            tempArray.currentYear=0
                        }
                        if(!tempArray.lastYear){
                            tempArray.lastYear=0
                        }
                        tempArray = JSON.parse(JSON.stringify(tempArray))
                        customerArray.push(tempArray);
                    }
                    tempArray.CustomerId=data.CustomerId;
                    tempArray.Klantnaam=data.Klantnaam;
                    tempArray.LAT=parseFloat(data.LAT);
                    tempArray.LONG=parseFloat(data.LONG);
                    if(CustomerId===data.CustomerId&&curyear===data.Year){
                        currentYear=data.Revenue;
                        tempArray.currentYear=currentYear;
                    }else if(CustomerId===data.CustomerId&&curyear-1===data.Year){
                        lastYear=data.Revenue;
                        tempArray.lastYear=lastYear;
                    }
                    return customerData;
                })
                this.setState({customerArray:customerArray})
            }
        )
        
    }

    getNumberOpenTasks = () => {
        let params = {
            username: Auth.getUserName()
        }
        var header = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetNumberOpenTasks, params, header)
        .then(result => {
            this.setState({tasksnumber:result.data.Items[0]})
        }
        )
    }

    getTopCustomer = () => {
        var header = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTopCustomer, header)
        .then(result => {
            this.setState({topCustmer:result.data.Items})
        }
        )
    }

    getTopItem = () => {
        var header = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTopItems, header)
        .then(result => {
            this.setState({topItem:result.data.Items})
        }
        )
    }

    getTopModel = () => {
        var header = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTopModel, header)
        .then(result => {
            this.setState({topModel:result.data.Items})
        }
        )
    }

    handleMarkerClick = (params) => {
        this.setState({
            user_marker: this.state.user_marker.map(marker => {
                if (marker.CustomerId === params.CustomerId) {
                    return {
                        ...marker,
                        showInfo: true,
                    };
                } else {
                    return {
                        ...marker,
                        showInfo: false,
                    };
                }
            }),
        });
    }
    handleMarkerClose = () => {
		this.setState({
            user_marker: this.state.user_marker.map(marker => {
                return {
                    ...marker,
                    showInfo: false,
                };
            }),
        });
	}
    VisitReport = () => {
        this.props.blankdispatch()
    }

    customer = () => {
        this.props.blankdispatch()
    }

    changeLocation = () => {
        this.setState({center: {lat: 52.371807, lng: 5.896029 }})
    }

    changeDistanceValue = (e) => {
        this.setState({currentValue:e.target.value})
        this.getMarsers();
    }

    getMarsers = () =>{
        let customerData = this.state.customerArray;
        let position_array = [];
        let distance = ''
        let user_marker = [];
        customerData.map((data, index) => {
            position_array.lat=data.LAT
            position_array.lng=data.LONG
            distance = this.getDistance(this.state.currentValue, position_array);
            if(distance<this.state.currentValue && data.CustomerId!==this.state.CustomerId){
                data.position_flag=true
                user_marker.push(data)
            }
            return customerData;
        })
        this.setState({user_marker:user_marker})
    }

    getDistance = (dis_value, position) =>{
        let center_position = this.state.center;
        let dLat = Math.abs(position.lat - center_position.lat) * (Math.PI / 180);
        let dLon = Math.abs(position.lng - center_position.lng) * (Math.PI / 180);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(position.lat * (Math.PI / 180)) * Math.cos(center_position.lat * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        let distance = 2 * 6371 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return distance;
    }

    formatNumber = (num) => {
        if(num){
            var value = num.toFixed(2);
            return  "€" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }else{
            return "€ 0.00" 
        }
       
    }

    
    render(){   
        let number = 0;
        let topCustmer = [];
        let topItem = [];
        let topModel = [];
        let customer = [];
        if(this.state.topCustmer){
            topCustmer=this.state.topCustmer;
        }
        if(this.state.topItem){
            topItem=this.state.topItem;
        }
        if(this.state.topModel){
            topModel=this.state.topModel;
        }
        if(this.state.tasksnumber[0]){
            number = this.state.tasksnumber
        }
        if(this.state.customer){
            customer = this.state.customer.map( s => ({value:s.key,label:s.value}) );
        }
    
        let map_lang=trls('map_lang')
        return (
            <Container>
                <div className="dashboard-header content__header content__header--with-line">
                    <h2 className="title">{trls('Dashboard')}</h2>
                </div>
                <Row className="dashboard-container">
                    <Col sm={4} className="top-content" >
                        <div className="dashboard__top-long">
                            <div>
                                <h6 className="dashboard__top-long-title">{trls('Visit_reports_page')}</h6>
                            </div>
                            <div className="dashboard__top-long-img">
                                <Link to={'/visit-report'}>
                                    <img src={require("../../assets/images/icon-payment-white.svg")} style={{cursor: "pointer"}} alt="payment" onClick={this.createVisitReport}/>
                                </Link>
                            </div>
                        </div>
                        <div className="dashboard__top-long">
                            <div>
                                <h6 className="dashboard__top-long-title">{trls('Customers_page')}</h6>
                            </div>
                            <div className="dashboard__top-long-img">
                                <Link to={'/customer'}>
                                    <img src={require("../../assets/images/icon-cart-white.svg")} style={{cursor: "pointer"}} alt="cart" onClick={this.customer}/>
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="dashboard__top-small">
                            <div className="dashboard__top-small-header">
                                <img src={require("../../assets/images/icon-exclamation.svg")} alt="exclamation"/>
                                <span>{trls('Number_Of_Tasks')}</span>
                            </div>
                            <div className="dashboard__top-small-value">{trls('Tasks')}: {number}</div>
                        </div>
                    </Col>
                </Row>
                <Row className="dashboard-container" style={{paddingTop:40}}>
                    <Col sm={4} style={{paddingBottom:20}} >
                        <div className="dashboard__bottom-item">
                            <div className="dashboard__bottom-item-header">
                                <h6 className="dashboard__bottom-item-title">{trls("Top_Customers")}</h6>
                                <div className="dashboard__bottom-item-img">
                                    <img src={require("../../assets/images/icon-orders-white.svg")} alt="shipped"/>
                                </div>
                            </div>
                            <table className="dashboard__bottom-item-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>{trls('CustomerName')}</th>
                                        <th>{trls('Revenue')}</th>
                                    </tr>
                                </thead>
                                    {topCustmer &&(<tbody >
                                        {
                                            topCustmer.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{i+1}</td>
                                                <td>{data.Klantnaam}</td>
                                                <td>{this.formatNumber(data.Revenue)}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>)}
                            </table>
                        </div>
                    </Col>
                    <Col sm={4} style={{paddingBottom:20}}>
                        <div className="dashboard__bottom-item">
                            <div className="dashboard__bottom-item-header">
                                <h6 className="dashboard__bottom-item-title">{trls('Top_Items')}</h6>
                                <div className="dashboard__bottom-item-img">
                                    <img src={require("../../assets/images/icon-orders-white.svg")} alt="shipped"/>
                                </div>
                            </div>
                            <table className="dashboard__bottom-item-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>{trls('Item')}</th>
                                        <th>{trls('Revenue')}</th>
                                    </tr>
                                </thead>
                                    {topItem &&(<tbody >
                                        {
                                            topItem.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{i+1}</td>
                                                <td>{data.itemnr}</td>
                                                <td>{this.formatNumber(data.revenue)}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>)}
                            </table>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className="dashboard__bottom-item">
                            <div className="dashboard__bottom-item-header">
                                    <h6 className="dashboard__bottom-item-title">{trls('Top_Models')}</h6>
                                <div className="dashboard__bottom-item-img">
                                    <img src={require("../../assets/images/icon-orders-white.svg")} alt="shipped"/>
                                </div>
                            </div>
                            <table className="dashboard__bottom-item-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>{trls('Model')}</th>
                                        <th>{trls('Revenue')}</th>
                                    </tr>
                                </thead>
                                    {topModel &&(<tbody >
                                        {
                                            topModel.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{i+1}</td>
                                                <td>{data.Model}</td>
                                                <td>{this.formatNumber(data.Revenue)}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>)}
                            </table>
                        </div>
                    </Col>
                </Row>
                <Col className="dashboard-map-layout">
                    <Row>
                        <Col sm={4} style={{paddingTop:"10px", paddingLeft:'30px'}}>
                            <h5 style={{fontWeight: "bold"}}>{trls('Nearest_Customers')}</h5>
                        </Col>
                        <Col sm={4} style={{paddingTop:"10px"}}>
                            <div style={{fontWeight:"700"}}>{trls('dashboard_page_customer_near_by_km')}</div>
                            <Slider
                                value={this.state.currentValue}
                                change={this.changeDistanceValue}
                                width={100}
                                ticks = {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                                ticks_labels = {["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50"]}
                                ticks_snap_bounds = { 0 }
                            />
                        </Col>
                        <Col sm={4} style={{padding:15, display: "flex", justifyContent:"space-between"}}>
                            <Select
                                name="customer"
                                options={customer}
                                className="select-customer-dashboard"
                                placeholder={trls('Select_Customer')}
                                onChange={val => this.getCustomerCoordinatesById(val)}
                            />
                            <Button variant="outline-success" style={{height:55, width:55, paddingTop:-10, color: '#F90404', fontSize:25}} onClick={this.getLocationIpPosition}><i className="fas fa-sync-alt"></i></Button>
                        </Col>
                    </Row>  
                    <Map
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyA34nBk3rPJKXaNQaSX4YiLFoabX3DhkXs&language=${map_lang}`}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `75%`, marginTop:`20px` }} />}
                        center={this.state.center}
                        mapElement={<div style={{ height: `100%` }} />}
                        markers={this.state.user_marker}
                        onMarkerClick={(val)=>this.handleMarkerClick(val)}
                        onMarkerClose={(val)=>this.handleMarkerClose(val)}
                    /> 
                </Col>    
            </Container>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);