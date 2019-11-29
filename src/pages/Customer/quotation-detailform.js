import React, {Component} from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({

});
class Qutatedetailform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            orderDetails:[]
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {
    }
    getCurtomerQuoteDetails = (value) => {
        this._isMounted = true;
        let params = {
            number : value
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerQuoteDetails, params, headers)
        .then(result => {
            if(this._isMounted){
                this.props.detailmode();
                this.setState({quoteDetails: result.data.Items})
            }
        });
    }
    componentDidUpdate(){
        if(this.props.number){
            this.getCurtomerQuoteDetails(this.props.number)
        }
    }
    render(){   
        let quoteDetails=this.state.quoteDetails;
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Quote_detail')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table className="place-and-orders__table table table--striped prurprice-dataTable"  >
                        <thead>
                        <tr>
                            <th>{trls('Id')}</th>
                            <th>{trls('Item')}</th>
                            <th>{trls('Color')}</th>
                            <th>{trls('Price')}</th>
                            <th>{trls('Unit')}</th>
                            <th>{trls('Discount')}</th>
                            <th>{trls('CustomerItemNumber')}</th>
                            <th>{trls('Number')}</th>
                        </tr>
                        </thead>
                        {quoteDetails &&(<tbody >
                            {
                                quoteDetails.map((data,i) =>(
                                <tr id={i} key={i}>
                                    <td>{data.Id}</td>
                                    <td>{data.Item}</td>
                                    <td>{data.Color}</td>
                                    <td>{data.Price}</td>
                                    <td>{data.Unit}</td>
                                    <td>{data.Discount}</td>
                                    <td>{data.CustomerItemNumber}</td>
                                    <td>{data.Number}</td>
                                </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                </div>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Qutatedetailform);