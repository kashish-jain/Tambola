import * as React from "react";
import { Component } from "react";
import Board from "./Board";
import { BoxState } from "./Box";
import Ticket from "./Ticket";
import ResultButtons from "./ResultButtons";

// TODO: Name entered by user could be empty; This is disastrous; We'll make name a different
// component soon.

interface HostProps {
  socket: any;
}

interface HostState {
  checkingTicket: boolean;
  name: string | null;
}

class Host extends Component<HostProps, HostState> {
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  constructor(props: HostProps) {
    super(props);
    this.state = { checkingTicket: false, name: "" };
  }
  componentDidMount() {
    this.props.socket.on(
      "callWinforHost",
      (callWinType: string, houses: Array<Array<Array<BoxState>>>) => {
        this.winningCallFromPlayer = callWinType;
        this.ticketFromPlayer = houses;
        this.setState({ checkingTicket: true });
      }
    );
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
      <div>
        <Board socket={this.props.socket} />
        {playerTicket}
      </div>
    );
  }
}

export default Host;
