import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import ResultButtons from "./ResultButtons";
import { callWin } from "./Player";

interface HostTicketProps {
  socket: any;
  callWinObj: callWin;
  removeTicketFromHost: (id: string) => void;
}

interface HostTicketState {}

class HostTicket extends Component<HostTicketProps, HostTicketState> {
  constructor(props: HostTicketProps) {
    super(props);
    this.state = { showTicket: true };
  }

  handleResultCall = (result: string) => {
    this.props.socket.emit("resultsFromHost", {
      result: result,
      callWinType: this.props.callWinObj.callWinType,
      userCalledForWin: this.props.callWinObj.user,
    });
    this.props.removeTicketFromHost(this.props.callWinObj.user.id);
    this.setState({
      showTicket: false,
    });
  };

  render() {
    let playerTicket = (
      <div>
        <br></br>
        <p>{this.props.callWinObj.user.username}'s Ticket</p>
        <Ticket houses={this.props.callWinObj.houses} />
        <p>Win Call: {this.props.callWinObj.callWinType}</p>
        <ResultButtons
          key={0}
          win={"Confirm Win!"}
          bogey={"Bogey!"}
          resultCallback={this.handleResultCall}
        />
      </div>
    );
    return <>{playerTicket}</>;
  }
}

export default HostTicket;
