var request = require("request");
var cheerio = require("cheerio");
var csv = require("ya-csv");
var csvtojson = require("csvtojson");
var fs = require("fs");
import Base from "./base";
var france = require("./france.json");

var turf = require("turf");
import truncate from "@turf/truncate";

var extentPolygon = turf.polygon(france.features[0].geometry.coordinates[1]);

var outputPath = "./scrapping/data/";

export class Store {
  monasteries = [];
  monasteriesRaw = [];
  monasteriesValidated = [];

  private filePathRaw = outputPath + "monasteries_raw.json";
  private filePathValidated = outputPath + "monasteries_validated.json";
  private filePath = outputPath + "monasteries.json";

  private autoSave = true;
  private saving = false;
  private savingTimeout = 5000;
  public orders = [];

  constructor(orders) {
    this.orders = orders;

    // loading previously stored records
    var monasteriesRaw = fs.readFileSync(this.filePathRaw, "utf8") || "[]";
    this.monasteriesRaw = JSON.parse(monasteriesRaw);

    var monasteriesValidated =
      fs.readFileSync(this.filePathValidated, "utf8") || "[]";
    this.monasteriesValidated = JSON.parse(monasteriesValidated);

    var monasteriesFixed = fs.readFileSync(this.filePath, "utf8") || "[]";
    this.monasteries = JSON.parse(monasteriesFixed);
  }

  /* orders */
  orderById(id) {
    return this.orders.find(o => o.id === id);
  }

  orderIdByName(name) {
    const order = this.orderByName(name);
    return order ? order.id : false;
  }

  orderByName(name) {
    return this.orders.find(o => o.name === name);
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
    fs.writeFileSync(this.filePathValidated, "[]");

    this.monasteries = [];
    fs.writeFileSync(this.filePath, "[]");
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
    console.log("validating");
    // check valid
    const monasteriesChecked = this.monasteriesRaw.filter(monastery => {
      const checkFns = Object.keys(this.checks).map(checkKey => {
        return this.checks[checkKey];
      });

      /*
      Object.keys(this.checks).map(checkKey => {
        console.log(checkKey, this.checks[checkKey](monastery));
      });
      */

      return checkFns.every(fn => {
        return fn(monastery);
      });
    });

    // correct
    const monasteriesCorrected = monasteriesChecked.map(monastery => {
      const fixFns = Object.keys(this.fixes).map(fixKey => {
        return this.fixes[fixKey];
      });

      let corrected = Object.assign(monastery, {});
      fixFns.forEach(fn => {
        corrected = fn(corrected);
      });

      return corrected;
    });

    this.monasteriesValidated = monasteriesCorrected;

    fs.writeFile(
      this.filePathValidated,
      JSON.stringify(monasteriesCorrected, null, 2),
      () => {
        console.log("validated store saved");
      }
    );
  }

  // todo
  findDuplicates() {
    const fixed = [];
    const monasteriesToProccess = JSON.parse(
      JSON.stringify(this.monasteriesValidated)
    ).map(m => {
      m.processed = false;
      return m;
    });

    const bundles = [];
    monasteriesToProccess.forEach(monastery => {
      if (!monastery.processed) {
        const monasteriesBundle = [monastery];
        // find all other not-proccessed monasteries
        const others = monasteriesToProccess.filter(other => {
          return other.id !== monastery.id && !other.proccessed;
        });

        // find possible duplicates
        others.forEach(other => {
          if (other.name === monastery.name) {
            const distance = turf.distance(other.point, monastery.point);
            if (distance < 1) {
              other.processed = true;
              monasteriesBundle.push(other);

              //console.log(other.source, monastery.source);
            }
          }
        });

        bundles.push(monasteriesBundle);
      }
    });

    bundles.forEach(bundle => {
      const fixedMonastery: any = {
        id: Base.generateUuid(),
        sourceRecords: bundle.map(m => m.id),
        sources: bundle.map(m => m.source),
        links: bundle.map(b => b.link).filter(b => b),
        name: bundle[0].name,
        orders: [],
        point: truncate(
          turf.center(turf.featureCollection(bundle.map(m => m.point))),
          { precision: 5, coordinates: 2 }
        )
      };
      bundle.forEach(m => {
        m.orders.forEach(o => {
          fixedMonastery.orders.push(o);
        });
      });

      if (bundle.length > 1) {
        const genders = bundle.map(m => {
          return m.gender.value;
        });
        fixedMonastery.gender = {};
        fixedMonastery.gender.notes = bundle
          .map(m => m.gender.note)
          .filter(n => n);

        if (genders.includes("m") && genders.includes("f")) {
          fixedMonastery.gender.value = "?";
        } else if (genders.includes("d")) {
          fixedMonastery.gender.value = "d";
        } else if (genders.includes("m")) {
          fixedMonastery.gender.value = "m";
        } else if (genders.includes("f")) {
          fixedMonastery.gender.value = "f";
        } else {
          fixedMonastery.gender.value = false;
        }

        fixedMonastery.establishment = bundle
          .map(m => m.establishment)
          .filter(a => a)
          .join("|");

        fixedMonastery.closing = bundle
          .map(m => m.closing)
          .filter(a => a)
          .join("|");

        fixedMonastery.construction = bundle
          .map(m => m.construction)
          .filter(a => a)
          .join("|");
      } else {
        fixedMonastery.gender = bundle[0].gender;
      }
      fixed.push(fixedMonastery);
    });

    fixed.sort((a, b) =>
      a.sourceRecords.length > b.sourceRecords.length ? -1 : 1
    );

    fs.writeFile(this.filePath, JSON.stringify(fixed, null, 2), () => {
      console.log("fixed store saved");
    });
  }

  /* changing values of monastery entries */
  fixes = {
    makePoints: monastery => {
      if (monastery.geo && monastery.geo.lng && monastery.geo.lat) {
        monastery.point = turf.point([monastery.geo.lng, monastery.geo.lat]);
      }
      return monastery;
    },
    // check if the order id is valid and if the gender is right
    checkOrderId: monastery => {
      return monastery;
    },
    checkOrderGender: monastery => {
      return monastery;
    },
    checkOrderDate: monastery => {
      return monastery;
    }
  };

  /* filtering valid monastery entries */
  checks = {
    validCoordinates: monastery => {
      const geo = monastery.geo;
      return (
        geo &&
        geo.lng &&
        geo.lat &&
        Base.isNumeric(geo.lng) &&
        Base.isNumeric(geo.lat)
      );
    },

    extent: monastery => {
      const geo = monastery.geo;
      if (geo && geo.lng && geo.lat) {
        const point = turf.point([geo.lng, geo.lat]);

        return turf.inside(point, extentPolygon);
      }
      return false;
    },

    // todo
    middleage: monastery => {
      return true;
    },
    // todo
    isLateAndWithNoOrder: monastery => {
      return true;
    }
  };
}
