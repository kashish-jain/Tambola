import * as React from "react";
import { Component } from "react";
import { callWin } from "./Player";
import HostTicket from "./HostTicket";

interface MultipleHostTicketProps {
  socket: any;
}

interface MultipleHostTicketState {
  ticketFromPlayers: { [id: string]: callWin };
}

class MultipleHostTicket extends Component<
  MultipleHostTicketProps,
  MultipleHostTicketState
> {
  constructor(props: MultipleHostTicketProps) {
    super(props);
    this.state = { ticketFromPlayers: {} };
  }

  componentDidMount() {
    this.props.socket.on("callWinToHost", (callWinObj: callWin) => {
      // updating values
      let newState = this.state.ticketFromPlayers;
      console.log("old tickets ", newState);
      console.log("getting ticket from", callWinObj.user.username);
      newState[callWinObj.user.id] = callWinObj;
      this.state.ticketFromPlayers[callWinObj.user.id] = callWinObj;
      this.setState({
        ticketFromPlayers: newState,
      });
    });
  }

  removeTicket = (id: string) => {
    let newState = this.state.ticketFromPlayers;
    delete newState[id];
    this.setState({ ticketFromPlayers: newState });
  };

  render() {
    let ticketComponents = [];
    for (const [key, value] of Object.entries(this.state.ticketFromPlayers)) {
      let ticket = (
        <HostTicket
          key={key}
          socket={this.props.socket}
          callWinObj={value}
          removeTicketFromHost={this.removeTicket}
        />
      );
      ticketComponents.push(ticket);
    }
    return ticketComponents;
  }
}

export default MultipleHostTicket;
