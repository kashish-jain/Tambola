import React, { FunctionComponent } from "react";

// This is not being used right now. The intent was that after generating the new number,
// the corresponding box on the board changes color by itself. But the better idea is to
// let the host change the board values actually or keep track of board values;


type BoardBoxProps = {
  value: number;
  gone ?: boolean
};

export let BoardBox: FunctionComponent<BoardBoxProps> = ({
  value,
  gone
}: BoardBoxProps) => {
    let color = (gone === true) ? "red" : "";
  return <p className="board-box" style={{backgroundColor: color}}>{value}</p>;
};
