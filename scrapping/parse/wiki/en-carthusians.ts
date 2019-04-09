var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiParser } from "./parser";
import BASE from "../../base";
import { $mobx } from "mobx";

export class carthusiansWikiEnParser extends WikiParser {
  getLocalityGeo(monastery, next) {
    if (monastery && monastery.data && monastery.data.localityLink) {
      request(monastery.data.localityLink, (err, resp, html) => {
        if (!err) {
          const $ = cheerio.load(html);

          const geoValue = $("#coordinates")
            .find(".geo")
            .text()
            .split(";");

          if (geoValue && geoValue.length === 2) {
            // lat lng
            monastery.setGeo(
              {
                lng: geoValue[1],
                lat: geoValue[0]
              },
              2
            );
          }

          next();
        } else {
          console.log(err);
          next();
        }
      });
    } else {
      next();
    }
  }

  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        $(".mw-parser-output>ul>li, h2")
          .filter((i, li) => {
            const text = $(li).text();
            const html = $(li).html();

            return (
              !html.includes('class="external text"') &&
              !html.includes('class="external autonumber"') &&
              !html.includes("tocnumber") &&
              !text.includes(" see") &&
              text.includes("(")
            );
          })
          .map((i, li) => {
            this.addMonastery($(li).html());
          });
      }
      next();
    });
  }

  parseMonastery(monastery, next) {
    const html = "<li>" + monastery.html + "</li>";
    const $ = cheerio.load(html);

    // name
    const name = $(html)
      .text()
      .split(",")[0]
      .split("(")[0];
    monastery.addName(name, { primary: true });

    var brackets = html.match(/[^(\)]+(?=\))/g);
    const timeBracket = brackets[brackets.length - 1];

    // time values
    if (timeBracket[0] !== "<") {
      timeBracket.split(";").map(timeValue => {
        const time = BASE.timeParse({ all: timeValue });
        if (BASE.timeNonEmpty(time)) {
          monastery.addOrder({}, time);
          monastery.addStatus({}, time);
        }
      });
    }

    // locality link
    let firstLink;
    $(html)
      .find('a:not(.new):not([href*="cite"])')
      .map((ai, a) => {
        if (ai === 0) {
          firstLink = $(a).attr("href");
          monastery.setParam("localityLink", this.meta.rootUrl + firstLink);
        }
      });

    this.getLocalityGeo(monastery, () => {
      this.inspectWikiPage(monastery, () => {
        monastery.finishParsing();
        monastery.save(this.store);
        next();
      });
    });
  }
}
