import React from 'react';
import '../index.css';
import Board from "./Board";

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i],
            };
        }
    }
    return {
        winner: null,
    };
}

export function flipBetweenIndex(indexFrom, indexTo, array, squareType) {
    array = array.slice()

    for (let indexToFlip = indexFrom; indexToFlip < indexTo; indexToFlip++) {
        array[indexToFlip] = squareType
    }
    return array
}

export function updateRow(row) {
    row = row.slice()
    for (let index = 0; index < row.length; index++) {
        if (row[index]) {
            const firstNonNullElement = row[index]
            for (let indexRight = row.length; indexRight > index; indexRight--) {
                const elementFromTheRight = row[indexRight]
                if (firstNonNullElement === elementFromTheRight) {
                    return flipBetweenIndex(index, indexRight, row, firstNonNullElement)
                }
            }
        }

    }
    return row
}

export function updateDiagonaly(board) {
    let resultBoard = board.slice()
    console.log(resultBoard)
    let flip = false
    const boardLength = board.length - 1
    const x = 0
    for (let y = 0; y < boardLength; y++) {
        const square = board[x].slice()[y]
        for (let i = 0; i < (boardLength - y); i++) {
            if (flip) {
                resultBoard[boardLength - y - i][boardLength - x - i] = square
            } else {
                const squareToCompare = board[boardLength - y - i][boardLength - x - i]
                flip = (square !== null && squareToCompare !== null && square === squareToCompare)
            }
        }
    }
    flip = false
    const y = 0
    for (let x = 0; x < boardLength; x++) {
        const square = board[x].slice()[y]
        for (let i = 0; i < (boardLength - x); i++) {
            if (flip) {
                resultBoard[boardLength - y - i][boardLength - x - i] = square
            } else {
                const squareToCompare = board[boardLength - y - i][boardLength - x - i]
                flip = (square !== null && squareToCompare !== null && square === squareToCompare)
            }
        }
    }
    flip = false
    const x2 = 0
    for (let y = 0; y < boardLength; y++) {
        const square = board[x2].slice()[y]
        for (let i = 0; i < y; i++) {
            if (flip) {
                resultBoard[y - i][x + i] = square
            } else {
                const squareToCompare = board[y - i][x + i]
                flip = (square !== null && squareToCompare !== null && square === squareToCompare)
            }
        }
    }
    flip = false
    const y2 = 0
    for (let x = 0; x < boardLength; x++) {
        const square = board[x].slice()[y2]
        for (let i = 0; i < (boardLength - x); i++) {
            if (flip) {
                resultBoard[boardLength - y2 - i][boardLength - x - i] = square
            } else {
                const squareToCompare = board[boardLength - y2 - i][boardLength - x - i]
                flip = (square !== null && squareToCompare !== null && square === squareToCompare)
            }
        }
    }
    console.log('--------')
    console.log(resultBoard)
    return resultBoard
}

function createBoard(length) {
    return Array(length).fill(Array(length).fill(null))
}

export function flipBoard(board) {
    board = board.slice()
    let flippedBoard = createBoard(board.length)
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            const value = board[x].slice()[y]
            let row = flippedBoard[y].slice()
            row[x] = value
            flippedBoard[y] = row.slice()
        }
    }
    return flippedBoard
}

export function updateBoardAfterMarkerPlaced(board) {
    const updatedHirizontal = board.map(row => updateRow(row))
    const flipped = flipBoard(updatedHirizontal)
    const updatedVerticaly = flipped.map(col => updateRow(col))
    const updatedBoard = flipBoard(updatedVerticaly)
    return updatedBoard
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: createBoard(1),
            }],
            xIsNext: true,
            people: [],
            stepNumber: 0,
            isHidden: true,
        };
        this.handleNameClick = this.handleNameClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(i) {
        // ToDo man får bara placera bredvid andra redan placerade rutor
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const squaresX = current.squares[i].slice();
        const updatedSquares = updateBoardAfterMarkerPlaced(squares)

        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        //squares[x] = squaresX
        this.setState({
            history: history.concat([{
                squares: squares,
                latestMovedSquare: i,
            }]),
            squares: updatedSquares,
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    handleNameClick() {
        if (this.nameTextInput.value && this.state.people.length <= 1) {
            this.setState({
                people: this.state.people.concat(this.nameTextInput.value)
            });
            this.nameTextInput.value = '';
            this.nameTextInput.focus();
        }
        if (this.state.people.length === 1) {
            this.toggleHidden();
        }
    }

    toggleHidden() {
        this.setState({
            isHidden: !this.state.isHidden
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sortList() {
        this.setState({
            ascendingOrder: !this.state.ascendingOrder
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winInfo = calculateWinner(current.squares);
        const winner = winInfo.winner;
        let status;

        const moves = history.map((step, move) => {
            const latestMoveSquare = step.latestMoveSquare;
            const col = 1 + latestMoveSquare % 3;
            const row = 1 + Math.floor(latestMoveSquare / 3);
            const desc = move ?
                `Go to move #${move} (${col}), ${row})` :
                "Go to game start";

            return (
                <li key={move}>
                    <button
                        className={`${move === this.state.stepNumber ? "move-list-item-selected" : ""} ${"movelist"}`}
                        onClick={() => this.jumpTo(move)}>{desc}
                    </button>
                </li>
            );
        });

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let names = this.state.people.map(name => {
            return <li>{name}</li>;
        });

        if (!this.state.ascendingOrder) {
            moves.sort(function (a, b) {
                return b.key - a.key;
            });
        }

        return (
            <React.Fragment>
                <div className="game">
                    <div className="game-board">
                        <br />
                        <div>{status}</div>
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                            winLine={winInfo.line}
                        />
                    </div>
                    <div className="game-info">
                        <ol>{moves}</ol>
                    </div>
                    <button
                        className="sortButton"
                        onClick={() => this.sortList()}>
                        Change order
                    </button>
                </div>
                <br />
                <div className="added-players">
                    {
                        this.state.isHidden ?
                            <div className="playerinfo">
                                <div className="player-names">
                                    <input type="text" placeholder="Enter player name"
                                        ref={(ref) => this.nameTextInput = ref}
                                        className="form-control" />
                                </div>
                                <div className="col-md-4">
                                    <button
                                        type="button" className="btnAddPlayer"
                                        onClick={this.handleNameClick}>Add</button>
                                </div>
                            </div>
                            : null
                    }
                    <div className="row">
                        <div className="column">
                            <h3>Players:</h3>
                            <ol>{names}</ol>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Game;


//        <React.Fragment>
//        <div>
//        <br />
//            <div className="status">{status}</div>
//            {rows}
//        </div>
//        <div className="row">
//            <div className="column">
//            <br />
//              <input type="text" placeholder="Enter player name"
//              ref={(ref) => this.nameTextInput = ref}
//              className="form-control" />
//            </div>
//            <div className="col-md-4">
//            <button type="button" className="btnAddPlayer"
//            onClick={this.handleNameClick}>Add</button>
//            </div>
//            <div className="row">
//                <div className="column">
//                <h3>Players:</h3>
//                <ol>{names}</ol>
//                </div>
//            </div>
//        </div>
//        </React.Fragment>




// handleClick(x, y) {
//     // ToDo man får bara placera bredvid andra redan placerade rutor
//     const history = this.state.history.slice(0, this.state.stepNumber + 1);
//     const current = history[history.length - 1];
//     const squares = current.squares.slice();
//     const squaresX = current.squares[x].slice();
//     const updatedSquares = updateBoardAfterMarkerPlaced(squares)

//     if (calculateWinner(squares).winner || squares([x][y])) {
//         return;
//     }

//     squaresX[y] = this.state.xIsNext ? 'X' : 'O';
//     squares[x] = squaresX
//     this.setState({
//         history: history.concat([{
//             squares: squares,
//         }]),
//         squares: updatedSquares,
//         xIsNext: !this.state.xIsNext,
//         stepNumber: history.length,
//     });
// }