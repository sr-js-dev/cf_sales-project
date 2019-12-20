import React, {Component} from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../components/translate';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Taskhistory extends Component {
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

        let viewHistoryData = [];
        if(this.props.viewHistoryData){
            viewHistoryData   = this.props.viewHistoryData
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
                    {trls('Documents')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive credit-history">
                    <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('PreviousEmployee')}</th>
                                <th>{trls('NewEmployee')}</th>
                                <th>{trls('ChangeDate')}</th>
                            </tr>
                        </thead>
                        {viewHistoryData && (<tbody >
                            {
                                viewHistoryData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.PreviousEmployee}</td>
                                        <td>{data.NewEmployee}</td>
                                        <td>{data.ChangedDate}</td>
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
export default connect(mapStateToProps, mapDispatchToProps)(Taskhistory);