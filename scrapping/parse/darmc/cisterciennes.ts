import { DarmcParser } from "./parser";
import BASE from "./../../base";

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

    monastery.addStatus({}, time);
    monastery.addOrder({ gender: monastery.html.GENDER }, time);

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
