// chartType = histogram, horizontalLineGraph, lineGraph - выбор
// chartDisplayType = primary, secondary - выбор
// chartColor = green, blue, grey - ручной ввод
// chartShading = затенение графика - true/false
// lineType =  solid - сплошная, dashed - прерывистая - выбор
// chartText = Только для диаграмм типа horizontalLineGraph

import { Bar } from "recharts";

const Graph = ({
  chartType,
  chartDisplayType,
  chartColor,
  chartShading,
  lineType,
  values,
}) => {

    console.log(value);
  return (
    <>
      {chartType === "histogram" ? (
        <Bar
          dataKey={values}
          fill={
            chartColor === "green"
              ? "#00EEA7"
              : chartColor === "blue"
              ? "#0081DF"
              : "rgba(255, 255, 255, 0.70)"
          }
        />
      ) : null}
    </>
  );
};

export default Graph;
