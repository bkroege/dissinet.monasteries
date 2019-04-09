var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiParser } from "./parser";
import BASE from "../../base";

export class benedictinesWikiFrParser extends WikiParser {
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
        const names = BASE.cleanText($(column).text()).split("ou ");

        names.forEach((name, ni) => {
          monastery.addName(name, { primary: ni === 0 });
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
        const genderText = BASE.cleanText(
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
        const dateText = BASE.cleanText($(column).text());

        const occurences = dateText.split(", puis");

        occurences.map(occurence => {
          const time = BASE.timeParse({ all: occurence }, { lang: "fr" });
          monastery.addStatus({}, time);
          monastery.addOrder({ gender: gender }, time);
        });
      }

      if (ci === 4) {
        const link = $(column).find("a");
        if (link.length) {
          monastery.setParam(
            "localityLink",
            this.meta.rootUrl + link.attr("href")
          );
        }
      }
    });

    this.getLocalityGeo(monastery, () => {
      this.inspectWikiPage(monastery, () => {
        monastery.finishParsing();
        monastery.save(this.store);
        next();
      });
    });
  }
}
