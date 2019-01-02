var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiFrParser } from "./parser";

export class premonstransiansWikiFrParer extends WikiFrParser {
  initialiseRecords(next) {
    const response = [];
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        $(".mw-parser-output ul li").map((ri, record) => {
          response.push(this.monasteryCreator(record));
        });
      }
      next(response);
    });
  }
}
