var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { Parser } from "../parser";
import Base from "../base";

var data = require("./vafl-collegiales-data");

export class collegialesVaflParser extends Parser {
  initialiseRecords(next) {
    data.features.forEach(d => {
      this.addMonastery({
        coordinates: d.geometry.coordinates,
        link: d.properties.popupContent,
        id: d.id,
        color: d.properties.pinColor
      });
    });
    next();
  }

  parseMonastery(monastery, next) {
    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
