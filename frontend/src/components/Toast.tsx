import * as React from "react";
import { Component } from "react";
import "../css/Snackbar.css";

interface ToastProps {
  message: string; // "Click to copy the join link to your game"
  isShown: boolean;
  initiallyHidden: boolean;
  handleClose: () => void;
}

interface ToastState {}

class Toast extends Component<ToastProps, ToastState> {
  constructor(props: ToastProps) {
    super(props);
    this.state = { isShown: this.props.isShown };
  }

  render() {
    let animation,
      displayStyle = "flex";
    if (this.props.isShown === false) {
      animation = "animated bounceOutRight";
    } else {
      animation = "animated bounceInRight";
    }
    if (this.props.initiallyHidden) displayStyle = "none";
    return (
      <div className={animation}>
        <div className="snackbar" style={{ display: displayStyle }}>
          <p className="snackbar-text">{this.props.message}</p>
          <button
            onClick={() => {
              this.props.handleClose();
            }}
          >
            X
          </button>
        </div>
      </div>
    );
  }
}

export default Toast;
