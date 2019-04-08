var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { SpreadsheetParser } from "./parser";
import BASE from "../../base";

export class cisteciennesSpreadsheetParser extends SpreadsheetParser {
  parseMonastery(monastery, next) {
    const html = monastery.html;

    monastery.setGeo({
      lat: html.latitude,
      lng: html.longitude
    });

    monastery.addName(html.name, { primary: true });

    const time = BASE.timeParse(
      { from: html.foundation, to: html.dissolution },
      { lang: "en" }
    );

    monastery.addStatus({}, time);
    monastery.addOrder({}, time);

    monastery.setParam("filiation", html.filiation);
    monastery.setParam("diocese", html.diocese);

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
