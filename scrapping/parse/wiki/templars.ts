var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var async = require("async");
import { WikiParser } from "./parser";
import BASE from "../../base";

export class templarsWikiFrParser extends WikiParser {
  initialiseRecords(next) {
    const parsingMethods = {
      name: (val, html) => {
        html.name = BASE.cleanText(val.text());
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
                        ths.push(BASE.cleanText($(th).text()));
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
              console.log("err", this.meta.rootUrl + linkToRegion, err);
            }
            callback();
          });
        };

        const tables = [];
        $("table.wikitable").map((ri, table) => {
          $(table)
            .find("tr")
            .each((ri, mainTableRow) => {
              const linkToRegion = $(mainTableRow)
                .find("a")
                .attr("href");
              tables.push(linkToRegion);
            });
        });

        const getTable = (table, next) => {
          if (table) {
            inspectTable(table, () => {
              next();
            });
          } else {
            next();
          }
        };

        async.eachLimit(tables, 10, getTable.bind(this), () => {
          next();
        });
      } else {
        console.log("err2", this.meta.url, err);
      }
    });
  }

  parseMonastery(monastery, next) {
    const html = monastery.html;

    monastery.addName(html.name, { primary: true });
    if (html.locality) {
      monastery.setParam("localityLink", this.meta.rootUrl + html.locality);
    }

    const time = {};

    monastery.addStatus({}, time);
    monastery.addOrder({}, time);

    this.getLocalityGeo(monastery, () => {
      this.inspectWikiPage(monastery, () => {
        monastery.finishParsing();
        monastery.save(this.store);
        next();
      });
    });
  }
}
