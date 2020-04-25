import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import Board from "./Board";
import { BoxState } from "./Box";
import NewNumber from "./NewNumber";
import ResultButtons from "./ResultButtons";
import Reward from "react-rewards";
import HostTicket from "./HostTicket";
import PcTicket from "./PcTicket";

export interface callWin {
  callWinType: string;
  houses: Array<Array<Array<BoxState>>>;
  user: { id: string; username: string; room: string };
}

// TODO: Name entered by user could be empty; This is disastrous; We'll make name a different
// component soon.
interface PlayerProps {
  socket: any;
}

interface PlayerState {
  // type is either PC or host
  type: string;
  name: string | null;
}

class Player extends Component<PlayerProps, PlayerState> {
  reward: any;
  // The declarations are just for Host type
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  userCalledForWin: { id: string; username: string; room: string } | undefined;
  constructor(props: PlayerProps) {
    super(props);
    this.state = { name: "", type: "" };
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

      // event when host confirms if somebody won anything or not
      this.props.socket.on("resultsForPC", (resultsObj: callWin) => {
        console.log("resultObj ", resultsObj);
        this.reward.rewardMe();
      });

      // only Host can check tickets for now
      if (playerTypeObj.type == "Host") {
        // this.props.socket.on(
        //   "callWinToHost",
        //   ({ callWinType, houses, user }: callWin) => {
        //     // logging
        //     console.log("getting ticket from", user.username);
        //     // updating values
        //     this.winningCallFromPlayer = callWinType;
        //     this.ticketFromPlayer = houses;
        //     this.userCalledForWin = user;
        //     this.setState({
        //       checkingTicket: true,
        //     });
        //   }
        // );
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
    });
  }

  // handleResultCall = (result: string) => {
  //   this.props.socket.emit("resultsFromHost", {
  //     result: result,
  //     callWinType: this.winningCallFromPlayer,
  //     userCalledForWin: this.userCalledForWin,
  //   });
  //   this.setState({
  //     checkingTicket: false,
  //   });
  // };

  render() {
    // ticket or board depending if host or pc
    let mainComponent = null;
    if (this.state.type === "PC") {
      mainComponent = (
        <div>
          <PcTicket socket={this.props.socket} />
          <NewNumber socket={this.props.socket} />
        </div>
      );
    } else if (this.state.type === "Host") {
      mainComponent = (
        <div>
          <Board socket={this.props.socket} />
          <HostTicket socket={this.props.socket} />
        </div>
      );
    }

    // let playerTicket = this.state.checkingTicket ? (
    //   <div>
    //     <br></br>
    //     <Ticket houses={this.ticketFromPlayer} />
    //     <p>Win Call: {this.winningCallFromPlayer}</p>
    //     <ResultButtons
    //       key={0}
    //       win={"Confirm Win!"}
    //       bogey={"Bogey!"}
    //       resultCallback={this.handleResultCall}
    //     />
    //   </div>
    // ) : null;
    return (
      <>
        {mainComponent}
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
