import React from "react";
import { Component } from "react";
import "../App.css";
import io from "socket.io-client";
import Host from "./Host";
import Player from "./Player";

interface AppState {
  socket: any;
  type: string;
}

interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      socket: io(),
      type: "",
    };
  }

  componentDidMount() {
    this.state.socket.on("userConnected", (type: any) => {
      this.setState({
        socket: this.state.socket,
        type: type.type,
      });
    });
    console.log("dkshf", window.location.pathname);
  }

  render() {
    let component;
    if (this.state.type === "Host") {
      component = <Host socket={this.state.socket} />;
    } else if (this.state.type === "PC") {
      component = <Player socket={this.state.socket} />;
    }
    return (
      <>
        <div className="App">{component}</div>
      </>
    );
  }
}

export default App;
