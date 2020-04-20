import * as React from "react";
import { Component } from "react";

// TODO: May be we can just remove the state in this component as whatever we need is in the props
// This is the component which is used by both BoardLine and also Line (ticket Line)

interface BoxProps {
  value: number;

  // Optional because BoardLine does not pass this, but
  // for generation of ticket it is passed;
  index?: number;
  check?: boolean;
  changeHouseState?: (index: number, check: boolean) => void;
}

export interface BoxState {
  value: number;
  check: boolean;
}

class Box extends Component<BoxProps, BoxState> {
  constructor(props: BoxProps) {
    super(props);
    this.state = {
      value: this.props.value,
      check: this.props.check === undefined ? false : this.props.check,
    };
  }
  clickHandler = () => {
    let invertCheck = this.state.check ? false : true;
    this.setState({ check: invertCheck, value: this.state.value });

    // Change house's state when clicked, only on ticket and not on board
    if (
      this.props.changeHouseState !== undefined &&
      this.props.index !== undefined
    ) {
      this.props.changeHouseState(this.props.index, invertCheck);
    }
  };
  render() {
    let checkedCssClass = this.state.check ? "checked" : "unchecked";
    return (
      <div className="box" onClick={this.clickHandler}>
        <div className={checkedCssClass}></div>
        <p>{this.props.value == 0 ? "" : this.props.value}</p>
      </div>
    );
  }
}

export default Box;
