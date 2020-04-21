import * as React from "react";
import { Component } from "react";

interface NewNumberProps {
  socket: any;
}

interface NewNumberState {
  newNumber: number;
}

interface newNumberObj_t {
  newNumber: number;
}

class NewNumber extends Component<NewNumberProps, NewNumberState> {
  constructor(props: NewNumberProps) {
    super(props);
    this.state = { newNumber: 0 };
  }

  componentDidMount() {
    this.props.socket.on(
      "newNumberFromHost",
      (newNumberObj: newNumberObj_t) => {
        console.log(newNumberObj.newNumber);
        this.setState({ newNumber: newNumberObj.newNumber });
      }
    );
  }
  render() {
    let newNumberComponent =
      this.state.newNumber == 0 ? null : (
        <p>New Number:{this.state.newNumber}</p>
      );
    return newNumberComponent;
  }
}

export default NewNumber;