import * as React from "react";
import { Component } from "react";

interface ResultButtonsProps {
  bogey: string;
  win: string;
  resultCallback: (result: string) => void;
}

interface ResultButtonsState {}

class ResultButtons extends Component<ResultButtonsProps, ResultButtonsState> {
  constructor(props: ResultButtonsProps) {
    super(props);
  }

  render() {
    return (
      <div className="result-buttons">
        <button
          onClick={() => {
            this.props.resultCallback(this.props.win);
          }}
        >
          {this.props.win}
        </button>
        <button
          onClick={() => {
            this.props.resultCallback(this.props.bogey);
          }}
        >
          {this.props.bogey}
        </button>
      </div>
    );
  }
}

export default ResultButtons;
