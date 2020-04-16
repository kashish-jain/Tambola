import * as React from 'react';
import { Component } from 'react';

interface BoxProps {
    value: number
}

interface BoxState {
    check: boolean
}

class Box extends Component<BoxProps, BoxState> {
    constructor(props: BoxProps){
        super(props);
        this.state = {
            check: false
        }
    }
    clickHandler = () => {
        let invertedCheck = !this.state.check;
        this.setState({check: invertedCheck});
        console.log("clicked ", this.state);
    }
    render()
    {
        let checked = this.state.check ? "checked" : "unchecked";
        return(
            <div className="box" onClick={this.clickHandler}>
                <div className={checked}></div>
                <p>{(this.props.value == 0)?"" : this.props.value}</p>
            </div>
        );
    }
}

export default Box;