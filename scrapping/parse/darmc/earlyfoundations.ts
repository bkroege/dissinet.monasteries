import { DarmcParser } from "./parser";

export class earlyFoundationsDarmcParser extends DarmcParser {
  parseMonastery(monastery, next) {
    const html = monastery.html;

    monastery.addName(monastery.html.Display_Name);
    monastery.addName(monastery.html.Name2, { primary: false });
    monastery.addName(monastery.html.Alternate_name, { primary: false });
    monastery.addName(monastery.html.Latin_Name, {
      primary: false,
      lang: "la"
    });

    const time = {
      from: { post: html.FOUNDATION_EARLY, ante: html.FOUNDATION_LATE }
    };

    monastery.setGeo({
      lat: html.Lat,
      lng: html.Long_
    });

    monastery.addOrder({ id: html.Affiliation || "" }, time);

    monastery.finishParsing();
    monastery.save(this.store);
    next();
  }
}
