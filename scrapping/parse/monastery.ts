import Base from "../base";

import { parsingTime } from "./../scrap";

export class TimeI {
  from: { ante; post };
  to: { ante; post };
  note?;

  constructor(values) {
    const validateDate = (fromTo, antePost) => {
      if (values && values[fromTo] && values[fromTo][antePost]) {
        return parseInt(values[fromTo][antePost], 10);
      } else {
        return false;
      }
    };

    this.from = {
      ante: validateDate("from", "ante"),
      post: validateDate("from", "post")
    };
    this.to = {
      ante: validateDate("to", "ante"),
      post: validateDate("to", "post")
    };

    if (values && values.note) {
      this.note = values.note;
    }
  }
}

export class StatusI {
  time: TimeI;
  id;
  note?;
  constructor(values, timeValues) {
    this.time = new TimeI(timeValues);
    this.id = values.id || "";
    if (this.note) {
      this.note = values.note;
    }
  }
}

export class OrderI {
  time: TimeI;
  id;
  note?;
  gender;
  constructor(values, timeValues) {
    this.time = new TimeI(timeValues);
    this.id = values.id.toLowerCase();
    if (this.note) {
      this.note = values.note;
    }
    this.gender = values.gender ? values.gender : false;
  }
}

export class GeoI {
  lat;
  lng;
  note?;
  precision;
  constructor(values: { lat?; lng?; note?; precision? }) {
    this.lat = values.lat ? Base.cleanCoordinates(values.lat) : false;
    this.lng = values.lng ? Base.cleanCoordinates(values.lng) : false;

    if (values.note) {
      this.note = Base.cleanText(values.note);
    }
    this.precision =
      values.precision && [1, 2, 3, 4].includes(values.precision)
        ? values.precision
        : 1;
  }
}

export class Monastery {
  data: any;
  html;
  meta: { id; type; order?; url?; status? };
  saved = false;
  parsed = false;

  constructor(meta: { id; type; status; order?; url? }, html) {
    this.meta = meta;
    this.html = html;
    this.data = {
      id: Base.generateUuid(),
      names: [],
      link: false,
      statuses: [],
      geo: new GeoI({ precision: 4 }),
      orders: []
    };
  }

  setParam(paramName, value): void {
    const cleaned = Base.cleanText(value);
    if (cleaned) {
      this.data[paramName] = cleaned;
    }
  }

  setLink(link): void {
    this.data.link = link;
  }

  addStatus(values, timeValues = {}): void {
    if (!values.id && this.meta.status) {
      values.id = this.meta.status;
    }
    const newStatus = new StatusI(values, timeValues);
    this.data.statuses.push(newStatus);
  }

  addOrder(orderValues, timeValues): void {
    if (!orderValues.id) {
      orderValues.id = this.meta.order;
    }
    const newOrder = new OrderI(orderValues, timeValues);
    this.data.orders.push(newOrder);
  }

  addEmptyOrder(): void {
    const newEmptyOrder = new OrderI({ id: this.meta.order }, {});
    this.data.orders.push(newEmptyOrder);
  }

  setSource(source): void {
    this.data.source = source;
  }

  setGeo(values: { lat; lng; note?; precision? }): void {
    this.data.geo = new GeoI(values);
  }

  addName(value, data = { primary: true, long: false, lang: "" }): void {
    const cleanedValue = Base.cleanText(value);
    if (cleanedValue) {
      this.data.names.push({
        value: cleanedValue,
        priority: data.primary || true,
        long: data.long || false,
        lang: data.lang || false
      });
    }
  }

  finishParsing(): void {
    this.data.meta = {
      timestamp: parsingTime,
      source: this.meta.id
    };
    this.parsed = true;
  }

  save(store): void {
    store.add(this.data);
    this.saved = true;
  }
}
