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
    console.log(this.data);

    const genderOk = m => {
      const mGenders = m.orders.map(o => o.gender);
      return mGenders.some(g => this.allowedGenders.includes(g));
    };

    // gender
    return this.data.filter(genderOk);
  }

  @computed get allowedGenders() {
    const gender = this.filters.gender;
    return Object.keys(gender).filter(o => gender[o]);
  }

  @computed get activeRecordsCount() {
    return this.activeMonasteries.length;
  }

  @computed get recordsCountAll() {
    return this.data.length;
  }

  @action toggleOrder(branchValueToToggle) {
    const newFilters = this.filters;

    newFilters.orders.forEach(order => {
      order.branches.forEach(branch => {
        if (branch.value === branchValueToToggle) {
          branch.active = !branch.active;
        }
      });
    });

    this._filters.replace(newFilters);
  }

  @action toggleStatus(statusValueToToggle) {
    const newFilters = this.filters;

    newFilters.status.forEach(status => {
      if (status.value === statusValueToToggle) {
        status.active = !status.active;
      }
    });

    this._filters.replace(newFilters);
  }

  @action toggleGender(genderValueToToggle) {
    const newFilters = this.filters;

    newFilters.gender.forEach(gender => {
      if (gender.value === genderValueToToggle) {
        gender.active = !gender.active;
      }
    });

    this._filters.replace(newFilters);
  }

  @action toggleCategory(categoryValueToToggle) {
    const newFilters = this.filters;

    newFilters.category.forEach(category => {
      if (category.value === categoryValueToToggle) {
        category.active = !category.active;
      }
    });

    this._filters.replace(newFilters);
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
