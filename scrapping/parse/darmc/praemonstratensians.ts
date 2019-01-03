import { DarmcParser } from "./parser";

export class praemonstratensiansDarmcParser extends DarmcParser {
  parseMonastery(monastery, next) {
    monastery.setName(monastery.html.NAME);
    monastery.setType(monastery.html.Type);
    monastery.setParam("establishment", monastery.html.FOUNDED);
    monastery.setParam("closing", monastery.html.END);

    monastery.setCoordinates({
      lat: monastery.html.DEC_LAT,
      lng: monastery.html.DEC_LONG
    });

    monastery.addEmptyOrder();

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
