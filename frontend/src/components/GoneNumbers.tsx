import * as React from "react";
import { Component } from "react";

interface GoneNumbersProps {
  numbers: Array<number>;
}

interface GoneNumbersState {}

class GoneNumbers extends Component<GoneNumbersProps, GoneNumbersState> {
  constructor(props: GoneNumbersProps) {
    super(props);
    this.state = {
      isShown: false,
    };
  }

  render() {
    let mainComp = [];
    for (let i = this.props.numbers.length - 1; i >= 0; --i) {
      mainComp.push(<p key={i}>{this.props.numbers[i]}</p>);
    }
    return (
      <div className="gone-numbers-container">
        <button
          id="gone-numbers-button"
          onClick={() => {
            let goneNumbers = document.getElementById("gone-numbers-menu");
            let button = document.getElementById("gone-numbers-button");
            if (goneNumbers !== null && button !== null) {
              if (
                window
                  .getComputedStyle(goneNumbers)
                  .getPropertyValue("display") !== "none"
              ) {
                goneNumbers.style.display = "none";
                button.innerHTML = "Gone Numbers";
              } else {
                goneNumbers.style.display = "block";
                goneNumbers.classList.add("animated", "fadeIn");
                button.innerHTML = "X";
              }
            }
          }}
        >
          Gone Numbers
        </button>
        <div id="gone-numbers-menu">{mainComp}</div>
      </div>
    );
  }
}

export default GoneNumbers;
