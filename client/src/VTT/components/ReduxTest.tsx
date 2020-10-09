
import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux'

interface AppState {
  isOn: boolean
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  isOn: state.app.isOn
})

const mapDispatch = {
  toggleOn: () => ({ type: 'TOGGLE_IS_ON' })
}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  backgroundColor: string
}
export interface IComponentStateType {
  // playMap: PlayMap | null;
  mode: string;
  mapMode: string;
  selectedTokenID: number;
  hoveredTokenID: number;
  deselecting: boolean;
}

class MyComponent extends Component<
  Props,
  IComponentStateType
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // playMap: null,
      mode: "main",
      mapMode: "pan",
      selectedTokenID: -1,
      hoveredTokenID: -1,
      deselecting: false
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div style={{ backgroundColor: this.props.backgroundColor }}>
        <button onClick={this.props.toggleOn}>
          Toggle is {this.props.isOn ? 'ON' : 'OFF'}
        </button>
      </div>
    );
  }
}
// const MyComponent = (props: Props) => (
//   <div style={{ backgroundColor: props.backgroundColor }}>
//     <button onClick={props.toggleOn}>
//       Toggle is {props.isOn ? 'ON' : 'OFF'}
//     </button>
//   </div>
// )

export default connector(MyComponent)