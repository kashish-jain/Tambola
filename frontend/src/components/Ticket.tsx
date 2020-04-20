import * as React from "react";
import { Component } from "react";
import House from "./House";
import WinningButtons from "./WinningButtons";
import { generateHouse } from '../utils/utils'

interface TicketProps {
  socket: any;
}

interface TicketState {}

class Ticket extends Component<TicketProps, TicketState> {
  constructor(props: TicketProps) {
    super(props);
  }

  // houses;
  houses = [generateHouse(), generateHouse()];

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
    this.props.socket.emit("callWinfromPC", callWinType, this.houses);
  };

  render() {
    return (
      <div>
        <House key={0} changeTicketState={this.changeTicketState} houseNumbers ={this.houses[0]} houseIndex={0}/><br />
        <House key={1} changeTicketState={this.changeTicketState} houseNumbers ={this.houses[1]} houseIndex={1}/>
        <WinningButtons
          key={0}
          firstLine={"First Line"}
          secondLine={"Second Line"}
          thirdLine={"Third Line"}
          corners={"Corners"}
          fullHouse={"Full House"}
          winCallBack={this.handleWinningCall}
        />
      </div>
    );
  }
}

export default Ticket;
