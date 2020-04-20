import * as React from "react";
import { Component } from "react";
import Board from "./Board";

interface HostProps {
  socket: any;
}

interface HostState {}

class Host extends Component<HostProps, HostState> {
  constructor(props: HostProps) {
    super(props);
  }
  render() {
    return (
      <>
        <Board socket={this.props.socket} />;
        <button onClick={() => {
            this.props.socket.emit("confirmWin");
          }}>Confirm Win</button>
        <button onClick={() => {
            this.props.socket.emit("bogey");
          }}>Bogey!</button>
      </>
    );
  }
}

export default Host;
