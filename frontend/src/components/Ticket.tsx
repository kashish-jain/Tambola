import * as React from "react";
import { Component } from "react";
import House from "./House";
import WinningButtons from "./WinningButtons";
import { generateHouse } from "../utils/utils";
import { BoxState } from "./Box";

interface TicketProps {
  // Don't need socket here when it generated on host's screen
  socket?: any;

  // Houses are sent from host to draw ticket on its screen
  houses?: Array<Array<Array<BoxState>>>;

  // number of houses
  num: number;
}

interface TicketState {}

class Ticket extends Component<TicketProps, TicketState> {
  constructor(props: TicketProps) {
    super(props);
  }

  // generate houses only if they were not given in props;
  // normal ticket houses are generated from function, otherwise on host's screen, they are
  // generated from props
  houses =
    this.props.houses === undefined
      ? [generateHouse(), generateHouse()]
      : this.props.houses;

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

  // this will be null if ticket is being generated at host's screen instead of player's
  handleWinningCall = this.props.houses
    ? null
    : (callWinType: string) => {
        // send ticket here as well
        this.props.socket.emit("callWinFromPC", 
          {
            callWinType: callWinType, 
            houses: this.houses,
          });
      };

  winningButtons =
    this.handleWinningCall === null ? null : (
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
    let ticket = [];
    for(let i = 0; i < this.props.num; ++i) {
      ticket[i] = (
        <>
          <House
            key={i}
            changeTicketState={this.changeTicketState}
            houseNumbers={this.houses[i]}
            houseIndex={i}
          />
          <br />
        </>
      );
    }
    return (
      <div>
        {ticket}
        {this.winningButtons}
      </div>
    );
  }
}

export default Ticket;
