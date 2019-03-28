var request = require("request");
var cheerio = require("cheerio");
import Base from "../../base";

import { Parser } from "./../parser";

export class DarmcParser extends Parser {
  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      console.log("initial", html);
      if (!err) {
        const json = JSON.parse(html);
        json.features.map(feat => this.addMonastery(feat.attributes));
      }
      next();
    });
  }

  parseMonastery(monastery, next) {
    monastery.setName(monastery.html.NAME);
    const timeText = monastery.html.Founded;

    const time = {
      from: { post: timeText.split("-")[0] },
      to: { post: timeText.split("-")[1] }
    };

    monastery.addType(
      {
        name: monastery.html.Type
      },
      time
    );

    monastery.setParam("note", monastery.html.DESCR);

    monastery.setGeo({
      lat: monastery.html.Lat,
      lng: monastery.html.Long
    });

    monastery.addEmptyOrder();

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
