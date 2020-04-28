import * as React from "react";
import { Component } from "react";

interface SnackbarProps {
  message: string; // "Click to copy the join link to your game"
  actionText: string; // "Copy URL"
}

interface SnackbarState {}

class Snackbar extends Component<SnackbarProps, SnackbarState> {
  constructor(props: SnackbarProps) {
    super(props);
  }

  render() {
    return (
      <>
        <div>
          {this.props.message}
          <button>{this.props.actionText}</button>
        </div>
      </>
    );
  }
}

export default Snackbar;
