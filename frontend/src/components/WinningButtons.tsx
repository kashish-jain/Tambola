import * as React from "react";
import { Component } from "react";

interface WinningButtonsProps {
  firstLine: string;
  secondLine: string;
  thirdLine: string;
  corners: string;
  fullHouse: string;
  winCallBack: (callWinType: string) => void;
}

interface WinningButtonsState {}

class WinningButtons extends Component<
  WinningButtonsProps,
  WinningButtonsState
> {
  constructor(props: WinningButtonsProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.props.winCallBack(this.props.firstLine);
          }}
        >
          {this.props.firstLine}
        </button>

        <button
          onClick={() => {
            this.props.winCallBack(this.props.secondLine);
          }}
        >
          {this.props.secondLine}
        </button>

        <button
          onClick={() => {
            this.props.winCallBack(this.props.thirdLine);
          }}
        >
          {this.props.thirdLine}
        </button>

        <button
          onClick={() => {
            this.props.winCallBack(this.props.corners);
          }}
        >
          {this.props.corners}
        </button>

        <button
          onClick={() => {
            this.props.winCallBack(this.props.fullHouse);
          }}
        >
          {this.props.fullHouse}
        </button>
      </div>
    );
  }
}

export default WinningButtons;
