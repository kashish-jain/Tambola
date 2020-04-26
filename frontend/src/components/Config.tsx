import * as React from "react";
import { Component } from "react";
import ConfigTable from "./ConfigTable";
import Player from "./Player";
import ReadyPlayers from "./ReadyPlayers";

export interface Award {
  // Actual type information:
  // {
  //    nameAward: string;
  //    numAward: string;
  // }
  [index: string]: string;
}

export interface PcStatus {
  user: User;
  ready: boolean;
  numTickets: number;
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
  numHouses: number;

  // List of players who are ready to play
  PcsStatus: PcStatus[];
}

class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      type: "",
      numHouses: 1,
      name: "",
      readyHost: false,
      readyClient: false,
      PcsStatus: [],
      awards: [
        {
          nameAward: "First Line",
          numAward: "1",
        },
        {
          nameAward: "Second Line",
          numAward: "1",
        },
        {
          nameAward: "Third Line",
          numAward: "1",
        },
        {
          nameAward: "Corners",
          numAward: "1",
        },
        {
          nameAward: "Full House",
          numAward: "1",
        },
      ],
    };
  }

  componentDidMount() {
    // Extracting roomID from the URL
    let roomID = window.location.pathname.substr(
      window.location.pathname.lastIndexOf("/") + 1
    );

    // Player joins by entering his name in the prompt
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

      // Receiving event on Host from new PC who has joined and sending them
      // the list of readyPlayers
      if (playerTypeObj.type == "Host") {
        this.props.socket.on("notifyHostConnection", (user: User) => {
          let PcsStatus = this.state.PcsStatus;
          let newPcStatus: PcStatus = {
            user: user,
            ready: false,
            numTickets: 0,
          };
          PcsStatus.push(newPcStatus);
          this.setState({ PcsStatus: PcsStatus });
          this.props.socket.emit("PcsStatus", user, PcsStatus);
        });

        this.props.socket.on("PcReady", (user: User, numTickets: number) => {
          // Find user in array and make him ready
          let PcsStatus = this.state.PcsStatus;
          for (let i = 0; i < PcsStatus.length; ++i) {
            if (PcsStatus[i].user.id == user.id) {
              PcsStatus[i].ready = true;
              PcsStatus[i].numTickets = numTickets;
            }
          }
          this.setState({ PcsStatus: PcsStatus });
          this.props.socket.emit("PcsStatus", user, PcsStatus);
        });
      }
    });

    // server sending awards from Host as Host is ready
    this.props.socket.on("HostConfigDone", (awards: any) => {
      this.setState({
        awards: awards,
        readyHost: true,
      });
    });

    // Know the status of all the players if someone new joined or got ready
    this.props.socket.on("PcsStatus", (PcsStatus: PcStatus[]) => {
      this.setState({ PcsStatus: PcsStatus });
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
      nameAward: "",
      numAward: "",
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
        numHouses: value,
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
      this.props.socket.emit("PcReady", this.state.numHouses);
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
          numHouses={this.state.numHouses}
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
          <ConfigTable
            awards={this.state.awards}
            handleChangeHost={this.handleChangeHost}
            handleAddRow={this.handleAddRow}
            handleRemoveRow={this.handleRemoveRow}
            handleRemoveSpecificRow={this.handleRemoveSpecificRow}
            handleSubmit={this.handleSubmit}
          />
          <ReadyPlayers players={this.state.PcsStatus} />
        </>
      );
    } else if (this.state.type == "PC") {
      // TODO: ADD A MESSAGE FOR SAYING HOST NOT READY

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
                value={this.state.numHouses}
                onChange={this.handleChangePC}
              />
            </label>
            <br />
            <input type="submit" value="Ready" />
          </form>
          <ReadyPlayers players={this.state.PcsStatus} />
        </>
      );
    }
    return <>{mainComponent}</>;
  }
}

export default Config;
