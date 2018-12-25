var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");

var outputPath = "./scrapping/data/";

export class Store {
  private monasteries = [];
  private filePath = outputPath + "monasteries.json";

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
    if (monastery.name) {
      const stored = this.alreadyStored(monastery.name);

      if (stored) {
        console.log("monastery already in db", monastery.name);
        monastery.orders.forEach(order => {
          const alreadyAdded = stored.orders.find(o => {
            return (
              o.name === order.name &&
              order.from === o.from &&
              order.to === o.to
            );
          });
          if (!alreadyAdded) {
            stored.orders.push(order);
          }
        });
        // add orders
      } else {
        //console.log("adding monastery", data);
        this.monasteries.push(monastery);
      }
    }
  }

  // truncate stored data
  public clean() {
    fs.writeFileSync(this.filePath, "[]");
    console.log("cleaned");
  }

  // save monasteries object to the file
  public save() {
    fs.writeFile(this.filePath, JSON.stringify(this.monasteries), () => {
      console.log("saved");
    });
  }
}
