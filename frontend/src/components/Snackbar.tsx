import * as React from "react";
import { Component } from "react";
import "../css/Snackbar.css";

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
        <div className="snackbar">
          <p className="snackbar-text">{this.props.message}</p>
          <button className="snackbar-action" onClick={this.handleCopyUrl}>
            {this.props.actionText}
          </button>
        </div>
      </div>
    );
  }
}

export default Snackbar;
