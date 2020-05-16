import * as React from "react";
import { Component } from "react";

interface TimerProps {
  socket: any;
  endGame: () => void;
}

interface TimerState {
  seconds: number;
  hasGameEnded: boolean;
}

class Timer extends Component<TimerProps, TimerState> {
  constructor(props: TimerProps) {
    super(props);
    this.state = { seconds: 10, hasGameEnded: false };
  }

  interval: any;
  componentDidMount() {
    this.interval = setInterval(() => this.updateTimer(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  emittedGameOver: boolean = false;
  updateTimer = () => {
    let prevSeconds = this.state.seconds;
    if (prevSeconds >= 2) {
      this.setState({
        seconds: prevSeconds - 1,
      });
    } else if (!this.emittedGameOver) {
      this.props.endGame();
      this.emittedGameOver = true;
    }
  };

  render() {
    return (
      <p className="animated pulse">
        Game will be over in {this.state.seconds} seconds
      </p>
    );
  }
}

export default Timer;
