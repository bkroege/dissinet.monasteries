var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiParser } from "./parser";
import Base from "../../base";

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
          console.log(
            "monastery processed",
            recordsProcessed + "/" + noRecords
          );
          if (recordsProcessed === noRecords) {
            next();
          }
        };

        console.log($(linkSelector).length);
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
    monastery.setGeo(
      {
        lng: geo[0],
        lat: geo[1]
      },
      1
    );

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
