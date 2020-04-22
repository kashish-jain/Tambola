import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import NewNumber from "./NewNumber";

// TODO: Name entered by user could be empty; This is disastrous; We'll make name a different
// component soon.

interface PlayerProps {
  socket: any;
}

interface PlayerState {
  name: string | null;
}

class Player extends Component<PlayerProps, PlayerState> {
  constructor(props: PlayerProps) {
    super(props);
    this.state = { name: "" };
  }

  componentDidMount() {
    let roomID = window.location.pathname.substr(
      window.location.pathname.lastIndexOf("/") + 1
    );
    let name;
    if (this.state.name == "") {
      name = prompt("What would you like to be called?");
      this.setState({ name: name });
    }
    this.props.socket.emit("joinRoom", {
      room: roomID,
      username: name,
    });
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
