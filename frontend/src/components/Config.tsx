import * as React from "react";
import { Component } from "react";
import DTable from "./DTable";
import Player from "./Player";

interface ConfigProps {
  socket: any;
}

interface ConfigState {
  type: string;
  name: string | null;
  
  // Config
  configDone: boolean; // to check if config is done

  //  Host Config State options
  rows: {
   [name: string]: number | string,
  }[];

  //  PC Config State options
  numTickets: number;
}

class Config extends Component<ConfigProps, ConfigState> {

  constructor(props: ConfigProps) {
    super(props);
    this.state = { type: "", numTickets: 0, name: "", configDone: false, rows: [] };
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
      
      if (playerTypeObj.type == "Host") {
        
      } else if (playerTypeObj.type == "PC") {

      }
    });
  }

  handleChange = (event: any) => {
    const { value } = event.target;
    if(this.state.type == "Host") {
      // set state here

    } else if(this.state.type == "PC") {
      this.setState({
        numTickets: value
      });
    }
  };

  handleSubmit = (event: any) => {
    this.setState({
        configDone: true
    });
    
    if(this.state.type == "Host") {
      

    } else if(this.state.type == "PC") {
      console.log("Number of Tickets:", this.state.numTickets);
      event.preventDefault();
    }
  };

  render() {
    let mainComponent = null;
    if(this.state.configDone) {
      // display player

      // also need to pass award details
      mainComponent = (
        <Player socket={this.props.socket} num={this.state.numTickets}/>
      );
    } else if(this.state.type == "Host") {
      // form for host configuration
      //    Choosing Awards
      // pass handleSubmit as a prop
      mainComponent = (
        <>
          <h1>Host Configuration</h1><hr/>
          <DTable />
        </>
      );

    } else if(this.state.type == "PC") {
      // form for PC configuration
      //    Number of Tickets
      mainComponent = (
        <>
          <h1>PC Configuration</h1><hr/>
          <form onSubmit={this.handleSubmit}>
            <label>
              Number of Tickets:
              <input type="text" value={this.state.numTickets} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </>
      );      
    }
    return (
      <>
        {mainComponent}
      </>
    );
  }
}

export default Config;