import React from "react";
import { observer } from "mobx-react";
import orders from "./orders";

@observer
export default class ContainerPanel extends React.Component<any, any> {
  refs;
  props;
  mapEl;

  constructor(props: any) {
    super(props);
  }

  render() {
    const store = this.props.store;
    return (
      <div className="panel">
        <div className="panel-wrapper" />
        <h1 className="title">Monasteries in France</h1>
        <h2 className="subtitle">
          Showing {store.activeRecordsCount} / {store.recordsCountAll} records
        </h2>
        <p />
        <h3 className="subtitle section-label">Monastic orders</h3>
        <div className="panel-control">
          {orders.map(order => {
            return <div>{order.name}</div>;
          })}
        </div>
      </div>
    );
  }
}
