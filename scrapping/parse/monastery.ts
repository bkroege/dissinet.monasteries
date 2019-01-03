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
      type: "",
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
  setType(newType): void {
    this.data.type = newType;
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
    if (!newOrder.order && this.meta.order) {
      newOrder.order = this.meta.order;
    }
    this.data.orders.push(newOrder);
  }

  parseAndAddOrder(newOrder): void {
    const parsedFrom = parseInt(newOrder.from) || false;
    const parsedTo = parseInt(newOrder.to) || false;

    this.addOrder({
      from: parsedFrom,
      to: parsedTo,
      fromNote:
        newOrder.from == parsedFrom
          ? ""
          : Base.cleanText(newOrder.from, { trim: false }),
      toNote:
        newOrder.to == parsedTo
          ? ""
          : Base.cleanText(newOrder.to, { trim: false }),
      note: newOrder.note
    });
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
