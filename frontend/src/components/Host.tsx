import * as React from "react";
import { Component } from "react";
import Board from "./Board";
import { BoxState } from "./Box";
import Ticket from "./Ticket";
import ResultButtons from "./ResultButtons";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

interface HostProps {
  socket: any;
}

interface HostState {
  checkingTicket: boolean;
}

class Host extends Component<HostProps, HostState> {
  ticketFromPlayer: Array<Array<Array<BoxState>>> | undefined;
  winningCallFromPlayer: string | undefined;
  constructor(props: HostProps) {
    super(props);
    this.state = { checkingTicket: false };
  }

  handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`);
    this.props.socket.emit("messageFromClient", newMessage);
  };

  componentDidMount() {
    this.props.socket.on(
      "callWinforHost",
      (callWinType: string, houses: Array<Array<Array<BoxState>>>) => {
        this.winningCallFromPlayer = callWinType;
        this.ticketFromPlayer = houses;
        this.setState({ checkingTicket: true });
      }
    );
    this.props.socket.on("messageToClient", (msg: string) => {
      console.log("message received frontend ", msg);
      addResponseMessage(msg);
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
        <Widget handleNewUserMessage={this.handleNewUserMessage} />
      </div>
    );
  }
}

export default Host;
