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
    return <Board socket={this.props.socket} />;
  }
}

export default Host;
