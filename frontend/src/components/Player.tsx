import * as React from "react";
import { Component } from "react";
import Board from "./Board";
import { BoxState } from "./Box";
import PcTicket from "./PcTicket";
import MultipleHostTicket from "./MultipleHostTickets";
import { Award } from "./Config";
import Prizes from "./Prizes";
import Walkthrough from "./Walkthrough";
import Reward from "react-rewards";
import { doNotLeavePage } from "../utils/utils";


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

interface PlayerProps {
  socket: any;
  type: string; // type is either PC or host
  name: string;

  // awards coming for buttons and leaderboard
  awards: Award[];

  // for PC
  numHouses: number;
  runWalkthrough: boolean
}

interface PlayerState {
  hasGameEnded: boolean;
}

class Player extends Component<PlayerProps, PlayerState> {
  // The declarations are just for Host type
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  userCalledForWin: { id: string; username: string; room: string } | undefined;
  reward: any;
  constructor(props: PlayerProps) {
    super(props);
    this.state = {
      hasGameEnded: false,
    };
  }

  // This function will be called if game ends
  endGame = () => {
    this.setState({ hasGameEnded: true });
    this.reward.rewardMe();
    window.removeEventListener('beforeunload', doNotLeavePage);
    let timesRun = 0;
    let interval = setInterval(() => {
      this.reward.rewardMe();
      ++timesRun;
      if (timesRun === 4) clearInterval(interval);
    }, 2000);
  };

  render() {
    let mainComponent = null;
    let gameOverP = null;
    let gameEndedCssClass = "";
    if (this.state.hasGameEnded) {
      // This css class changes the opacity and disable all the clicks.
      // This is different from how it is handled in Notifications component
      gameEndedCssClass = "game-ended no-click";
      gameOverP = <p className="game-over animated rubberBand">Game Over</p>;
    }
    if (this.props.type === "PC") {
      mainComponent = (
        <div className="everything-but-prizes">
          <Walkthrough type="game" playerType="PC" runWalkthrough={this.props.runWalkthrough}/>
          <div className={gameEndedCssClass}>
            <PcTicket
              socket={this.props.socket}
              numHouses={this.props.numHouses}
              awards={this.props.awards}
              endGame={this.endGame}
            />
          </div>
          {gameOverP}
        </div>
      );
    } else if (this.props.type === "Host") {
      mainComponent = (
        <div className="everything-but-prizes">
          <Walkthrough type="game" playerType="Host" runWalkthrough={this.props.runWalkthrough}/>
          <div className={gameEndedCssClass}>
            <Board socket={this.props.socket} endGame={this.endGame}/>
            <MultipleHostTicket socket={this.props.socket} showWalkthrough={this.props.runWalkthrough}/>
          </div>
          {gameOverP}
        </div>
      );
    }
    return (
      <>
        <div className="main-container">
          {mainComponent}
          <Prizes
            socket={this.props.socket}
            awards={this.props.awards}
            playerType={this.props.type}
            endGame={this.endGame}
          />
        </div>
        {/* This is just for game over confetti */}
        <div className="game-over-reward">
          <Reward
            ref={(ref: any) => {
              this.reward = ref;
            }}
            type="confetti"
            config={{
              elementCount: 90,
              angle: 70,
              spread: 70,
              decay: 0.95,
              lifetime: 100,
            }}
          ></Reward>
        </div>
      </>
    );
  }
}

export default Player;
