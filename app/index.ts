console.log("hello monasteries");

import "./main.scss";
import "./../node_modules/leaflet/dist/leaflet.css";
import "./../node_modules/leaflet.markercluster/dist/MarkerCluster.css";
import "./../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css";

import orders from "./orders";

import AppStore from "./store";

import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./app";

const data = require("./monasteries.json");

console.log(data);

var version = "0.0.1";
var colors = [
  "#8dd3c7",
  "#ffffb3",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#bc80bd",
  "#d9d9d9"
];

const ordersColored = orders.map((order, oi) => {
  order.color = colors[oi];
  order.active = true;
});

const store = new AppStore(data, ordersColored);

if (document.body) {
  document.body.innerHTML = "";

  ReactDOM.render(
    React.createElement(AppContainer, {
      store: store
    }),
    document.body.appendChild(document.createElement("div"))
  );
}
