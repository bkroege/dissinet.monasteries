import React from "react";
import { observer } from "mobx-react";

@observer
export default class AppContainer extends React.Component<any, any> {
  props;
  constructor(props: any) {
    super(props);
  }
  public render() {
    return <div>app</div>;
  }
}
