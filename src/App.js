import React, { useState, useEffect, useRef } from 'react';
import LineChart from './components/LineChart'
import './App.css';
import mqtt from 'mqtt';
import 'fontsource-roboto'
import Button from '@material-ui/core/Button'
import { makeStyles } from "@material-ui/core/styles";
import {} from '@material-ui/core/colors/'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.success.main
  }
}));

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
                label: "",
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

    const datasets_structure = (label, data) => {
        return({
            label: label,
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
        if(data.length < 10) {
            data_aux.push(newValue);
        }
        else {
            for (var i = 0; i < 9; i++) {
                data_aux[i] = data_aux[i+1];
            }
            data_aux[9] = newValue;
        }
        return data_aux
    }

    const build_data = (lvl, sensor, date) => {
        let data_aux = {
            ...chartData
        }
        // console.log("data_aux:", data_aux)

        if(chartData.datasets[0].label === "") {
            data_aux.pos = 0
            data_aux.datasets[0].label = sensor;
            data_aux.datasets[0].data = [lvl];
            data_aux.labels = [[date]];
            console.log("data_aux: ", data_aux)
        }
        else{
            var pos = null;
            for(var i=0; i<chartData.datasets.length; i++) {
                //console.log("bucle: ", chartData.datasets[i].label)
                if(chartData.datasets[i].label === sensor) {
                    pos = i;
                }
            }

            //pos = chartData.datasets.indexOf(sensor);

            if (pos == null){
                data_aux.pos = data_aux.labels.length
                data_aux.datasets.push(datasets_structure(sensor,[lvl]));
                data_aux.labels.push([date])
            }
            else{
                let data_returned = update_dataset(data_aux.datasets[pos].data,lvl)
                data_aux.pos = pos
                data_aux.datasets[pos] = datasets_structure(sensor,data_returned)
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
            console.log("on message");
            let regex = /(sensor\d+)/g;
            let sensor_aux = topic.match(regex)[0];
            let lvl_aux = JSON.parse(message.toString())["co2"];
            var hoy = new Date();
            var h = hoy.getHours().toString();
            var m = hoy.getMinutes().toString();
            var s = hoy.getSeconds().toString();
            var date_aux = h.concat(":",m,":",s);
            // console.log("hoy:", hoy);

            // let data_aux = {
            //     ...chartData
            // }
    
            // console.log("data_aux:", data_aux)
            
            setChartData(build_data(lvl_aux,sensor_aux, date_aux))

            setData((prev) => ({
                ...prev, 
                lvl: lvl_aux,
                sensor: sensor_aux,
                date: date_aux
            }));

            
        });
    }

    useEffect(() => {
        client.current = mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt')
        procedure(client.current) 

        return () => client.current.end();
    },[procedure]);

    useEffect(() => {
        console.log("useEffect_Data", chartData);

    },[chartData]);

/* <LineChart state={chartData} />  */
// {test_array.map(station => <button key={station}> {station} </button>)}
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
    const value = 99
    const classes = useStyles();
 
    return (
        <div className="App">
            {chartData.datasets.map(station => 
            <Button 
            //classes = {{ root: classes.root}}
            variant="contained" 
            color= "primary"
            className={station.label}
            key={station.label} 
            onClick={() => onButtonClick(station.label)}>
                    {station.label}: {data.lvl}
            </Button>)}

            <header className="App-header">
                <LineChart state={chartData} /> 
            </header>
        </div>
    );
}

export default App;
