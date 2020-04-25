import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import { BoxState } from "./Box";
import { generateHouse } from "../utils/utils";
import WinningButtons from "./WinningButtons";
import NewNumber from "./NewNumber";

interface PcTicketProps {
  socket: any;
}

interface PcTicketState {}

class PcTicket extends Component<PcTicketProps, PcTicketState> {
  houses: Array<Array<Array<BoxState>>>;
  constructor(props: PcTicketProps) {
    super(props);
    this.houses = [generateHouse(), generateHouse()];
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
      firstLine={"First Line"}
      secondLine={"Second Line"}
      thirdLine={"Third Line"}
      corners={"Corners"}
      fullHouse={"Full House"}
      winCallBack={this.handleWinningCall}
    />
  );

  render() {
    return (
      <>
        <Ticket
          houses={this.houses}
          changeTicketState={this.changeTicketState}
        />
        {this.winningButtons}
        <NewNumber socket={this.props.socket} />
      </>
    );
  }
}

export default PcTicket;
