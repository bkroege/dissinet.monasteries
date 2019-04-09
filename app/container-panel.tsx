import React from "react";
import { observer } from "mobx-react";

@observer
export default class ContainerPanel extends React.Component<any, any> {
  refs;
  props;
  mapEl;

  constructor(props: any) {
    super(props);
  }

  handleCheckboxClick(e) {
    console.log("checkbox clicked", e.target.value);
    this.props.store.toggleOrder(e.target.value);
  }

  handleAllCheckboxClick() {
    this.props.store.toggleAllOrder();
  }

  handleDownloadClick() {
    this.props.store.download();
  }

  renderHeading1(content) {
    return (
      <p key={content} className="is-4 title section-label">
        {content}
      </p>
    );
  }
  renderHeading2(content) {
    return (
      <p key={content} className="is-6 subtitle section-label">
        {content}
      </p>
    );
  }

  renderCheckbox(key, label, checked, opts = {}) {
    return (
      <div className="field checkbox only-label is-small" key={key}>
        <input
          className="is-checkradio is-black no-borders is-small"
          type="checkbox"
          name="all"
          onChange={this.handleAllCheckboxClick.bind(this)}
          checked={checked}
          value="all"
          id="all"
          style={{}}
        />
        <label htmlFor="all">
          <span className="legend-color" />
          <span className="legend-name is-small">{label}</span>
        </label>
      </div>
    );
  }

  render() {
    const store = this.props.store;
    console.log("activeRecordsCount", store.activeRecordsCount);
    const active = store.activeMonasteries;
    console.log(store.data.filter(d => !active.map(a => a.id).includes(d.id)));

    const filters = store.filters;

    const allLabel = store.allOrdersActive
      ? "uncheck all orders"
      : "check all orders";
    return (
      <div className="panel">
        <h1 className="title">Monasteries and convents in France</h1>
        <h2 className="subtitle">
          Showing {store.activeRecordsCount} / {store.recordsCountAll} records
        </h2>

        {/* order */}
        <div key="orders" className="panel-section orders">
          {this.renderHeading1("orders")}
          {Object.keys(filters.orders).map((orderName, oi) => {
            const order = filters.orders[orderName];
            return (
              <div key={oi}>
                {this.renderHeading2(orderName)}
                {Object.keys(order.branches).map((branchName, bi) => {
                  return this.renderCheckbox(
                    bi,
                    branchName,
                    order.branches[branchName],
                    {}
                  );
                })}
              </div>
            );
          })}
          <hr />
        </div>

        <div key="status" className="panel-section status">
          {/* status */}
          {this.renderHeading1("status")}
          {Object.keys(filters.status).map((status, si) => {
            return this.renderCheckbox(si, status, filters.status[status], {});
          })}
          <hr />
        </div>

        <div key="gender" className="panel-section gender">
          {/* gender */}
          {this.renderHeading1("gender")}
          {Object.keys(filters.gender).map((gender, gi) => {
            return this.renderCheckbox(gi, gender, filters.gender[gender], {});
          })}
          <hr />
        </div>

        <div key="category" className="panel-section category">
          {/* category */}
          {this.renderHeading1("category")}
          {Object.keys(filters.category).map((category, ci) => {
            return this.renderCheckbox(
              ci,
              category,
              filters.category[category],
              {}
            );
          })}
          <hr />
        </div>

        <div>
          <hr />
          <div
            className="button-bar"
            onClick={this.handleDownloadClick.bind(this)}
          >
            <a className="button is-black">Download</a>
          </div>
        </div>
      </div>
    );
  }
}
