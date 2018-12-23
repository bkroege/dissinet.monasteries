var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

var outputPath = "data/";
var monasteriesPath = outputPath + "monasteries";
var ordersPath = outputPath + "orders";

const monasteries = [];

// bénédictines

var $;

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
                  const data = { orders: ["benedictines"] };
                  if (ci === 0) {
                    data.name = $(column)
                      .text()
                      .split(":")[0]
                      .split("[")[0];
                    data.link = $(column)
                      .find("a")
                      .attr("href");
                  }
                  getCoords(data, data1 => {
                    //console.log(data1);
                    addMonastery(data1);
                  });
                  //console.log(data.name, data.link);
                });
            });
        }
      });
    }
  });
};

benedictines();

const addMonastery = data => {
  if (monasteries.find(m => m.name === data.name)) {
    console.log("monastery already in db", data.name);
  } else {
    console.log("adding monastery", data);
    monasteries.push(data);
  }
};

const save = () => {
  var monasteriesW = csv.createCsvFileWriter(monasteriesPath + ".csv", {
    flags: ""
  });
  var ordersW = csv.createCsvFileWriter(ordersPath + ".csv", { flags: "" });
};
