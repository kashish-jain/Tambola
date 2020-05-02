import * as React from "react";
import { FunctionComponent } from "react";
import Box, { BoxState } from "./Box";

interface BoardLineProps {
  index: number;
  numbers: Array<BoxState>;
}

export let BoardLine: FunctionComponent<BoardLineProps> = ({
  numbers,
}: BoardLineProps) => {
  let boxes = numbers.map(function (number) {
    return <Box value={number.value} check={number.check} />;
  });
  return <div className="board-line">{boxes}</div>;
};
