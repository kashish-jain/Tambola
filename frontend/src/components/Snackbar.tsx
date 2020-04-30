import * as React from "react";
import { Component } from "react";

interface SnackbarProps {
  message: string; // "Click to copy the join link to your game"
  actionText: string; // "Copy URL"
}

interface SnackbarState {
  hidden: boolean;
}

class Snackbar extends Component<SnackbarProps, SnackbarState> {
  constructor(props: SnackbarProps) {
    super(props);
    this.state = { hidden: false };
  }

  handleCopyUrl = () => {
    // Hacky way, but only way without using any external library
    var dummy = document.createElement("input"),
      curUrl = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = curUrl;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    this.setState({
      hidden: true,
    });
  };

  render() {
    let animation;
    if (this.state.hidden === true) {
      animation = "animated bounceOutUp";
    } else {
      animation = "animated bounceInDown";
    }
    return (
      <div className={animation}>
        <div
          style={{
            position: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            left: "0.75rem",
            right: "0.75rem",
            borderRadius: "10px",
            background: "#ffcb36",
          }}
        >
          <p style={{ color: "#000000" }}>{this.props.message}</p>
          <button style={{ width: "30%" }} onClick={this.handleCopyUrl}>
            {this.props.actionText}
          </button>
        </div>
      </div>
    );
  }
}

export default Snackbar;
