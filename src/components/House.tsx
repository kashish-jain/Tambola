import * as React from 'react';
import { Component } from 'react';
import Line from './Line'

// TODO: Make the numbers unique

interface HouseProps {

}

interface HouseState {

}

function generateFiveNumbers() {
    let arr = [];
    for(let i = 0; i < 5; ++i) {
        arr[i] = Math.floor(Math.random() * 99) + 1; // returns a random integer from 1 to 99
    }
    let retArr: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let i = 0;
    while (i < 5){
        let j = Math.floor(Math.random() * 10)
        if(retArr[j] === 0) {
            retArr[j] = arr[i];
            ++i;
        }
    }   
    return retArr;
}

class House extends Component<HouseProps, HouseState> {
    constructor(props: HouseProps) {
        super(props);
    }

    line1 = generateFiveNumbers();
    line2 = generateFiveNumbers();
    line3 = generateFiveNumbers();

    render() {
        console.log(this.line1);
        console.log("House render");
        return (
            <div>
                <Line key = {1}numbers={this.line1}/>
                <Line key = {2}numbers={this.line2}/>
                <Line key = {3}numbers={this.line3}/>
            </div>
        )
    }

}

export default House;