import React from "react";
import sampleSize from "lodash.samplesize";
import Number from "./number";
import { randomNumBetween, colors } from "./utils";

class Game extends React.Component {
  constructor(props) {
    super(props);
    const challengeNums = Array.from({ length: this.props.challengeSize }).map(() =>
      randomNumBetween(...this.props.challengeRange)
    );
    const target = sampleSize(challengeNums, this.props.answerSize).reduce((a, b) => a + b, 0);

    this.state = {
      challengeNums,
      target,
      gameStatus: "new",
      remainingSecs: this.props.initialSeconds,
      selectedIDs: []
    };
  }
  componentDidMount() {
    if (this.props.autoPlay) {
      this.startGame();
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalID);
  }
  calcGameStatus = newSelectedIDs => {
    const sumSelected = newSelectedIDs.reduce((acc, curr) => acc + this.state.challengeNums[curr], 0);

    if (sumSelected === this.state.target && newSelectedIDs.length > 1) {
      return "won";
    }

    if (newSelectedIDs.length !== this.props.answerSize) {
      return "playing";
    }
    return sumSelected === this.state.target ? "won" : "lost";
  };
  selectNum = numIndex => {
    this.setState(
      prevState => {
        if (prevState.gameStatus !== "playing") {
          return null;
        }

        const newSelectedIDs = [...prevState.selectedIDs, numIndex];

        return {
          selectedIDs: newSelectedIDs,
          gameStatus: this.calcGameStatus(newSelectedIDs)
        };
      },
      () => {
        if (this.state.gameStatus !== "playing") {
          clearInterval(this.state.intervalID);
        }
      }
    );
  };
  startGame = () => {
    this.setState({ gameStatus: "playing" }, () => {
      const intervalID = setInterval(() => {
        this.setState(prevState => {
          const newRemainingSecs = prevState.remainingSecs - 1;

          if (newRemainingSecs === 0) {
            clearInterval(this.state.intervalID);
            return { gameStatus: "lost", remainingSecs: 0 };
          }
          return { remainingSecs: newRemainingSecs };
        });
      }, 1000);

      return {
        intervalID
      };
    });
  };
  isNumAvailable = numIndex => this.state.selectedIDs.indexOf(numIndex) === -1;
  render() {
    const { gameStatus, remainingSecs } = this.state;
    return (
      <div className="game">
        <div className="help">
          Pick {this.props.answerSize} or {this.props.answerSize - 1} numbers that sum to the target in{" "}
          {this.props.initialSeconds} seconds
        </div>
        <div className="target" style={{ backgroundColor: colors[gameStatus] }}>
          {gameStatus === "new" ? "TARGET" : this.state.target}
        </div>
        <div className="challenge-numbers">
          {this.state.challengeNums.map((val, i) => (
            <Number
              key={i}
              id={i}
              value={gameStatus === "new" ? "?" : val}
              clickable={this.isNumAvailable(i)}
              onClick={this.selectNum}
            />
          ))}
        </div>
        <div className="footer">
          {gameStatus === "new" && <button onClick={this.startGame}>Start Game</button>}
          {gameStatus === "playing" && <div className="timer-value">{remainingSecs}</div>}
          {["won", "lost"].includes(gameStatus) && <button onClick={this.props.onPlayAgain}>Play Again</button>}
        </div>
      </div>
    );
  }
}

export default Game;
