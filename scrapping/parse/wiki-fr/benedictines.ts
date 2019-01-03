var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { WikiFrParser } from "./parser";
import Base from "./../base";

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
        monastery.setName($(column).text());

        // link
        const aEl = $(column).find("a");
        if (aEl.attr("class") !== "new") {
          const link = this.meta.rootUrl + aEl.attr("href");
          monastery.setLink(link);
        }
      }

      // gender
      if (ci === 1) {
        const genderText = Base.cleanText(
          $(column)
            .not("sup > *")
            .text(),
          {
            chars: ["\n"],
            trim: true
          }
        );

        let gender = "";
        let genderNote = "";
        if (genderText) {
          if (
            genderText.includes("moines") &&
            genderText.includes("moniales")
          ) {
            genderNote = genderText;
            gender = "d";
          } else if (genderText === "moines") {
            gender = "m";
          } else if (genderText === "moniales") {
            gender = "n";
          } else {
            genderNote = genderText;
          }
        }

        monastery.setGender(genderNote, gender);
      }

      // orders
      if (ci === 3) {
        const dateText = Base.cleanText($(column).text(), {
          chars: ["\n"],
          trim: true
        });

        const occurences = dateText.split(", puis");

        occurences.map(occurence => {
          const parts = occurence.split("-");

          if (parts.length === 2) {
            const parsedFrom = parseInt(parts[0]) || false;
            const parsedTo = parseInt(parts[1]) || false;
            monastery.addOrder({
              name: "benedictines",
              from: parsedFrom,
              to: parsedTo,
              fromNote:
                parts[0] == parsedFrom
                  ? ""
                  : Base.cleanText(parts[0], { trim: false }),
              toNote:
                parts[1] == parsedTo
                  ? ""
                  : Base.cleanText(parts[1], { trim: false }),
              note: ""
            });
          } else {
            monastery.addEmptyOrder(occurence);
          }
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
