import React, { useState, useEffect, useRef } from 'react';
import LineChart from './components/LineChart'
import './App.css';
import mqtt from 'mqtt';
import 'fontsource-roboto'
//import Button from '@material-ui/core/Button'
import { Select, Button, InputLabel, MenuItem, Grid, TextField } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import {} from '@material-ui/core/colors/'


function App() {

    const [data, setData] = useState({
        lvl: null,
        sensor: "",
        date: []
    });

    const [chartData, setChartData] = useState({
        pos: null,
        labels: [[]],
        datasets: [
            {
                label: [""],
                data: [],
                backgroundColor: [
                'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 2,
            }
        ]
    })

    const client = useRef(null);

    const [select, setSelect] = useState("10");
    const [frequency, setFrequency] = useState(1);
    const [size, setSize] = useState(10);
    const [threshold, setThreshold] = useState(800);
    const [name, setName] = useState("");

    const datasets_structure = (label, data,n_name) => {
        return({
            label: [label,"sensor" + n_name,toString()],
            data: data,
            backgroundColor: [
            'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
            'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 2,
        })
    }

    const update_dataset = (data,newValue) => {
        var data_aux = data.slice();
        if(data.length < 200) {
            data_aux.push(newValue);
        }
        else {
            for (var i = 0; i < 199; i++) {
                data_aux[i] = data_aux[i+1];
            }
            data_aux[199] = newValue;
        }
        return data_aux
    }

    const build_data = (lvl, label, date) => {
        let data_aux = {
            ...chartData
        }
        // console.log("data_aux:", data_aux)

        if(chartData.datasets[0].label[0] === "") {
            data_aux.pos = 0
            data_aux.datasets[0].label = [label, "sensor1"];
            data_aux.datasets[0].data = [lvl];
            data_aux.labels = [[date]];
            console.log("data_aux: ", data_aux)
        }
        else{
            var pos = null;
            for(var i=0; i<chartData.datasets.length; i++) {
                if(chartData.datasets[i].label[0] === label) {
                    pos = i;
                }
            }

            //pos = chartData.datasets.indexOf(sensor);
            if (pos == null){
                data_aux.datasets.push(datasets_structure(label,[lvl],data_aux.datasets.length+1));
                data_aux.labels.push([date])
            }
            else{
                let data_returned = update_dataset(data_aux.datasets[pos].data,lvl)
                data_aux.datasets[pos] = datasets_structure(label,data_returned,pos+1)
                data_aux.labels[pos] = update_dataset(data_aux.labels[pos],date);
                console.log("print data_aux:", data_aux)
            }
        }

        return data_aux
    }

    const procedure = (client) => {

        client.on("connect", () => {
        console.log("Connected");
        client.subscribe("/tfg/react/chart/co2/#");
        });

        client.on("message", (topic, message) => {
            // console.log("topic on message:", topic)
            let regex = /([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})/g;

            let label_aux = topic.match(regex);

            if(label_aux) {
                label_aux = label_aux[0]
                let lvl_aux = JSON.parse(message.toString())["co2"];
                var hoy = new Date();
                var h = hoy.getHours().toString();
                var m = hoy.getMinutes().toString();
                var s = hoy.getSeconds().toString();
                var date_aux = h.concat(":",m,":",s);
                
                // console.log("regex:", label_aux)

                if(lvl_aux > 390 && lvl_aux < 3000){
                    setChartData(build_data(lvl_aux,label_aux, date_aux))

                    setData((prev) => ({
                        ...prev, 
                        lvl: lvl_aux,
                        sensor: label_aux,
                        date: date_aux
                    }));
                }
            }
            
            
        });
    }

    useEffect(() => {
        client.current = mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt')
        procedure(client.current) 

        return () => client.current.end();
    },[procedure]);

    // useEffect(() => {
    //     console.log("useEffect_Data", chartData);

    // },[chartData]);


    const onButtonClick = (sensor) => {
        console.log("label",sensor)
        var pos = null;
        for(var i=0; i<chartData.datasets.length; i++) {
            if(chartData.datasets[i].label === sensor) {
                pos = i;
            }
        }

        setChartData((prev) => ({
            ...prev,
            pos: pos
        }));
    };

    const changeFrequency = (e) => {
        setFrequency(Number(e.target.value))
        client.current.publish("/tfg/react/chart/sensor1/change",JSON.stringify({ freq: Number(e.target.value)}));
    }

    const onThreshold = (station) => {
        if(select=="10"){
            if(station.data[station.data.length-1] > threshold)
                return "secondary"
            else
                return "primary"
        }
    }

    //Function to change the name of the sensor in the app
    const changeName = () => {
        let data_aux = {
            ...chartData
        }

        data_aux.datasets[chartData.pos].label[1] = name;

        setChartData(data_aux);
    }

    return (
        <div className="App">
            <Grid container xs={12}>
                <Grid container xs={8} className="Buttons">
                    {chartData.datasets.map(station => 
                        <div className="ButtonsFormat">
                            <div className="marginButton">
                                <Button 
                                variant="contained" 
                                color= {onThreshold(station)}
                                key={station.label}
                                onClick={() => onButtonClick(station.label)}>
                                        {station.label[1]}: {station.data[station.data.length-1]}
                                </Button>
                            </div>
                        </div>
                        )}
                </Grid>

                <Grid container xs={1} direction="column" className="select">
                    <InputLabel id="label">Select threshold</InputLabel>
                    <Select labelId="label" id="select" value={select} onChange={e => setSelect(e.target.value)}>
                        <MenuItem value="10">Threshold</MenuItem>
                        <MenuItem value="20">Formula</MenuItem>
                    </Select>
                
                    <InputLabel id="label1">Last measures</InputLabel>
                    <Select labelId="label1" id="select" value={size.toString()}  onChange={e => setSize(Number(e.target.value))}>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="20">20</MenuItem>
                        <MenuItem value="50">50</MenuItem>
                        <MenuItem value="100">100</MenuItem>
                        <MenuItem value="200">200</MenuItem>
                    </Select>

                    <InputLabel id="label2">Sensor frequency</InputLabel>
                    <Select labelId="label2" id="select" value={frequency.toString()}  onChange={e => changeFrequency(e)}>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="20">20</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                    </Select>

                    <TextField id="standard-basic" label="Name"  onChange={e => setName(e.target.value)}/>
                    <div className = "okButton">
                        <Button variant="contained" onClick = {() => changeName()}>OK</Button>
                    </div>
                </Grid>
                
                <Grid container xs={1} direction="row" className="textField">
                    {select === "20" &&  
                    <div>
                        <TextField id="standard-basic" label="Area"  onChange={e => console.log()}/>
                        <TextField id="standard-basic" label="People" />
                    </div>}
                    {select === "10" &&  <TextField id="standard-basic" label="Threshold" onChange={e => setThreshold(Number(e.target.value))}/>}
                </Grid>

            </Grid>
                
            <header className="App-header">
                <LineChart state={chartData} size={size} /> 
            </header>
        </div>
    );
}

export default App;
