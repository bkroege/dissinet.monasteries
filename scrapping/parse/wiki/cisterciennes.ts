var request = require("request");
var cheerio = require("cheerio");

import urls from "../../util/urls";
import cleanText from "../../util/cleantext";
import cleanCoordinates from "../../util/cleancoordinates";

const recordSelector = "table.wikitable tbody tr";

export function parseCisterciennesWiki(store, next) {
  const infoLabels = {
    "Début de la construction": "construction",
    Fondation: "establishment",
    "Fin des travaux": "closing",
    Fermeture: "closing"
  };

  request(urls.cisterciennes, function(err, resp, html) {
    if (!err) {
      const $ = cheerio.load(html);

      //const numberOfRecords = 57;
      const numberOfRecords = $(recordSelector).length;
      let proccessed = 0;

      const checkFinished = () => {
        setTimeout(() => {
          if (proccessed === numberOfRecords) {
            next();
          } else {
            console.log(
              "cisterciennes ",
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
            if (!data.lon) {
              data.lon = cleanCoordinates(
                $a("#coordinates")
                  .find("a")
                  .data("lon")
              );
            }
            if (!data.lat) {
              data.lat = cleanCoordinates(
                $a("#coordinates")
                  .find("a")
                  .data("lat")
              );
            }

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

      $(recordSelector).map((ri, row) => {
        const data: any = {};

        // gender
        let gender = "d";
        const color = $(row).css("background");
        if (color) {
          if (color.substr(1, 2) === "FF") {
            gender = "n";
          } else if (color.substr(5, 2) === "FF") {
            gender = "m";
          }
        }
        data.gender = gender;
        data.genderNote = "";

        const columns = $(row).find("td");
        columns.map((ci, column) => {
          // name and link
          if (ci === 1) {
            data.name = cleanText($(column).text(), {
              trim: true,
              chars: ["\n", ":", "[", "("]
            });

            // link
            if (
              $(column)
                .find("a")
                .attr("class") !== "new"
            ) {
              data.link =
                urls.wikiRoot +
                $(column)
                  .find("a")
                  .attr("href");
            }
          } else if (ci === 2) {
            // lat lng
            data.lon = cleanCoordinates(
              $(column)
                .find("a")
                .data("lon")
            );
            data.lat = cleanCoordinates(
              $(column)
                .find("a")
                .data("lat")
            );

            // diocese
          } else if (ci === 5) {
            data.diocese = cleanText(
              $(column)
                .find("a")
                .text(),
              {
                chars: ["\n"],
                trim: true
              }
            );
          }
        });

        const ordersHtml = $(columns[6]).html();
        const yearsFromHtml = $(columns[7]).html();
        const yearsToHtml = $(columns[8]).html();

        let orders = [];

        if (ordersHtml && yearsFromHtml && yearsToHtml) {
          const orderNames = splitColumn(ordersHtml, $);
          const yearsFrom = splitColumn(yearsFromHtml, $);
          const yearsTo = splitColumn(yearsToHtml, $);

          // cleaning invalid inputs
          if (orderNames.length < yearsFrom.length) {
            orderNames.push(orderNames[orderNames.length - 1]);
          }
          if (orderNames.length > yearsFrom.length) {
            yearsFrom.push(yearsFrom[yearsFrom.length - 1]);
            yearsTo.push(yearsTo[yearsTo.length - 1]);
          }

          orderNames.map((orderName, oi) => {
            const partFrom = cleanText(yearsFrom[oi], { trim: true });
            const partTo = cleanText(yearsTo[oi], { trim: true });

            const fromClean = parseInt(partFrom) == partFrom;
            const toClean = parseInt(partTo) == partTo;

            orders.push({
              name: orderName.toLowerCase(),
              from: fromClean ? parseInt(partFrom) : false,
              to: toClean ? parseInt(partTo) : false,
              fromNote: fromClean ? "" : partFrom,
              toNote: toClean ? "" : partTo,
              note: ""
            });
          });
        }

        data.orders = orders;

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
      });
    }
  });
}

var splitColumn = (html, $) => {
  const htmlArray = html.split("<br>");
  return htmlArray.map(line => {
    const wrapped = "<span>" + line + "</span>";
    return $(wrapped).text();
  });
};
