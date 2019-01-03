var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

var async = require("async");

import sources from "./sources";

import { Store } from "./store";

var store = new Store();
console.log(store.monasteries.length);

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
/*
const parse = (source, next) => {
  const parser = new source.parser(store, source.meta, () => {
    console.log(source.meta.id, "finished");
  });
  parser.parse(next);
};

const parsed = async.map(sources.filter(s => s.parse), parse, (e, r) => {
  store.save();
});

*/
