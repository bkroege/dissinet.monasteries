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
  monasteries = [];
  monasteriesValidated = [];
  private filePath = outputPath + "monasteries.json";
  private filePathValidated = outputPath + "monasteries_validated.json";
  private autoSave = true;
  private saving = false;
  private savingTimeout = 5000;

  constructor() {
    // loading previously stored records
    var storedMonasteries = fs.readFileSync(this.filePath, "utf8");
    var monasteriesValidated = fs.readFileSync(this.filePathValidated, "utf8");
    this.monasteries = JSON.parse(storedMonasteries);
    this.monasteriesValidated = JSON.parse(monasteriesValidated);
  }

  // if already stored, returns that monastery, otherwise returns false
  alreadyStored(checkMonastery) {
    return this.monasteries.find(monastery => {
      return checkMonastery.name === monastery.name;
    });
  }

  add(monastery) {
    this.monasteries.push(monastery);

    if (this.autoSave) {
      if (!this.saving) {
        this.saving = true;
        this.saveToFile(this.savingTimeout);
      }
    }
  }

  // truncate stored data
  truncate() {
    this.monasteries = [];
    fs.writeFileSync(this.filePath, "[]");

    this.monasteriesValidated = [];
    fs.writeFileSync(this.monasteriesValidated, "[]");
    console.log("cleaned");
  }

  // save monasteries object to the file
  saveToFile(timeout = 0) {
    if (timeout) {
      setTimeout(() => {
        fs.writeFile(
          this.filePath,
          JSON.stringify(this.monasteries, null, 2),
          () => {
            console.log("store saved");
            this.saving = false;
          }
        );
      }, timeout);
    }
  }

  data() {
    return this.monasteries;
  }

  validate() {
    this.monasteriesValidated = this.monasteries.filter(monastery => {
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
