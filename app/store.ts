import { keys, toJS, observable, action, computed } from "mobx";

export default class AppStore {
  data;
  _orders;

  _center;
  _zoom;
  _extent;

  constructor(data, orders) {
    this.data = data;
    console.log(orders);
    this._orders = observable.array(orders, { deep: true });

    this._center = observable.box([48, 2]);
    this._zoom = observable.box(6);
    this._extent = observable.box([[10, 10], [20, 20]]);
  }

  @computed get orders() {
    return toJS(this._orders);
  }

  @computed
  get extent(): Array<number> {
    return toJS(this._extent);
  }

  @computed
  get center(): Array<Number> {
    return toJS(this._center);
  }

  @computed
  get zoom(): Number {
    return this._zoom.get();
  }

  @computed
  get activeData() {
    return this.data.map(point => {
      const coordinates = point.point.geometry.coordinates;
      return {
        id: point.id,
        geo: [coordinates[1], coordinates[0]],
        data: point
      };
    });
  }

  @action activateOrder(orderName) {
    const newOrders = this.orders;
    const orderToActivate = newOrders.find(o => o.name === orderName);
    if (orderToActivate) {
      orderToActivate.active = true;
    }
    this._orders.replace(newOrders);
  }

  @action deactivateOrder(orderName) {
    const newOrders = this.orders;
    const orderToDeactivate = newOrders.find(o => o.name === orderName);
    if (orderToDeactivate) {
      orderToDeactivate.active = false;
    }
    this._orders.replace(newOrders);
  }

  @action toggleOrder(orderName) {
    const orderToToggle = this.orders.find(o => o.name === orderName);
    if (orderToToggle) {
      orderToToggle.active
        ? this.deactivateOrder(orderName)
        : this.activateOrder(orderName);
    }
  }

  @action
  mapMoved(
    newCenter: Array<Number>,
    newZoom: Number,
    newExtent: Array<Number>
  ): void {
    this._center.set(newCenter);
    this._zoom.set(newZoom);
    this._extent.set(newExtent);
    //window["stores"].selection.updateSpace(newExtent);
  }
}
