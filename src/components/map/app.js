import * as React from 'react';
import {useState, useEffect} from 'react';
import { List, ListItem } from '@material-ui/core';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Paper } from '@material-ui/core';
import {Helmet} from 'react-helmet';
import Button from '@material-ui/core/button';
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl';

import ControlPanel from './control-panel';
import Pins from './pins';
import CityInfo from './city-info';

import CITIES from './cities.json';

const TOKEN = 'pk.eyJ1IjoiaG93aWxvdmV0aGVlYXJ0aCIsImEiOiJja2xtaWJmNHkwOWJxMndtMjk1dmFicWpmIn0.2ThiqLcsMOshiqFxxbHtsg'; // Set your mapbox token here

const geolocateStyle = {
  top: 0,
  left: 0,
  padding: '10px'
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: '10px'
};

const navStyle = {
  top: 72,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: '10px'
};

const initialViewport = {
  latitude: 40,
  longitude: -100,
  zoom: 3.5,
  bearing: 0,
  pitch: 0
}

export default function App() {
  const [viewport, setViewport] = useState(initialViewport);
  const [popupInfo, setPopupInfo] = useState(null);
  const [sortedCities, setSortedCities] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const updateDimensions = () => {
    setIsDesktop(window.innerWidth >= 800);
  }

  const shouldShowMap = isDesktop || showMap;
  const shouldShowList = isDesktop || !showMap;

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [])

  useEffect(() => {
    setSortedCities(CITIES.sort((cityA, cityB) => {
      let nameA = cityA.city.toUpperCase(); // ignore upper and lowercase
      let nameB = cityB.city.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;

    }))
  }, [])

  return (
      <>
        <Helmet>
          <link
              rel="stylesheet"
              href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css"
              crossorigin=""
          />
        </Helmet>
        <h4>
          Want to broadcast an action targeting some bank in your area? Please email <a href={"mailto:howilovetheearth@gmail.com"}>howilovetheearth@gmail.com</a> with details.
        </h4>
        {isDesktop? undefined:
            <Button
                variant="outlined"
                onClick={() => {setShowMap(!showMap)}}
            >
              {!showMap? "Show Map" : "Hide Map"}
            </Button>  }
        <div className={"test"}>
          {shouldShowList?
              <Paper className="city-list" style={{maxHeight: 500, overflow: 'auto'}}>
                <List component="nav">
                  {sortedCities.map((city, index) => {
                    return (
                        <ListItem
                            key={`${city.city}-index`}
                            button
                            onClick={() => {
                              setPopupInfo(city);
                              setViewport(initialViewport);
                            }}
                        >
                          <div>
                            <h4>Add Your Event Here</h4>
                            <div>
                              Add your place here.
                            </div>
                            <div>
                              {city.city}
                            </div>
                            <div>
                              <a href={"https://google.com"} target={"_blank"}>Take Action</a>
                            </div>
                          </div>
                        </ListItem>
                    )
                  })
                  }
                </List>
              </Paper>: undefined}
          {shouldShowMap?
              <div
                  className="mapgl"
              >
                <MapGL
                    {...viewport}
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    onViewportChange={setViewport}
                    mapboxApiAccessToken={TOKEN}
                >
                  <Pins data={CITIES} onClick={setPopupInfo} />

                  {popupInfo && (
                      <Popup
                          tipSize={5}
                          anchor="top"
                          longitude={popupInfo.longitude}
                          latitude={popupInfo.latitude}
                          closeOnClick={false}
                          onClose={setPopupInfo}
                      >
                        <CityInfo info={popupInfo} />
                      </Popup>
                  )}

                  <GeolocateControl style={geolocateStyle} />
                  <FullscreenControl style={fullscreenControlStyle} />
                  <NavigationControl style={navStyle} />
                  <ScaleControl style={scaleControlStyle} />
                </MapGL>
              </div>: undefined}
        </div>
      </>
  );
}
// export function renderToDom(container) {
//   render(<App />, container);
// }
