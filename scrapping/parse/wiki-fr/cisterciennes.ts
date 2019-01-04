var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiFrParser } from "./parser";
import Base from "../../base";

export class cisteciennesWikiFrParser extends WikiFrParser {
  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);
        $("table.wikitable tbody tr").map((ri, record) => {
          this.addMonastery(record);
        });
      }
      next();
    });
  }
  parseMonastery(monastery, next) {
    monastery.setType("abbey");
    const $ = cheerio.load(monastery.html);

    // gender
    let gender = "d";
    const color = $($.html()).css("background");
    if (color) {
      if (color.substr(1, 2) === "FF") {
        gender = "f";
      } else if (color.substr(5, 2) === "FF") {
        gender = "m";
      }
    }
    monastery.setGender("", gender);

    const columns = $("td");
    columns.map((ci, column) => {
      // name and link
      if (ci === 1) {
        monastery.setName($(column).text());

        // link
        if (
          $(column)
            .find("a")
            .attr("class") !== "new"
        ) {
          monastery.setLink(
            this.meta.rootUrl +
              $(column)
                .find("a")
                .attr("href")
          );
        }
      } else if (ci === 2) {
        monastery.setCoordinates({
          lng: $(column)
            .find("a")
            .data("lon"),
          lat: $(column)
            .find("a")
            .data("lat")
        });
      }
    });

    const ordersHtml = $(columns[6]).html();
    const yearsFromHtml = $(columns[7]).html();
    const yearsToHtml = $(columns[8]).html();

    if (ordersHtml && yearsFromHtml && yearsToHtml) {
      const orderNames = Base.splitColumn(ordersHtml, $);
      const yearsFrom = Base.splitColumn(yearsFromHtml, $);
      const yearsTo = Base.splitColumn(yearsToHtml, $);

      // cleaning invalid inputs
      if (orderNames.length < yearsFrom.length) {
        orderNames.push(orderNames[orderNames.length - 1]);
      }
      if (orderNames.length > yearsFrom.length) {
        yearsFrom.push(yearsFrom[yearsFrom.length - 1]);
        yearsTo.push(yearsTo[yearsTo.length - 1]);
      }

      orderNames.map((orderName, oi) => {
        const partFrom = Base.cleanText(yearsFrom[oi], { trim: true });
        const partTo = Base.cleanText(yearsTo[oi], { trim: true });

        const fromClean = parseInt(partFrom) == partFrom;
        const toClean = parseInt(partTo) == partTo;

        monastery.addOrder({
          name: orderName.toLowerCase(),
          from: fromClean ? parseInt(partFrom) : false,
          to: toClean ? parseInt(partTo) : false,
          fromNote: fromClean ? "" : partFrom,
          toNote: toClean ? "" : partTo,
          note: ""
        });
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
