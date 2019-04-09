/* DEPRECATED */

var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiParser } from "./parser";
import BASE from "../../base";

export class praemonstratensiansWikiFrParser extends WikiParser {
  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);
        $(".mw-parser-output ul li").map((ri, record) => {
          this.addMonastery(record);
        });
      }
      next();
    });
  }

  parseMonastery(monastery, next) {
    const $ = cheerio.load(monastery.html);
    const recordText = $("li").text();

    // name
    monastery.addName(recordText.split(",")[0].split("(")[0], {
      primary: true
    });

    // link
    const potentialLink = $($("a")[0]);
    //console.log(potentialLink.attr("href"));

    if (potentialLink.text() === monastery.data.name) {
      const link = this.meta.rootUrl + potentialLink.attr("href");
      monastery.setLink(link);
      monastery.setParam("localityLink", link);
    }

    // orders
    const brackets = recordText.split(["("]);
    const potentialTimeValues = brackets
      .map(b => b.split(")")[0])
      .filter(b => b.includes("-"));

    const mostProbableDate =
      potentialTimeValues.length > 0
        ? potentialTimeValues
            .map(v => {
              return {
                value: v,
                occurences: v.match(/\d+/g) ? v.match(/[0-9]/g).length : 0
              };
            })
            .reduce((max, val) => (val.occurences > max.occurences ? val : max))
        : false;

    let time = {};

    if (mostProbableDate && mostProbableDate.occurences > 0) {
      time = BASE.timeParse({ all: mostProbableDate.value });
    }

    monastery.addOrder({}, time);
    monastery.addStatus({}, time);

    this.getLocalityGeo(monastery, () => {
      this.inspectWikiPage(monastery, () => {
        monastery.finishParsing();
        monastery.save(this.store);
        next();
      });
    });
  }
}
