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
     
      // not needed I guess 
      if (playerTypeObj.type == "Host") {
        
      } else if (playerTypeObj.type == "PC") {

      }
    });
  }

  // For Host Config
  handleChangeHost = (idx: number) => (e: any) => {
    const { name, value } = e.target;
    const rows = this.state.rows;
    
    rows[idx][name] = value;
    console.log(rows[idx]);

    this.setState({
      rows
    });
  };
  handleAddRow = () => {
    const item = {
      name: "",
      mobile: ""
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };
  handleRemoveRow = () => {
    this.setState({
      rows: this.state.rows.slice(0, -1)
    });
  };
  handleRemoveSpecificRow = (idx: number) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
  };

  // For PC Config
  handleChangePC = (event: any) => {
    const { value } = event.target;
    if(this.state.type == "PC") { // sanity check
      this.setState({
        numTickets: value
      });
    }
  };

  // common function for Host and PC Config
  handleSubmit = (event: any) => {
    this.setState({
        configDone: true
    });
    
    if(this.state.type == "Host") {
      console.log("config submitted from host", event.target, this.state.rows );
    } else if(this.state.type == "PC") {
      console.log("Number of Tickets:", this.state.numTickets);
    }
    event.preventDefault();
  };

  render() {
    let mainComponent = null;
    if(this.state.configDone) {
      // display player

      // also need to pass award details
      mainComponent = (
        <Player 
          socket={this.props.socket} 
          num={this.state.numTickets} 
          name={this.state.name} 
          type={this.state.type} />
      );
    } else if(this.state.type == "Host") {
      // form for host configuration
      //    Choosing Awards
      // pass handleSubmit as a prop
      mainComponent = (
        <>
          <h1>Host Configuration</h1><hr/>
          <DTable
            rows={this.state.rows}
            handleChangeHost={this.handleChangeHost} 
            handleAddRow={this.handleAddRow} 
            handleRemoveRow={this.handleRemoveRow} 
            handleRemoveSpecificRow={this.handleRemoveSpecificRow}
            handleSubmit={this.handleSubmit} />
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
              <input type="text" value={this.state.numTickets} onChange={this.handleChangePC} />
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