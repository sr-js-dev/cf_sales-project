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

class Taskdocument extends Component {
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
        let documentData = [];
        let documentHeader = [];
        if(this.props.documentData){
            documentData   = this.props.documentData
        }
        if(this.props.documentHeader){
            documentHeader   = this.props.documentHeader
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
                    {trls('Task')} {trls('Documents')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="modal-header-doc">
                    <Col sm={4} style={{textAlign:"center"}}>
                        <div style={{color: "#0D12EE", fontWeight:"bold"}}>{trls('CustomerName')}:</div> 
                        {documentHeader[1]!=="null"&&(
                        <p style={{paddingTop:"10px"}}>{documentHeader[1]}</p>
                        )}
                    </Col>
                    <Col sm={4} style={{textAlign:"center"}}>
                        <div style={{color: "#0D12EE", fontWeight:"bold"}}>{trls('Employee')}:</div> 
                        {documentHeader[2]!=="null"&&(
                        <p style={{paddingTop:"10px"}}>{documentHeader[2]}</p>
                        )}
                    </Col >
                    <Col sm={4} style={{textAlign:"center"}}>
                        <div style={{color: "#0D12EE", fontWeight:"bold"}}>{trls('Subject')}:</div> 
                        {documentHeader[3]!=="null"&&(
                        <p style={{paddingTop:"10px"}}>{documentHeader[3]}</p>
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
export default connect(mapStateToProps, mapDispatchToProps)(Taskdocument);