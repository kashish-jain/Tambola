import * as React from "react";
import { Component } from "react";
import { User } from "./Config";

interface ReadyPlayersProps {
  players: User[];
}

interface ReadyPlayersState {}

class ReadyPlayers extends Component<ReadyPlayersProps, ReadyPlayersState> {
  constructor(props: ReadyPlayersProps) {
    super(props);
  }

  render() {
    let playersComp = [];
    for (let i = 0; i < this.props.players.length; ++i) {
      playersComp.push(
        <p key={this.props.players[i].username}>
          {this.props.players[i].username}
        </p>
      );
    }
    return (
      <>
        <p>Ready Players:</p>
        {playersComp}
      </>
    );
  }
}

export default ReadyPlayers;
