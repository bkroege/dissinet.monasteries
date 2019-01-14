import React from "react";
import { observer } from "mobx-react";
import ContainerMap from "./container-map";
import ContainerPanel from "./container-panel";

@observer
export default class AppContainer extends React.Component<any, any> {
  props;

  constructor(props: any) {
    super(props);
  }

  render() {
    const store = this.props.store;
    return (
      <div className="wrapper">
        <ContainerMap store={store} />
        <ContainerPanel store={store} />
      </div>
    );
  }
}
