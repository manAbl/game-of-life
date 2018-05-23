import React, { Component } from 'react';

const Box = ({ boxId, key, boxClass, row, col, selectBox }) => {
  //eslint-disable-next-line
  let boxSelected = () => {
    selectBox(row,col);
  };
  return (
    <div id={boxId} key={key} className={boxClass} onClick={this.boxSelected} />
  );
}

const Grid = ({ fullGrid, cols, rows, selectBox }) => {
  const width = (cols * 16) + 1;
  let rowsArr = [];
  let boxClass = '';

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let boxId = i + '-' + j;

      boxClass = fullGrid[i][j] ? 'box on' : 'box off';
      rowsArr.push(
        <Box
          key={boxId}
          boxId={boxId}
          boxClass={boxClass}
          row={i}
          col={j}
          selectBox={selectBox}
        />
      );
    }
  }

  return (
    <div className="grid" style={{width: width}}>
      {rowsArr}
    </div>
  );
}

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column'
};

class App extends Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      gen: 0,
      fullGrid: Array(this.rows).fill().map(() =>
                Array(this.cols).fill(false))
    };
  }
  selectBox = () => {};
  render() {
    const props = {
      fullGrid: this.state.fullGrid,
      gen: this.state.gen,
      selectBox: this.selectBox
    };

    return (
      <div style={styles}>
        <h1>Game Of Life</h1>
        <Grid
          fullGrid={props.fullGrid}
          rows={this.rows}
          cols={this.cols}
          selectBox={props.selectBox}
        />
        <h2>Generations: {props.gen} </h2>
      </div>
    );
  }
}

export default App;
