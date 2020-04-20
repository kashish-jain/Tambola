import * as React from "react";
import { Component } from "react";

// This is the component which is used by both BoardLine and also Line (ticket Line)

interface BoxProps {
  value: number;

  // Optional because BoardLine does not pass this, but
  // for generation of ticket it is passed;
  index?: number;
  check?: boolean;
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
    let invertedCheck = !this.state.check;
    this.setState({ check: invertedCheck, value: this.state.value });
    console.log("clicked ", this.state);
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
