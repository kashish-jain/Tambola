import * as React from "react";
import { Component } from "react";
import { resultObj } from "./Player";
import { Award } from "./Config";

interface PrizesProps {
  socket: any;
  awards: Award[];
}

interface PrizesState {
  remainingAwards: Award[];
}

class Prizes extends Component<PrizesProps, PrizesState> {
  constructor(props: PrizesProps) {
    super(props);
    this.state = { remainingAwards: this.props.awards };
  }
  componentDidMount() {
    this.props.socket.on("resultsForPC", (resultsObj: resultObj) => {
      console.log("result obj for updating available prizes", resultsObj);
    });
  }
  render() {
    // use state.remainingAwards to make a table
    return <></>;
  }
}

export default Prizes;
