import * as React from "react";
import { Component } from "react";
import Board from "./Board";
import { BoxState } from "./Box";
import PcTicket from "./PcTicket";
import MultipleHostTicket from "./MultipleHostTickets";
import { Award } from "./Config";
import Prizes from "./Prizes";

export interface callWin {
  callWinType: string;
  houses: Array<Array<Array<BoxState>>>;
  user: { id: string; username: string; room: string };
}

export interface resultObj {
  callWinType: string;
  calledWinUsername: string;
  result: string;
}

// TODO: Name entered by user could be empty; This is disastrous; We'll make name a different
// component soon.
interface PlayerProps {
  socket: any;
  type: string; // type is either PC or host
  name: string;

  // awards coming for buttons and leaderboard
  awards: Award[];

  // for PC
  numHouses: number;
}

interface PlayerState {
  hasGameEnded: boolean;
}

class Player extends Component<PlayerProps, PlayerState> {
  // The declarations are just for Host type
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  userCalledForWin: { id: string; username: string; room: string } | undefined;

  constructor(props: PlayerProps) {
    super(props);
    this.state = {
      hasGameEnded: false,
    };
  }

  // This function will be called if game ends
  endGame = () => {
    this.setState({ hasGameEnded: true });
  };

  render() {
    let mainComponent = null;
    let gameEndedDiv = null;
    let gameEndedCssClass = "";
    if (this.state.hasGameEnded) {
      // This css class changes the opacity and disable all the clicks.
      // This is different from how it is handled in Notifications component
      gameEndedCssClass = "game-ended";
      gameEndedDiv = (
        <div className="game-ended-notification-container">
          <p className="main animated rubberBand">Game Over</p>
        </div>
      );
    }
    if (this.props.type === "PC") {
      mainComponent = (
        <div className={gameEndedCssClass}>
          <PcTicket
            socket={this.props.socket}
            numHouses={this.props.numHouses}
            awards={this.props.awards}
          />
        </div>
      );
    } else if (this.props.type === "Host") {
      mainComponent = (
        <div className={gameEndedCssClass}>
          <Board socket={this.props.socket} />
          <MultipleHostTicket socket={this.props.socket} />
        </div>
      );
    }
    return (
      <div>
        {mainComponent}
        {gameEndedDiv}
        <Prizes
          socket={this.props.socket}
          awards={this.props.awards}
          endGame={this.endGame}
        />
      </div>
    );
  }
}

export default Player;
