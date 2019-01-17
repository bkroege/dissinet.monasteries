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

var version = "0.0.1 (experimental version)";
var colors = [
  "#8dd3c7",
  "#ffffb3",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9",
  "#ffed6f",
  "#bc80bd",
  "#ccebc5"
];

orders.forEach((order, oi) => {
  order.color = colors[oi];
  order.active = true;
  order.names = [order.name];
});

const unknownOrder = orders.find(o => o.name === "unknown");
unknownOrder.names.push("?");
const othersOrder = orders.find(o => o.name === "others");
const orderNamesInDict = [];

orders.forEach(order => {
  order.names.forEach(name => orderNamesInDict.push(name));
});

data.forEach(monastery => {
  monastery.orders.forEach(order => {
    if (!orderNamesInDict.includes(order.name)) {
      othersOrder.names.push(order.name);
    }
  });
});

othersOrder.names = othersOrder.names.filter((v, i, a) => a.indexOf(v) === i);
const store = new AppStore(data, orders);

if (document.body) {
  document.body.innerHTML = "";

  ReactDOM.render(
    React.createElement(AppContainer, {
      store: store
    }),
    document.body.appendChild(document.createElement("div"))
  );
}
