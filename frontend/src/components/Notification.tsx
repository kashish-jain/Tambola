import * as React from "react";
import { Component } from "react";
import { callWin, resultObj } from "./Player";
import Reward from "react-rewards";

// Important: To make the notifications to appear properly and rewards to work properly
// The parent div should have position: relative

interface NotificationProps {
  socket: any;
  type: string;
}

interface NotificationState {
  notificationObj: callWin | resultObj | null;
}

function getUserName(obj: any) {
  return obj.calledWinUsername || obj.user.username;
}

function getMainHeading(obj: any) {
  let mainHeading;
  if (obj.result !== undefined) {
    // this is result Obj
    mainHeading = obj.result + " " + obj.callWinType;
  } else {
    mainHeading = "Call: " + obj.callWinType;
  }
  return mainHeading;
}

class Notification extends Component<NotificationProps, NotificationState> {
  reward: any;
  constructor(props: NotificationProps) {
    super(props);
    this.state = { notificationObj: null };
  }

  componentDidMount() {
    let ticketBoardContainer = document.getElementById(
      "ticket-board-container"
    );
    this.props.socket.on("callWinToHost", (callWinObj: callWin) => {
      this.reward.rewardMe();
      this.setState({ notificationObj: callWinObj });
      ticketBoardContainer?.setAttribute("style", "opacity:0.2;");

      // callWinToHost notification gets deleted after 5seconds on everyone's screen
      setTimeout(() => {
        this.deleteNotification();
      }, 5000);
    });
    this.props.socket.on("resultsForPC", (resultsObj: resultObj) => {
      this.reward.rewardMe();
      this.setState({ notificationObj: resultsObj });
      ticketBoardContainer?.setAttribute("style", "opacity:0.2;");

      // Result notification gets deleted after 5seconds on everyone's screen
      setTimeout(() => {
        this.deleteNotification();
      }, 5000);
    });
  }

  deleteNotification = () => {
    this.setState({ notificationObj: null });
    let ticketBoardContainer = document.getElementById(
      "ticket-board-container"
    );
    if (ticketBoardContainer)
      ticketBoardContainer.setAttribute("style", "opacity: 1");
  };

  render() {
    let notificationComp = this.state.notificationObj ? (
      <div className="notification-container">
        <div className="notification">
          <p className="main animated rubberBand">
            {getMainHeading(this.state.notificationObj)}
          </p>
          <p className="sub animated bounce">
            {getUserName(this.state.notificationObj)}
          </p>
        </div>
      </div>
    ) : null;
    return (
      <>
        {notificationComp}
        <Reward
          ref={(ref: any) => {
            this.reward = ref;
          }}
          type="confetti"
          config={{
            elementCount: 100,
            angle: 90,
            spread: 90,
            decay: 0.95,
            lifetime: 150,
          }}
        ></Reward>
      </>
    );
  }
}

export default Notification;
