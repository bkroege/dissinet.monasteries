var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiFrParser } from "./parser";
import Base from "../../base";

export class benedictinesWikiFrParser extends WikiFrParser {
  initialiseRecords(next) {
    request(this.meta.url, (err, resp, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        $("table.wikitable").map((ri, table) => {
          $(table)
            .find("tr")
            .map((ti, record) => this.addMonastery(record));
        });
      }
      next();
    });
  }

  parseMonastery(monastery, next) {
    const $ = cheerio.load(monastery.html);
    $("td").map((ci, column) => {
      if (ci === 0) {
        // name
        const names = Base.cleanText($(column).text()).split("ou ");

        names.forEach((name, ni) => {
          monastery.addName(name, ni === 0);
        });

        // link
        const aEl = $(column).find("a");
        if (aEl.attr("class") !== "new") {
          const link = this.meta.rootUrl + aEl.attr("href");
          monastery.setLink(link);
        }
      }

      // gender
      let gender: any = false;
      if (ci === 1) {
        const genderText = Base.cleanText(
          $(column)
            .not("sup > *")
            .text()
        );

        if (genderText) {
          if (
            genderText.includes("moines") &&
            genderText.includes("moniales")
          ) {
            gender = "d";
          } else if (genderText === "moines") {
            gender = "m";
          } else if (genderText === "moniales") {
            gender = "f";
          }
        }
      }

      // orders
      if (ci === 3) {
        const dateText = Base.cleanText($(column).text());

        const occurences = dateText.split(", puis");

        occurences.map(occurence => {
          const time = Base.prepareTime(occurence);
          monastery.addType("abbey", time);
          monastery.addOrder({ gender: gender }, time);
        });
      }
    });

    this.inspectWikiPage(monastery, () => {
      monastery.finishParsing();
      monastery.save(this.store);
      next();
    });
  }
}
