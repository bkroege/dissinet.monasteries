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

var monasteries = require("./data/monasteries");
var orders = require("./data/orders");

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

var onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

console.log(orders);

const filters = {
  orders: [],
  time: { from: 350, to: 1500 },
  category: [],
  gender: [],
  status: []
};

filters["gender"] = [
  { label: "male", value: "m", active: true },
  { label: "female", value: "f", active: true },
  { label: "double", value: "d", active: true },
  { label: "unknown", value: "", active: true }
];

// orders
const orderGroups = orders.map(o => o.ordergroup).filter(onlyUnique);

orderGroups.forEach((order, oi) =>
  filters["orders"].push({ label: order, color: colors[oi], branches: [] })
);

orders.forEach(order => {
  const ordergroup = filters["orders"].find(o => o.label === order.ordergroup);
  ordergroup.branches.push({
    label: order.label,
    value: order.label,
    active: true
  });
});

// categories
const categories = orders.map(o => o.category).filter(onlyUnique);

categories.forEach(c =>
  filters["category"].push({
    label: c,
    value: c,
    active: true
  })
);

//status
const statuses = [];
monasteries.forEach(monastery => {
  monastery.statuses.forEach(status => {
    if (!statuses.includes(status.id)) {
      statuses.push(status.id);
    }
  });
});

statuses.forEach(s =>
  filters["status"].push({ label: s, value: s, active: true })
);

console.log(filters);

const store = new AppStore(monasteries, filters);

if (document.body) {
  document.body.innerHTML = "";

  ReactDOM.render(
    React.createElement(AppContainer, {
      store: store
    }),
    document.body.appendChild(document.createElement("div"))
  );
}
