import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import { BoxState } from "./Box";
import ResultButtons from "./ResultButtons";
import { callWin } from "./Player";

interface HostTicketProps {
  socket: any;
}

interface HostTicketState {
  checkingTicket: boolean;
  ticketsFromPlayers: callWin;
}

class HostTicket extends Component<HostTicketProps, HostTicketState> {
  constructor(props: HostTicketProps) {
    super(props);
  }

  handleResultCall = (result: string) => {
    this.props.socket.emit("resultsFromHost", {
      result: result,
      callWinType: this.state.ticketsFromPlayers.callWinType,
      userCalledForWin: this.state.ticketsFromPlayers.user,
    });

    this.setState({
      checkingTicket: false,
    });
  };

  componentDidMount() {
    this.props.socket.on("callWinToHost", (callWinObj: callWin) => {
      // logging
      console.log("getting ticket from", callWinObj.user.username);

      // updating values
      this.setState({
        checkingTicket: true,
        ticketsFromPlayers: callWinObj,
      });
    });
  }
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
      <>
        <p>ticket</p>
        <ResultButtons />
      </>
    );
  }
}

export default HostTicket;
