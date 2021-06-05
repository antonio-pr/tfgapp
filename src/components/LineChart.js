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
            // console.log("newChart",newChartInstance.data);
        }
        // updateDataset(0, [1, 2, 3, 4, 5, 6])
    }, [chartContainer]);

    useEffect(() => {
        if(chartInstance != null) {
            console.log("props.state.labels[props.state.pos]", props.state.labels[props.state.pos])
            console.log("props.state.datasets[props.state.pos]",props.state.datasets[props.state.pos])

            // chartInstance.data.labels = props.state.labels[props.state.pos].slice(0,props.size)
            chartInstance.data.labels = props.state.labels[props.state.pos].length <= props.size ? props.state.labels[props.state.pos].slice() : props.state.labels[props.state.pos].slice(props.state.labels[props.state.pos].length - props.size, props.state.labels[props.state.pos].length)

            // chartInstance.data.datasets[0].data = props.state.datasets[props.state.pos].data.slice(0,props.size)
            chartInstance.data.datasets[0].data = props.state.datasets[props.state.pos].data.length <= props.size ? props.state.datasets[props.state.pos].data.slice() : props.state.datasets[props.state.pos].data.slice(props.state.datasets[props.state.pos].data.length - props.size, props.state.datasets[props.state.pos].data.length)

            chartInstance.data.datasets[0].label = props.state.datasets[props.state.pos].label[1]
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