import Base from "./base";
import { timingSafeEqual } from "crypto";

export class Monastery {
  data: any = {};
  store: false;
  meta: any = {};

  parsed = false;
  saved = false;
  html = "";

  constructor(html, meta) {
    this.meta = meta;
    this.html = html;
    this.data = {
      id: Base.generateUuid(),
      source: meta.id,
      name: "",
      link: false,
      coordinates: {
        lat: false,
        lng: false
      },
      gender: {
        value: false,
        note: ""
      },
      orders: []
    };
  }

  setParam(paramName, value): void {
    this.data[paramName] = value;
  }

  setLink(link): void {
    this.data.link = link;
  }

  setSource(source): void {
    this.data.source = source;
  }

  setGender(note, value): void {
    this.data.gender = {
      note: Base.cleanText(note, { trim: true, chars: ["\n", ":", "[", "("] }),
      value: value
    };
  }

  setCoordinates(values: { lat; lng }): void {
    this.data.coordinates = {
      lat: Base.cleanCoordinates(values.lat),
      lng: Base.cleanCoordinates(values.lng)
    };
  }

  setName(value): void {
    this.data.name = Base.cleanText(value, {
      trim: true,
      chars: ["\n", ":", "[", "("]
    });
  }

  addOrder(newOrder): void {
    this.data.orders.push(newOrder);
  }

  addEmptyOrder(note = ""): void {
    const emptyOrder = {
      name: this.meta.order,
      from: false,
      to: false,
      fromNote: "",
      toNote: "",
      note: note
    };
    this.addOrder(emptyOrder);
  }

  finishParsing(): void {
    this.parsed = true;
  }

  save(store): void {
    store.add(this.data);
    this.saved = true;
  }
}
