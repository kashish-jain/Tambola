import * as React from "react";
import { Component } from "react";
import { resultObj } from "./Player";
import { Award } from "./Config";

interface PrizesProps {
  socket: any;
  awards: Award[];
}

interface PrizesState {
  // remaining awards should store, nameAward and numAward
  remainingAwards: Award[];

  // also keeping track of whoWonWhat
  // string -> string[]
  // nameAward -> players who have won it
  whoWonWhat: {
    [nameAward: string]: string[];
  };
}

class Prizes extends Component<PrizesProps, PrizesState> {
  constructor(props: PrizesProps) {
    super(props);
    this.state = { remainingAwards: this.props.awards, whoWonWhat: {} };
  }
  componentDidMount() {
    this.props.socket.on("resultsForPC", (resultsObj: resultObj) => {
      console.log("result obj for updating available prizes", resultsObj);
      if (resultsObj.result == "Confirm Win!") {
        let currAwards = this.state.remainingAwards;
        let currWhoWonWhat = this.state.whoWonWhat;
        for (let i = 0; i < currAwards.length; ++i) {
          if (currAwards[i].nameAward == resultsObj.callWinType) {
            // decrement currAwards[i].numAward
            let currNumAward = +currAwards[i].numAward;
            --currNumAward;
            currAwards[i].numAward = currNumAward.toString();

            // update whoWonWhat
            if (currWhoWonWhat[resultsObj.callWinType] === undefined) {
              currWhoWonWhat[resultsObj.callWinType] = [
                resultsObj.calledWinUsername,
              ];
            } else {
              currWhoWonWhat[resultsObj.callWinType].push(
                resultsObj.calledWinUsername
              );
            }
          }
        }
        this.setState({
          remainingAwards: currAwards,
          whoWonWhat: currWhoWonWhat,
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
          <td>
            {this.state.whoWonWhat[this.state.remainingAwards[i].nameAward]}
          </td>
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
