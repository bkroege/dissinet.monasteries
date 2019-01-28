var request = require("request");
var cheerio = require("cheerio");
//var csv = require("ya-csv");
var csv = require("csvtojson");
var fs = require("fs");

var async = require("async");

import sources from "./sources";

import { Store } from "./store";

csv()
  .fromFile("./data/orders.csv")
  .then(orders => {
    var store = new Store(
      orders.map(order => {
        order.alternativeNames = order["alternative names"];
        order.alternativeNames.push(order.label);
        return order;
      })
    );
    store.truncate();

    const parse = (source, next) => {
      const parser = new source.parser(store, source.meta, () => {
        console.log(source.meta.id, "finished");
      });
      parser.parse(next);
    };

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
