var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiFrParser } from "./parser";
import Base from "../base";

export class praemonstratensiansWikiFrParser extends WikiFrParser {
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
    monastery.setType("abbey");
    const $ = cheerio.load(monastery.html);
    const recordText = $("li").text();

    // name
    monastery.setName(recordText.split(",")[0].split("(")[0]);

    console.log(recordText);
    // link
    const potentialLink = $($("a")[0]);
    //console.log(potentialLink.attr("href"));

    if (potentialLink.text() === monastery.data.name) {
      monastery.setLink(this.meta.rootUrl + potentialLink.attr("href"));
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

    if (mostProbableDate && mostProbableDate.occurences > 0) {
      const parts = mostProbableDate.value.split("-");
      const partFrom = Base.cleanText(parts[0], { trim: true });
      const partTo = Base.cleanText(parts[1], { trim: true });

      const fromClean = parseInt(partFrom) == partFrom;
      const toClean = parseInt(partTo) == partTo;

      monastery.addOrder({
        from: fromClean ? parseInt(partFrom) : false,
        to: toClean ? parseInt(partTo) : false,
        fromNote: fromClean ? "" : partFrom,
        toNote: toClean ? "" : partTo
      });
    } else {
      monastery.addEmptyOrder("");
    }

    this.inspectWikiPage(monastery, () => {
      monastery.finishParsing();
      monastery.save(this.store);
      next();
    });
  }
}
