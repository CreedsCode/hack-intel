import 'chart.js/auto';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { PivotConfig, ResultSet } from '@cubejs-client/core';
import { type ChartType } from './types';

interface ChartViewerProps {
  resultSet: ResultSet;
  pivotConfig: PivotConfig;
  chartType: ChartType;
  title?: string;
  subtitle?: string;
  xLabel?: string;
  yLabel?: string;
  height?: string;
  className?: string;
  legendLabelMap?: Record<string, string>;
  legendLabels?: string[];
}

export function ChartViewer(props: ChartViewerProps) {
  const {
    resultSet,
    pivotConfig,
    chartType,
    title,
    subtitle,
    xLabel,
    yLabel,
    height,
    className = '',
    legendLabelMap = {},
    legendLabels,
  } = props;

  const formatLabel = (label: string) => {
    const date = Date.parse(label);
    if (!isNaN(date)) {
      return new Date(label).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    }
    return label;
  };

  const data = {
    labels: resultSet.chartPivot(pivotConfig).map((row) => formatLabel(row.x)),
    datasets: resultSet.series(pivotConfig).map((item, idx) => {
      let legendLabel = item.title;
      if (legendLabels && legendLabels[idx]) {
        legendLabel = legendLabels[idx];
      } else if (legendLabelMap[item.title]) {
        legendLabel = legendLabelMap[item.title];
      }
      
      const colors = [
        'rgba(99, 102, 241, 0.8)', // indigo-500
        'rgba(34, 197, 94, 0.8)',  // green-500
        'rgba(59, 130, 246, 0.8)', // blue-500
        'rgba(168, 85, 247, 0.8)',  // purple-500
      ];

      return {
        fill: chartType === 'area',
        label: legendLabel,
        data: item.series.map(({ value }) => value),
        backgroundColor: colors[idx % colors.length],
        borderColor: colors[idx % colors.length].replace('0.8', '1'),
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          color: '#D1D5DB', // gray-300
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
            weight: 500 as const,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937', // gray-800
        titleColor: '#F3F4F6', // gray-100
        bodyColor: '#D1D5DB', // gray-300
        borderColor: '#374151', // gray-700
        borderWidth: 1,
        padding: 12,
        titleFont: { 
          family: 'Inter, system-ui, sans-serif',
          weight: 600 as const,
          size: 13
        },
        bodyFont: { 
          family: 'Inter, system-ui, sans-serif',
          weight: 400 as const,
          size: 12
        },
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151', // gray-700
          drawBorder: false,
        },
        border: {
          display: false,
        },
        title: xLabel
          ? {
              display: true,
              text: xLabel,
              color: '#9CA3AF', // gray-400
              font: { 
                size: 12,
                family: 'Inter, system-ui, sans-serif',
                weight: 500 as const
              },
              padding: { top: 10 }
            }
          : undefined,
        ticks: {
          color: '#9CA3AF', // gray-400
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: '#374151', // gray-700
          drawBorder: false,
        },
        border: {
          display: false,
        },
        title: yLabel
          ? {
              display: true,
              text: yLabel,
              color: '#9CA3AF', // gray-400
              font: { 
                size: 12,
                family: 'Inter, system-ui, sans-serif',
                weight: 500 as const
              },
              padding: { right: 10 }
            }
          : undefined,
        ticks: {
          color: '#9CA3AF', // gray-400
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          padding: 8,
        },
      },
    },
  };

  const ChartElement = {
    area: Line,
    bar: Bar,
    doughnut: Doughnut,
    line: Line,
    pie: Pie,
  }[chartType as Exclude<ChartType, 'table'>];

  return (
    <div className={`w-full h-full ${className}`}>
      <div className="h-full w-full">
        <ChartElement data={data} options={options} />
      </div>
    </div>
  );
}
