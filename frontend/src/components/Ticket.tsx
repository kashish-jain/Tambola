import * as React from "react";
import { Component } from "react";
import House from "./House";
import WinningButtons from "./WinningButtons";

interface TicketProps {
  socket: any
}

interface TicketState {

}

class Ticket extends Component<TicketProps, TicketState> {
  constructor(props: TicketProps) {
    super(props);
  }
  render() {
    return (
      <div>
        <House key={0} />
        <WinningButtons
          key={0}
          firstLine={"First Line"}
          secondLine={"Second Line"}
          thirdLine={"Third Line"}
          corners={"Corners"}
          fullHouse={"Full House"}
        />
      </div>
    );
  }
}

export default Ticket;
