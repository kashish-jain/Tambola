import React from "react";
import { Component } from "react";
import "../App.css";
import io from "socket.io-client";
import Player from "./Player";

import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'
const Home = () => <h1>Home Page</h1>;
const Foo = () => <h1>Foo Page</h1>;
const Bar = () => <h1>Bar Page</h1>;

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
        <Router>
        <div>
          <nav>
            <Link to="/">Home</Link> <br/>
            <Link to="/game/abcd">abcd</Link> <br/>
            <Link to="/game/xyz">xyz</Link> <br/>
          </nav>
          <Switch>
            <Route exact path="/"> Welcome to Tambola </Route>
            <Route exact path="/game/abcd"> <Player socket={this.state.socket} /> </Route>
            <Route exact path="/game/xyz"> <Player socket={this.state.socket} /> </Route>
          </Switch>
        </div>
      </Router>
      </>
    );
  }
}

export default App;
