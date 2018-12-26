var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

import { parseBenedictinesWiki } from "./parse/wiki/benedictines";
import { parsePremonstratensiansWiki } from "./parse/wiki/premonstratensians";
import { Store } from "./store";

var store = new Store();
store.clean();
parseBenedictinesWiki(store, () => {
  console.log("done benedictines");
  parsePremonstratensiansWiki(store, () => {
    console.log("done premonstratensians");
  });
});
