import * as React from "react";
import { Component } from "react";
import { callWin } from "./Player";
import HostTicket from "./HostTicket";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

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
    this.hasWalkthroughShown = false;
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
    });
  }

  removeTicket = (idWinCall: string) => {
    let newTicketsState = this.state.ticketFromPlayers;
    delete newTicketsState[idWinCall];
    this.setState({ ticketFromPlayers: newTicketsState });
  };

  handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      this.setState({ runWalkthrough: false });
    }
    this.hasWalkthroughShown = true;
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
