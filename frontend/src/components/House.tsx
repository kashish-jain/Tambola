import * as React from 'react';
import { Component } from 'react';
import Line from './Line'

interface HouseProps {

}

interface HouseState {
    numbers: Array<number>
}

function random0to2() {
    return Math.floor(Math.random() * 3);
}

function randomitoiplus9(i: number) {
    //Edge Cases: When i = 0 return 1-9; When i = 8 return 80-90
    if(i === 0) 
    {
        return Math.floor(Math.random() * 9) + 1;
    } else if (i === 80)
    {
        console.log("here");
        return Math.floor(Math.random() * 11) + i;
    }

    return Math.floor(Math.random() * 10) + i;
}

function generateTicket(): Array<Array<number>>
{
    let line2: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let line3: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let line1: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let ticket: Array<Array<number>> = [line1, line2, line3];
    let lengthArr: Array<number> = [0, 0, 0];
    for(let i = 0; i < 9; ++i){
        let lineNumber: number = random0to2();

        // not to increase more than 5 numbers in each row
        while(lengthArr[lineNumber] === 5) {
            lineNumber = random0to2();
        }
        ++lengthArr[lineNumber];
        let randomNum = randomitoiplus9(i * 10);
        ticket[lineNumber][i] = randomNum;
    }
    // Now ticket has 9 numbers; Each column has 1 number
    // Each row should have 5 numbers; Fill the missing
    for(let z = 0; z < 3; ++z)
    {
        let i = 0;
        while (i < 5 - lengthArr[z])
        {
            let randomNum = (Math.floor(Math.random() * 90)) + 1;
            while(ticket[0].includes(randomNum) || ticket[1].includes(randomNum) || ticket[2].includes(randomNum))
            {
                randomNum = (Math.floor(Math.random() * 90)) + 1;
            }
            let randomNumFirstChar = (randomNum < 10)? 0 : parseInt(randomNum.toString().charAt(0));
            if(ticket[z][randomNumFirstChar] == 0)
            {
                ticket[z][randomNumFirstChar] = randomNum;
                ++i;
            }
        }
    }
    // should be in ascending order in each column
    for(let i = 0; i < 10; ++i)
    {
        let l0 = ticket[0][i];
        let l1 = ticket[1][i];
        let l2 = ticket[2][i];
        if(l1 == l2 || l2 == l0 || l1 == l0) {
            // do nothing when 2 of them are 0s
        }
        else if(l0 != 0 && l1 != 0 && l2 != 0)
        {
            // put them in ascending order
            let arr = [l0, l1, l2];
            arr.sort(function(a, b){return a-b});
            ticket[0][i] = arr[0];
            ticket[1][i] = arr[1];
            ticket[2][i] = arr[2];
        }
        else 
        {
            // case where 1 is 0; we put the other 2 in ascending
            if(l0 == 0)
            {
                ticket[1][i] = Math.min(l1, l2);
                ticket[2][i] = Math.max(l1, l2);
            } 
            else if (l1 == 0)
            {
                ticket[0][i] = Math.min(l0, l2);
                ticket[2][i] = Math.max(l0, l2);
            }
            else 
            {
                ticket[0][i] = Math.min(l0, l1);
                ticket[1][i] = Math.max(l0, l1);
            }
        }
    }

    return ticket;
}


class House extends Component<HouseProps, HouseState> {
    constructor(props: HouseProps) {
        super(props);
    }
    ticket = generateTicket();
    render() {
        return (
            <div>
                <Line key = {1}numbers={this.ticket[0]}/>
                <Line key = {2}numbers={this.ticket[1]}/>
                <Line key = {3}numbers={this.ticket[2]}/>
            </div>
        )
    }

}

export default House;