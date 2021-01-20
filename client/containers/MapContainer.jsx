import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import GoogleMapReact from  'google-map-react';
import APIKey from '../secrets.js';
import CurrentLocation from '../components/Map.jsx'

//NOT CURRENTLY IN DOM, I'VE JUST LEFT IT IN FOR MY OWN REFERENCE


export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,  // Hides or shows the InfoWindow
    activeMarker: {},          // Shows the active marker upon click
    selectedPlace: {} 
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render(){
    return (
      <div id="mapBox">
        <CurrentLocation
          centerAroundCurrentLocation
          google={this.props.google}
        >
          <Marker
            onClick={this.onMarkerClick}
            name={'Current Location'}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selectedPlace.name}</h4>
            </div>
          </InfoWindow>
        </CurrentLocation>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: APIKey
})(MapContainer);


// API key: AIzaSyCDy4afmx8jFL41P2ARsimuul3fk_VdSZk