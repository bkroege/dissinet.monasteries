import { keys, toJS, observable, action, computed } from "mobx";
var JSZip = require("jszip");

export default class AppStore {
  data;
  _orders;

  _center;
  _zoom;
  _extent;

  constructor(data, orders) {
    this.data = data;
    this._orders = observable.array(orders, { deep: true });

    this._center = observable.box([48, 2]);
    this._zoom = observable.box(6);
    this._extent = observable.box([[10, 10], [20, 20]]);
  }

  @computed get orders() {
    return toJS(this._orders);
  }

  @computed get allOrdersActive() {
    return this.orders.every(o => o.active);
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

  @computed get activeOrders() {
    return this.orders.filter(o => o.active);
  }
  @computed get activeOrdersNames() {
    const orderNames = [];
    this.activeOrders.forEach(order => {
      order.names.forEach(name => {
        orderNames.push(name.toLowerCase());
      });
    });
    return orderNames;
  }

  @computed get activeMonasteries() {
    return this.data.filter(monastery => {
      const monasteryOrders = monastery.orders.map(o => o.name);
      return monasteryOrders.some(orderName =>
        this.activeOrdersNames.includes(orderName)
      );
    });
  }

  @computed get activeRecordsCount() {
    return this.activeMonasteries.length;
  }

  @computed get recordsCountAll() {
    return this.data.length;
  }

  @computed
  get activeData() {
    return this.activeMonasteries.map(monastery => {
      const coordinates = monastery.point.geometry.coordinates;
      return {
        id: monastery.id,
        geo: [coordinates[1], coordinates[0]],
        data: monastery
      };
    });
  }

  orderByName(orders, orderName) {
    return orders.find(o => o.names.includes(orderName.toLowerCase()));
  }

  @action activateOrder(orderName) {
    const newOrders = this.orders;
    const orderToActivate = this.orderByName(newOrders, orderName)
    if (orderToActivate) {
      orderToActivate.active = true;
    }
    this._orders.replace(newOrders);
  }

  @action deactivateOrder(orderName) {
    const newOrders = this.orders;
    const orderToDeactivate = this.orderByName(newOrders, orderName)
    if (orderToDeactivate) {
      orderToDeactivate.active = false;
    }
    this._orders.replace(newOrders);
  }

  @action toggleOrder(orderName) {
    const orderToToggle = this.orderByName(this.orders, orderName)
    console.log(orderToToggle)
    if (orderToToggle) {
      orderToToggle.active
        ? this.deactivateOrder(orderName)
        : this.activateOrder(orderName);
    }
  }

  @action toggleAllOrder() {
    const newValue = !this.allOrdersActive;
    this._orders.replace(
      this.orders.map(o => {
        o.active = newValue;
        return o;
      })
    );
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

  download() {
    const monasteriesToDownload = this.activeMonasteries;

    var anchor = document.createElement("a");

    const zip = new JSZip();
    const text = encodeURIComponent(JSON.stringify(monasteriesToDownload));
    zip.file('monasteries.json', text)
    zip.generateAsync({type:"base64"}).then((base64) => {
      console.log(base64)
      anchor.href = "data:application/zip;base64," + base64;
      anchor.target = "_blank";
      anchor.download = "test.zip";
      anchor.click();
    }
  }
}
