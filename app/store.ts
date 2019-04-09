import { keys, toJS, observable, action, computed } from "mobx";
var JSZip = require("jszip");

export default class AppStore {
  data;
  _filters;

  _center;
  _zoom;
  _extent;

  constructor(data, filters) {
    this.data = data;
    this._filters = observable.map(filters, { deep: true });

    this._center = observable.box([48, 2]);
    this._zoom = observable.box(6);
    this._extent = observable.box([[10, 10], [20, 20]]);
  }

  @computed get filters() {
    return toJS(this._filters);
  }
  @computed get branchNames() {
    return [];
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

  @computed get activeMonasteries() {
    return this.data;
  }

  @computed get activeRecordsCount() {
    return this.activeMonasteries.length;
  }

  @computed get recordsCountAll() {
    return this.data.length;
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

    const geojsonMonasteries = monasteriesToDownload.map(monastery => {
      monastery.point.properties.name = monastery.name;
      monastery.point.properties.orders = monastery.orders;
      monastery.point.properties.id = monastery.id;
      return monastery.point;
    });

    var anchor = document.createElement("a");

    const zip = new JSZip();
    const text = encodeURIComponent(
      JSON.stringify({
        type: "FeatureCollection",
        features: geojsonMonasteries
      })
    );

    anchor.href = "data:text/html," + JSON.stringify(text);
    anchor.target = "_blank";
    anchor.download = "test.geojson";
    anchor.click();

    /*
    zip.file("monasteries.json", text);
    zip.generateAsync({ type: "base64" }).then(base64 => {
      console.log(base64);
      anchor.href = "data:application/zip;base64," + base64;
      anchor.target = "_blank";
      anchor.download = "test.zip";
      anchor.click();
    });
    */
  }
}
