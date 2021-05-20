import React, { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const chartConfig = {
    type: 'line',
    data: {
        labels: [],
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
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                beginAtZero: true
                }
            }]
        }
    }
};

const colorConfig = [
    {
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)'
    },
    {
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)'
    },
    {
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)'
    },
    {
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)'
    }      
]

const LineChart = (props) => {
    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        if(chartContainer && chartContainer.current) {
            const newChartInstance = new Chart(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
            console.log("newChart",newChartInstance.data);
        }
        // updateDataset(0, [1, 2, 3, 4, 5, 6])
    }, [chartContainer]);

    // const datasets_structure = (label, data) => {
    //     return({
    //         label: label,
    //         data: data,
    //         backgroundColor: [
    //         'rgba(75, 192, 192, 0.2)'
    //         ],
    //         borderColor: [
    //         'rgba(75, 192, 192, 1)'
    //         ],
    //         borderWidth: 2,
    //     })
    // }

    // const update_dataset = (data,newValue,label) => {
    //     var data_aux = data.slice();
    //     if(data.length < 10) {
    //         data_aux.push(newValue);
    //     }
    //     else {
    //         for (var i = 0; i < 9; i++) {
    //             data_aux[i] = data_aux[i+1];
    //         }
    //         data_aux[9] = newValue;
    //     }
    //     return datasets_structure(label,data_aux)
    // }

    useEffect(() => {
        // const update_data = (state) => {
        //     if(chartInstance.data.datasets[0].label === "") {
        //         console.log("first message comming")
        //         chartInstance.data.datasets[0].label = state.sensor;
        //         chartInstance.data.datasets[0].data = [state.lvl];
        //         //chartInstance.data.labels = [state.date];
        //     }else{
        //         var pos = null;
        //         for(var i=0; i<chartInstance.data.datasets.length; i++) {
        //             console.log("bucle ", chartInstance.data.datasets[i].label)
        //             if(chartInstance.data.datasets[i].label === state.sensor){
        //                 console.log("Posicion sensor:",state.sensor, i)
        //                 pos = i;
        //             }
        //         }

        //         if(pos == null) {
        //             chartInstance.data.datasets.push(datasets_structure(state.sensor, [state.lvl]))
        //             console.log("pos == null: ");
        //         }
        //         else {
        //             //console.log("actualizarrrr",chartInstance.data.datasets[pos])
        //             chartInstance.data.datasets[pos] = update_dataset(chartInstance.data.datasets[pos].data.slice(), state.lvl,state.sensor)
        //         }
        //         console.log("chartInstance ", chartInstance.data);
        //     }
        //     // chartInstance.data.labels = state.date;
        //     // chartInstance.options.scales.yAxes.beginAtZero = true;
        //     chartInstance.update();
        // }

        //console.log("state", props.state);
        
        if(chartInstance != null) {
            console.log("props.state.labels[props.state.pos]", props.state.labels[props.state.pos])
            console.log("props.state.datasets[props.state.pos]",props.state.datasets[props.state.pos])
            chartInstance.data.labels = props.state.labels[props.state.pos]
            chartInstance.data.datasets[0].data = props.state.datasets[props.state.pos].data
            chartInstance.data.datasets[0].label = props.state.datasets[props.state.pos].label
            chartInstance.data.datasets[0].backgroundColor = colorConfig[props.state.pos].backgroundColor
            chartInstance.data.datasets[0].borderColor = colorConfig[props.state.pos].borderColor
            chartInstance.options.scales.yAxes.beginAtZero = true
            chartInstance.update()
        }
    }, [props.state]);

//<button onClick={}>Randomize!</button>
    return (
        <div>
            <canvas ref={chartContainer} width={700} height={400}/>
        </div>
    );
};

export default LineChart;