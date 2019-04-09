import { DarmcParser } from "./parser";
import BASE from "../../base";

export class praemonstratensiansDarmcParser extends DarmcParser {
  parseMonastery(monastery, next) {
    const html = monastery.html;
    monastery.addName(monastery.html.NAME, { primary: true });
    monastery.addName(monastery.html.ALTERN, { primary: false });

    const time = BASE.timeParse({
      from: html.BEGIN_,
      to: html.END_
    });

    monastery.setGeo({
      lat: monastery.html.DEC_LAT,
      lng: monastery.html.DEC_LONG
    });

    monastery.addOrder({}, time);
    monastery.addStatus({}, time);

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
