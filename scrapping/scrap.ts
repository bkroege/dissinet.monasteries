var request = require("request");
var cheerio = require("cheerio");
var csv = require("csvtojson");
var fs = require("fs");
var async = require("async");

import BASE from "./base";
import sources from "./sources";
import { Store } from "./store";

const now = new Date();
export const parsingTime = now.toString();

// load source table
var sourceKey = "1ltj9_nRbQLXYthlXzDOqNK-woQpW7Y0LQFWy0wdqQ7g";
const orderKey = "1oPjlu-9lAbADfbvpXnYJBqE5gDxuXWapq0k86jSj65g";

BASE.readSpreadsheet(sourceKey, sourceRows => {
  sourceRows.forEach(sourceRow => {
    const source = sources.find(s => s.id == sourceRow.sourceid);

    if (source) {
      const meta = source.meta;
      meta.id = sourceRow.sourceid;

      // gender
      if (["f", "m", "d"].includes(sourceRow.gender)) {
        meta.gender = sourceRow.gender;
      }

      // status
      if (sourceRow.status.length) {
        meta.status = sourceRow.status;
      }

      // order
      if (sourceRow.orderlabel.length) {
        meta.order = sourceRow.orderlabel.toLowerCase();
      }

      // language
      if (sourceRow.language.length) {
        meta.lang = sourceRow.language;
      }

      // time
      meta.time = BASE.timeParse({
        from: sourceRow.datefrom,
        to: sourceRow.dateto
      });

      // reliability
      meta.reliability = sourceRow.reliability;
    }
  });

  // parsing order table
  BASE.readSpreadsheet(orderKey, orderRows => {
    const ordersJSON = [];
    orderRows.forEach(orderRow => {
      delete orderRow["_xml"];
      delete orderRow["_links"];
      ordersJSON.push(orderRow);
    });

    var store = new Store(ordersJSON);
    //store.truncate();

    const parse = (source, next) => {
      console.log("going to parse", source.meta.id);
      const parser = new source.parser(store, source.meta, () => {
        console.log(source.meta.id, "finished");
      });
      parser.parse(next);
    };

    async.eachLimit(sources.filter(s => s.parse), 1, parse, (e, r) => {
      store.saveToFile();
      store.validate();
      //store.findDuplicates();
      console.log("raw", store.monasteriesRaw.length);
      console.log("validated", store.monasteriesValidated.length);
      console.log("final", store.monasteries.length);
    });
  });
});
