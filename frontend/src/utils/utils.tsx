import { BoxState } from "../components/Box";

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNumberOfElementsInSet(set: Array<Array<number>>) {
  let count = 0;
  for (let i = 0; i < set.length; ++i) {
    count = count + set[i].length;
  }
  return count;
}

function getRowCount(house: Array<Array<number>>, rowIndex: number) {
  let count = 0;
  for (let i = 0; i < house[rowIndex].length; ++i) {
    if (house[rowIndex][i] !== 0) ++count;
  }
  return count;
}

function getEmptyFullTicket(): Array<Array<Array<number>>> {
  let houses = [];
  for (let houseNo = 0; houseNo < 6; ++houseNo) {
    let house = [];
    for (let rowNo = 0; rowNo < 3; ++rowNo) {
      let row = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      house.push(row);
    }
    houses[houseNo] = house;
  }
  console.log("houses", houses);
  return houses;
}

function generate() {
  let col1: Array<number> = [],
    col2: Array<number> = [],
    col3: Array<number> = [],
    col4: Array<number> = [],
    col5: Array<number> = [],
    col6: Array<number> = [],
    col7: Array<number> = [],
    col8: Array<number> = [],
    col9: Array<number> = [];

  for (let i = 1; i <= 9; ++i) {
    col1.push(i);
  }
  for (let i = 10; i <= 19; ++i) {
    col2.push(i);
  }
  for (let i = 20; i <= 29; ++i) {
    col3.push(i);
  }
  for (let i = 30; i <= 39; ++i) {
    col4.push(i);
  }
  for (let i = 40; i <= 49; ++i) {
    col5.push(i);
  }
  for (let i = 50; i <= 59; ++i) {
    col6.push(i);
  }
  for (let i = 60; i <= 69; ++i) {
    col7.push(i);
  }
  for (let i = 70; i <= 79; ++i) {
    col8.push(i);
  }
  for (let i = 80; i <= 90; ++i) {
    col9.push(i);
  }

  let columns: Array<Array<number>> = [
    col1,
    col2,
    col3,
    col4,
    col5,
    col6,
    col7,
    col8,
    col9,
  ];

  let set1: Array<Array<number>> = [],
    set2: Array<Array<number>> = [],
    set3: Array<Array<number>> = [],
    set4: Array<Array<number>> = [],
    set5: Array<Array<number>> = [],
    set6: Array<Array<number>> = [];

  for (let i = 0; i < 9; ++i) {
    set1.push([]);
    set2.push([]);
    set3.push([]);
    set4.push([]);
    set5.push([]);
    set6.push([]);
  }

  let sets: Array<Array<Array<number>>> = [set1, set2, set3, set4, set5, set6];

  //   add 6 numbers from each column to each of the sets
  for (let i = 0; i < 9; ++i) {
    let col = columns[i];
    for (let j = 0; j < 6; ++j) {
      let randomNumIndex = getRandom(0, col.length - 1);
      let randomNum = col[randomNumIndex];
      let set = sets[j][i];
      set.push(randomNum);
      col.splice(randomNumIndex, 1);
    }
  }

  //   // Assign 1 element of last col to a random set
  let lastCol = columns[columns.length - 1];
  let randomNumIndex = getRandom(0, lastCol.length - 1);
  let randomNum = lastCol[randomNumIndex];
  let randomSetIndex = getRandom(0, sets.length - 1);
  let randomSet = sets[randomSetIndex][8];
  randomSet.push(randomNum);
  lastCol.splice(randomNumIndex, 1);

  //   // 3 Passes over the columns
  for (let pass = 0; pass < 3; ++pass) {
    for (let j = 0; j < 9; ++j) {
      let col = columns[j];
      if (col.length === 0) continue;
      let randomNumIndex = getRandom(0, col.length - 1);
      let randomNum = col[randomNumIndex];
      let vacantSetFound = false;
      while (vacantSetFound === false) {
        let randomSetIndex = getRandom(0, sets.length - 1);
        let randomSet = sets[randomSetIndex];
        if (
          getNumberOfElementsInSet(randomSet) === 15 ||
          randomSet[j].length === 2
        )
          continue;

        vacantSetFound = true;
        randomSet[j].push(randomNum);
        col.splice(randomNumIndex, 1);
      }
    }
  }

  //   // Last pass
  for (let j = 0; j < 9; ++j) {
    let col = columns[j];
    if (col.length === 0) continue;
    let randomNumIndex = getRandom(0, col.length - 1);
    let randomNum = col[randomNumIndex];
    let vacantSetFound = false;
    while (vacantSetFound === false) {
      let randomSetIndex = getRandom(0, sets.length - 1);
      let randomSet = sets[randomSetIndex];
      if (
        getNumberOfElementsInSet(randomSet) === 15 ||
        randomSet[j].length === 3
      )
        continue;

      vacantSetFound = true;
      randomSet[j].push(randomNum);
      col.splice(randomNumIndex, 1);
    }
  }

  for (let i = 0; i < 6; ++i) {
    for (let j = 0; j < 9; ++j) {
      sets[i][j].sort((a, b) => {
        return a - b;
      });
    }
  }

  return sets;
}

function putElements(set: Array<Array<number>>, house: Array<Array<number>>) {
  for (let i = 0; i < 9; ++i) {
    // Put the row which have three numbers
    if (set[i].length === 3)
      for (let j = 0; j < 3; ++j) {
        house[j][i] = set[i][j];
      }
  }

  // // Now the cases where the column will have two numbers;
  let counter = 0;
  let columnIndicesWithTwoNums = [];
  for (let i = 0; i < 9; ++i) {
    if (set[i].length === 2) {
      columnIndicesWithTwoNums.push(i);
    }
  }
  let lenColumnsWithTwoNums = columnIndicesWithTwoNums.length;
  for (let i = 0; i < lenColumnsWithTwoNums; ++i) {
    let randomColumnIndexInArray = getRandom(
      0,
      columnIndicesWithTwoNums.length - 1
    );
    let actualRandomColumnIndex =
      columnIndicesWithTwoNums[randomColumnIndexInArray];
    let preComp = [
      [0, 1],
      [0, 2],
      [1, 2],
    ];
    let indices = preComp[counter % 3];
    house[indices[0]][actualRandomColumnIndex] =
      set[actualRandomColumnIndex][0];
    house[indices[1]][actualRandomColumnIndex] =
      set[actualRandomColumnIndex][1];
    columnIndicesWithTwoNums.splice(randomColumnIndexInArray, 1);
    ++counter;
  }

  // Cases where column will have 1 number
  for (let i = 0; i < 9; ++i) {
    if (set[i].length === 1) {
      let randomIndex = getRandom(0, 2);
      while (
        house[randomIndex][i] !== 0 ||
        getRowCount(house, randomIndex) === 5
      ) {
        randomIndex = getRandom(0, 2);
      }
      // found the rowNo for this number
      house[randomIndex][i] = set[i][0];
    }
  }
  return house;
}

function generateTicket(numHouses: number) {
  // Full ticket of numbers get generated i.e. 6 houses
  let sets = generate();
  let fullTicket = getEmptyFullTicket();
  for (let i = 0; i < numHouses; ++i) {
    putElements(sets[i], fullTicket[i]);
  }
  let finalTicket: Array<Array<Array<BoxState>>> = [];
  for (let i = 0; i < numHouses; ++i) {
    let house: Array<Array<BoxState>> = [];
    for (let j = 0; j < 3; ++j) {
      let row: Array<BoxState> = [];
      for (let k = 0; k < 9; ++k) {
        row[k] = { value: fullTicket[i][j][k], check: false };
      }
      house[j] = row;
    }
    finalTicket[i] = house;
  }
  return finalTicket;
}

let doNotLeavePage = (event: any) => {
  // Custom message is not working, considererd as security threat;
  // Event listener gets removed when the game
  event.preventDefault();
  event.returnValue =
    "All the game state will be lost. Are you sure you want to leave?";
  return "All the game state will be lost. Are you sure you want to leave?";
};

export { generateTicket, doNotLeavePage };
