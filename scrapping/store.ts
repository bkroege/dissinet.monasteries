var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");
import Base from "./base";

var turf = require("turf");
var extentPolygon = turf.polygon([
  [[-6, 41], [11, 41], [11, 52], [-6, 52], [-6, 41]]
]);

var outputPath = "./scrapping/data/";

export class Store {
  monasteriesRaw = [];
  monasteriesValidated = [];
  private filePathRaw = outputPath + "monasteries_raw.json";
  private filePathValidated = outputPath + "monasteries_validated.json";
  private autoSave = true;
  private saving = false;
  private savingTimeout = 5000;

  constructor() {
    // loading previously stored records
    var monasteriesRaw = fs.readFileSync(this.filePathRaw, "utf8");
    this.monasteriesRaw = JSON.parse(monasteriesRaw);

    var monasteriesValidated = fs.readFileSync(this.filePathValidated, "utf8");
    this.monasteriesValidated = JSON.parse(monasteriesValidated);
  }

  // if already stored, returns that monastery, otherwise returns false
  alreadyStored(checkMonastery) {
    return this.monasteriesRaw.find(monastery => {
      return checkMonastery.name === monastery.name;
    });
  }

  add(monastery) {
    this.monasteriesRaw.push(monastery);

    if (this.autoSave) {
      if (!this.saving) {
        this.saving = true;
        this.saveToFile(this.savingTimeout);
      }
    }
  }

  // truncate stored data
  truncate() {
    this.monasteriesRaw = [];
    fs.writeFileSync(this.filePathRaw, "[]");

    this.monasteriesValidated = [];
    fs.writeFileSync(this.monasteriesValidated, "[]");
    console.log("cleaned");
  }

  // save monasteries object to the file
  saveToFile(timeout = 0) {
    if (timeout) {
      setTimeout(() => {
        fs.writeFile(
          this.filePathRaw,
          JSON.stringify(this.monasteriesRaw, null, 2),
          () => {
            console.log("store saved");
            this.saving = false;
          }
        );
      }, timeout);
    }
  }

  validate() {
    this.monasteriesValidated = this.monasteriesRaw.filter(monastery => {
      const checkFns = Object.keys(this.checks).map(checkKey => {
        return this.checks[checkKey];
      });
      return checkFns.every(fn => {
        return fn(monastery);
      });
    });

    fs.writeFile(
      this.filePathValidated,
      JSON.stringify(this.monasteriesValidated, null, 2),
      () => {
        console.log("validated store saved");
      }
    );
  }

  findDuplicates() {
    this.monasteriesRaw = [];
  }

  checks = {
    validCoordinates: monastery => {
      const coords = monastery.coordinates;
      return (
        coords &&
        coords.lng &&
        coords.lat &&
        Base.isNumeric(coords.lng) &&
        Base.isNumeric(coords.lat)
      );
    },
    extent: monastery => {
      const point = turf.point([
        monastery.coordinates.lng,
        monastery.coordinates.lat
      ]);

      return turf.inside(point, extentPolygon);
    }
  };
}
