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
    const { value } = event.target;
    if (event.key === "Enter" && value !== "") {
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
      let myStyles: React.CSSProperties = {};
      if (!this.state.isEmpty) {
        myStyles = { visibility: "visible" };
      } else {
        myStyles = { visibility: "hidden" };
      }
      let submitButton = (
        <div style={myStyles}>
          <button onClick={this.handleSubmit}>OK</button>
        </div>
      )

      return (
        <div className="enter-name-container">
          <div className="enter-name">
            <p className="enter-name-question">Hi. What's your name?</p>
            <input
              id="enter-name"
              type="text"
              value={this.state.name}
              placeholder="Type your answer here..."
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              spellCheck="false"
              autoFocus
            />
            <br />
            <br />
            <br />
            {submitButton}
          </div>
        </div>
      );
    } else {
      return <Config socket={this.props.socket} name={this.state.name} />;
    }
  }
}

export default EnterName;
