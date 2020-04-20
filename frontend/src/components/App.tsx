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
}

interface AppProps {

}

class App extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      socket: io()
    }
  }

  type = "";

  componentWillMount() {
    
  }

  render() {
    console.log(this.state.socket);
    this.state.socket.on("userConnected", (type: any) => {
      this.type = type["type"];
      console.log(this.type);
      console.log(this.type === "Host");
    });

    
    let comp = (this.type === "Host")? <Board socket={this.state.socket}/>: <House />;
    console.log(this.type);
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
