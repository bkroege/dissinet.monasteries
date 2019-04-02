var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiParser } from "./parser";
import Base from "../../base";

export class templarsWikiFrParser extends WikiParser {
  initialiseRecords(next) {
    const parsingMethods = {
      name: (val, html) => {
        html.name = Base.cleanText(val.text());
      },
      place: (val, html) => {
        if (val.find("a").attr("class") !== "new") {
          html.locality = val.find("a").attr("href");
        }
      },
      info: (val, html) => {
        html.info = val.text();
      }
    };

    const columnsMethods = {
      "Commanderie / Maisons": "name",
      Commanderie: "name",
      "Commanderie ou possession": "name",
      "Ville actuelle (à ou près de)": "place",
      Etablissement: "place",
      "Ville actuelle (ou à proximité)": "place",
      Observations: "info"
    };

    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        const tablesNo = $("table.wikitable").find("tr").length;
        let tablesProcessed = 0;

        /* */
        const inspectTable = (linkToRegion, callback) => {
          request(this.meta.rootUrl + linkToRegion, (err, respR, htmlR) => {
            if (!err) {
              const $ = cheerio.load(htmlR);
              const ths = [];
              $("table.wikitable.left")
                .find("tr")
                .each((rri, rRow) => {
                  // get column names
                  if (rri === 0) {
                    $(rRow)
                      .find("th")
                      .each((ti, th) => {
                        ths.push(Base.cleanText($(th).text()));
                      });
                  } else {
                    const htmlMonastery = {
                      link: linkToRegion
                    };
                    $(rRow)
                      .find("td")
                      .each((tdi, td) => {
                        const columnName = ths[tdi];

                        const methodToParse =
                          columnName in columnsMethods &&
                          parsingMethods[columnsMethods[columnName]]
                            ? parsingMethods[columnsMethods[columnName]]
                            : false;

                        if (methodToParse) {
                          methodToParse($(td), htmlMonastery);
                        }
                      });
                    //console.log(linkToRegion, htmlMonastery);

                    this.addMonastery(htmlMonastery);
                  }
                });
            } else {
              console.log("err", err);
            }
            callback();
          });
        };

        const checkEnd = () => {
          console.log("table processed", tablesProcessed + "/" + tablesNo);
          if (tablesProcessed === tablesNo) {
            next();
          }
        };

        $("table.wikitable").map((ri, table) => {
          $(table)
            .find("tr")
            .each((ri, mainTableRow) => {
              const linkToRegion = $(mainTableRow)
                .find("a")
                .attr("href");

              // each region url
              if (linkToRegion) {
                inspectTable(linkToRegion, () => {
                  tablesProcessed = tablesProcessed + 1;
                  checkEnd();
                });
              } else {
                tablesProcessed = tablesProcessed + 1;
                checkEnd();
              }
            });
        });
      }
    });
  }

  parseMonastery(monastery, next) {
    console.log(monastery);
    const html = monastery.html;

    monastery.addName(html.name);
    if (html.locality) {
      monastery.setParam("localityLink", this.meta.rootUrl + html.locality);
    }

    this.getLocalityGeo(monastery, () => {
      this.inspectWikiPage(monastery, () => {
        monastery.finishParsing();
        monastery.save(this.store);
        next();
      });
    });
  }
}
