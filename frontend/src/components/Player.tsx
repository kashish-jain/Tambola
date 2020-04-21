import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import NewNumber from "./NewNumber";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

interface PlayerProps {
  socket: any;
}

interface PlayerState {}

class Player extends Component<PlayerProps, PlayerState> {
  constructor(props: PlayerProps) {
    super(props);
  }

  handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`);
    this.props.socket.emit("messageFromClient", newMessage);
  };

  componentDidMount() {
    this.props.socket.on("messageToClient", (msg: string) => {
      console.log("message received frontend ", msg);
      addResponseMessage(msg);
    });
  }
  render() {
    return (
      <>
        <Ticket socket={this.props.socket} />
        <NewNumber socket={this.props.socket} />
        <Widget handleNewUserMessage={this.handleNewUserMessage} />
      </>
    );
  }
}

export default Player;
