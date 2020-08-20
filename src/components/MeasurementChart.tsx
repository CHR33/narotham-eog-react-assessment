import React from 'react';
import moment from 'moment';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Label} from 'recharts';

import { Measurement } from '../models';

interface MeaurementChartProps {
  data: Measurement[];
  selectedMetrics: string[]
}

export default (props: MeaurementChartProps) => (
  <MeasurementChart {...props} />
);

const MeasurementChart = (props: MeaurementChartProps) => {
  let xAxisTickFormatter = (date: number) => {
    return moment.unix(date).format("hh:mm");
  };

  return (
    <LineChart
      data={props.data}
      height={500}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="at"
        tickFormatter={xAxisTickFormatter}
      />
      <YAxis yAxisId="PSI">
        <Label
          offset={20}
          position="bottom"
          style={{ textAnchor: "middle" }}
          value="PSI"
        />
      </YAxis>
      <YAxis yAxisId="F" orientation="left">
        <Label
          offset={20}
          position="bottom"
          style={{ textAnchor: "middle" }}
          value="F"
        />
      </YAxis>
      <YAxis yAxisId="%" orientation="left">
        <Label
          offset={20}
          position="bottom"
          style={{ textAnchor: "middle" }}
          value="%"
        />
      </YAxis>
      <Legend />
      {props.selectedMetrics.length > 0
        ? props.selectedMetrics.map(metricName => {
            switch(metricName) {
              case 'waterTemp':
              case 'flareTemp':
              case 'oilTemp':
                return (
                  <Line
                    activeDot={{ r: 5 }}
                    dataKey={metricName}
                    dot={false}
                    isAnimationActive={false}
                    name={metricName}
                    key={`line-${metricName}`}
                    stroke="#8884d8"
                    type="monotone"
                    yAxisId="F"
                  />
                );
              case 'tubingPressure':
              case 'casingPressure':
                return (
                  <Line
                    activeDot={{ r: 5 }}
                    dataKey={metricName}
                    dot={false}
                    isAnimationActive={false}
                    key={`line-${metricName}`}
                    name={metricName}
                    stroke="#82ca9d"
                    type="monotone"
                    yAxisId="PSI"
                  />
                );
              case 'injValveOpen':
                return (
                  <Line
                    activeDot={{ r: 5 }}
                    dataKey={metricName}
                    dot={false}
                    isAnimationActive={false}
                    key={`line-${metricName}`}
                    name={metricName}
                    stroke="blue"
                    type="monotone"
                    yAxisId="%"
                  />
                );
              default:
                return null;
            }
          })
        :
      null}
    </LineChart>
  );
};
