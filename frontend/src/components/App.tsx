import React from "react";
import "../App.css";
import House from "./House";
import NextNumber from "./NextNumber";
import Board from "./Board";

let textToSpeech = (newNumber: number) => {
  // get all voices that browser offers
  var available_voices = window.speechSynthesis.getVoices();

  // this will hold an english voice
  var english_voice;

  // find voice by language locale "en-US"
  // if not then select the first voice
  for (var i = 0; i < available_voices.length; i++) {
    if (available_voices[i].lang === "en-US") {
      english_voice = available_voices[i];
      break;
    }
  }
  if (english_voice === undefined) english_voice = available_voices[0];

  // new SpeechSynthesisUtterance object
  var utter = new SpeechSynthesisUtterance();
  utter.rate = 1;
  utter.pitch = 0.5;
  utter.text = String(newNumber);
  utter.voice = english_voice;

  // speak
  window.speechSynthesis.speak(utter);
};

function App() {
  return (
    <div className="App">
      <House />
      <Board />
    </div>
  );
}

export default App;
