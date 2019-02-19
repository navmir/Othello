import React from 'react';
import '../index.css';
import Board from "./Board";

function calculateWinner(xNumbers, oNumbers) {
    return (xNumbers + oNumbers < 64) ? null : (xNumbers === oNumbers) ? 'XO' : (xNumbers > oNumbers ? 'X' : 'O');
}

function flipSquares(squares, position, xIsNext) {
    let modifiedBoard = null;
    let [startX, startY] = [position % 8, (position - position % 8) / 8];

    if (squares[position] !== null) {
        return null;
    }

    // "Iterate all directions these numbers are the offsets in the array to reach the next square")
    [1, 7, 8, 9, -1, -7, -8, -9].forEach((offset) => {
        let flippedSquares = modifiedBoard ? modifiedBoard.slice() : squares.slice();
        let atLeastOneMarkIsFlipped = false;
        let [lastXpos, lastYpos] = [startX, startY];

        for (let y = position + offset; y < 64; y = y + offset) {

            // Calculate row and col of the current square
            let [xPos, yPos] = [y % 8, (y - y % 8) / 8];

            if (Math.abs(lastXpos - xPos) > 1 || Math.abs(lastYpos - yPos) > 1) {
                break;
            }

            // Next square occupied with the opposite color
            if (flippedSquares[y] === (!xIsNext ? 'X' : 'O')) {
                flippedSquares[y] = xIsNext ? 'X' : 'O';
                atLeastOneMarkIsFlipped = true;
                [lastXpos, lastYpos] = [xPos, yPos];
                continue;
            }

            // Next square occupied with the same color
            else if ((flippedSquares[y] === (xIsNext ? 'X' : 'O')) && atLeastOneMarkIsFlipped) {
                flippedSquares[position] = xIsNext ? 'X' : 'O';
                modifiedBoard = flippedSquares.slice();
            }
            break;
        }
    });
    return modifiedBoard;
}

function checkAvailableMoves(color, squares) {
    return squares
        .map((value, index) => { return flipSquares(squares, index, color) ? index : null; })
        .filter((item) => { return item !== null; });
}

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        const initSquares = Array(64).fill(null);
        [initSquares[8 * 3 + 3], initSquares[8 * 3 + 4], initSquares[8 * 4 + 4], initSquares[8 * 4 + 3]] = ['X', 'O', 'X', 'O'];

        this.state = {
            history: [{
                squares: initSquares,
                xNumbers: 2,
                oNumbers: 2,
                xWasNext: true
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
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];

        if (calculateWinner(current.xNumbers, current.oNumbers) || current.squares[i]) {
            return;
        }

        const changedSquares = flipSquares(current.squares, i, this.state.xIsNext);
        if (changedSquares === null) return;

        const xNumbers = changedSquares.reduce((acc, current) => { return current === 'X' ? acc + 1 : acc }, 0);
        const oNumbers = changedSquares.reduce((acc, current) => { return current === 'O' ? acc + 1 : acc }, 0);
        let shouldTurnColor = checkAvailableMoves(!this.state.xIsNext, changedSquares).length > 0 ? !this.state.xIsNext : this.state.xIsNext;

        this.setState({
            history: history.concat([{
                squares: changedSquares,
                xNumbers: xNumbers,
                oNumbers: oNumbers,
                xWasNext: shouldTurnColor
            }]),
            xIsNext: shouldTurnColor,
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
            stepNumber: parseInt(step, 0),
            xIsNext: this.state.history[step].xWasNext
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
        let winner = calculateWinner(current.xNumbers, current.oNumbers);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #` + move :
                "Go to game start";

            return (
                <option
                    className={`${move === this.state.stepNumber ? "move-list-item-selected" : ""} ${"movelist"}`}
                    key={move} value={move}>{desc}
                </option>
            );
        });

        const selectMoves = () => {
            return (
                <select
                    id="dropdown"
                    ref={(input) => this.selectedMove = input}
                    onChange={() => this.jumpTo(this.selectedMove.value)}
                    value={this.state.stepNumber}>
                    {moves}
                </select>
            )
        }

        let availableMoves = checkAvailableMoves(current.xWasNext, current.squares);
        let availableMovesOpposite = checkAvailableMoves(!current.xWasNext, current.squares);

        if ((availableMoves.length === 0) && (availableMovesOpposite.length === 0)) {
            winner = current.xNumbers === current.oNumbers ? 'XO' : current.xNumbers > current.oNumbers ? 'X' : 'O';
        }

        let status = winner ? (winner === 'XO') ? 'It is a draw' : 'The winner is ' + (winner === 'X' ? 'white' : 'black') :
            [this.state.xIsNext ? 'Whites turn' : 'Blacks turn', ' with ', availableMoves.length, ' available moves left.'].join('');


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
                        <div classNae="game-status">{status} {winner}</div>
                        <Board
                            squares={current.squares}
                            availableMoves={availableMoves}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <div>White markers: {current.xNumbers}</div>
                        <div>Black Markers: {current.oNumbers}</div>
                        <br />
                        <div>{selectMoves()}</div>
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