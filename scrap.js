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
  const url =
    "https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France";
  const rootUrl = "https://fr.wikipedia.org";
  request(url, function(err, resp, html) {
    if (!err) {
      const $ = cheerio.load(html);

      const getCoords = (data, next) => {
        request(rootUrl + data.link, (err, resp, ahtml) => {
          //console.log(resp);
          if (!err) {
            const $a = cheerio.load(ahtml);
            data.lon = $a("#coordinates")
              .find("a")
              .data("lon");
            data.lat = $a("#coordinates")
              .find("a")
              .data("lat");
            next(data);
          } else {
            next(data);
          }
        });
      };
      $("table.wikitable").map((ri, table) => {
        if (ri < 2) {
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
                      data.link = $(column)
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

                    console.log(genderText);

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
                    let from = false;
                    let to = false;
                    let fromNote = "";
                    let toNote = "";
                    let note = "";

                    const dateText = cleanText($(column).text(), {
                      chars: ["\n"],
                      trim: true
                    });
                    const parts = dateText.split("-");
                    if (parts.length === 2) {
                      from = parseInt(parts[0]) || false;
                      fromNote =
                        parts[0] == from
                          ? ""
                          : cleanText(parts[0], { trim: false });

                      to = parseInt(parts[1]) || false;
                      toNote =
                        parts[1] == to
                          ? ""
                          : cleanText(parts[1], { trim: false });
                    } else {
                      note = dateText;
                    }
                    data.orders = [
                      {
                        order: "benedictines",
                        from: from,
                        to: to,
                        fromNote: fromNote,
                        toNote: toNote,
                        note: note
                      }
                    ];
                  }
                });

              if (data.link) {
                getCoords(data, data1 => {
                  //console.log(data1);
                  addMonastery(data1);
                  save();
                });
              } else {
                addMonastery(data);
                save();
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
      console.log("monastery already in db", data.name);
    } else {
      console.log("adding monastery", data);
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
    console.log("saved");
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
