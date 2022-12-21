import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

interface PerformanceType {
  vl_value: string | null,
  an_value: string | null,
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

export const options = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
};


export const PerformanceChart = ({dataset}: PerformanceChartProps) => {

    const [data, setData] = useState({labels: [] as any, datasets: [] as any});

    useEffect(() => { 
      if (dataset) {

        setData({
          labels: dataset.map((x: any) => new Date(x.date).toLocaleDateString("en-US")),
          datasets: [
            {
              label: 'VL Value',
              data: dataset.map((x: any) => x.vl_value),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              yAxisID: 'y',
            },
            {
              label: 'AN Value',
              data: dataset.map((x: any) => x.an_value),
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