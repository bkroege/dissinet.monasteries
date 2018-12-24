var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

var outputPath = "data/";
var storedPath = outputPath + "monasteries.json";
var monasteriesPath = outputPath + "monasteries";
var ordersPath = outputPath + "orders";

var $;

// bénédictines
const benedictines = () => {
  const infoLabels = {
    "Début de la construction": "construction",
    Fondation: "establishment",
    "Fin des travaux": "closing",
    Fermeture: "closing"
  };
  const url =
    "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France";
  const rootUrl = "https://fr.wikipedia.org";
  request(url, function(err, resp, html) {
    if (!err) {
      const $ = cheerio.load(html);

      const numberOfRecords = $("table.wikitable tbody tr").length;
      let proccessed = 0;

      console.log("numberOf records", numberOfRecords);

      const checkFinished = () => {
        setTimeout(() => {
          if (proccessed === numberOfRecords) {
            save();
          } else {
            console.log(
              "checking",
              proccessed +
                "/" +
                numberOfRecords +
                " [" +
                toPrecision((proccessed / numberOfRecords) * 100, 3) +
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
            data.lon = $a("#coordinates")
              .find("a")
              .data("lon");
            data.lat = $a("#coordinates")
              .find("a")
              .data("lat");

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
              const data = {};

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
                        rootUrl +
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
                        gender = "b";
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
                          order: "benedictines",
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
                          order: "benedictines",
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

              if (data.link) {
                getInfo(data, data1 => {
                  proccessed += 1;
                  //console.log(data1);
                  addMonastery(data1);
                });
              } else {
                proccessed += 1;
                addMonastery(data);
              }
            });
        }
      });
    }
  });
};

const addMonastery = data => {
  if (data.name) {
    if (monasteries.find(m => m.name === data.name)) {
      //console.log("monastery already in db", data.name);
    } else {
      //console.log("adding monastery", data);
      monasteries.push(data);
    }
  }
};

const cleanText = (text, rules) => {
  let newText = text;
  if (rules.chars && rules.chars.length) {
    rules.chars.forEach(char => {
      newText.split(char)[0];
    });
  }

  if (rules["trim"]) {
    newText.trim();
  }

  return newText

    .split("[")[0]
    .split("(")[0]
    .split("\n")[0]
    .trim();
};

const clean = () => {
  fs.writeFileSync(storedPath, "[]");
  console.log("cleaned");
};

const save = () => {
  fs.writeFile(storedPath, JSON.stringify(monasteries), () => {
    //console.log("saved");
  });
  /*
    var monasteriesW = csv.createCsvFileWriter(monasteriesPath + ".csv", {
        flags: ""
    });
    var ordersW = csv.createCsvFileWriter(ordersPath + ".csv", { flags: "" });
  */
};

clean();
var storedMonasteries = fs.readFileSync(storedPath, "utf8");
console.log(storedMonasteries);
const monasteries = JSON.parse(storedMonasteries);
benedictines();
