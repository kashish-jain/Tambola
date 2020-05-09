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

      // JS does not support keys to be objects, so this is easy workaround for the
      // case when same user made 2 different win calls at the same time; The key
      // is a string concatenation of id and wintype
      newState[callWinObj.user.id + callWinObj.callWinType] = callWinObj;
      this.setState({
        ticketFromPlayers: newState,
      });
      // Disable the generate new button
      let generateNewButton = document.querySelector(
        "button.new-number"
      ) as HTMLInputElement;
      generateNewButton.disabled = true;
      generateNewButton.style.opacity = "0.5";
    });
  }

  removeTicket = (idWinCall: string) => {
    let newState = this.state.ticketFromPlayers;
    delete newState[idWinCall];
    this.setState({ ticketFromPlayers: newState });

    // check if there is no HostTicket then enable the generate new button
    if (Object.keys(newState).length === 0 && newState.constructor === Object) {
      let generateNewButton = document.querySelector(
        "button.new-number"
      ) as HTMLInputElement;
      generateNewButton.disabled = false;
      generateNewButton.style.opacity = "";
    }
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
