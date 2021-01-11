import * as React from "react";
import House from "./House";
import { BoxState } from "./Box";

interface TicketProps {
  // Don't need socket here when it generated on host's screen
  socket?: any;

  // number of houses
  numHouses: number;

  houses: Array<Array<Array<BoxState>>>;
  changeTicketState?: (
    houseIndex: number,
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ) => void;
}

function Ticket(props: TicketProps) {
  let changeTicketState = (
    houseIndex: number,
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ): void => {
    if (props.changeTicketState)
      props.changeTicketState(houseIndex, lineIndex, boxIndex, check);
  };

  let ticket = [];
  for (let i = 0; i < props.numHouses; ++i) {
    ticket[i] = (
      <>
        <House
          key={i}
          changeTicketState={changeTicketState}
          houseNumbers={props.houses[i]}
          houseIndex={i}
        />
        <br />
      </>
    );
  }
  return <div>{ticket}</div>;
}

export default Ticket;
