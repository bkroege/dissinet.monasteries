import "./main.scss";
import "./../node_modules/leaflet/dist/leaflet.css";
import "./../node_modules/leaflet.markercluster/dist/MarkerCluster.css";
import "./../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css";

import AppStore from "./store";

import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./app";

var monasteries = require("./data/monasteries");
var orders = require("./data/orders");
var statuses = require("./data/statuses");

const ordersCounts = {};

monasteries.forEach(m => {
  m.orders.forEach(o => {
    if (o.id in ordersCounts) {
      ordersCounts[o.id] += 1;
    } else {
      ordersCounts[o.id] = 1;
    }
  });
});
console.log(ordersCounts);

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
  time: { min: 350, max: 1500 },
  category: [],
  gender: [],
  status: []
};

filters["gender"] = [
  { label: "male", value: "m", active: true },
  { label: "female", value: "f", active: true },
  { label: "double", value: "d", active: true },
  { label: "unknown", value: 0, active: true }
];

// orders
const orderGroups = orders.map(o => o.ordergroup).filter(onlyUnique);

orderGroups.forEach((order, oi) =>
  filters["orders"].push({ label: order, color: colors[oi], branches: [] })
);

orders
  .filter(o => o.id in ordersCounts)
  .filter(o => o.id !== "16")
  .filter(o => o.id !== "17")
  .forEach(order => {
    const ordergroup = filters["orders"].find(
      o => o.label === order.ordergroup
    );
    ordergroup.branches.push({
      label: order.label,
      value: parseInt(order.id),
      active: true
    });
  });
filters["orders"].push({
  label: "unknown",
  color: "grey",
  branches: [{ label: "uknown", value: 0, active: true }]
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
filters["category"].push({ label: "unknown", value: 0, active: true });

statuses.forEach(s => {
  if (monasteries.some(m => m.statuses.find(st => st.id == s.id))) {
    filters["status"].push({
      label: s.default,
      value: parseInt(s.id),
      active: true
    });
  }
});
filters["status"].push({ label: "unknown", value: 0, active: true });

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
