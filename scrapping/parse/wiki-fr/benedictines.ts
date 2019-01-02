var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiFrParser } from "./parser";
import { Monastery } from "./../monastery";

export class benedictinesWikiFrParer extends WikiFrParser {
  initialiseRecords(next) {
    const response = [];
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        $("table.wikitable").map((ri, table) => {
          if (ri > -1) {
            $(table)
              .find("tr")
              .map((ti, row) => {
                response.push(this.monasteryCreator(row));
              });
          }
        });
      }
      next(response);
    });
  }
}
