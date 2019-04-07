import { DarmcParser } from "./parser";

export class praemonstratensiansDarmcParser extends DarmcParser {
  parseMonastery(monastery, next) {
    const html = monastery.html;
    monastery.addName(monastery.html.NAME, { primary: true });
    monastery.addName(monastery.html.ALTERN, { primary: false });

    const time = {
      from: { post: html.FOUNDED, ante: html.BEGIN_ },
      to: { ante: html.END_ }
    };

    monastery.setParam("note", monastery.html.DESCR);

    monastery.setGeo({
      lat: monastery.html.DEC_LAT,
      lng: monastery.html.DEC_LONG
    });

    monastery.addEmptyOrder(time);

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
