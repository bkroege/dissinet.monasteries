import { keys, toJS, observable, action, computed } from "mobx";

export default class AppStore {
  data;
  orders;

  mapZoom;
  mapExtent;

  constructor(data, orders) {
    this.data = data;
    this.orders = observable.array(orders, { deep: true });
  }
}
