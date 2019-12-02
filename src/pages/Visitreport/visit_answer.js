import React, {Component} from 'react'
import { Modal, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../components/translate';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Visitanswer extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
    }

    componentDidUpdate(){

    }

    render(){
        let viewHeader = [];
        let viewLine = [];
        if(this.props.viewHeader){
            viewHeader   = this.props.viewHeader[0]
        }
        if(this.props.viewLine){
            viewLine   = this.props.viewLine
        }

        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Answer_visit_report')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={4} style={{textAlign:"center"}}>
                        <div style={{color: "#0D12EE", fontWeight:"bold"}}>{trls('Visit_Date')}:</div> 
                        {viewHeader&&(
                        <p style={{paddingTop:"10px"}}>{viewHeader.VisitDate}</p>
                        )}
                    </Col>
                    <Col sm={4} style={{textAlign:"center"}}>
                        <div style={{color: "#0D12EE", fontWeight:"bold"}}>{trls('Customer')}:</div> 
                        {viewHeader&&(
                        <p style={{paddingTop:"10px"}}>{viewHeader.Customer}</p>
                        )}
                    </Col >
                    <Col sm={4} style={{textAlign:"center"}}>
                        <div style={{color: "#0D12EE", fontWeight:"bold"}}>{trls('CreatedBy')}:</div> 
                        {viewHeader&&(
                        <p style={{paddingTop:"10px"}}>{viewHeader.CreatedBy}</p>
                        )}
                    </Col>
                </Row> 
                <div style={{fontSize:16, fontWeight:"bold", paddingTop:20, paddingBottom:20}}>{trls('Add_VisitReport')}</div>
                <div className="table-responsive purchase-order-table">
                    <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>{trls('Question')}</th>
                                <th>{trls('Answer')}</th>
                            </tr>
                        </thead>
                        {viewLine && (<tbody >
                            {
                                viewLine.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{i+1}</td>
                                        <td>{data.question}</td>
                                        <td>{data.answer}</td>
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
export default connect(mapStateToProps, mapDispatchToProps)(Visitanswer);