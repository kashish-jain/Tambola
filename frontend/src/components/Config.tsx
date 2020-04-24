import * as React from "react";
import { Component } from "react";
import DTable from "./DTable";

interface ConfigProps {
  socket: any;
}

interface ConfigState {
  type: string;
  awards: string;
  name: string | null;
  // Host Config State options

  // PC Config State options
}

class Config extends Component<ConfigProps, ConfigState> {

  constructor(props: ConfigProps) {
    super(props);
    this.state = { type: "", awards: "", name: ""};
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

  handleChange(event: any) {
    this.setState({awards: event.target.awards});
  }

  handleSubmit(event: any) {
    alert('Awards were submitted: ' + this.state.awards);
    event.preventDefault();
  }

  render() {
    let mainComponent = null;
    if(this.state.type == "Host") {
      // form for host configuration
      //    Choosing Awards
      mainComponent = (
        <form onSubmit={this.handleSubmit}>
          <label>
            Awards:
            <input type="text" value={this.state.awards} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    } else if(this.state.type == "PC") {
      // form for PC configuration
      //    Number of Tickets
      mainComponent = <DTable />;
    }
    return mainComponent;
  }
}

export default Config;