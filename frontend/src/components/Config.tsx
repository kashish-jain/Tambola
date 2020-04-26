import * as React from "react";
import { Component } from "react";
import DTable from "./DTable";
import Player from "./Player";
import ReadyPlayers from "./ReadyPlayers";

export interface Award {
  [index: string]: string;
}

export interface User {
  username: string;
  id: string;
  room: string;
}

interface ConfigProps {
  socket: any;
}

interface ConfigState {
  type: string;
  name: string | null;

  // Config
  readyHost: boolean;
  readyClient: boolean;

  //  Host Config State options
  awards: Award[];

  //  PC Config State options
  numTickets: number;

  // List of players who are ready to play
  readyPlayers: User[];
}

class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      type: "",
      numTickets: 0,
      name: "",
      readyHost: false,
      readyClient: false,
      readyPlayers: [],
      awards: [
        {
          name: "First Line",
          mobile: "1",
        },
        {
          name: "Second Line",
          mobile: "1",
        },
        {
          name: "Third Line",
          mobile: "1",
        },
        {
          name: "Corners",
          mobile: "1",
        },
        {
          name: "Full House",
          mobile: "1",
        },
      ],
    };
  }

  componentDidMount() {
    // Player joins by entering his name
    let roomID = window.location.pathname.substr(
      window.location.pathname.lastIndexOf("/") + 1
    );
    let name;
    if (this.state.name == "") {
      name = prompt("What would you like to be called?");
      this.setState({ name: name });
    }

    // asking server to join room
    this.props.socket.emit("joinRoom", {
      room: roomID,
      username: name,
    });

    // server response: player gets know if he is host or pc
    this.props.socket.on("userConnected", (playerTypeObj: any) => {
      this.setState({
        type: playerTypeObj.type, // pass this type to player as well
      });

      // not needed I guess
      if (playerTypeObj.type == "Host") {
      } else if (playerTypeObj.type == "PC") {
        // attach listener for Host config Done
      }
    });

    // server sending awards from Host
    this.props.socket.on("HostConfigDone", (awards: any) => {
      this.setState({
        awards: awards,
        readyHost: true,
      });
    });

    this.props.socket.on("PcReady", (user: User) => {
      // Check in the array of users if user has already joined
      // case where someone presses ready twice
      let readyPlayers = this.state.readyPlayers;
      for (let i = 0; i < readyPlayers.length; ++i) {
        if (readyPlayers[i].id == user.id) {
          return;
        }
      }
      readyPlayers.push(user);
      this.setState({
        readyPlayers: readyPlayers,
      });
    });
  }

  // For Host Config
  handleChangeHost = (idx: number) => (e: any) => {
    const eTarget = e.target;
    let name: string = eTarget.name;
    let value: string = eTarget.value;

    const awards = this.state.awards;

    awards[idx][name] = value;

    this.setState({
      awards,
    });
  };
  handleAddRow = () => {
    const item = {
      name: "",
      mobile: "",
    };
    this.setState({
      awards: [...this.state.awards, item],
    });
  };
  handleRemoveRow = () => {
    this.setState({
      awards: this.state.awards.slice(0, -1),
    });
  };
  handleRemoveSpecificRow = (idx: number) => () => {
    const awards = [...this.state.awards];
    awards.splice(idx, 1);
    this.setState({ awards });
  };

  // For PC Config
  handleChangePC = (event: any) => {
    const { value } = event.target;
    if (this.state.type == "PC") {
      // sanity check
      this.setState({
        numTickets: value,
      });
    }
  };

  // common function for Host and PC Config
  handleSubmit = (event: any) => {
    this.setState({
      readyClient: true,
    });
    if (this.state.type == "Host") {
      // emitter for config done
      this.props.socket.emit("HostConfigDone", this.state.awards);
      console.log("config submitted from host", this.state.awards);
    } else if (this.state.type == "PC") {
      //let everyone know that i am ready. Backend knows who I am by socket.id
      this.props.socket.emit("PcReady");
    }
    event.preventDefault();
  };

  render() {
    let mainComponent = null;
    if (this.state.readyHost && this.state.readyClient) {
      // display player
      mainComponent = (
        <Player
          socket={this.props.socket}
          num={this.state.numTickets}
          name={this.state.name}
          type={this.state.type}
          awards={this.state.awards}
        />
      );
    } else if (this.state.type == "Host") {
      // form for host configuration
      //    Choosing Awards
      // pass handleSubmit as a prop
      mainComponent = (
        <>
          <h1>Host Configuration</h1>
          <hr />
          <DTable
            awards={this.state.awards}
            handleChangeHost={this.handleChangeHost}
            handleAddRow={this.handleAddRow}
            handleRemoveRow={this.handleRemoveRow}
            handleRemoveSpecificRow={this.handleRemoveSpecificRow}
            handleSubmit={this.handleSubmit}
          />
        </>
      );
    } else if (this.state.type == "PC") {
      // ADD A MESSAGE FOR SAYING HOST NOT READY
      // form for PC configuration
      //    Number of Tickets
      mainComponent = (
        <>
          <h1>PC Configuration</h1>
          <hr />
          <form onSubmit={this.handleSubmit}>
            <label>
              Number of Tickets:
              <input
                type="text"
                value={this.state.numTickets}
                onChange={this.handleChangePC}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </>
      );
    }
    return (
      <>
        {mainComponent}
        <ReadyPlayers players={this.state.readyPlayers} />
      </>
    );
  }
}

export default Config;
