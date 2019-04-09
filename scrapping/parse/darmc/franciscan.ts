import { DarmcParser } from "./parser";
import BASE from "../../base";

export class franciscanDarmcParser extends DarmcParser {
  parseMonastery(monastery, next) {
    const html = monastery.html;
    monastery.addName(html.NAME, { primary: true });

    const time = this.meta.time;

    monastery.addStatus(
      {
        id: html.type
      },
      time
    );
    monastery.addOrder({}, time);

    monastery.setParam("note", html.DESCR);

    monastery.setGeo({
      lat: html.Lat,
      lng: html.Long
    });

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
