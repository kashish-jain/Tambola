import React, { FunctionComponent } from "react";
import Box from "./Box";

type BoardLineProps = {
  numbers: Array<number>;
};

export let BoardLine: FunctionComponent<BoardLineProps> = ({
  numbers,
}: BoardLineProps) => {
  let boxes = numbers.map(function (number) {
    return <Box value={number} />;
  });
  return <div style={{ display: "flex" }}>{boxes}</div>;
};
