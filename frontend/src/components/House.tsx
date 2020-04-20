import * as React from "react";
import { Component } from "react";
import Line from "./Line";
import { BoxState } from "./Box";

interface HouseProps {
  houseIndex: number
  houseNumbers: Array<Array<BoxState>>
  changeTicketState: (
    houseIndex: number,
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ) => void;
}

interface HouseState {
  numbers: Array<number>;
}

class House extends Component<HouseProps, HouseState> {
  constructor(props: HouseProps) {
    super(props);
  }

  changeTicketState = (
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ): void => {
    this.props.changeTicketState(this.props.houseIndex, lineIndex, boxIndex, check);
  };

  render() {
    return (
      <div>
        <Line
          key={0}
          index={0}
          numbers={this.props.houseNumbers[0]}
          changeTicketState={this.changeTicketState}
        />
        <Line
          key={1}
          index={1}
          numbers={this.props.houseNumbers[1]}
          changeTicketState={this.changeTicketState}
        />
        <Line
          key={2}
          index={2}
          numbers={this.props.houseNumbers[2]}
          changeTicketState={this.changeTicketState}
        />
      </div>
    );
  }
}

export default House;
