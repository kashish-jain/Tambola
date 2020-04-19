import * as React from "react";
import { Component } from "react";
import { BoardLine } from "./BoardLine";

// Fix some logic of duplicate keys for rows generated

interface BoardProps {}

interface BoardState {
  boardNumbers: Array<number>;
  goneNumbers: number;
}

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

function createNumbersLine(n: number): Array<number> {
  // generates an array of 10 elements; from n - n+9
  let a = [];
  for (let i = 0; i < 10; ++i) {
    a[i] = n + i;
  }
  return a;
}

// Function generates all numbers 1-90 in order for printing the board
function generateAllBoardNumbers(): Array<Array<number>> {
  let a = [];
  for (let i = 0; i < 9; ++i) {
    a[i] = createNumbersLine(i * 10 + 1);
  }
  return a;
}

class Board extends Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    let boardNumbersArray = shuffle(createArray());
    this.state = {
      boardNumbers: boardNumbersArray,
      goneNumbers: 0,
    };
  }

  allBoardNumbers: Array<Array<number>> = generateAllBoardNumbers();
  allLines = this.allBoardNumbers.map(function (numberRow) {
    return <BoardLine key={1} numbers={numberRow} />;
  });

  render() {
    return (
      <>
        <button
          onClick={() => {
            console.log(
              "new number ",
              this.state.boardNumbers[this.state.goneNumbers]
            );
            this.setState({
              boardNumbers: this.state.boardNumbers,
              goneNumbers: this.state.goneNumbers + 1,
            });
          }}
        >
          Generate New
        </button>
        {this.allLines}
      </>
    );
  }
}

export default Board;
