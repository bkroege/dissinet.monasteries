var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiFrParser } from "./parser";

export class cisteciennesWikiFrParer extends WikiFrParser {
  initialiseRecords(next) {
    const response = [];
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        $("table.wikitable tbody tr").map((ri, record) => {
          response.push(this.monasteryCreator(record));
        });
      }
      next(response);
    });
  }
}
