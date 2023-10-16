import {
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  Line,
  ReferenceLine,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";

import "./App.sass";
import { useEffect, useState } from "react";
import axios from "axios";
import Graph from "./Graph/Graph";

const combinateData = (...extra) => {
  let result = extra[0].map((item, i) => {
    let combinedObj = { ...item };
    for (let j = 1; j < extra.length; j++) {
      combinedObj = {
        ...combinedObj,
        ...extra[j][i],
      };
    }
    return combinedObj;
  });
  return result;
};

const App = ({ capacity, stock, entrance, shipment }) => {
  const [mainData, setMainData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const [response1, response2, response3, response4] = await Promise.all([
          axios.get("http://localhost:3000/stocksData"),
          axios.get("http://localhost:3000/capacityData"),
          axios.get("http://localhost:3000/entranceData"),
          axios.get("http://localhost:3000/shipmentData"),
        ]);

        const stocksData = response1.data;
        const capacityData = response2.data;
        const entranceData = response3.data;
        const shipmentData = response4.data;

        const combinedResult = combinateData(
          stocksData,
          capacityData,
          entranceData,
          shipmentData
        );

        setMainData(combinedResult);
      } catch (error) {
        console.error("Ошибка при выполнении запросов:", error);
      }
    }

    fetchData();
  }, []);
  const haspredict = mainData?.filter((item) => item.stocks.predict);
  const stocks = haspredict?.findIndex(
    (item) => item.amount <= item.stocks.predict
  );
  const pers = ((stocks) / (haspredict?.length)) * 100;

  const formatDate = (dateString) => {
    const today = new Date();
    let [day, month, year] = dateString.split(".");

    if (
      today.setHours(0, 0, 0, 0) === new Date(year, month - 1, day).getTime()
    ) {
      day = "->" + day;
    }
    return `${day}`;
  };

  const CustomizedLabel = (props) => {
    const { x, y, index } = props;
    if (index === 0) {
      return (
        <svg className="label">
          <rect x={x - 2} y={y - 6} className="label__wrapper" />
          <text x={x} y={y + 4} className="label__text">
            Вместимость
          </text>
        </svg>
      );
    }

    return null;
  };
  const futureDays = (value) => {
    const today = new Date();
    let [day, month, year] = value.date.split(".");
    if (
      today.setHours(0, 0, 0, 0) <= new Date(year, month - 1, day).getTime()
    ) {
      return `${value.stocks.predict}`;
    }
    return null;
  };
  const pastDays = (value) => {
    const today = new Date();
    let [day, month, year] = value.date.split(".");
    if (
      today.setHours(0, 0, 0, 0) >= new Date(year, month - 1, day).getTime()
    ) {
      return `${value.stocks.fact}`;
    }
    return null;
  };
  const shipmentView = () => {
    switch (shipment) {
      case "line":
        return (
          <Line
            type="'linear"
            dataKey={(value) => {
              return value.shipment.fact
                ? value.shipment.fact
                : value.shipment.predict;
            }}
            stroke="#00EEA7"
            dot={false}
            activeDot={false}
          />
        );
      case "bar":
        return (
          <Bar
            dataKey={(value) => {
              return value.shipment.fact
                ? value.shipment.fact
                : value.shipment.predict;
            }}
            fill="#00EEA7"
          />
        );
      default:
        return;
    }
  };
  const entranceView = () => {
    switch (entrance) {
      case "line":
        return (
          <Line
            type="'linear"
            dataKey={(value) => {
              return value.entrance.fact
                ? value.entrance.fact
                : value.entrance.predict;
            }}
            stroke="#0081DF"
            dot={false}
            activeDot={false}
          />
        );
      case "bar":
        return (
          <Bar
            dataKey={(value) => {
              return value.entrance.fact
                ? value.entrance.fact
                : value.entrance.predict;
            }}
            fill="#0081DF"
          />
        );
      default:
        return;
    }
  };
  const stocksView = () => {
    switch (stock) {
      case "line":
        return (
          <>
              <Area
                dataKey={(value) => {
                  return pastDays(value);
                }}
                stackId="0"
                activeDot={false}
                connectNulls
                fill="rgba(0,0,0,40%)"
                stroke="#5F5F5F"
              />
              <Area
                dataKey={(value) => {
                  return futureDays(value);
                }}
                stackId="1"
                fill={`url(#colorUv)`}
                stroke={`url(#colorStrike)`}
                activeDot={false}
              />
            </>
        );
      case "bar":
        return (
          <>
              <Bar
                dataKey={(value) => {
                  return pastDays(value);
                }}
                stackId="0"
                activeDot={false}
                connectNulls
                fill="rgba(0,0,0,40%)"
                stroke="#5F5F5F"
              />
              <Bar
                dataKey={(value) => {
                  return futureDays(value);
                }}
                stackId="1"
                fill={`url(#colorUv)`}
                stroke={`url(#colorStrike)`}
                activeDot={false}
              />
            </>
        );
      default:
        return;
    }
  };
  return (
    <div className="wrappper">
      <ResponsiveContainer width="99%" height="100%">
        <ComposedChart
          width={1260}
          height={450}
          data={mainData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          barGap={0}
          baseValue={0}
        >
          <XAxis
            dataKey="date"
            xAxisId={0}
            tickFormatter={(value) => {
              return formatDate(value);
            }}
            interval={mainData?.length > 30 ? 1 : 0}
            scale="point"
          />
          {/* <XAxis
            dataKey="date"
            xAxisId={1}
            tickFormatter={formatMonth}
            tickLine={false}
          /> */}
          {mainData?.map((entry) => (
            <ReferenceLine
              key={entry.date}
              x={entry.date}
              stroke="rgba(255, 255, 255, 0.05)"
            />
          ))}
          <Tooltip
            contentStyle={{ display: "none" }}
            cursor={{ stroke: "rgba(255, 255, 255, 0.1)", strokeWidth: 1.5 }}
          />
          <YAxis orientation="right" axisLine={false} tickLine={false} />
          <defs>
            <linearGradient id="colorUv" x1="0%" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
              <stop offset={`${pers}%`} stopColor="rgba(255, 255, 255, 0.05)" />
              <stop offset={`${pers}%`} stopColor="rgba(255, 81, 70, 0.15)" />
              <stop offset="100%" stopColor="rgba(255, 81, 70, 0.15)" />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="colorStrike" x1="0%" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.70)" />
              <stop offset={`${pers}%`} stopColor="rgba(255, 255, 255, 0.70)" />
              <stop offset={`${pers}%`} stopColor="red" />
              <stop offset="100%" stopColor="red" />
            </linearGradient>
          </defs>
          <Bar
          dataKey={(values) => {
            return values.shipment.fact
              ? values.shipment.fact
              : values.shipment.predict;
          }}
          fill="#00EEA7"
        />
          <Graph chartType="histogram" chartColor="green" values={mainData}/>
          {entranceView()}
          {/* {shipmentView()} */}
          {capacity && (
            <Line
              type="stepAfter"
              dataKey="amount"
              stroke="rgba(255, 255, 255, 0.4)"
              dot={false}
              strokeDasharray="5 5"
              label={<CustomizedLabel />}
              activeDot={false}
            />
          )}
          {stocksView()}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default App;
