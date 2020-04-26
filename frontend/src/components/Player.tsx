import * as React from "react";
import { Component } from "react";
import Board from "./Board";
import { BoxState } from "./Box";
import PcTicket from "./PcTicket";
import MultipleHostTicket from "./MultipleHostTickets";

export interface callWin {
  callWinType: string;
  houses: Array<Array<Array<BoxState>>>;
  user: { id: string; username: string; room: string };
}

// TODO: Name entered by user could be empty; This is disastrous; We'll make name a different
// component soon.
interface PlayerProps {
  socket: any;
  type: string; // type is either PC or host
  name: string | null;
  
  // for PC
  num: number;
}

interface PlayerState {

  // This is just for host type
  //  for displaying ticket on win call
  checkingTicket: boolean;
}

class Player extends Component<PlayerProps, PlayerState> {
  // The declarations are just for Host type
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  userCalledForWin: { id: string; username: string; room: string } | undefined;
  
  constructor(props: PlayerProps) {
    super(props);
  }

  render() {
    // ticket or board depending if host or pc
    let mainComponent = null;
    if (this.props.type === "PC") {
      mainComponent = (
        <div>
          <PcTicket socket={this.props.socket} num={this.props.num}/>
        </div>
      );
    } else if (this.props.type === "Host") {
      mainComponent = (
        <div>
          <Board socket={this.props.socket} />
          <MultipleHostTicket socket={this.props.socket} />
        </div>
      );
    }
    return <>{mainComponent}</>;
  }
}

export default Player;
