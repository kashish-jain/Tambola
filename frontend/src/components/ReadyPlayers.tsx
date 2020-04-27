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
    let checkMark = <span className="checkmark">&#10004;</span>;
    let playersComp = [];
    for (let i = 0; i < this.props.players.length; ++i) {
      playersComp.push(
        <tr key={i}>
          <td>{this.props.players[i].user.username}</td>
          <td>{this.props.players[i].numTickets}</td>
          <td>{this.props.players[i].ready ? checkMark : "X"}</td>
        </tr>
      );
    }
    return (
      <div className="ready-players-container">
        <h1 className="players-in-game">Players in Game</h1>
        <hr />
        <table className="ready-players">
          <tr>
            <th>Name</th>
            <th># of Tickets</th>
            <th>Ready</th>
          </tr>
          {playersComp}
        </table>
      </div>
    );
  }
}

export default ReadyPlayers;
