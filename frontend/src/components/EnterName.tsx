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
      let myStyles: React.CSSProperties = {};
      if (!this.state.isEmpty) {
        myStyles = { display: "flex", visibility: "visible" };
      } else {
        myStyles = { display: "flex", visibility: "hidden" };
      }
      let submitButton = (
        <div style={myStyles}>
          <button
            onClick={this.handleSubmit}
            style={{
              width: "3.5rem",
            }}
          >
            OK
          </button>
          <p style={{ marginLeft: "0.6rem", color: "#ffffff" }}>press ENTER</p>
        </div>
      );
      return (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <p
            style={{
              fontSize: "2rem",
            }}
          >
            Hi. What's your name?
          </p>
          <input
            type="text"
            value={this.state.name}
            placeholder="Type your answer here..."
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            style={{
              outline: "none",
              background: "#0e141f",
              border: "none",
              fontSize: "4rem",
              color: "#ffcb36",
            }}
            spellCheck="false"
            autoFocus
          />
          <br />
          <br />
          <br />
          {submitButton}
        </div>
      );
    } else {
      return <Config socket={this.props.socket} name={this.state.name} />;
    }
  }
}

export default EnterName;
