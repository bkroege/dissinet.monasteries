var request = require("request");
var cheerio = require("cheerio");
import Base from "../../base";

import { Parser } from "./../parser";

export class DarmcParser extends Parser {
  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const json = JSON.parse(html);
        json.features.map(feat => this.addMonastery(feat.attributes));
      }
      next();
    });
  }

  parseMonastery(monastery, next) {
    const html = monastery.html;
    monastery.setName(html.NAME);
    const timeText = html.Founded;

    const time = {
      from: { post: timeText.split("-")[0] },
      to: { post: timeText.split("-")[1] }
    };

    if (html.Type) {
      monastery.addType(
        {
          name: html.Type
        },
        time
      );
    }

    if (html.DESCR) {
      monastery.setParam("note", html.DESCR);
    }

    monastery.setGeo({
      lat: html.Lat,
      lng: html.Long
    });

    monastery.addEmptyOrder();

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
