import * as React from "react";
import { Component } from "react";
import House from "./House";
import { BoxState } from "./Box";

interface TicketProps {
  // Don't need socket here when it generated on host's screen
  socket?: any;

  // number of houses
  num: number;

  houses: Array<Array<Array<BoxState>>>;
  changeTicketState?: (
    houseIndex: number,
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ) => void;
}

interface TicketState {}

class Ticket extends Component<TicketProps, TicketState> {
  constructor(props: TicketProps) {
    super(props);
  }

  changeTicketState = (
    houseIndex: number,
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ): void => {
    if (this.props.changeTicketState)
      this.props.changeTicketState(houseIndex, lineIndex, boxIndex, check);
  };

  render() {
    let ticket = [];
    for(let i = 0; i < this.props.num; ++i) {
      ticket[i] = (
        <>
          <House
            key={i}
            changeTicketState={this.changeTicketState}
            houseNumbers={this.props.houses[i]}
            houseIndex={i}
          />
          <br />
        </>
      );
    }
    return (
      <div>
        {ticket}
      </div>
    );
  }
}

export default Ticket;
