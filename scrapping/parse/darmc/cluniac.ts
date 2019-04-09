import { DarmcParser } from "./parser";
import BASE from "../../base";

export class cluniacDarmcParser extends DarmcParser {
  parseMonastery(monastery, next) {
    const html = monastery.html;
    monastery.addName(html.NAME, { primary: true });

    const time = BASE.timeParse({
      from: html.Founded
    });

    monastery.addStatus(
      {
        id: html.type
      },
      time
    );

    if (html.DESCR) {
      monastery.setParam("note", html.DESCR);
    }

    monastery.setGeo({
      lat: html.Lat,
      lng: html.Long
    });

    monastery.addOrder({}, time);

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
