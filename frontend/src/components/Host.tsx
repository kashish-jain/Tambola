import * as React from "react";
import { Component } from "react";
import Board from "./Board";
import ResultButtons from "./ResultButtons";

interface HostProps {
  socket: any;
}

interface HostState {}

class Host extends Component<HostProps, HostState> {
  constructor(props: HostProps) {
    super(props);
  }

  handleResultCall = (hostCheck: string) => {
    this.props.socket.emit("resultsFromHost", hostCheck);
  };

  render() {
    return (
      <>
        <Board socket={this.props.socket} />;
        <ResultButtons
          key={0}
          win={"Confirm Win!"}
          bogey={"Bogey!"}
          resultCallback={this.handleResultCall}
        />
      </>
    );
  }
}

export default Host;
