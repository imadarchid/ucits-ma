import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
  } from 'chart.js';

import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

interface PerformanceType {
  vl_value: number | null,
  an_value: number | null,
  date: string
}

interface PerformanceChartProps {
  dataset?: PerformanceType[]
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options:ChartOptions<'line'> = {
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
};


export const PerformanceChart = ({dataset}: PerformanceChartProps) => {

    const [data, setData] = useState({labels: [], datasets: []} as ChartData<'line'>);

    useEffect(() => { 
      if (dataset) {

        setData({
          labels: dataset.map((label) => new Date(label.date).toLocaleDateString("en-US")),
          datasets: [
            {
              label: 'VL Value',
              data: dataset.map((perf) => perf.vl_value),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              yAxisID: 'y',
            },
            {
              label: 'AN Value',
              data: dataset.map((perf) => perf.an_value),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              yAxisID: 'y1',
            },
          ],
        })

      }
    }, [dataset])

    return (
      <div className='flex max-w-2xl justify-center'>
        <Line options={options} data={data} ></Line>
      </div>
    )
}