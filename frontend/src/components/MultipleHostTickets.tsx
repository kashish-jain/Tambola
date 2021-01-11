import * as React from "react";
import { Component } from "react";
import { callWin } from "./Player";
import HostTicket from "./HostTicket";
import Joyride, { Step } from "react-joyride";

interface MultipleHostTicketProps {
  socket: any;
  showWalkthrough: boolean;
}

interface MultipleHostTicketState {
  ticketFromPlayers: { [id: string]: callWin };
  runWalkthrough: boolean;
}

class MultipleHostTicket extends Component<
  MultipleHostTicketProps,
  MultipleHostTicketState
> {
  hasWalkthroughShown: boolean;
  constructor(props: MultipleHostTicketProps) {
    super(props);
    this.state = { ticketFromPlayers: {}, runWalkthrough: false };
    
    // hasWalkthrough shown handles this logic: 
    // if player tickets become zero then the tutorial is shown and hasWalkthrough shown
    // becomes true and tutorial is never shown. This is the case when in props we receive
    // showWalkthrough as true. If it is false then we just change hasWalkthrough shown to be
    // true and then the walkThrough never playes
    this.hasWalkthroughShown = !this.props.showWalkthrough;
  }

  walkThroughSteps: Step[] = [
    {
      target: ".host-ticket",
      content:
        "This is the player's ticket. They think they have won this award. Your task is to check the 'crossed' numbers on this ticket and tell the players if this is a valid win or a Bogey!",
      disableBeacon: true,
      placement: "bottom",
      disableOverlay: true,
    },
  ];

  componentDidMount() {
    this.props.socket.on("callWinToHost", (callWinObj: callWin) => {
      // updating values
      let newTicketsState = this.state.ticketFromPlayers;
      let runWalkthrough: boolean = this.hasWalkthroughShown ? false : true;

      // JS does not support keys to be objects, so this is easy workaround for the
      // case when same user made 2 different win calls at the same time; The key
      // is a string concatenation of id and wintype
      newTicketsState[callWinObj.user.id + callWinObj.callWinType] = callWinObj;
      this.setState({
        ticketFromPlayers: newTicketsState,
        runWalkthrough: runWalkthrough,
      });
      // Disable the generate new button
      let generateNewButton = document.querySelector(
        "button.new-number"
      ) as HTMLInputElement;
      generateNewButton.disabled = true;
      generateNewButton.classList.add("disabled-button");
    });
  }

  removeTicket = (idWinCall: string) => {
    let newState = this.state.ticketFromPlayers;
    delete newState[idWinCall];
    this.setState({ ticketFromPlayers: newState });

    // check if there is no HostTicket then enable the generate new button and emit event for 'Waiting' component
    if (Object.keys(newState).length === 0 && newState.constructor === Object) {
      let generateNewButton = document.querySelector(
        "button.new-number"
      ) as HTMLInputElement;
      generateNewButton.disabled = false;
      generateNewButton.classList.remove("disabled-button");
      this.props.socket.emit("hostCompletedChecking");
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
    return (
      <>
        {ticketComponents}
        <Joyride
          steps={this.walkThroughSteps}
          run={this.state.runWalkthrough}
          continuous={true}
          disableOverlayClose={true}
          showProgress={true}
          showSkipButton={true}
          spotlightClicks={true}
          styles={{
            options: {
              zIndex: 10000,
              primaryColor: "#0e141f",
              textColor: "#0e141f",
            },
          }}
        />
      </>
    );
  }
}

export default MultipleHostTicket;
