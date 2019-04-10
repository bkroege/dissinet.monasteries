import { DarmcParser } from "./parser";
import BASE from "./../../base";
import { inflate } from "zlib";

export class cisterciennesDarmcParser extends DarmcParser {
  parseMonastery(monastery, next) {
    const html = monastery.html;

    monastery.addName(monastery.html.DISP_NAME);
    monastery.addName(monastery.html.ALT_NAME, { primary: false });
    monastery.addName(monastery.html.ALT_NAME_2, { primary: false });
    monastery.addName(monastery.html.LATIN_NAME, {
      primary: false,
      lang: "la"
    });

    const time = BASE.timeParse({
      from: html.F_DATE,
      to: html.D_DATE
    });

    const notes = monastery.html.NOTES;
    const genderCode = monastery.html.GENDER;
    if (genderCode === "T") {
      if (notes) {
        const firstGender = notes.includes("ounded as male") ? "M" : "F";
        const secondGender = firstGender === "M" ? "F" : "M";

        const noteChunks = notes.split(";");
        const changeYear = parseInt(
          noteChunks[noteChunks.length - 1].match(/\d+$/),
          10
        );

        const firstDate = BASE.timeParse({ from: html.F_DATE, to: changeYear });
        const secondDate = BASE.timeParse({
          from: changeYear,
          to: html.D_DATE
        });

        monastery.addOrder({ gender: firstGender }, firstDate);
        monastery.addOrder({ gender: secondGender }, secondDate);
      }
    } else {
      monastery.addOrder({ gender: genderCode }, time);
    }

    monastery.addStatus({}, time);

    if (html.CITATION) {
      monastery.setParam("sourceliterature", html.CITATIOn);
    }
    monastery.setParam("mother", html.MOTHER);
    monastery.setParam("family", html.FAMILY);
    monastery.setParam("diocese", html.DIOCESE);

    monastery.setGeo({
      lat: html.LATITUDE,
      lng: html.LONGITUDE
    });

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
