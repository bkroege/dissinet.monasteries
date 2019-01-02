var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

import urls from "./../../util/urls";
import cleanText from "./../../util/cleantext";
import cleanCoordinates from "./../../util/cleancoordinates";

export function parseBenedictinesWiki(store, next) {
  const infoLabels = {
    "Début de la construction": "construction",
    Fondation: "establishment",
    "Fin des travaux": "closing",
    Fermeture: "closing"
  };

  request(urls.benedictines, function(err, resp, html) {
    if (!err) {
      const $ = cheerio.load(html);

      //const numberOfRecords = 57;
      const numberOfRecords = $("table.wikitable tbody tr").length;
      let proccessed = 0;

      const checkFinished = () => {
        setTimeout(() => {
          if (
            proccessed === numberOfRecords //numberOfRecords
          ) {
            next();
          } else {
            console.log(
              "benedictines ",
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
      $("table.wikitable").map((ri, table) => {
        if (ri > -1) {
          $(table)
            .find("tr")
            .map((ti, row) => {
              // single monastery
              const data: any = {};

              $(row)
                .find("td")
                .map((ci, column) => {
                  // name
                  if (ci === 0) {
                    data.name = cleanText($(column).text(), {
                      trim: true,
                      chars: ["\n", ":", "[", "("]
                    });

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
                  }

                  // gender
                  if (ci === 1) {
                    const genderText = cleanText(
                      $(column)
                        .not("sup > *")
                        .text(),
                      { trim: true, chars: ["\n"] }
                    );

                    let gender = "";
                    let genderNote = "";
                    if (genderText) {
                      if (
                        genderText.includes("moines") &&
                        genderText.includes("moniales")
                      ) {
                        genderNote = genderText;
                        gender = "d";
                      } else if (genderText === "moines") {
                        gender = "m";
                      } else if (genderText === "moniales") {
                        gender = "n";
                      } else {
                        genderNote = genderText;
                      }
                    }

                    data.gender = gender;
                    data.genderNote = genderNote;
                  }

                  // diocese
                  if (ci === 2) {
                    data.diocese = cleanText($(column).text(), {
                      chars: ["\n"],
                      trim: true
                    });
                  }

                  // orders
                  if (ci === 3) {
                    const orders = [];
                    const dateText = cleanText($(column).text(), {
                      chars: ["\n"],
                      trim: true
                    });

                    const occurences = dateText.split(", puis");

                    occurences.map(occurence => {
                      const parts = occurence.split("-");

                      if (parts.length === 2) {
                        const parsedFrom = parseInt(parts[0]) || false;
                        const parsedTo = parseInt(parts[1]) || false;
                        orders.push({
                          name: "benedictines",
                          from: parsedFrom,
                          to: parsedTo,
                          fromNote:
                            parts[0] == parsedFrom
                              ? ""
                              : cleanText(parts[0], { trim: false }),
                          toNote:
                            parts[1] == parsedTo
                              ? ""
                              : cleanText(parts[1], { trim: false }),
                          note: ""
                        });
                      } else {
                        orders.push({
                          name: "benedictines",
                          from: false,
                          to: false,
                          fromNote: "",
                          toNote: "",
                          note: occurence
                        });
                      }
                    });

                    data.orders = orders;
                  }
                });

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
  });
}
