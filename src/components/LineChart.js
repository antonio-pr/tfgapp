import React, { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const chartConfig = {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6],
        datasets: [
            {
                label: "sensor1",
                data: [1,2,3,4,5,6],
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

    // useEffect(() => {
    //     console.log("state", props.state);
    // }, [props.state]);

    const updateDataset = (datasetIndex, newData) => {
        console.log("data: ", chartInstance.data.datasets[0].data)
        chartInstance.data.datasets[datasetIndex].data[5] = chartInstance.data.datasets[datasetIndex].data[5] + 1;
        chartInstance.update();
    };

    const onButtonClick = () => {
        const data = [1,2,3,4,5,6];
        updateDataset(0, data);
      };
//<button onClick={}>Randomize!</button>
    return (
        <div>
            <canvas ref={chartContainer} width={700} height={400}/>
            <button onClick={onButtonClick}>Randomize!</button>
        </div>
    );
};


export default LineChart;