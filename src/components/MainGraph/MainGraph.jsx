import {
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";
import Graph from "../Graph/Graph";

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

const MainGraph = () => {
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
          <Bar dataKey={value => {
            return value.shipment.fact
          }} />
        
            <Graph chartType="histogram" chartColor="green" values={mainData} />
        </ComposedChart>
      </ResponsiveContainer>
    
    </div>
  );
};

export default MainGraph;
