import * as React from "react";
import { Component } from "react";

interface TimerProps {
  socket: any;
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
    } else {
      this.props.socket.emit("gameOver");
    }
  };

  render() {
    return <>Game will be over in {this.state.seconds} seconds</>;
  }
}

export default Timer;
