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
        <p />
        <div className="field checkbox only-label" key={0}>
          <input
            className="is-checkradio is-black no-borders"
            type="checkbox"
            name="all"
            onChange={this.handleAllCheckboxClick.bind(this)}
            checked={store.allOrdersActive}
            value="all"
            id="all"
            style={{}}
          />
          <label htmlFor="all">
            <span className="legend-color" />
            <span className="legend-name">{allLabel}</span>
          </label>
        </div>

        {/* status */}
        <h3 className="is-6 subtitle section-label">Status</h3>
        {Object.keys(filters.status).map((status, si) => {
          return this.renderCheckbox(si, status, filters.status[status], {});
        })}

        {/* gender */}
        <h3 className="is-6 subtitle section-label">Gender</h3>
        {Object.keys(filters.gender).map((gender, gi) => {
          return this.renderCheckbox(gi, gender, filters.gender[gender], {});
        })}

        {/* category */}
        <h3 className="is-6 subtitle section-label">Category</h3>
        {Object.keys(filters.category).map((category, ci) => {
          return this.renderCheckbox(
            ci,
            category,
            filters.category[category],
            {}
          );
        })}

        <h3 className="subtitle section-label">Monastic orders</h3>
        <div className="panel-control">
          {store.orders.map((order, oi) => {
            return (
              <div className="field checkbox only-label" key={oi}>
                <input
                  className="is-checkradio is-black no-borders"
                  id={oi}
                  type="checkbox"
                  name={order.name}
                  onChange={this.handleCheckboxClick.bind(this)}
                  checked={order.active}
                  value={order.name}
                  style={{
                    backgroundColor: order.color
                  }}
                />
                <label htmlFor={oi}>
                  <span
                    className="legend-color"
                    style={{
                      backgroundColor: order.color
                    }}
                  />
                  <span className="legend-name">{order.name}</span>
                </label>
              </div>
            );
          })}
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
