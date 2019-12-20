import React, {Component} from 'react'
import { Modal, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import API from '../../components/api'

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Visitdocument extends Component {
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
    downlaodDocumant = (event) => {

        window.open(API.DownLoadTaskFile+event.currentTarget.id, '_blank');
    }
    render(){
        let viewHeader = [];
        let documentData = [];
        if(this.props.viewHeader){
            viewHeader   = this.props.viewHeader[0]
        }
        if(this.props.documentData){
            documentData   = this.props.documentData
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
                    {trls('Visit_report')} {trls('Documents')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                 <Row className="modal-header-doc">
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
                <div className="table-responsive credit-history">
                    <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Id')}</th>
                                <th>{trls('DocumentId')}</th>
                            </tr>
                        </thead>
                        {documentData && (<tbody >
                            {
                                documentData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{i+1}</td>
                                        <td>
                                            <div id={data.DocumentId} style={{color:"#069AF8", fontWeight:"bold", cursor: "pointer", textDecoration:"underline"}} onClick={this.downlaodDocumant}>{data.DocumentId}</div>
                                        </td>
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
export default connect(mapStateToProps, mapDispatchToProps)(Visitdocument);