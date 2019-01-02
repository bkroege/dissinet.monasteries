var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

import urls from "../../util/urls";
import cleanText from "../../util/cleantext";
import cleanCoordinates from "../../util/cleancoordinates";

export function parsePremonstratensiansWiki(store, next) {
  const infoLabels = {
    "Début de la construction": "construction",
    Fondation: "establishment",
    "Fin des travaux": "closing",
    Fermeture: "closing"
  };

  const recordSelector = ".mw-parser-output ul li";

  request(urls.premonstratensians, function(err, resp, html) {
    if (!err) {
      const $ = cheerio.load(html);

      //const numberOfRecords = 57;
      const numberOfRecords = $(recordSelector).length;
      let proccessed = 0;

      const checkFinished = () => {
        setTimeout(() => {
          if (
            proccessed === numberOfRecords //numberOfRecords
          ) {
            next();
          } else {
            console.log(
              "premonstratensians ",
              proccessed +
                "/" +
                numberOfRecords +
                " [" +
                ((proccessed / numberOfRecords) * 100).toFixed(3) +
                "%]"
            );
            checkFinished();
          }
        }, 1000);
      };
      checkFinished();

      const getInfo = (data, next) => {
        request(data.link, (err, resp, ahtml) => {
          //console.log(resp);
          if (!err) {
            const $a = cheerio.load(ahtml);

            // lat lng
            data.lon = cleanCoordinates(
              $a("#coordinates")
                .find("a")
                .data("lon")
            );
            data.lat = cleanCoordinates(
              $a("#coordinates")
                .find("a")
                .data("lat")
            );

            // building dates
            $a("table.infobox_v2")
              .find("tr")
              .map((ri, row) => {
                const rowLabel = cleanText(
                  $(row)
                    .find("th")
                    .text(),
                  { trim: true, chars: ["\n"] }
                );

                if (infoLabels[rowLabel]) {
                  const rowValue = cleanText(
                    $(row)
                      .find("td")
                      .text(),
                    { trim: true, chars: ["\n"] }
                  );
                  data[infoLabels[rowLabel]] = rowValue;
                }
              });

            next(data);
          } else {
            next(data);
          }
        });
      };

      $(recordSelector).map((ri, record) => {
        if (ri > -1) {
          const data: any = {};

          var nameReg = new RegExp("((.*?-.*?))");

          const recordText = $(record).text();

          // name
          data.name = recordText.split(",")[0].split("(")[0];

          // diocese
          if (recordText.includes("diocese de ")) {
            data.diocese = recordText.split("diocese de")[1].split(")")[0];
          }

          // link
          const potentialLink = $($(record).find("a")[0]);
          if (potentialLink.text() === data.name) {
            data.link = urls.wikiRoot + potentialLink.attr("href");
          }

          // gender
          data.gender = "";
          data.genderText = "";

          // time ( *-* )
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
                  .reduce((max, val) =>
                    val.occurences > max.occurences ? val : max
                  )
              : false;

          let dates = {};

          if (mostProbableDate && mostProbableDate.occurences > 0) {
            const parts = mostProbableDate.value.split("-");
            const partFrom = cleanText(parts[0], { trim: true });
            const partTo = cleanText(parts[1], { trim: true });

            const fromClean = parseInt(partFrom) == partFrom;
            const toClean = parseInt(partTo) == partTo;

            dates = {
              from: fromClean ? parseInt(partFrom) : false,
              to: toClean ? parseInt(partTo) : false,
              fromNote: fromClean ? "" : partFrom,
              toNote: toClean ? "" : partTo
            };
          } else {
            dates = {
              from: false,
              to: false,
              fromNote: "",
              toNote: ""
            };
          }

          data.orders = [
            Object.assign(dates, { name: "premonstratensians", note: "" })
          ];

          //console.log(data);
          if (data.link && !store.alreadyStored(data)) {
            getInfo(data, data1 => {
              proccessed += 1;
              store.add(data1);
              //console.log(data1);
            });
          } else {
            proccessed += 1;
            store.add(data);
          }
        }
      });
    }
  });
}
