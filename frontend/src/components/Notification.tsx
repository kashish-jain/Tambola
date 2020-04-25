import * as React from "react";
import { Component } from "react";
import { callWin } from "./Player";
import Reward from "react-rewards";

// Important: To make the notifications to appear properly and rewards to work properly
// The parent div should have position: relative

interface resultObj {
  callWinType: string;
  calledWinUsername: string;
  result: string;
}

interface NotificationProps {
  socket: any;
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
    this.props.socket.on("callWinToHost", (callWinObj: callWin) => {
      this.reward.rewardMe();
      this.setState({ notificationObj: callWinObj });
      setTimeout(() => {
        this.deleteNotification();
      }, 5000);
    });
    this.props.socket.on("resultsForPC", (resultsObj: resultObj) => {
      console.log("result obj", resultsObj);
      this.reward.rewardMe();
      this.setState({ notificationObj: resultsObj });
      setTimeout(() => {
        this.deleteNotification();
      }, 5000);
    });
  }

  deleteNotification = () => {
    this.setState({ notificationObj: null });
  };

  render() {
    let notificationComp = this.state.notificationObj ? (
      <div className="notification-container">
        <div className="notification">
          <p className="main">{getMainHeading(this.state.notificationObj)}</p>
          <p className="sub">{getUserName(this.state.notificationObj)}</p>
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
            angle: 60,
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
