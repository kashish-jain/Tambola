import * as React from "react";
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

function Line(props: LineProps) {
  // this callback will be envoked from box component when it gets clicked
  let changeTicketState = (boxIndex: number, check: boolean) => {
    props.changeTicketState(props.index, boxIndex, check);
  };
  let boxes = generateBoxComponents(props.numbers, changeTicketState);

  return <div className="line">{boxes}</div>;
}

export default Line;
