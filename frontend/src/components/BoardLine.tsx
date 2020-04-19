import React, { FunctionComponent } from "react";
import { BoardBox } from "./BoardBox";

type BoardLineProps = {
  numbers: Array<number>;
};

export let BoardLine: FunctionComponent<BoardLineProps> = ({
  numbers,
}: BoardLineProps) => {
  let boxes = numbers.map(function (number) {
    return <BoardBox value={number} />;
  });
  return <div style={{ display: "flex" }}>{boxes}</div>;
};
