import * as React from "react";
import { Component } from "react";
import { BoardLine } from "./BoardLine";
import Notification from "./Notification";
import { BoxState } from "./Box";
import Waiting from "./Waiting";
import Timer from "./Timer";

//TODO: Fix some logic of duplicate keys for rows generated

// Another variation: Right now the host will check mark the numbers which are done;
// What if he messes up? What if he could not maintain the board correctly and give awards to
// the bogus ones without even realizing that he has not been maintaining the board properly;
// We will have a rectify button which will actually change all the states of the boxes by looking
// at the array. This is still easy to do.

interface BoardProps {
  socket: any;
  endGame: () => void;
}

interface BoardState {
  // This is the array that actually holds what numbers are checked and what are not in 1-90 order
  allBoardNumbers: Array<Array<BoxState>>;

  // Array of shuffled numbers
  shuffledBoardNumbers: Array<number>;

  // This is index of the shuffledBoardNumbers array. So tells basically which number should come next
  goneNumbers: number;

  // for timer
  showTimer: boolean;
}

// Utility Functions
function shuffle(a: Array<number>): Array<number> {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Creates an array of size 90 with 1-90 at indices 0-89
function createArray(): Array<number> {
  let a = [];
  for (let i = 0; i < 90; ++i) {
    a[i] = i + 1;
  }
  return a;
}

function createNumbersLine(n: number): Array<BoxState> {
  // generates an array of 10 elements; from n - n+9
  let a: Array<BoxState> = [];
  for (let i = 0; i < 10; ++i) {
    a[i] = { value: n + i, check: false };
  }
  return a;
}

// Function generates all numbers 1-90 in order for printing the board
function generateAllBoardNumbers(): Array<Array<BoxState>> {
  let a: Array<Array<BoxState>> = [];
  for (let i = 0; i < 9; ++i) {
    a[i] = createNumbersLine(i * 10 + 1);
  }
  return a;
}

function generateAllLines(allBoardNumbers: Array<Array<BoxState>>) {
  let allLines = [];
  for (let i = 0; i < allBoardNumbers.length; ++i) {
    allLines.push(<BoardLine key={i} index={i} numbers={allBoardNumbers[i]} />);
  }
  return allLines;
}

class Board extends Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    let boardNumbersArray = shuffle(createArray());
    this.state = {
      shuffledBoardNumbers: boardNumbersArray,
      goneNumbers: 0,
      allBoardNumbers: generateAllBoardNumbers(),
      showTimer: false,
    };
  }

  componentDidMount() {
    this.props.socket.on("showTimer", () => {
      // Disable the generate new button
      let generateNewButton = document.querySelector(
        "button.new-number"
      ) as HTMLInputElement;
      generateNewButton.disabled = true;
      generateNewButton.classList.add("disabled-button");
      this.setState({ showTimer: true });
    });
    this.props.socket.on("callWinToHost", () => {
      if (this.state.showTimer === true) this.setState({ showTimer: false });
    });
  }

  handleNewNumber = (newNumber: number) => {
    let columnNumber = newNumber % 10 === 0 ? 9 : (newNumber % 10) - 1;
    let rowNum =
      newNumber % 10 === 0 ? newNumber / 10 - 1 : Math.floor(newNumber / 10);
    let allBoardNumbers = this.state.allBoardNumbers;
    allBoardNumbers[rowNum][columnNumber] = {
      value: newNumber,
      check: true,
    };
    this.setState({
      allBoardNumbers: allBoardNumbers,
      goneNumbers: this.state.goneNumbers + 1,
    });
  };

  render() {
    let timer = null;
    if (this.state.showTimer) {
      timer = <Timer socket={this.props.socket} endGame={this.props.endGame} />;
    }

    let newNumber = 0;
    let allLines = generateAllLines(this.state.allBoardNumbers);
    return (
      <div className="board-component-main">
        <button
          className={"new-number"}
          onClick={() => {
            newNumber = this.state.shuffledBoardNumbers[this.state.goneNumbers];
            this.handleNewNumber(newNumber);
            this.props.socket.emit("newNumber", newNumber);
          }}
        >
          Generate New
        </button>
        <div>
          <div className="new-number-host-container">
            <p className={"new-number-host"}>
              {this.state.shuffledBoardNumbers[this.state.goneNumbers - 1]
                ? this.state.shuffledBoardNumbers[this.state.goneNumbers - 1]
                : ""}
            </p>
          </div>
        </div>
        {timer}
        <Waiting socket={this.props.socket} playerType="Host" />
        <div className="notification-parent">
          {/* This div is for setting the opacity when notification is shown */}
          <div id="ticket-board-container" className="no-click">
            {allLines}
          </div>
          <Notification socket={this.props.socket} type="host" />
        </div>
      </div>
    );
  }
}

export default Board;
