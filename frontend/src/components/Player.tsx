import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import Board from "./Board";
import { BoxState } from "./Box";
import NewNumber from "./NewNumber";
import ResultButtons from "./ResultButtons";
import Reward from "react-rewards";
import { stringify } from "querystring";

interface callWin {
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
  reward: any;
  // The declarations are just for Host type
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  userCalledForWin: { id: string; username: string; room: string } | undefined;
  constructor(props: PlayerProps) {
    super(props);
    this.state = { checkingTicket: false };
  }

  componentDidMount() {

      // event when host confirms if somebody won anything or not
      this.props.socket.on("resultsForPC", (resultsObj: callWin) => {
        console.log("resultObj ", resultsObj);
        this.reward.rewardMe();
      });

      // only Host can check tickets for now
      if (this.props.type == "Host") {

        // attaching listener for win calls
        this.props.socket.on(
          "callWinToHost",
          ({ callWinType, houses, user }: callWin) => {
            // logging
            console.log("getting ticket from", user.username);

            // updating values
            this.winningCallFromPlayer = callWinType;
            this.ticketFromPlayer = houses;
            this.userCalledForWin = user;
            this.setState({
              checkingTicket: true
            });
          }
        );
      } else {
        // PLayer is PC, and now someone called for win
        this.props.socket.on(
          "callWinToHost",
          ({ callWinType, user }: callWin) => {
            console.log("notification: ", user.username, " ", callWinType);
            this.reward.rewardMe();
          }
        );
      }
  }

  handleResultCall = (result: string) => {
    this.props.socket.emit("resultsFromHost", {
      result: result,
      callWinType: this.winningCallFromPlayer,
      userCalledForWin: this.userCalledForWin,
    });
    this.setState({
      checkingTicket: false,
    });
  };

  render() {
    // ticket or board depending if host or pc
    let mainComponent = null;
    if (this.props.type === "PC") {
      mainComponent = (
        <div>
          <Ticket socket={this.props.socket} num={this.props.num}/>
          <NewNumber socket={this.props.socket} />
        </div>
      );
    } else if (this.props.type === "Host") {
      mainComponent = <Board socket={this.props.socket} />;
    }
    let playerTicket = (this.state.checkingTicket && this.ticketFromPlayer != undefined) ? (
      <div>
        <br></br>
        <Ticket houses={this.ticketFromPlayer} num={this.ticketFromPlayer.length}/>
        <p>Win Call: {this.winningCallFromPlayer}</p>
        <ResultButtons
          key={0}
          win={"Confirm Win!"}
          bogey={"Bogey!"}
          resultCallback={this.handleResultCall}
        />
      </div>
    ) : null;
    return (
      <>
        {mainComponent}
        {playerTicket}
        <Reward
          ref={(ref: any) => {
            this.reward = ref;
          }}
          type="confetti"
          config={{
            elementCount: 100,
            angle: 60,
            spread: 90,
            decay: 0.95,
            lifetime: 150,
          }}
        ></Reward>
      </>
    );
  }
}

export default Player;
