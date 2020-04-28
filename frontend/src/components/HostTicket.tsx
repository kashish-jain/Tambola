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
  }

  handleResultCall = (result: string) => {
    this.props.socket.emit("resultsFromHost", {
      result: result,
      callWinType: this.props.callWinObj.callWinType,
      userCalledForWin: this.props.callWinObj.user,
    });
    // Key is concatenation of id and callWinType
    this.props.removeTicketFromHost(
      this.props.callWinObj.user.id + this.props.callWinObj.callWinType
    );
  };

  render() {
    let playerTicket = (
      <div>
        <br></br>
        <p>{this.props.callWinObj.user.username}'s Ticket</p>
        <div style={{ pointerEvents: "none" }}>
          <Ticket
            houses={this.props.callWinObj.houses}
            numHouses={this.props.callWinObj.houses.length}
          />
        </div>
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
