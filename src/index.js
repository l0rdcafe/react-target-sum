import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import Game from "./game";

class GameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameID: 1
    };
  }
  resetGame = () => {
    this.setState(prevState => {
      const newgameID = prevState.gameID + 1;

      return {
        gameID: newgameID
      };
    });
  };
  render() {
    return (
      <Game
        key={this.state.gameID}
        autoPlay={this.state.gameID > 1}
        challengeRange={[2, 9]}
        challengeSize={6}
        answerSize={4}
        initialSeconds={15}
        onPlayAgain={this.resetGame}
      />
    );
  }
}

ReactDOM.render(<GameContainer />, document.getElementById("root"));
