var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

import { parseBenedictinesWiki } from "./parse/wiki/benedictines";
import { Store } from "./store";

var store = new Store();
parseBenedictinesWiki(store, () => {
  store.save();
});
