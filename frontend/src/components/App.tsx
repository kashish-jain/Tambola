import React from "react";
import { Component } from "react";
import "../css/App.css";
import io from "socket.io-client";
import EnterName from "./EnterName";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";

interface AppState {
  socket: any;
}

interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    const url = process.env.REACT_APP_BACKEND_URL || ""; // TODO: THROW ERROR IF URL EMPTY
    this.state = {
      socket: io(url),
    };
  }

  render() {
    return (
      <>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route
                path="/game/:roomid"
                element={<EnterName socket={this.state.socket} />}
              />
              <Route
                path="/home"
                element={<HomePage />}
              />
              <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
          </BrowserRouter>
        </div>
      </>
    );
  }
}

export default App;
