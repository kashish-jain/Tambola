import * as React from "react";
import { Component } from "react";
import Box from "./Box";
import { BoxState } from "./Box";

function generateBoxComponents(
  numbers: Array<BoxState>,
  callback: (boxIndex: number, check: boolean) => void
) {
  let boxes = [];
  for (let i = 0; i < numbers.length; ++i) {
    boxes[i] = (
      <Box
        key={i}
        value={numbers[i].value}
        check={numbers[i].check}
        changeTicketState={callback}
        index={i}
      />
    );
  }
  return boxes;
}

interface LineProps {
  index: number;
  numbers: Array<BoxState>;
  changeTicketState: (
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ) => void;
}

interface LineState {}

class Line extends Component<LineProps, LineState> {
  constructor(props: LineProps) {
    super(props);
  }

  // this callback will be envoked from box component when it gets clicked
  changeTicketState = (boxIndex: number, check: boolean) => {
    this.props.changeTicketState(this.props.index, boxIndex, check);
  };

  boxes = generateBoxComponents(this.props.numbers, this.changeTicketState);

  render() {
    return <div className="line">{this.boxes}</div>;
  }
}

export default Line;
