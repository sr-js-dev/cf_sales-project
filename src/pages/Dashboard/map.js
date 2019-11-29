import React from 'react'
import { trls } from '../../components/translate';
import { connect } from 'react-redux';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
  } from "react-google-maps";

const formatNumber = (num) =>{
    if(num){
        var value = num.toFixed(2);
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }else{
        return "0.00" 
    }
}
const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});
class MapTest extends React.Component {
    Map = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          defaultZoom={12}
          center={props.center}
          onClick={props.onClick}
        >
          {props.children}
        </GoogleMap>
      ))
    );
  
    render() {
      return <this.Map {...this.props} onClick={this.onMapClick}>
          <Marker  position={this.props.center} icon={{
                    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                    scale: 2.5,
                    fillColor: '#0526D0',
                    strokeColor: '#0526D0',
                    fillOpacity: 0.5,
                    strokeOpacity: 1,
                }}></Marker>
          {this.props.markers && this.props.markers.map((marker, index) => (
              
                <Marker key={index}  position={{ lat: marker.LAT, lng: marker.LONG }} onClick={(e) => this.props.onMarkerClick(marker)}>
                    {
                        marker.showInfo && (
                            <InfoWindow onCloseClick={(e) => this.props.onMarkerClose(marker)}>
                                <div>
                                    <div className="markinfo-header-text">
                                        {marker.Klantnaam}
                                    </div>
                                    <div className="markinfo-year-text">
                                        {trls("Turnover_current_year")}<span>: {formatNumber(marker.currentYear)}</span>
                                    </div>
                                    <div className="markinfo-year-text">
                                        {trls("Turnover_last_year")}<span>: {formatNumber(marker.lastYear)}</span>
                                    </div>
                                </div>
                                
                            </InfoWindow>
                    )}
                </Marker>
            ))}
      </this.Map>;
    }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(MapTest);