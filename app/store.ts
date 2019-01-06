import { keys, toJS, observable, action, computed } from "mobx";

export default class AppStore {
  data;
  orders;

  mapZoom;
  mapExtent;

  constructor(data) {
    this.data = data;
    this.orders = observable({}, { deep: true });
  }
}
