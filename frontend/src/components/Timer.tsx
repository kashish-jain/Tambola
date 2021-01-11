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

  updateTimer = () => {
    let prevSeconds = this.state.seconds;
    if (prevSeconds >= 1) {
      this.setState({
        seconds: prevSeconds - 1,
      });
      if (prevSeconds === 1) {
        this.props.endGame();
      }
    }
  };

  render() {
    let className = "";
    if (this.state.seconds > 0) {
      className = "animated infinite bounceIn";
    }
    return (
      <div className="game-over">
        <p>Game will be over in:</p>
        <p className={"timer " + className}>{this.state.seconds}</p>
      </div>
    );
  }
}

export default Timer;
