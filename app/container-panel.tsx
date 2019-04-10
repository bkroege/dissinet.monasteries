import React from "react";
import { observer } from "mobx-react";
import InputRange from "react-input-range";

@observer
export default class ContainerPanel extends React.Component<any, any> {
  refs;
  props;
  mapEl;
  state;
  setState;

  constructor(props: any) {
    super(props);
    this.state = {
      time: {
        min: 350,
        max: 1500
      }
    };
  }

  handleTimeChange(value) {
    this.props.store.changeTime(value);
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
      <p key={content} className="is-6 title section-label">
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

  renderCheckbox(data: { key; value; label; checked; event; style? }) {
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
          <span className="legend-name is-small" style={data.style}>
            {data.label}
          </span>
        </label>
      </div>
    );
  }

  render() {
    const store = this.props.store;
    console.log("activeRecordsCount", store.activeRecordsCount);
    const filters = store.filters;

    const allLabel = store.allOrdersActive
      ? "uncheck all orders"
      : "check all orders";
    return (
      <div className="panel">
        <h1 className="title is-4">Monasteries and convents</h1>
        <h1 className="subtitle is-5">France, 4th-15th c.</h1>
        <h2 className="subtitle is-6 is-dark">
          {store.activeRecordsCount} / {store.recordsCountAll} records
        </h2>

        {/* time */}
        <div key="time" className="panel-section time">
          {this.renderHeading1("time")}
          <form className="form">
            <InputRange
              draggableTrack
              minValue={350}
              maxValue={1500}
              onChange={value => {
                this.setState({ time: value });
              }}
              onChangeComplete={this.handleTimeChange.bind(this)}
              value={this.state.time}
            />
          </form>
          <hr />
        </div>

        {/* order */}
        <div key="orders" className="panel-section orders">
          {this.renderHeading1("orders")}
          {filters.orders
            .filter(og => og.branches.length)
            .map((orderGroup, oi) => {
              return (
                <div className="order-group" key={oi}>
                  {/*this.renderHeading2(orderGroup.label)*/}
                  {orderGroup.branches.map((branch, bi) => {
                    return this.renderCheckbox({
                      key: bi,
                      label: branch.label,
                      value: branch.value,
                      event: this.handleOrderFilter,
                      checked: branch.active,
                      style: { backgroundColor: orderGroup.color }
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
