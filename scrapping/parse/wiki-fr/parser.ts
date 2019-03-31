var request = require("request");
var cheerio = require("cheerio");
import Base from "../../base";

import { Parser } from "./../parser";

export class WikiFrParser extends Parser {
  getLocalityGeo(monastery, next) {
    if (monastery && monastery.data && monastery.data.localityLink) {
      request(monastery.data.localityLink, (err, resp, html) => {
        if (!err) {
          const $ = cheerio.load(html);

          // lat lng
          monastery.setGeo(
            {
              lng: $("#coordinates")
                .find("a")
                .data("lon"),
              lat: $("#coordinates")
                .find("a")
                .data("lat")
            },
            2
          );

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

  inspectWikiPage(monastery, next) {
    next();

    // todo
    /*
    if (monastery.data.link) {
      const infoLabels = {
        "Début de la construction": "construction",
        Fondation: "establishment",
        "Fin des travaux": "closing",
        Fermeture: "closing"
      };
      request(monastery.data.link, (err, resp, ahtml) => {
        //console.log(resp);
        if (!err) {
          const $ = cheerio.load(ahtml);

          // lat lng
          monastery.setCoordinates({
            lng: $("#coordinates")
              .find("a")
              .data("lon"),
            lat: $("#coordinates")
              .find("a")
              .data("lat")
          });

          // building dates
          $("table.infobox_v2")
            .find("tr")
            .map((ri, row) => {
              const rowLabel = Base.cleanText(
                $(row)
                  .find("th")
                  .text(),
                { trim: true, chars: ["\n"] }
              );

              if (infoLabels[rowLabel]) {
                const rowValue = Base.cleanText(
                  $(row)
                    .find("td")
                    .text(),
                  { trim: true, chars: ["\n"] }
                );
                monastery.setParam(infoLabels[rowLabel], rowValue);
              }
            });

          next();
        } else {
          next();
        }
      });
    } else {
      next();
    }
    */
  }
}
