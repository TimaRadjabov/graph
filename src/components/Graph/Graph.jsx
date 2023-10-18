// chartType = histogram, horizontalLineGraph, lineGraph - выбор
// chartDisplayType = primary, secondary - выбор
// chartColor = green, blue, grey - ручной ввод
// chartShading = затенение графика - true/false
// lineType =  solid - сплошная, dashed - прерывистая - выбор
// chartText = Только для диаграмм типа horizontalLineGraph

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Graph.sass";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);
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
const formatDate = (dateString) => {
  const today = new Date();
  let [day, month, year] = dateString.split(".");

  if (today.setHours(0, 0, 0, 0) === new Date(year, month - 1, day).getTime()) {
    day = "->" + day;
  }
  return `${day}`;
};

const charts = (data, chartType, chartColor, chartDisplayType) => {
  const optionsChart = {
    data,
    type: chartType === "histogram" ? "bar" : "line",
    label: "",
    backgroundColor:
      chartColor === "green" && chartDisplayType === "primary"
        ? "rgb(0, 238, 167)"
        : chartColor === "green" && chartDisplayType === "secondary"
        ? "rgba(0, 238, 167, 0.4)"
        : chartColor === "blue" && chartDisplayType === "primary"
        ? "rgb(0, 129, 223)"
        : chartColor === "blue" && chartDisplayType === "secondary"
        ? "rgba(0, 129, 223, 0.4)"
        : "rgba(255, 255, 255, 0.4)",
    borderDash: chartType === "horizontalLineGraph" ? [5, 5] : [],
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: !(chartType === "histogram") && 1,
    radius: 0,
    stepped: chartType === "horizontalLineGraph" && true,
  };
  return optionsChart;
};

export default function Graph() {
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

  const labels = mainData?.map((item) => formatDate(item.date));

  const shipmentFactData = mainData?.map((item) =>
    item.shipment.fact ? item.shipment.fact : null
  );
  const shipmentPredictData = mainData?.map((item) =>
    item.shipment.predict ? item.shipment.predict : null
  );
  const entranceFactData = mainData?.map((item) =>
    item.entrance.fact ? item.entrance.fact : null
  );
  const entrancePredictData = mainData?.map((item) =>
    item.entrance.predict ? item.entrance.predict : null
  );
  const stocksFactData = mainData?.map((item) =>
    item.stocks.fact ? item.stocks.fact : null
  );
  const stocksPredictData = mainData?.map((item) =>
    item.stocks.predict ? item.stocks.predict : null
  );
  const amountData = mainData?.map((item) => item.amount);

  const data = {
    labels,
    datasets: [
      charts(shipmentFactData, "histogram", "green", "secondary"),
      charts(shipmentPredictData, "histogram", "green", "primary"),
      charts(entranceFactData, "histogram", "blue", "secondary"),
      charts(entrancePredictData, "histogram", "blue", "primary"),
      charts(amountData, "horizontalLineGraph", "grey"),
      charts(stocksFactData, "lineGraph", "grey"),
      charts(stocksPredictData, "lineGraph", "grey"),
    ],
  };
  return (
    <>
      <div className="wrapper">
        <Chart
          type="bar"
          data={data}
          options={{
            responsive: true,
            alignToPixels: true,
            plugins: {
              legend: false,
            },
            tooltip: {
              mode: 'x',
              intersect: false
          },
            scales: {
              x: {
                grid: {
                  color: "rgba(255, 255, 255, 0.05)",
                },
                offset: false,
                beginAtZero: true,
              },
              y: {
                position: "right",
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      </div>
    </>
  );
}
