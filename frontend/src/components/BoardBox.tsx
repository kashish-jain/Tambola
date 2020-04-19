import React, { FunctionComponent } from "react";

type BoardBoxProps = {
  value: number;
};

export let BoardBox: FunctionComponent<BoardBoxProps> = ({
  value,
}: BoardBoxProps) => {
  return <p className="board-box">{value}</p>;
};
