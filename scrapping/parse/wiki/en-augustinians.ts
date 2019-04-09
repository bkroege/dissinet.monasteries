var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiParser } from "./parser";
import BASE from "../../base";

export class augustiniansWikiEnParser extends WikiParser {
  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        const linkSelector = "#mw-content-text ul li a";

        const noRecords = $(linkSelector).length;
        let recordsProcessed = 0;

        const inspectMonastery = (linkToMonastery, callback) => {
          request(
            this.meta.rootUrl + linkToMonastery,
            (err, resp, monasteryHtml) => {
              this.addMonastery(monasteryHtml);
              callback();
            }
          );
        };

        const checkEnd = () => {
          if (recordsProcessed === noRecords) {
            next();
          }
        };

        $(linkSelector).map((ai, alink) => {
          const link = $(alink).attr("href");
          inspectMonastery(link, () => {
            recordsProcessed = recordsProcessed + 1;
            checkEnd();
          });
        });
      }
    });
  }

  parseMonastery(monastery, next) {
    const $ = cheerio.load(monastery.html);

    const geo = $("span.geo")
      .text()
      .split(";");

    const time = {};

    monastery.setGeo(
      {
        lng: geo[0],
        lat: geo[1]
      },
      1
    );

    monastery.addOrder({}, {});
    monastery.addStatus({}, {});
    monastery.addName($("#firstHeading").text(), { primary: true, lang: "en" });

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
