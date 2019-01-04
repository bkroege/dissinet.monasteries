var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

var async = require("async");

import sources from "./sources";

import { Store } from "./store";

var store = new Store();

store.validate();
store.findDuplicates();
