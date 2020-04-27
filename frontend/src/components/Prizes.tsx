import * as React from "react";
import { Component } from "react";
import { resultObj } from "./Player";
import { Award } from "./Config";

interface PrizesProps {
  socket: any;
  awards: Award[];
}

interface PrizesState {
  remainingAwards: Award[];
}

class Prizes extends Component<PrizesProps, PrizesState> {
  constructor(props: PrizesProps) {
    super(props);
    this.state = { remainingAwards: this.props.awards };
  }
  componentDidMount() {
    this.props.socket.on("resultsForPC", (resultsObj: resultObj) => {
      console.log("result obj for updating available prizes", resultsObj);
      if (resultsObj.result == "Confirm Win!") {
        let currAwards = this.state.remainingAwards;
        for (let i = 0; i < currAwards.length; ++i) {
          if (currAwards[i].nameAward == resultsObj.callWinType) {
            // decrement currAwards[i].numAward
            let currNumAward = +currAwards[i].numAward;
            --currNumAward;
            currAwards[i].numAward = currNumAward.toString();
          }
        }
        this.setState({
          remainingAwards: currAwards,
        });
      }
    });
  }
  render() {
    // use state.remainingAwards to make a table
    let prizeComp = [];
    for (let i = 0; i < this.state.remainingAwards.length; ++i) {
      prizeComp.push(
        <tr key={i}>
          <td>{this.state.remainingAwards[i].nameAward}</td>
          <td>x{this.state.remainingAwards[i].numAward}</td>
        </tr>
      );
    }
    return (
      <table className="ready-player-container">
        <tr>
          <th colSpan={2}>Prizes</th>
        </tr>
        {prizeComp}
      </table>
    );
  }
}

export default Prizes;
