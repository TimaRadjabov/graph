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
} from "recharts";
import { data } from "./data";

const formatMonth = (dateString) => {
  const [day, month, year] = dateString.split(".");
  return `${month}/${year}`;
};
const formatDate = (dateString) => {
  const [day, month, year] = dateString.split(".");
  return `${day}`;
};
const App = () => {
  return (
    <ComposedChart
      width={1260}
      height={450}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      barGap={0}
    >
      <XAxis
        dataKey="date"
        xAxisId={0}
        tickFormatter={formatDate}
        interval={1}
      />
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
      {/* <Tooltip
        cursor={{ stroke: "rgba(255, 255, 255, 0.1)", strokeWidth: 1 }}
      /> */}
      <YAxis orientation="right" axisLine={false} tickLine={false} />
      <Area
        dataKey="fact"
        fill="rgba(255, 255, 255, 0.03)"
        stroke="rgba(255, 255, 255, 0.03)"
      />
      <Bar dataKey="entrance" fill="#0081DF" />
      <Bar dataKey="shipment" fill="#00EEA7" />
      <Line
        type="stepAfter"
        dataKey="amount"
        stroke="rgba(255, 255, 255, 0.4)"
        dot={false}
        strokeDasharray="5 5"
      />
      <Line
        type="linear"
        dataKey="fact"
        stroke="rgba(255, 255, 255, 0.6)"
        dot={false}
      />
    </ComposedChart>
  );
};

export default App;
