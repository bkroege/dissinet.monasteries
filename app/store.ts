import { keys, toJS, observable, action, computed } from "mobx";

export default class AppStore {
  data;
  orders;

  _center;
  _zoom;
  _extent;

  constructor(data, orders) {
    this.data = data;
    this.orders = observable.array(orders, { deep: true });

    this._center = observable.box([48, 2]);
    this._zoom = observable.box(6);
    this._extent = observable.box([[10, 10], [20, 20]]);
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
