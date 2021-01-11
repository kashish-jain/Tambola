import * as React from "react";
import Ticket from "./Ticket";
import ResultButtons from "./ResultButtons";
import { callWin } from "./Player";

interface HostTicketProps {
  socket: any;
  callWinObj: callWin;
  removeTicketFromHost: (id: string) => void;
}

function HostTicket(props: HostTicketProps) {
  let handleResultCall = (result: string) => {
    props.socket.emit("resultsFromHost", {
      result: result,
      callWinType: props.callWinObj.callWinType,
      userCalledForWin: props.callWinObj.user,
    });
    // Key is concatenation of id and callWinType
    props.removeTicketFromHost(
      props.callWinObj.user.id + props.callWinObj.callWinType
    );
  };
  let playerTicket = (
    <div className="host-ticket">
      <br></br>
      <p className="win-call-type">{props.callWinObj.callWinType}</p>
      <p className="player-name">{props.callWinObj.user.username}'s Ticket</p>
      <div className="no-click">
        <Ticket
          houses={props.callWinObj.houses}
          numHouses={props.callWinObj.houses.length}
        />
      </div>
      <ResultButtons
        key={0}
        win={"Confirm Win!"}
        bogey={"Bogey!"}
        resultCallback={handleResultCall}
      />
    </div>
  );
  return <>{playerTicket}</>;
}

export default HostTicket;
