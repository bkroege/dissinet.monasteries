var request = require("request");
var cheerio = require("cheerio");
import Base from "../../base";

import { Parser } from "./../parser";

export class DarmcParser extends Parser {
  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const json = JSON.parse(html);
        json.results.map(feat => this.addMonastery(feat.attributes));
      }
      next();
    });
  }

  parseMonastery(monastery, next) {
    monastery.setName(monastery.html.Name);
    monastery.setType(monastery.html.Type);
    monastery.setParam("establishment", monastery.html.Founded);
    monastery.setParam("note", monastery.html.Notes);

    monastery.setCoordinates({
      lat: monastery.html.Lat,
      lng: monastery.html.Long
    });

    monastery.addEmptyOrder();

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
