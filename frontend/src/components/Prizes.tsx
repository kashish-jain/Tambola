import * as React from "react";
import { Component } from "react";
import { resultObj } from "./Player";
import { Award } from "./Config";
import { newNumberObj_t } from "./NewNumber";
import "../css/Prizes.css";

interface PrizesProps {
  socket: any;
  awards: Award[];
  playerType: string;
  endGame: () => void;
}

interface PrizesState {
  // remaining awards should store, nameAward and numAward
  remainingAwards: Award[];

  // also keeping track of whoWonWhat
  // string -> string[]
  // nameAward -> players who have won it
  whoWonWhat: {
    [nameAward: string]: {
      [onNumber: number]: string[];
    };
  };
}

class Prizes extends Component<PrizesProps, PrizesState> {
  newNumber: number = 0;
  constructor(props: PrizesProps) {
    super(props);
    this.state = {
      remainingAwards: this.props.awards,
      whoWonWhat: {},
    };
  }

  componentDidMount() {
    // updating my copy of new number from the host
    this.props.socket.on(
      "newNumberFromHost",
      (newNumberObj: newNumberObj_t) => {
        this.newNumber = newNumberObj.newNumber;

        // disable the winButton for which numaward = 0
        for (let i = 0; i < this.state.remainingAwards.length; ++i) {
          if (parseInt(this.state.remainingAwards[i].numAward) === 0) {
            let winningButton = document.querySelector(
              `.winning-buttons button:nth-child(${i + 1})`
            ) as HTMLInputElement;

            // Will be null on host's screen
            if (winningButton) {
              winningButton.disabled = true;
              winningButton.classList.add("disabled-button");
            }
          }
        }
      }
    );

    this.props.socket.on("hostCompletedChecking", () => {
      let anyAwardsLeft: boolean = false;
      for (let i = 0; i < this.state.remainingAwards.length; ++i) {
        // Check if anyAwardsLeft, if not then game has ended
        if (parseInt(this.state.remainingAwards[i].numAward) > 0)
          anyAwardsLeft = true;
      }

      // timer logic
      if (!anyAwardsLeft && this.props.playerType === "Host") {
        this.props.socket.emit("showTimer");
      }
    });

    this.props.socket.on("resultsForPC", (resultsObj: resultObj) => {
      if (resultsObj.result === "Confirm Win!") {
        let currAwards = this.state.remainingAwards;
        let currWhoWonWhat = this.state.whoWonWhat;
        for (let i = 0; i < currAwards.length; ++i) {
          if (currAwards[i].nameAward === resultsObj.callWinType) {
            // adding entry for new award
            if (currWhoWonWhat[resultsObj.callWinType] === undefined) {
              currWhoWonWhat[resultsObj.callWinType] = {};
            }

            if (
              currWhoWonWhat[resultsObj.callWinType][this.newNumber] ===
              undefined
            ) {
              currWhoWonWhat[resultsObj.callWinType][this.newNumber] = [
                resultsObj.calledWinUsername,
              ];

              // decrement currAwards[i].numAward
              let currNumAward = parseInt(currAwards[i].numAward);
              --currNumAward;
              currAwards[i].numAward = currNumAward.toString();
            } else {
              currWhoWonWhat[resultsObj.callWinType][this.newNumber].push(
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

    // component about figuring out who won what award along with ties
    let whoWonComp = [];
    for (let i = 0; i < this.state.remainingAwards.length; ++i) {
      let tiedPlayers = [];
      for (var key in this.state.whoWonWhat[
        this.state.remainingAwards[i].nameAward
      ]) {
        if (
          this.state.whoWonWhat[
            this.state.remainingAwards[i].nameAward
          ].hasOwnProperty(key)
        ) {
          tiedPlayers.push(
            this.state.whoWonWhat[this.state.remainingAwards[i].nameAward][
              key
            ].join(" | ")
          );
        }
      }
      whoWonComp.push(tiedPlayers.join(", "));
    }

    // rendering the actual prizes
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
          <td className="won-by">{whoWonComp[i]}</td>
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
      </div>
    );
  }
}

export default Prizes;
