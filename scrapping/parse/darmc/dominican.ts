import { DarmcParser } from "./parser";
import BASE from "../../base";

export class dominicanDarmcParser extends DarmcParser {
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
    monastery.addOrder({}, time);

    monastery.setParam("note", html.COMMT);

    monastery.setGeo({
      lat: html.Lat,
      lng: html.Long
    });

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
