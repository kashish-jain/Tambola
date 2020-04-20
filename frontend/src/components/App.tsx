import React from "react";
import { Component } from "react";
import "../App.css";
import House from "./House";
import NextNumber from "./NextNumber";
import Board from "./Board";
import io from 'socket.io-client';

  /*socket.on('news', (data: any) => {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
  
  /*socket.on('newNumberFromHost', () => {
    // receiving number here for players
    console.log(`newNumberFromHost`);
  });*/

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
          type: type["type"]
        });
      }
      console.log("received notification", this.state.type);
    });
  }

  render() {
    let comp;
    if(this.state.type === "Host") {
      comp = <Board socket={this.state.socket}/>;
    } else if(this.state.type === "PC") {
      comp = <House />;
    } else {
      comp = <></>;
    }

    return (
      <>
        <div className="App">
          { comp }
        </div>
      </>
    );
  }
}

export default App;
