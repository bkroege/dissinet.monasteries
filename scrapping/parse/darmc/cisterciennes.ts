import { DarmcParser } from "./parser";

export class cisterciennesDarmcParser extends DarmcParser {
  parseMonastery(monastery, next) {
    const html = monastery.html;

    monastery.addName(monastery.html.DISP_NAME);
    monastery.addName(monastery.html.ALT_NAME, { primary: false });
    monastery.addName(monastery.html.ALT_NAME_2, { primary: false });
    monastery.addName(monastery.html.LATIN_NAME, {
      primary: false,
      lang: "latin"
    });

    const time = {
      from: { post: html.F_DATE },
      to: { post: html.D_DATE }
    };

    monastery.setParam("note", html.NOTES);

    monastery.setGeo({
      lat: html.LATITUDE,
      lng: html.LONGITUDE
    });

    monastery.addEmptyOrder(time);

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
