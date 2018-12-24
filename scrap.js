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
              $(row)
                .find("td")
                .map((ci, column) => {
                  // name
                  const data = {
                    orders: [{ order: "benedictines", from: false, to: false }]
                  };
                  if (ci === 0) {
                    data.name = cleanName($(column).text());

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
                  //console.log(data.name, data.link);
                });
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

const cleanName = name => {
  return name
    .split(":")[0]
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
