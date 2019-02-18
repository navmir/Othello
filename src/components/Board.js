import React from 'react';
import '../index.css';
import Square from "./Square";

class Board extends React.Component {
    renderSquare(i) {
        const winLine = this.props.winLine;
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={winLine && winLine.includes(i)}
            />
        );
    }

    render() {
        const boardSize = 9;
        let squares = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(this.renderSquare(i * boardSize + j));
            }
            squares.push(<div key={i} className="board-row">{row}</div>);
        }

        return (
            <div>{squares}</div>
        );
    }
}

export default Board;


/*
    renderSquare(x, y) {
        return (
        <Square
            value={this.state.squares[x][y]}
            onClick={() => this.handleClick(x, y)}
        />
        );
    }*/


/*
  renderSquare(x, y) {
    const winLine = this.props.winLine;

    return (
        <Square
            key={x,y}
            value={this.state.squares[x,y]}
            onClick={() => this.props.onClick(x,y)}
            highlight={winLine && winLine.includes(x,y)}
        />
    );
  }
          <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlight={winLine && winLine.includes(i)}
        />










                    <Square
                key={x}
                value={this.props[x, y]}
                onClick={() => this.props.onClick(x, y)}
                highlight={winLine && winLine.includes(x, y)}
            />
*/

