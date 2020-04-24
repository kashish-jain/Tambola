import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import Board from "./Board";
import { BoxState } from "./Box";
import NewNumber from "./NewNumber";
import ResultButtons from "./ResultButtons";

interface callWin {
  callWinType: string;
  houses: Array<Array<Array<BoxState>>>;
  user: {id: string, username: string, room: string};
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
  
  // This is just for host type
  //  for displaying ticket on win call
  checkingTicket: boolean;
}

class Player extends Component<PlayerProps, PlayerState> {
  // The declarations are just for Host type
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  userCalledForWin: {id: string, username: string, room: string} | undefined;
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
          "callWinToHost", ({
              callWinType,
              houses,
              user
            }: callWin) => {
            
            // logging
            console.log("getting ticket from", user.username);

            // updating values
            this.winningCallFromPlayer = callWinType;
            this.ticketFromPlayer = houses;
            this.userCalledForWin = user;
            this.setState({
              checkingTicket: true,
            });
          }
        );
      }
    });
  }

  handleResultCall = (result: string) => {
    this.props.socket.emit(
      "resultsFromHost", { 
        result: result,
        callWinType: this.winningCallFromPlayer,
        userCalledForWin: this.userCalledForWin
    });
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
      </>
    );
  }
}

export default Player;
