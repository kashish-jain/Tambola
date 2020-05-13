import * as React from "react";
import { callWin } from "./Player";

export interface WaitingProps {
  playerType: string;
  socket: any;
}

export interface WaitingState {
  message: string;
}

class Waiting extends React.Component<WaitingProps, WaitingState> {
  constructor(props: WaitingProps) {
    super(props);
    this.state = { message: "" };
  }

  componentDidMount() {
    this.props.socket.on("callWinToHost", (callWinObj: callWin) => {
      if (this.props.playerType === "Host") {
        this.setState({
          message: "Other players are waiting on you to check tickets",
        });
      } else {
        this.setState({
          message: "Waiting for host to check the player tickets",
        });
      }
    });

    this.props.socket.on("hostCompletedChecking", () => {
      this.setState({ message: "" });
    });
  }

  render() {
    return <p className="waiting">{this.state.message}</p>;
  }
}

export default Waiting;
