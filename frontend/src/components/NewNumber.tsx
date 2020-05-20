import * as React from "react";
import { Component } from "react";
import GoneNumbers from "./GoneNumbers";

interface NewNumberProps {
  socket: any;
}

interface NewNumberState {
  newNumber: number;
}

export interface newNumberObj_t {
  newNumber: number;
}

class NewNumber extends Component<NewNumberProps, NewNumberState> {
  goneNumbers: Array<number>;
  constructor(props: NewNumberProps) {
    super(props);
    this.state = { newNumber: 0 };
    this.goneNumbers = [];
  }

  componentDidMount() {
    this.props.socket.on(
      "newNumberFromHost",
      (newNumberObj: newNumberObj_t) => {
        this.goneNumbers.push(newNumberObj.newNumber);
        this.setState({ newNumber: newNumberObj.newNumber });
      }
    );
  }

  // For generating random key for every render so that dom is manipulated every
  // single time for new render to display the animation
  generateRandomKey = () => {
    return Math.random() * 10000;
  };

  render() {
    let newNumberComponent = (
      <>
        <p className="new-number-player">New Number </p>
        <div>
          <div
            key={this.generateRandomKey()}
            className="new-number-player-container custom-pulse"
          >
            <p className="only-new-number-player">
              {this.state.newNumber ? this.state.newNumber : ""}
            </p>
          </div>
        </div>
        <GoneNumbers numbers={this.goneNumbers} />
      </>
    );
    return newNumberComponent;
  }
}

export default NewNumber;
