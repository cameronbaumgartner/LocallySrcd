import APIKey from '../secrets.js'

// 'AIzaSyCDy4afmx8jFL41P2ARsimuul3fk_VdSZk'
import React from 'react'
import GoogleMapReact from 'google-map-react'
import '../stylesheet/map.scss'
import marker from '../assets/marker-icon.png';
import { Icon } from '@iconify/react'

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={marker} className="pin-icon" />
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
      </GoogleMapReact>
    </div>
  </div>
)

export default Map;