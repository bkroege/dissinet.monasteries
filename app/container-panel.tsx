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

  handleOrderFilter(e) {
    this.props.store.toggleOrder(e.target.value);
  }

  handleCategoryFilter(e) {
    this.props.store.toggleCategory(e.target.value);
  }

  handleGenderFilter(e) {
    this.props.store.toggleGender(e.target.value);
  }
  handleStatusFilter(e) {
    this.props.store.toggleStatus(e.target.value);
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

  renderCheckbox(data: { key; value; label; checked; event }) {
    return (
      <div className="field checkbox only-label is-small" key={data.key}>
        <input
          className="is-checkradio is-black no-borders is-small"
          type="checkbox"
          name="all"
          onChange={data.event ? data.event.bind(this) : () => {}}
          checked={data.checked}
          value={data.value}
          id={data.label}
          style={{}}
        />
        <label htmlFor={data.label}>
          <span className="legend-color" />
          <span className="legend-name is-small">{data.label}</span>
        </label>
      </div>
    );
  }

  render() {
    const store = this.props.store;
    console.log("activeRecordsCount", store.activeRecordsCount);
    const active = store.activeMonasteries;
    console.log("data active", store.activeMonasteries);

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
          {filters.orders
            .filter(og => og.branches.length)
            .map((orderGroup, oi) => {
              return (
                <div key={oi}>
                  {this.renderHeading2(orderGroup.label)}
                  {orderGroup.branches.map((branch, bi) => {
                    return this.renderCheckbox({
                      key: bi,
                      label: branch.label,
                      value: branch.value,
                      event: this.handleOrderFilter,
                      checked: branch.active
                    });
                  })}
                </div>
              );
            })}
          <hr />
        </div>

        <div key="status" className="panel-section status">
          {/* status */}
          {this.renderHeading1("status")}
          {filters.status.map((status, si) => {
            return this.renderCheckbox({
              key: si,
              label: status.label,
              value: status.value,
              event: this.handleStatusFilter,
              checked: status.active
            });
          })}
          <hr />
        </div>

        <div key="gender" className="panel-section gender">
          {/* gender */}
          {this.renderHeading1("gender")}
          {filters.gender.map((gender, gi) => {
            return this.renderCheckbox({
              key: gi,
              label: gender.label,
              value: gender.value,
              event: this.handleGenderFilter,
              checked: gender.active
            });
          })}
          <hr />
        </div>

        <div key="category" className="panel-section category">
          {/* category */}
          {this.renderHeading1("category")}
          {filters.category.map((category, ci) => {
            return this.renderCheckbox({
              key: ci,
              label: category.label,
              value: category.value,
              event: this.handleCategoryFilter,
              checked: category.active
            });
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
