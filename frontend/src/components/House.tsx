import * as React from "react";
import Line from "./Line";
import { BoxState } from "./Box";

interface HouseProps {
  houseIndex: number;
  houseNumbers: Array<Array<BoxState>>;
  changeTicketState: (
    houseIndex: number,
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ) => void;
}

function House(props: HouseProps) {
  let changeTicketState = (
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ): void => {
    props.changeTicketState(props.houseIndex, lineIndex, boxIndex, check);
  };

  return (
    <div>
      <Line
        key={0}
        index={0}
        numbers={props.houseNumbers[0]}
        changeTicketState={changeTicketState}
      />
      <Line
        key={1}
        index={1}
        numbers={props.houseNumbers[1]}
        changeTicketState={changeTicketState}
      />
      <Line
        key={2}
        index={2}
        numbers={props.houseNumbers[2]}
        changeTicketState={changeTicketState}
      />
    </div>
  );
}

export default House;
