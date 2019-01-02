var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

var outputPath = "./scrapping/data/";

export class Store {
  private monasteries = [];
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
  public alreadyStored(checkMonastery) {
    return this.monasteries.find(monastery => {
      return checkMonastery.name === monastery.name;
    });
  }

  public add(monastery) {
    this.monasteries.push(monastery);

    if (this.autoSave) {
      if (!this.saving) {
        this.saving = true;
        this.save(this.savingTimeout);
      }
    }
  }

  // truncate stored data
  public clean() {
    this.monasteries = [];
    fs.writeFileSync(this.filePath, "[]");
    console.log("cleaned");
  }

  // save monasteries object to the file
  public save(timeout = 0) {
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

  public data() {
    return this.monasteries;
  }
}
