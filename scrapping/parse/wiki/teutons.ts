var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiParser } from "./parser";
import BASE from "../../base";

export class teutonsWikiDeParser extends WikiParser {
  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        $("table.wikitable").map((ri, table) => {
          $(table)
            .find("tr")
            .map((ti, record) => {
              if (ti !== 0) {
                this.addMonastery(record);
              }
            });
        });
      }
      next();
    });
  }

  parseMonastery(monastery, next) {
    const $ = cheerio.load(monastery.html);
    let fromTime = "";
    let toTime = "";

    $("td").map((ci, column) => {
      if (ci === 0) {
        // name
        monastery.addName(
          BASE.cleanText(
            $(column)
              .text()
              .replace("Kommende", "")
          ),
          { primary: true }
        );

        // link
        const link = $(column)
          .find("a")
          .map((li, link) => {
            if ($(link).attr("class") !== "new") {
              monastery.setParam(
                "localityLink",
                this.meta.rootUrl + $(link).attr("href")
              );
            }
          });
      }

      // orders
      if (ci === 1) {
        fromTime = BASE.cleanText($(column).text());
      }
      if (ci === 2) {
        toTime = BASE.cleanText($(column).text());
      }

      // note
      if (ci === 3) {
        monastery.setParam("note", $(column).text());
      }

      if (ci === 4) {
        if ($(column).find("img")) {
          const src = $(column)
            .find("img")
            .attr("src");
          if (src) {
            monastery.setParam("image", "https:" + src);
          }
        }
        const timeInput = { from: fromTime, to: toTime };
        const time = BASE.timeParse(timeInput, { lang: "de" });
        monastery.addOrder({}, time);
      }
    });

    this.getLocalityGeo(monastery, () => {
      monastery.finishParsing();
      monastery.save(this.store);
      next();
    });
  }
}
