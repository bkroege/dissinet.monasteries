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

  render() {
    const store = this.props.store;
    console.log("activeRecordsCount", store.activeRecordsCount);
    const active = store.activeMonasteries;
    console.log(store.data.filter(d => !active.map(a => a.id).includes(d.id)));
    return (
      <div className="panel">
        <h1 className="title">Monasteries in France</h1>
        <h2 className="subtitle">
          Showing {store.activeRecordsCount} / {store.recordsCountAll} records
        </h2>
        <p />
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
        </div>
      </div>
    );
  }
}
