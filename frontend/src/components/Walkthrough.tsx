import * as React from "react";
import Joyride, { Step } from "react-joyride";

export interface WalkthroughProps {
  type: "game" | "config";
  playerType: "PC" | "Host";
  runWalkthrough: boolean;
}

export interface WalkthroughState {
  // run: boolean;
}

class Walkthrough extends React.Component<WalkthroughProps, WalkthroughState> {
  diffTypeSteps: {
    config: { PC: Step[]; Host: Step[] };
    game: { PC: Step[]; Host: Step[] };
  };
  constructor(props: WalkthroughProps) {
    super(props);
    // this.state = { run: this.props.runWalkthrough };
    let configHostSteps: Step[] = [
      {
        target: ".snackbar",
        content: (
          <>
          <h3>You are the host!</h3>
          <p>Share this link with your friends so that they can play in this game created by you.</p>
          </>
        ),
        disableBeacon: true,
      },
      {
        target: ".config-table",
        content: "You can use this section to add, delete or customize awards",
        disableBeacon: true,
      },
      {
        target: ".ready-players-container",
        content: "You will see all players and their status in the game here.",
        disableBeacon: true,
      },
      {
        target: ".start-game",
        content:
          "Click this button after all players have joined to start the game.",
        disableBeacon: true,
        spotlightClicks: false,
      },
    ];

    let ConfigPCSteps: Step[] = [
      {
        target:
          "#pc-config-table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=number]",
        content: "Select the number of tickets you want to play with.",
        disableBeacon: true,
      },
      {
        target: "button.ready",
        content:
          'Click this button to mark yourself "Ready" after you select the number of tickets you want to play with.',
        disableBeacon: true,
      },
      {
        target: ".ready-players-container",
        content: "You will see all players and their status in the game here.",
        disableBeacon: true,
      },
    ];

    let gameHostSteps = [
      {
        target: ".new-number",
        content:
          "Clicking this generates a new random number which will be displayed on every player's screen.",
        disableBeacon: true,
      },
      {
        target: "table.prizes",
        content: "Remaining awards and winners will be shown here.",
        disableBeacon: true,
      },
    ];

    let gamePCSteps = [
      {
        target: ".new-number-player-container",
        content: "The new random number called by the host will be shown here",
        disableBeacon: true,
      },
      {
        target: "#gone-numbers-button",
        content: "To view all the previous numbers, click this button.",
        disableBeacon: true,
      },
      {
        target: "#ticket-board-container",
        content:
          "This is your Tambola ticket. You can cross a number if it matches the called number.",
        disableBeacon: true,
      },
      {
        target: ".winning-buttons",
        content:
          "If you think you are winning an award, call for that award using these buttons. Your ticket will then be checked by the host for a Bogey!",
        disableBeacon: true,
      },
      {
        target: "table.prizes",
        content: "Remaining awards and winners will be shown here.",
        disableBeacon: true,
      },
    ];

    this.diffTypeSteps = {
      config: { PC: ConfigPCSteps, Host: configHostSteps },
      game: { PC: gamePCSteps, Host: gameHostSteps },
    };
  }
  componentDidUpdate(prevProps: WalkthroughProps) {
    console.log("componendidupdate called with run ", this.props.runWalkthrough)
    if(this.props.runWalkthrough !== prevProps.runWalkthrough) {
      this.setState({run: this.props.runWalkthrough});
    }
  }

  render() {
    let playerType = this.props.playerType;
    let tutorialType = this.props.type;
    const steps = this.diffTypeSteps[tutorialType][playerType];
    return (
      <>
        <Joyride
          steps={steps}
          run={this.props.runWalkthrough}
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

export default Walkthrough;
