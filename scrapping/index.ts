var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

import { parseBenedictinesWiki } from "./parse/wiki/benedictines";
import { parsePremonstratensiansWiki } from "./parse/wiki/premonstratensians";
import { parseCisterciennesWiki } from "./parse/wiki/cisterciennes";
import { Store } from "./store";

var store = new Store();
//store.clean();

parseCisterciennesWiki(store, () => {
  console.log("done cistercienes");
  parseBenedictinesWiki(store, () => {
    console.log("done benedictines");
    parsePremonstratensiansWiki(store, () => {
      console.log("done premonstratensians");
    });
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
