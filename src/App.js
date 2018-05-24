import React, { Component } from 'react';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';

const Box = ({ boxId, boxClass, row, col, selectBox }) => {
  //eslint-disable-next-line
  const boxSelected = () => {
    selectBox(row,col);
  }

  return (
    <div id={boxId} className={boxClass} onClick={this.boxSelected} />
  );
}

const Grid = ({ fullGrid, cols, rows, selectBox }) => {
  const width = (cols * 14) + 1;
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

const Buttons = ({ seed, slow, fast, playBtn, pauseBtn, clear, gridSize }) => {
  const buttonsClass = 'btn btn-default';
  //eslint-disable-next-line
  let handleSelect = (event) => {
    gridSize(event);
  }

  return (
    <div className='center'>
      <ButtonToolbar>
        <button className={buttonsClass} onClick={playBtn}>
          Play
        </button>
        <button className={buttonsClass} onClick={pauseBtn}>
          Pause
        </button>
        <button className={buttonsClass} onClick={clear}>
          Clear
        </button>
        <button className={buttonsClass} onClick={slow}>
          Slow
        </button>
        <button className={buttonsClass} onClick={fast}>
          Fast
        </button>
        <button className={buttonsClass} onClick={seed}>
          Seed
        </button>
        <DropdownButton title='grid size' id='size-menu' onSelect={this.handleSelect}>
          <MenuItem eventKey='1'> 20x10 </MenuItem>
          <MenuItem eventKey='2'> 50x30 </MenuItem>
          <MenuItem eventKey='3'> 70x50 </MenuItem>
        </DropdownButton>
      </ButtonToolbar>
    </div>
  );
}

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
    }
  }
  seed = () => {
    let gridCopy = arrayClonator(this.state.fullGrid);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      fullGrid: gridCopy
    });
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClonator(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      fullGrid: gridCopy
    });
  }

  playBtn = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed)
  }

  pauseBtn = () => {
    clearInterval(this.intervalId);
  }

  slow = () => {
    this.speed = 1000;
    this.playBtn();
  }

  fast = () => {
    this.speed = 100;
    this.playBtn();
  }

  clear = () => {
    const grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));

    this.setState({
      gen: 0,
      fullGrid: grid
    });
  }

 gridSize = (size) => {
    switch (size) {
      case '1':
        this.cols = 20;
        this.rows = 10;
      break;
      case '2':
        this.cols = 50;
        this.rows = 30;
      break;
      default:
        this.cols = 70;
        this.rows = 50;
    }
    this.clear();
  }

  play = () => {

  let g = this.state.fullGrid;
  let g2 = arrayClonator(this.state.fullGrid);

  for (let i = 0; i < this.rows; i++) {
    for (let j = 0; j < this.cols; j++) {
      let count = 0;
      if (i > 0) if (g[i - 1][j]) count++;
      if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
      if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
      if (j < this.cols - 1) if (g[i][j + 1]) count++;
      if (j > 0) if (g[i][j - 1]) count++;
      if (i < this.rows - 1) if (g[i + 1][j]) count++;
      if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
      if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
      if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
      if (!g[i][j] && count === 3) g2[i][j] = true;
    }
  }
  this.setState({
    fullGrid: g2,
    gen: this.state.gen + 1
  });

}

  componentDidMount() {
    this.seed();
    this.playBtn();
  }

  render() {
    const props = {
      fullGrid: this.state.fullGrid,
      gen: this.state.gen,
    };

    return (
      <div style={styles}>
        <h1>Game Of Life</h1>
        <Buttons
          playBtn={this.playBtn}
          pauseBtn={this.pauseBtn}
          seed={this.seed}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          gridSize={this.gridSize}
        />
        <Grid
          fullGrid={props.fullGrid}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {props.gen} </h2>
      </div>
    );
  }
}

function arrayClonator(arr) {
  return JSON.parse(JSON.stringify(arr));
}

export default App;
