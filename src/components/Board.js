import React from 'react';
import '../index.css';
import Square from "./Square";

export default class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                key={i}
                isAvailable={this.props.availableMoves.indexOf(i) > -1}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const rows = [];
        for (let i = 0; i < 8; i++) {
            const col = [];
            for (let j = 0; j < 8; j++) {
                col.push(this.renderSquare(i + (j * 8)))
            }
            rows.push(<div key={i} className="board-row">{col}</div>);
        }

        return (
            <div>{rows}</div>
        );
    }
}