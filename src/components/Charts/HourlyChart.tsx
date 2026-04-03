import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts';

interface ChartProps {
  data: any[];
  title: string;
  yAxisLabel: string;
  lines?: Array<{
    key: string;
    name: string;
    stroke: string;
  }>;
  bars?: Array<{
    key: string;
    name: string;
    fill: string;
  }>;
}

export const HourlyChart: React.FC<ChartProps> = ({
  data,
  title,
  yAxisLabel,
  lines,
  bars,
}) => {
  const isComposed = bars && bars.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {isComposed ? (
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {lines?.map(line => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.stroke}
                name={line.name}
                isAnimationActive={false}
              />
            ))}
            {bars?.map(bar => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                fill={bar.fill}
                name={bar.name}
                opacity={0.7}
              />
            ))}
          </ComposedChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {lines?.map(line => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.stroke}
                name={line.name}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyChart;
