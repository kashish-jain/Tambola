import * as React from "react";
import { Component } from "react";
import Box from "./Box";
import { BoxState } from "./Box";

function generateBoxComponents(numbers: Array<BoxState>) {
  let boxes = [];
  for (let i = 0; i < numbers.length; ++i) {
    boxes[i] = (
      <Box key={i} value={numbers[i].value} check={numbers[i].check} />
    );
  }
  return boxes;
}

interface LineProps {
  index: number;
  numbers: Array<BoxState>;
}

interface LineState {}

class Line extends Component<LineProps, LineState> {
  constructor(props: LineProps) {
    super(props);
  }

  boxes = generateBoxComponents(this.props.numbers);

  render() {
    return <div style={{ display: "flex" }}>{this.boxes}</div>;
  }
}

export default Line;
