import React from "react";
import { Component } from "react";
import "../App.css";
import io from "socket.io-client";
import Player from "./Player";

interface AppState {
  socket: any;
}

interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      socket: io(),
    };
  }

  render() {
    return (
      <>
        <div className="App">
          <Player socket={this.state.socket} />
        </div>
      </>
    );
  }
}

export default App;
