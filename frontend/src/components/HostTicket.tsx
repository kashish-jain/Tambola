import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import ResultButtons from "./ResultButtons";
import { callWin } from "./Player";

interface HostTicketProps {
  socket: any;
}

interface HostTicketState {
  checkingTicket: boolean;
}

class HostTicket extends Component<HostTicketProps, HostTicketState> {
  ticketsFromPlayers: callWin | undefined;
  constructor(props: HostTicketProps) {
    super(props);
    this.state = { checkingTicket: false };
  }

  handleResultCall = (result: string) => {
    this.props.socket.emit("resultsFromHost", {
      result: result,
      callWinType: this.ticketsFromPlayers?.callWinType,
      userCalledForWin: this.ticketsFromPlayers?.user,
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
      this.ticketsFromPlayers = callWinObj;
      this.setState({
        checkingTicket: true,
      });
    });
  }
  render() {
    let playerTicket =
      this.state.checkingTicket && this.ticketsFromPlayers ? (
        <div>
          <br></br>
          <Ticket houses={this.ticketsFromPlayers?.houses} />
          <p>Win Call: {this.ticketsFromPlayers?.callWinType}</p>
          <ResultButtons
            key={0}
            win={"Confirm Win!"}
            bogey={"Bogey!"}
            resultCallback={this.handleResultCall}
          />
        </div>
      ) : null;
    return <>{playerTicket}</>;
  }
}

export default HostTicket;
