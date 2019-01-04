var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

var turf = require("turf");
var extent = turf.polygon([[[-6, 41], [11, 41], [11, 52], [-6, 52], [-6, 41]]]);

var outputPath = "./scrapping/data/";

export class Store {
  monasteries = [];
  private filePath = outputPath + "monasteries.json";
  private autoSave = true;
  private saving = false;
  private savingTimeout = 5000;

  constructor() {
    // loading previously stored records
    var storedMonasteries = fs.readFileSync(this.filePath, "utf8");
    this.monasteries = JSON.parse(storedMonasteries);
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
    this.monasteries.forEach(monastery => {
      const checkFns = Object.keys(this.checks).map(checkKey => {
        return this.checks[checkKey];
      });
      const passed = checkFns.every(fn => {
        return fn(monastery);
      });
      console.log(monastery.source, passed);
    });
  }

  checks = {
    extent: monastery => {
      const point = turf.point([
        monastery.coordinates.lng,
        monastery.coordinates.lat
      ]);
      console.log(point);
      console.log(extent);
      console.log("");

      return turf.inside(point, extent);
    }
  };
}
