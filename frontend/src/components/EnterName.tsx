import * as React from "react";
import { Component } from "react";
import Config from "./Config";

interface EnterNameProps {
  socket: any;
}

interface EnterNameState {
  isEmpty: boolean;
  name: string;
  submitted: boolean;
}

class EnterName extends Component<EnterNameProps, EnterNameState> {
  constructor(props: EnterNameProps) {
    super(props);
    this.state = { isEmpty: true, name: "", submitted: false };
  }

  handleChange = (event: any) => {
    const { value } = event.target;
    if (value !== "") {
      this.setState({ isEmpty: false, name: value });
    } else {
      this.setState({ isEmpty: true, name: value });
    }
  };

  handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      console.log("enter press here!");
      this.setState({
        submitted: true,
      });
    }
  };

  handleSubmit = (event: any) => {
    this.setState({
      submitted: true,
    });
    event.preventDefault();
  };

  render() {
    if (!this.state.submitted) {
      let submitButton = null;
      if (!this.state.isEmpty) {
        submitButton = (
          <div>
            <button onClick={this.handleSubmit}>OK</button>
            <p>press ENTER</p>
          </div>
        );
      }
      return (
        <>
          <p>Hi. What's your name?</p>
          <input
            type="text"
            value={this.state.name}
            placeholder="Type your name here..."
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
          {submitButton}
        </>
      );
    } else {
      return <Config socket={this.props.socket} name={this.state.name} />;
    }
  }
}

export default EnterName;
