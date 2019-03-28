var request = require("request");
var cheerio = require("cheerio");
//var csv = require("ya-csv");
var csv = require("csvtojson");
var fs = require("fs");

var async = require("async");

import sources from "./sources";

import { Store } from "./store";

// parsing order table
csv()
  .fromFile("./data/orders.csv")
  .then(orders => {
    const orderData = orders.map(order => {
      order.names = order["alternative names"].split(", ");
      order.names.push(order.label);
      order.names = order.names
        .filter(n => n && n.length)
        .map(n => n.toLowerCase(n));
      return order;
    });

    var store = new Store(orderData);
    store.truncate();

    const parse = (source, next) => {
      console.log("going to parse", source);
      const parser = new source.parser(store, source.meta, () => {
        console.log(source.meta.id, "finished");
      });
      parser.parse(next);
    };

    console.log("sources", sources);

    async.eachLimit(sources.filter(s => s.parse), 1, parse, (e, r) => {
      store.saveToFile();
      store.validate();
      store.findDuplicates();
    });
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
