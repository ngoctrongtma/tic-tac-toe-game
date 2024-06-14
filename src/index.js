import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


// This component is a Square in Board 
// It will show "X" when user click
// (1) class Square extends React.Component {
//     render() {
//         return (
//             <button className="square" onClick={() => { this.props.onClick() }}>
//                 {/* TODO */}
//                 {this.props.value}
//             </button>
//         );
//     }
// }
function Square(props) { // this is function component. It replaces the class (1) above 
    return (
        <button className="square" onClick={() => { props.onClick() }}>
            {props.value}
        </button>
    )
}

// Board is include 9 Square
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }
    jumTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); // create history array temp include curent step
        const current = history[history.length - 1]; // get current object to update state
        const squares = current.squares.slice(); // get squares property of object
        if (calculateWinner(squares) || squares[i]) { // check winner
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; // set value X or O for square just clicked.
        this.setState({ //update state of Game
            history: history.concat([{ // add new object squares into history[]
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                "Go To Move #" + move : "Go To Game Start";
            return (
                <li key={move}>
                    <button onClick={() => this.jumTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <div className="game-content">
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                        <button className="btn-replay" onClick={() => { window.location.reload() }}>Replay</button>
                        <h1>TIC-TAC-TOE GAME</h1>
                        <h2>create by Trong Truong</h2>
                    </div>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
// helper choose winner
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
            return squares[a];
        }
    }
    return null;
}
