import {
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  Line,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  Area,
  Label,
  Text,
  Customized,
} from "recharts";
import { data } from "./data";
import { PureComponent, useRef } from "react";

const formatMonth = (dateString) => {
  const [day, month, year] = dateString.split(".");
  return `${month}/${year}`;
};
const formatDate = (dateString) => {
  const [day, month, year] = dateString.split(".");
  return `${day}`;
};

const CustomizedLabel = () => {
  return (
    <text x={0} y={71} fill="rgba(255, 255, 255, 0.04)" fontSize={13}>
      Вместимость
    </text>
  );
};

const App = () => {
  const fact = data.filter((item, i) => item.amount < item.fact);
  const amount = data.filter((item, i) => item.amount > item.fact);
  const perc1 = (amount.length / (fact.length + amount.length)) * 100;
  return (
    <ComposedChart
      width={1260}
      height={450}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      barGap={0}
      baseValue="dataMin"
    >
      <XAxis dataKey="date" xAxisId={0} tickFormatter={formatDate} />
      <XAxis
        dataKey="date"
        xAxisId={1}
        tickFormatter={formatMonth}
        tickLine={false}
      />
      {data.map((entry) => (
        <ReferenceLine
          key={entry.date}
          x={entry.date}
          stroke="rgba(255, 255, 255, 0.05)"
        />
      ))}
      <Tooltip
        contentStyle={{ display: "none" }} cursor={{ stroke: "rgba(255, 255, 255, 0.1)", strokeWidth: 1.5 }}
      />
      <YAxis orientation="right" axisLine={false} tickLine={false} />
      <defs>
        <linearGradient id="colorUv" x1="0%" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
          <stop offset={`${perc1}%`} stopColor="rgba(255, 255, 255, 0.05)" />
          <stop offset={`${perc1}%`} stopColor="rgba(255, 81, 70, 0.15)" />
          <stop offset="100%" stopColor="rgba(255, 81, 70, 0.15)" />
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id="colorStrike" x1="0%" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.70)" />
          <stop offset={`${perc1}%`} stopColor="rgba(255, 255, 255, 0.70)" />
          <stop offset={`${perc1}%`} stopColor="red" />
          <stop offset="100%" stopColor="red" />
        </linearGradient>
      </defs>
      <Bar dataKey="entrance" fill="#0081DF" />
      <Bar dataKey="shipment" fill="#00EEA7" />
      <Line
        type="stepAfter"
        dataKey="amount"
        stroke="rgba(255, 255, 255, 0.4)"
        dot={false}
        strokeDasharray="5 5"
        label={<CustomizedLabel />}
        activeDot={false}
      />

      <Line
        type="linear"
        dataKey="fact"
        stroke="rgba(255, 255, 255, 0.6)"
        dot={false}
        activeDot={false}
      />
      <Area
        dataKey="fact"
        fill={`url(#colorUv)`}
        stroke={`url(#colorStrike)`}
        activeDot={false}
      />
    </ComposedChart>
  );
};

export default App;
