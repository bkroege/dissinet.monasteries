var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
import { Parser } from "../parser";
import Base from "../../base";

var data = require("./vafl-collegiales-data");

export class collegialesVaflParser extends Parser {
  initialiseRecords(next) {
    data.features.forEach(d => {
      this.addMonastery({
        coordinates: d.geometry.coordinates,
        id: d.id,
        color: d.properties.pinColor
      });
    });
    next();
  }

  parseMonastery(monastery, next) {
    monastery.setCoordinates({
      lng: monastery.html.coordinates[0],
      lat: monastery.html.coordinates[1]
    });

    monastery.setType("collegiate churches");

    // data not filled
    if (monastery.data.color !== "#FFFF00" && monastery.html.id) {
      request(this.meta.rootUrl + monastery.html.id, (err, resp, html) => {
        if (html) {
          const $ = cheerio.load(html);
          monastery.setName($("h1[property='dc:title']").text());

          // time
          if ($('h2:contains("Chronologie")')) {
            $('h2:contains("Chronologie")')
              .next()
              .find(".main_info")
              .map((ti, time) => {
                const content = $(time).text();
                if (content.includes("Fondation")) {
                  monastery.setParam("establishment", content);
                }
                if (content.includes("Disparition")) {
                  monastery.setParam("disappearance", content);
                }
                if (content.includes("Attestation")) {
                  monastery.setParam("certificate", content);
                }
              });
          }

          $(
            'h4:contains("État antérieur"),h4:contains("État du chapitre"),h4:contains("État postérieur") '
          )
            .next()
            .find("li span.main_info")
            .map((oi, oInfo) => {
              const content = $(oInfo).text();
              if (content.includes("féminine")) {
                monastery.setGender("", "f");
              } else if (content.includes("masculine")) {
                monastery.setGender("", "m");
              }

              const order = {
                from: false,
                to: false,
                note: content
              };
              const words = content.split(" ");

              const timeWords = ["et", "entre", "partir", "en"];

              words.forEach(word => {
                if (word === "et") {
                  const toI = content.indexOf(" et ");
                  const fromI = content.indexOf(" entre ");
                  order.to = content.substring(toI + 4);
                  order.from = content.substring(fromI + 7, toI);
                } else if (word === "jusque") {
                  const toI = content.indexOf(" jusque ");
                  order.to = content.substring(toI + 8);
                } else if (word === "partir") {
                  const fromI = content.indexOf(" partir de ");
                  order.to = content.substring(fromI + 11);
                }
              });

              monastery.parseAndAddOrder(order);
              /*
              ['et']
              ['entre', 'à partir de']
              ['en']
              */
              //console.log("-" + content);
            });
        }
        monastery.finishParsing();
        monastery.save(this.store);
        next();
      });
    }
  }
}
