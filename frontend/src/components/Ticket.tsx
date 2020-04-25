import * as React from "react";
import { Component } from "react";
import House from "./House";
import { BoxState } from "./Box";

interface TicketProps {
  // Don't need socket here when it generated on host's screen
  socket?: any;
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
    return (
      <div>
        <House
          key={0}
          changeTicketState={this.changeTicketState}
          houseNumbers={this.props.houses[0]}
          houseIndex={0}
        />
        <br />
        <House
          key={1}
          changeTicketState={this.changeTicketState}
          houseNumbers={this.props.houses[1]}
          houseIndex={1}
        />
      </div>
    );
  }
}

export default Ticket;
