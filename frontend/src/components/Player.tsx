import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import NewNumber from "./NewNumber";

interface PlayerProps {
  socket: any;
}

interface PlayerState {}

class Player extends Component<PlayerProps, PlayerState> {
  constructor(props: PlayerProps) {
    super(props);
  }
  render() {
    return (
      <>
        <Ticket socket={this.props.socket} />
        <NewNumber socket={this.props.socket} />
      </>
    );
  }
}

export default Player;
