import * as React from 'react';
import { Component } from 'react';

interface WinningButtonsProps {
    firstLine: string
    secondLine: string
    thirdLine: string
    corners: string
    fullHouse: string
}

interface WinningButtonsState {
    
}

class WinningButtons extends Component<WinningButtonsProps, WinningButtonsState> {
    constructor(props: WinningButtonsProps) {
      super(props);
    }

    render() {
        return (
            <div>
                <button>{this.props.firstLine}</button>
                <button>{this.props.secondLine}</button>
                <button>{this.props.thirdLine}</button>
                <button>{this.props.corners}</button>
                <button>{this.props.fullHouse}</button>
            </div>
        )
    }
}
 

export default WinningButtons;