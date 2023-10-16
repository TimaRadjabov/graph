import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./style.css";
import MainGraph from "./components/MainGraph/MainGraph";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App capacity={true} stock={"line"} entrance={"bar"} shipment={"bar"}/> */}
    <MainGraph />
    
  </React.StrictMode>
);
