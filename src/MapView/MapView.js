import React, { useEffect, useRef, useState } from "react";

// Open Layer
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";

// Styles
import "./mapView.css"
import { Icon, Style } from "ol/style";

const MapView = ({ coords, display_name }) => {

  console.log("Init Mapview with : " + coords.longitude + " , " + coords.latitude);

  // Place Icon
  const placeIcon = `${process.env.PUBLIC_URL}/icons/placeIcon.png`;

  // set intial state - used to track references to OpenLayers 
  const [map, setMap] = useState(null);

  // get ref to div element - OpenLayers will render into this div
  const mapRef = useRef();
  mapRef.current = map;

  // Init Map with Tiles only if Empty
  useEffect(() => {
    if (!map) {

      // Init Tile Layer
      const tileLayer = new TileLayer({
        source: new XYZ({
          // url: 'http://localhost:8091/tile/{z}/{x}/{y}.png' 
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        })
      });

      // Init View
      const initialView = new View({
        center: fromLonLat([0, 0]),
        zoom: 5
      });

      // Create Map
      const initialMap = new Map({
        target: mapRef.current,
        layers: [ tileLayer ],
        view: initialView,
      });

      // save map and vector layer references to state
      setMap(initialMap);
    }
  }, []);

  // Update map if user changes geo location
  useEffect(() => {
    if (map != null && coords.longitude && coords.latitude) {

      // Set map new view
      map.setView(
        new View({
          center: fromLonLat([coords.longitude, coords.latitude]),
          zoom: 19,
        })
      );

      // Add new Point
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat([coords.longitude, coords.latitude])),
      });
    
      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: placeIcon,
          height: 25,
          width: 25
        })
      });
    
      iconFeature.setStyle([iconStyle]);
    
      const vectorSource = new VectorSource({
        features: [iconFeature],
      });
    
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      // Add Vector layer to Map
      map.addLayer(vectorLayer);
    }
  }, [coords]);

  return (
    <div ref={mapRef} className="map-container" />
  );
}

export default MapView;

