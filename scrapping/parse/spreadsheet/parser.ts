var request = require("request");
var cheerio = require("cheerio");
import { Parser } from "./../parser";

var GoogleSpreadsheet = require("google-spreadsheet");

export class SpreadsheetParser extends Parser {
  initialiseRecords(next) {
    // spreadsheet key is the long id in the sheets URL
    var doc = new GoogleSpreadsheet(this.meta.url);

    doc.getInfo((e, info) => {
      const worksheet = info.worksheets[0];
      worksheet.getRows((e, rows) => {
        rows.map(row => {
          this.addMonastery(row);
        });
        next();
      });
    });
  }
}
