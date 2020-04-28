import * as React from "react";
import { Component } from "react";
import { resultObj } from "./Player";
import { Award } from "./Config";
import "../css/Prizes.css";

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
      console.log(
        "result obj for updating available prizes",
        this.state.whoWonWhat
      );
      if (resultsObj.result == "Confirm Win!") {
        let currAwards = this.state.remainingAwards;
        let currWhoWonWhat = this.state.whoWonWhat;
        for (let i = 0; i < currAwards.length; ++i) {
          if (currAwards[i].nameAward == resultsObj.callWinType) {
            // decrement currAwards[i].numAward
            let currNumAward = +currAwards[i].numAward;
            --currNumAward;
            currAwards[i].numAward = currNumAward.toString();

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
    let zeroAwardsLeft = <span className="zero-awards-left">x0</span>;
    let prizeComp = [];
    for (let i = 0; i < this.state.remainingAwards.length; ++i) {
      prizeComp.push(
        <tr key={i}>
          <td className="award">{this.state.remainingAwards[i].nameAward}</td>
          <td className="left">
            {this.state.remainingAwards[i].numAward === "0"
              ? zeroAwardsLeft
              : "x" + this.state.remainingAwards[i].numAward}
          </td>
          <td className="won-by">
            {this.state.whoWonWhat[
              this.state.remainingAwards[i].nameAward
            ]?.join(", ")}
          </td>
        </tr>
      );
    }
    return (
      <div className="prizes-container">
        <hr />
        <table className="prizes">
          <tr>
            <th className="award">Award</th>
            <th className="left">Left</th>
            <th className="won-by">Won By</th>
          </tr>
          {prizeComp}
        </table>
      </div>
    );
  }
}

export default Prizes;
