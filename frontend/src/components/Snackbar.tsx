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
    if (this.state.hidden === true) {
      return <></>;
    }
    return (
      <>
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "space-around",
            marginLeft: "0.75rem",
            marginTop: "0.50rem",
            top: "1%",
            width: "90%",
            background: "#ffcb36",
          }}
        >
          <p style={{ color: "#000000" }}>{this.props.message}</p>
          <button style={{ width: "25%" }} onClick={this.handleCopyUrl}>
            {this.props.actionText}
          </button>
        </div>
      </>
    );
  }
}

export default Snackbar;
