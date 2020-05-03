import * as React from "react";
import { Component } from "react";

interface GoneNumbersProps {
  numbers: Array<number>;
}

interface GoneNumbersState {
  isShown: boolean;
}

class GoneNumbers extends Component<GoneNumbersProps, GoneNumbersState> {
  constructor(props: GoneNumbersProps) {
    super(props);
    this.state = {
      isShown: false,
    };
  }

  render() {
    let mainComp = [];
    if (this.state.isShown) {
      for (let i = this.props.numbers.length - 1; i >= 0; --i) {
        mainComp.push(<p key={i}>{this.props.numbers[i]}</p>);
      }
    }

    return (
      <div className="gone-numbers-container">
        <button
          onClick={() => {
            this.setState({ isShown: !this.state.isShown });
          }}
        >
          {this.state.isShown ? "Hide Gone Numbers" : "Show Gone Numbers"}
        </button>
        <div className="gone-numbers-menu animated fadeIn">{mainComp}</div>
      </div>
    );
  }
}

export default GoneNumbers;
