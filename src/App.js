import React, { useState, useEffect } from "react";
import './App.css';
import MapView from "./MapView/MapView";

function App() {

  // Set Coordinations
  const [coords, setCorrds] = useState({ latitude: "", longitude: "" });
  const [display_name, setName] = useState("");

  // Load current position
  useEffect(() => {
    console.log("Get Current Position");
    navigator.geolocation.getCurrentPosition(
      getCurrentCityName,
      error,
      options
    );
  }, []);

  // Get current location when the app loads for the first time
  function getCurrentCityName(position) {
    setCorrds({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

    let url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2" +
      "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;

    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "https://o2cj2q.csb.app"
      }
    })
      .then((response) => response.json())
      .then((data) => setName(data.display_name));
  }

  // Handle Errors
  function error(err) {
    if (
      err.code === 1 || //if user denied accessing the location
      err.code === 2 || //for any internal errors
      err.code === 3 //error due to timeout
    ) {
      alert(err.message);
    } else {
      alert(err);
    }
  }

  // Geolocalisation Options
  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
  };

  console.log("Render App");

  return (
    <div className="App">
      <MapView coords={coords} dispaly_name={display_name} />
    </div>
  );

}

export default App;
