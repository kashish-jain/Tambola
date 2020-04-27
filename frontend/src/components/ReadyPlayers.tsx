import * as React from "react";
import { Component } from "react";
import { PcStatus } from "./Config";

interface ReadyPlayersProps {
  players: PcStatus[];
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
        <tr key={i}>
          <td>{this.props.players[i].user.username}</td>
          <td>{this.props.players[i].ready ? "Yes" : "No"}</td>
          <td>{this.props.players[i].numTickets}</td>
        </tr>
      );
    }
    return (
      <table className="ready-player-container">
        <tr>
          <th>Name</th>
          <th>Ready</th>
          <th>Number of Tickets</th>
        </tr>
        {playersComp}
      </table>
    );
  }
}

export default ReadyPlayers;
