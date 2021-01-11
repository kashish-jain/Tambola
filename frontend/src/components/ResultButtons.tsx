import * as React from "react";

interface ResultButtonsProps {
  bogey: string;
  win: string;
  resultCallback: (result: string) => void;
}

function ResultButtons(props: ResultButtonsProps) {
  return (
    <div className="result-buttons">
      <button
        onClick={() => {
          props.resultCallback(props.win);
        }}
      >
        {props.win}
      </button>
      <button
        onClick={() => {
          props.resultCallback(props.bogey);
        }}
      >
        {props.bogey}
      </button>
    </div>
  );
}

export default ResultButtons;
