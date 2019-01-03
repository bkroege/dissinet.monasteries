var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

var async = require("async");

import sources from "./sources";

import { Store } from "./store";

var store = new Store();
console.log("no of monasteries:", store.monasteries.length);

const orders = {};
store.monasteries.forEach(monastery => {
  monastery.orders.forEach(order => {
    if (order.name in orders) {
      orders[order.name] += 1;
    } else {
      orders[order.name] = 0;
    }
  });
});

Object.keys(orders).forEach(orderName => {
  console.log("order", orderName, " occurrences: ", orders[orderName]);
});

/*
console.log(
  store
    .data()
    .filter(monastery => {
      return monastery.orders.length > 1;
    })
    .map(monastery => monastery.orders.map(o => o.name))
);
*/
