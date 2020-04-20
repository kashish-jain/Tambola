import React from "react";
import { Component } from "react";
import "../App.css";
import Ticket from "./Ticket";
import Board from "./Board";
import io from 'socket.io-client';

interface AppState {
  socket: any
  type: string
}

interface AppProps {

}

class App extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      socket: io(),
      type: ""
    }
  }

  componentDidMount() {
    this.state.socket.on("userConnected", (type: any) => {
      if(this.state.type == "") {
        this.setState({
          socket: this.state.socket,
          type: type.type
        });
      }
      console.log("received notification", this.state.type);
    });
  }

  render() {
    let component;
    if(this.state.type === "Host") {
      component = <Board socket={this.state.socket}/>;
    } else if(this.state.type === "PC") {
      component = <Ticket socket={this.state.socket}/>;
    } else {
      component = <></>;
    }

    return (
      <>
        <div className="App">
          { component }
        </div>
      </>
    );
  }
}

export default App;
