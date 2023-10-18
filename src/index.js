import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./style.css";
import MainGraph from "./components/MainGraph/MainGraph";
import Graph from "./components/Graph/Graph";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App capacity={true} stock={"line"} entrance={"bar"} shipment={"bar"}/>  */}
    <MainGraph />
    {/* <Graph /> */}
    
  </React.StrictMode>
);
