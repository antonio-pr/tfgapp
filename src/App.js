import React, { useState, useEffect, useRef } from 'react';
import LineChart from './components/LineChart'
import './App.css';
import mqtt from 'mqtt';

function App() {
  const [state, setState] = useState({});
  const client = useRef(null);

  useEffect(() => {
    client.current = mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt')
  },[]);

  useEffect(() => {
    const handleJsonMessage = (json,sensor_name) => {
      setState({
        lvl: json["co2"],
        sensor: sensor_name
      });
      console.log(state)
    }

    client.current.on("connect", () => {
      console.log("Connected");
      client.current.subscribe("/tfg/react/chart/co2/#");
    });

    client.current.on("message", (topic, message) => {
        let regex = /(sensor\d+)/g;
        let coincidence = topic.match(regex);

        // handleJsonMessage(JSON.parse(message.toString()),coincidence[0]);

        setState({
          lvl: JSON.parse(message.toString())["co2"],
          sensor: coincidence[0]
        });
        console.log(state)
    });
  },[state]);

  //<LineChart state={state} /> 
  return (
    <div className="App">
      <header className="App-header">

      </header>
    </div>
  );
}

export default App;
