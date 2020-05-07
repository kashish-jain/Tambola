import * as React from "react";
import { Component } from "react";
import { resultObj } from "./Player";
import { Award } from "./Config";
import Reward from "react-rewards";
import "../css/Prizes.css";

interface PrizesProps {
  socket: any;
  awards: Award[];
  endGame: () => void;
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
  hasGameEnded: boolean;
}

class Prizes extends Component<PrizesProps, PrizesState> {
  reward: any;
  constructor(props: PrizesProps) {
    super(props);
    this.state = {
      remainingAwards: this.props.awards,
      whoWonWhat: {},
      hasGameEnded: false,
    };
  }
  componentDidMount() {
    this.props.socket.on("resultsForPC", (resultsObj: resultObj) => {
      if (resultsObj.result == "Confirm Win!") {
        let currAwards = this.state.remainingAwards;
        let currWhoWonWhat = this.state.whoWonWhat;
        let anyAwardsLeft: boolean = false;
        for (let i = 0; i < currAwards.length; ++i) {
          if (currAwards[i].nameAward == resultsObj.callWinType) {
            // decrement currAwards[i].numAward
            let currNumAward = parseInt(currAwards[i].numAward);
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
          // Check if anyAwardsLeft, if not then game has ended
          if (parseInt(currAwards[i].numAward) > 0) anyAwardsLeft = true;
        }
        if (!anyAwardsLeft) {
          this.props.endGame();
          // Keep rewarding the player after every 2 sec
          let timesRun = 0;
          let interval = setInterval(() => {
            this.reward.rewardMe();
            ++timesRun;
            if (timesRun === 5) clearInterval(interval);
          }, 2000);
        }
        this.setState({
          remainingAwards: currAwards,
          whoWonWhat: currWhoWonWhat,
          hasGameEnded: !anyAwardsLeft,
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
        <p className="award-status">Award Status</p>
        <hr />
        <table className="prizes">
          <tr>
            <th className="award">Award</th>
            <th className="left">Left</th>
            <th className="won-by">Won By</th>
          </tr>
          {prizeComp}
        </table>
        <Reward
          ref={(ref: any) => {
            this.reward = ref;
          }}
          type="confetti"
          config={{
            elementCount: 50,
            angle: 75,
            spread: 40,
            decay: 0.95,
            lifetime: 100,
          }}
        ></Reward>
      </div>
    );
  }
}

export default Prizes;
