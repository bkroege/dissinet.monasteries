import Base from "./base";

export class Monastery {
  data: any = {};
  store: false;

  public parsed = false;
  public saved = false;

  constructor() {
    this.data = {
      id: Base.generateUuid(),
      name: "",
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

  setGender(note, value): void {
    this.data.gender = {
      note: note,
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
    this.data.name = value;
  }

  addOrder(newOrder): void {
    this.data.orders.push(newOrder);
  }

  addEmptyOrder(orderName): void {
    const emptyOrder = {
      name: orderName,
      from: false,
      to: false,
      fromNote: "",
      toNote: "",
      note: ""
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
