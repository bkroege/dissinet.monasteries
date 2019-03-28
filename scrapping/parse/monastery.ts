import Base from "../base";
import { timingSafeEqual } from "crypto";

export class TimeI {
  from: { ante; post };
  to: { ante; post };
  note?;

  constructor(values) {
    const validateDate = (fromTo, antePost) => {
      if (values[fromTo] && values[fromTo][antePost]) {
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

    if (values.note) {
      this.note = values.note;
    }
  }
}

export class TypeI {
  time: TimeI;
  id;
  note?;
  constructor(values, timeValues) {
    this.time = new TimeI(timeValues);
    this.id = values.id;
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
    this.id = values.id;
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
  meta: { id; type; order?; url? };
  saved = false;
  parsed = false;

  constructor(meta: { id; type; order?; url? }, html) {
    this.meta = meta;
    this.html = html;
    this.data = {
      id: Base.generateUuid(),
      names: [],
      source: meta.id,
      link: false,
      types: [],
      geo: new GeoI({}),
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

  addType(values, timeValues): void {
    const newType = new TypeI(values, timeValues);
    this.data.types.push(newType);
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

  addName(value, primary = true): void {
    const cleanedValue = Base.cleanText(value);
    if (cleanedValue) {
      this.data.names.push({
        value: cleanedValue,
        priority: primary
      });
    }
  }

  finishParsing(): void {
    this.parsed = true;
  }

  save(store): void {
    store.add(this.data);
    this.saved = true;
  }
}
