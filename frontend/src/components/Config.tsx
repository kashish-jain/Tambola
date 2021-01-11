import * as React from "react";
import { Component } from "react";
import ConfigTable from "./ConfigTable";
import Player from "./Player";
import ReadyPlayers from "./ReadyPlayers";
import Snackbar from "./Snackbar";
import Walkthrough from "./Walkthrough";
import Modal from "react-modal";
import Toast from "./Toast";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#0e141f",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    transition: "all 1s",
  },
};

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
  name: string;
}

interface ConfigState {
  type: string;

  // Config
  readyHost: boolean;
  readyClient: boolean;

  //  Host Config State options
  awards: Award[];

  //  PC Config State options
  numHouses: number;

  // List of players who are ready to play
  PcsStatus: PcStatus[];

  // notification for host disconnected
  hostDisconnected: boolean;

  // For warning modal which opens when host hits start game if some player is not ready
  isModalOpen: boolean;

  // When host tries to start game when there is no one in the game room
  isToastOpen: boolean;

  // when arrive on host screen, ask the user if they want to see tutorial or not
  watchTutorialModal: boolean

  // passed to child components to let them know if user selected to watch the tutorial or not
  runWalkthrough: boolean
  //
  hasGameAlreadyStarted: boolean;
}

class Config extends Component<ConfigProps, ConfigState> {
  // For the toast component to hide initially and not add animation on initial render
  hideToastInitially: boolean;
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      type: "",
      numHouses: 1,
      readyHost: false,
      readyClient: false,
      PcsStatus: [],
      isModalOpen: false,
      isToastOpen: false,
      watchTutorialModal: true,
      runWalkthrough: false,
      hasGameAlreadyStarted: false,
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
      hostDisconnected: false,
    };
    this.hideToastInitially = true;
  }

  // Only handles on host's config when he presses start game button.
  handlleHostConfigDone = () => {
    if (this.state.isModalOpen) {
      this.setState({ isModalOpen: false });
    }
    this.props.socket.emit("HostConfigDone", this.state.awards);
    console.log("config submitted from host", this.state.awards);
  };

  componentDidMount() {
    // Extracting roomID from the URL
    let roomID = window.location.pathname.substr(
      window.location.pathname.lastIndexOf("/") + 1
    );

    // asking server to join room
    this.props.socket.emit("joinRoom", {
      room: roomID,
      username: this.props.name,
    });

    // check if the game has already started or not
    this.props.socket.on("gameHasAlreadyStarted", () => {
      this.setState({ hasGameAlreadyStarted: true });
    });

    // server response: player gets know if he is host or pc
    this.props.socket.on("userConnected", (playerTypeObj: any) => {
      this.setState({
        type: playerTypeObj.type, // pass this type to player as well
      });

      // Receiving event on Host from new PC who has joined and sending them
      // the list of readyPlayers
      if (playerTypeObj.type === "Host") {
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
            if (PcsStatus[i].user.id === user.id) {
              PcsStatus[i].ready = true;
              PcsStatus[i].numTickets = numTickets;
            }
          }
          this.setState({ PcsStatus: PcsStatus });
          this.props.socket.emit("PcsStatus", user, PcsStatus);
        });

        this.props.socket.on("userDisconnect", (user: User) => {
          // dealing with ready/not ready
          let PcsStatus = this.state.PcsStatus;
          for (let i = 0; i < PcsStatus.length; ++i) {
            if (PcsStatus[i].user.id === user.id) {
              // Remove this user from PcsStatus
              PcsStatus.splice(i, 1);
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

    // Host disconnect
    this.props.socket.on("HostDisconnected", (userHost: User) => {
      console.log(userHost, ": host disconnected");
      this.setState({
        hostDisconnected: true,
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
    if (this.state.type === "PC") {
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
    if (this.state.type === "Host") {
      // start the game only when there are actual players in the game
      if (this.state.PcsStatus.length > 0) {
        // checking if all the players are ready
        let isEveryOneReady = true;
        for (let i = 0; i < this.state.PcsStatus.length; ++i) {
          if (!this.state.PcsStatus[i].ready) {
            isEveryOneReady = false;
            continue;
          }
        }
        if (isEveryOneReady) {
          this.handlleHostConfigDone();
        } else {
          this.setState({ isModalOpen: true });
        }
      } else {
        // To make the toast visible
        this.hideToastInitially = false;
        this.setState({ isToastOpen: true });
      }
    } else if (this.state.type === "PC") {
      //let everyone know that i am ready. Backend knows who I am by socket.id
      this.props.socket.emit("PcReady", this.state.numHouses);
    }
    event.preventDefault();
  };

  render() {
    // game is over if there is no host
    if (this.state.hostDisconnected) {
      return (
        <>
          <h1 className="host-configuration">
            Host left the game. Please close this tab. Generate a new room if
            you want to play more.
          </h1>
          <a href="/" style={{ color: "white" }}>
            <button>Back</button>
          </a>
        </>
      );
    }

    // If new playerjoins in already started game or host becomes ready (starts the game)
    // this pc is not ready, let him know that he cannot play now in this game
    if (
      this.state.hasGameAlreadyStarted ||
      (this.state.readyHost && !this.state.readyClient)
    ) {
      return (
        <>
          <h1 className="host-configuration">
            This game was started without you. You can play in the next game.
            Meanwhile you can go back to the home screen and play another game
            :)
          </h1>
          <a href="/" style={{ color: "white" }}>
            <button>Home</button>
          </a>
        </>
      );
    }

    let mainComponent = null;
    if (this.state.readyHost && this.state.readyClient) {
      // display player
      mainComponent = (
        <Player
          socket={this.props.socket}
          numHouses={this.state.numHouses}
          name={this.props.name}
          type={this.state.type}
          awards={this.state.awards}
          runWalkthrough={this.state.runWalkthrough}
        />
      );
    } else if (this.state.type === "Host") {
      // form for host configuration
      //    Choosing Awards
      // pass handleSubmit as a prop

      mainComponent = (
        <div className="config-container">
          <Walkthrough playerType="Host" type="config" runWalkthrough={this.state.runWalkthrough}/>
          <Snackbar
            message="Share this 'join link' with other players"
            actionText="Copy Link"
          />
          <Toast
            message={"There are no players in the game right now"}
            isShown={this.state.isToastOpen}
            handleClose={() => {
              this.setState({ isToastOpen: false });
            }}
            initiallyHidden={this.hideToastInitially}
          />
          <Modal isOpen={this.state.isModalOpen} style={customModalStyles}>
            <h3>Some players are still not ready.</h3>
            <h3>Are you sure you want to start the game?</h3>
            <div className="modal-buttons">
              <button onClick={this.handlleHostConfigDone}>Yes</button>
              <button
                onClick={() => {
                  this.setState({ isModalOpen: false });
                }}
              >
                No
              </button>
            </div>
          </Modal>
          <h1 className="host-configuration">Game Setup</h1>
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
        </div>
      );
    } else if (this.state.type === "PC") {
      // form for PC configuration
      //    Number of Tickets
      mainComponent = (
        <div className="config-container">
          <Walkthrough playerType="PC" type="config" runWalkthrough={this.state.runWalkthrough}/>
          <h1 className="pc-configuration">Player Setup</h1>
          <hr />
          <form onSubmit={this.handleSubmit}>
            <table className="config-table" id="pc-config-table">
              <tbody>
                <tr>
                  <td className="number-tickets">Number of Tickets:</td>
                  <td>
                    <input
                      type="number"
                      max="6"
                      min="1"
                      value={this.state.numHouses}
                      onChange={this.handleChangePC}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>Waiting for host to start the game</td>
                  <td>
                    <button className="ready" type="submit">
                      Ready
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
          <ReadyPlayers players={this.state.PcsStatus} />
        </div>
      );
    }
    return (
      <>
        {mainComponent}
        <Modal isOpen={this.state.watchTutorialModal} style={customModalStyles}>
          <h3>Would you like to watch tutorial?</h3>
          <div className="modal-buttons">
            <button onClick={() => {
              this.setState({runWalkthrough: true, watchTutorialModal: false})
              console.log("clicked yes");}
              }>Yes</button>
            <button
              onClick={() => {
                console.log("clicked No");
                this.setState({ runWalkthrough: false, watchTutorialModal: false });
              }}
            >
              No
            </button>
          </div>
        </Modal>
      </>
    );
  }
}

export default Config;
