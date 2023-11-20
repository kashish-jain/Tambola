import React, { useState } from "react";
import Board from "./Board";
import { BoxState } from "./Box";
import PcTicket from "./PcTicket";
import MultipleHostTicket from "./MultipleHostTickets";
import { Award } from "./Config";
import Prizes from "./Prizes";
import Walkthrough from "./Walkthrough";
import { doNotLeavePage } from "../utils/utils";
import { useReward } from "react-rewards";


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


function Player(props: PlayerProps) {

  const [isGameEnded, setIsGameEnded] = useState(false)
  const { reward } = useReward('game-over-reward', 'confetti', {
    elementCount: 100,
    angle: 90,
    spread: 90,
    decay: 0.95,
    lifetime: 150,
  });

  // The declarations are just for Host type
  // ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  // winningCallFromPlayer: string | undefined;
  // userCalledForWin: { id: string; username: string; room: string } | undefined;

  // This function will be called if game ends
  const endGame = () => {
    setIsGameEnded(true)
    reward()
    window.removeEventListener('beforeunload', doNotLeavePage);
    let timesRun = 0;
    let interval = setInterval(() => {
      console.log("ending game calling confetti")
      reward()
      ++timesRun;
      if (timesRun === 4) clearInterval(interval);
    }, 2000);
  };

  let mainComponent = null;
  let gameOverP = null;
  let gameEndedCssClass = "";
  if (isGameEnded) {
    // This css class changes the opacity and disable all the clicks.
    // This is different from how it is handled in Notifications component
    gameEndedCssClass = "game-ended no-click";
    gameOverP = <p className="game-over animated rubberBand">Game Over</p>;
  }
  if (props.type === "PC") {
    mainComponent = (
      <div className="everything-but-prizes">
        <Walkthrough type="game" playerType="PC" runWalkthrough={props.runWalkthrough} />
        <div className={gameEndedCssClass}>
          <PcTicket
            socket={props.socket}
            numHouses={props.numHouses}
            awards={props.awards}
            endGame={endGame}
          />
        </div>
        {gameOverP}
      </div>
    );
  } else if (props.type === "Host") {
    mainComponent = (
      <div className="everything-but-prizes">
        <Walkthrough type="game" playerType="Host" runWalkthrough={props.runWalkthrough} />
        <div className={gameEndedCssClass}>
          <Board socket={props.socket} endGame={endGame} />
          <MultipleHostTicket socket={props.socket} showWalkthrough={props.runWalkthrough} />
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
          socket={props.socket}
          awards={props.awards}
          playerType={props.type}
          endGame={endGame}
        />
      </div>
      {/* This is just for game over confetti */}
      <div id="game-over-reward"></div>
    </>
  );
}

export default Player;
