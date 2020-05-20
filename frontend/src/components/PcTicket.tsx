import * as React from "react";
import { Component } from "react";
import Ticket from "./Ticket";
import { BoxState } from "./Box";
import { generateTicket } from "../utils/utils";
import WinningButtons from "./WinningButtons";
import NewNumber from "./NewNumber";
import Notification from "./Notification";
import { Award } from "./Config";
import Waiting from "./Waiting";
import Timer from "./Timer";

interface PcTicketProps {
  socket: any;

  // awards coming for winning buttons
  awards: Award[];

  // number of houses
  numHouses: number;

  endGame: () => void;
}

interface PcTicketState {
  showTimer: boolean;
}

class PcTicket extends Component<PcTicketProps, PcTicketState> {
  houses: Array<Array<Array<BoxState>>>;
  constructor(props: PcTicketProps) {
    super(props);
    this.houses = generateTicket(this.props.numHouses);
    this.state = { showTimer: false };
  }
  componentDidMount() {
    this.props.socket.on("showTimer", () => {
      this.setState({ showTimer: true });
    });

    // hiding timer in case there is another call for win
    this.props.socket.on("callWinToHost", () => {
      if (this.state.showTimer === true) this.setState({ showTimer: false });
    });
  }
  changeTicketState = (
    houseIndex: number,
    lineIndex: number,
    boxIndex: number,
    check: boolean
  ): void => {
    let { value } = this.houses[houseIndex][lineIndex][boxIndex];
    this.houses[houseIndex][lineIndex][boxIndex] = { value: value, check };
    console.log("here it is after changing", this.houses);
  };

  handleWinningCall = (callWinType: string) => {
    // send ticket here as well
    this.props.socket.emit("callWinFromPC", {
      callWinType: callWinType,
      houses: this.houses,
    });
  };

  winningButtons = (
    <WinningButtons
      key={0}
      awards={this.props.awards}
      winCallBack={this.handleWinningCall}
    />
  );

  render() {
    let timer = null;
    if (this.state.showTimer) {
      timer = <Timer socket={this.props.socket} endGame={this.props.endGame} />;
    }

    return (
      <div className="pc-ticket">
        <NewNumber socket={this.props.socket} />
        {timer}
        <Waiting playerType="PC" socket={this.props.socket} />
        <div className="notification-parent">
          {/* This div is for setting the opacity when notification is shown */}
          <div id="ticket-board-container">
            <Ticket
              houses={this.houses}
              changeTicketState={this.changeTicketState}
              numHouses={this.props.numHouses}
            />
          </div>

          <Notification socket={this.props.socket} type="Pc" />
        </div>

        {this.winningButtons}
      </div>
    );
  }
}

export default PcTicket;
