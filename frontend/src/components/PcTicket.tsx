import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import { BoxState } from "./Box";
import { generateHouse } from "../utils/utils";
import WinningButtons from "./WinningButtons";
import NewNumber from "./NewNumber";
import Notification from "./Notification";
import { Award } from "./Config";
import Prizes from "./Prizes";

interface PcTicketProps {
  socket: any;

  // awards coming for winning buttons
  awards: Award[];

  // number of houses
  numHouses: number;
}

interface PcTicketState {}

function genHouses(n: number) {
  let ret_val = [];
  for (let i = 0; i < n; ++i) {
    ret_val[i] = generateHouse();
  }
  return ret_val;
}

class PcTicket extends Component<PcTicketProps, PcTicketState> {
  houses: Array<Array<Array<BoxState>>>;
  constructor(props: PcTicketProps) {
    super(props);
    this.houses = genHouses(this.props.numHouses);
  }

  changeTicketState = (
    houseIndex: number,
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ): void => {
    let { value } = this.houses[houseIndex][lineIndex][boxIndex];
    this.houses[houseIndex][lineIndex][boxIndex] = { value: value, check };
    console.log("here it is after changing", this.houses);
  };

  handleWinningCall = (callWinType: string) => {
    // send ticket here as well
    this.props.socket.emit("callWinFromPC", {
      callWinType: callWinType,
      houses: this.houses,
    });
  };

  winningButtons = (
    <WinningButtons
      key={0}
      awards={this.props.awards}
      winCallBack={this.handleWinningCall}
    />
  );

  render() {
    return (
      <>
        <NewNumber socket={this.props.socket} />
        <div className="notification-parent">
          {/* This div is for setting the opacity when notification is shown */}
          <div id="ticket-board-container">
            <Ticket
              houses={this.houses}
              changeTicketState={this.changeTicketState}
              numHouses={this.props.numHouses}
            />
          </div>

          <Notification socket={this.props.socket} />
        </div>

        {this.winningButtons}
        <Prizes socket={this.props.socket} awards={this.props.awards} />
      </>
    );
  }
}

export default PcTicket;
