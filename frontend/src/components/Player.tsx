import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import Board from "./Board";
import { BoxState } from "./Box";
import NewNumber from "./NewNumber";
import ResultButtons from "./ResultButtons";
import Reward from "react-rewards";

// TODO: Name entered by user could be empty; This is disastrous; We'll make name a different
// component soon.

interface PlayerProps {
  socket: any;
}

interface PlayerState {
  // type is either PC or host
  type: string;
  // This is just for host type
  checkingTicket: boolean;
  name: string | null;
}

class Player extends Component<PlayerProps, PlayerState> {
  reward: any;
  // The declarations are just for Host type
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  constructor(props: PlayerProps) {
    super(props);
    this.state = { name: "", checkingTicket: false, type: "" };
  }

  componentDidMount() {
    // Player joins by entering his name
    let roomID = window.location.pathname.substr(
      window.location.pathname.lastIndexOf("/") + 1
    );
    let name;
    if (this.state.name == "") {
      name = prompt("What would you like to be called?");
      this.setState({ name: name });
    }
    this.props.socket.emit("joinRoom", {
      room: roomID,
      username: name,
    });

    // Then player gets know if he is host or pc
    this.props.socket.on("userConnected", (playerTypeObj: any) => {
      this.setState({
        type: playerTypeObj.type,
      });
      // only Host can check tickets for now
      if (playerTypeObj.type == "Host") {
        this.props.socket.on(
          "callWinforHost",
          (callWinType: string, houses: Array<Array<Array<BoxState>>>) => {
            console.log("getting ticket from other user");
            this.winningCallFromPlayer = callWinType;
            this.ticketFromPlayer = houses;
            this.setState({
              checkingTicket: true,
            });
          }
        );
      } else {
        // PLayer is PC, and now someone called for win
        this.props.socket.on(
          "callWinforHost",
          (callWinType: string, houses: Array<Array<Array<BoxState>>>) => {
            console.log("notification: someone called for ", callWinType);
            this.reward.rewardMe();
          }
        );
      }
    });
  }

  handleResultCall = (hostCheck: string) => {
    this.props.socket.emit(
      "resultsFromHost",
      hostCheck,
      this.winningCallFromPlayer
    );
    this.setState({
      checkingTicket: false,
    });
  };

  render() {
    // ticket or board depending if host or pc
    let mainComponent = null;
    if (this.state.type === "PC") {
      mainComponent = (
        <div>
          <Ticket socket={this.props.socket} />
          <NewNumber socket={this.props.socket} />
        </div>
      );
    } else if (this.state.type === "Host") {
      mainComponent = <Board socket={this.props.socket} />;
    }
    let playerTicket = this.state.checkingTicket ? (
      <div>
        <br></br>
        <Ticket houses={this.ticketFromPlayer} />
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
          config={{ elementCount: 100, angle: 60, spread: 80 }}
        ></Reward>
      </>
    );
  }
}

export default Player;
