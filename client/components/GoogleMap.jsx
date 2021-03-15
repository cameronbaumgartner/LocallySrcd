import {APIKey} from '../../server/secrets.js'
import React from 'react'
import GoogleMapReact from 'google-map-react'
import '../stylesheet/map.scss'
import marker from '../assets/thickpin.png';
import { Icon } from '@iconify/react'

const locationArray = [];

const mapToMap = (resArray) => {
  for(let i = 0; i < resArray.length; i ++){
    // console.log('in map to map:',resArray[i]);
    locationArray.push(
      <LocationPin
        lat={resArray[i].lat}
        lng={resArray[i].lng}
        text={resArray[i].address}
      />
    )
  }
}

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={<img src='./assets/thickpin.png'/>} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
)

const Map = ({ location, zoomLevel }) => (
  <div className = "map">
    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: APIKey }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
      <LocationPin
        lat={location.lat}
        lng={location.lng}
        text={location.address}
      />
      {locationArray}
      </GoogleMapReact>
    </div>
  </div>
)

export { Map, mapToMap };