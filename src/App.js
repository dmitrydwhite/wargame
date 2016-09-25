import React, { Component } from 'react';
import './App.css';
import './HeaderBar.css';

import Rebase from 're-base';

import WarGame from './WarCardGame.js';

var base = Rebase.createClass({
  apiKey: 'AIzaSyCVYmP8SxsA278Iv0rV6ayO25btKZqxuwk',
  authDomain: 'war-card-game-project.firebaseapp.com',
  databaseURL: 'https://war-card-game-project.firebaseio.com/',
  storageBucket: "war-card-game-project.appspot.com",
  messagingSenderId: "880491706309"
});

var App = React.createClass({
  getInitialState() {
    var stateObject;

    this.game = this.startNewGame();
    stateObject = this.game;

    stateObject.displayCards = {
      computer: {},
      user: {},
      extra: 0
    };

    stateObject.waitingForPlay = true;
    stateObject.turnIsTied = false;
    stateObject.turnWinner = '';

    return stateObject;
  },

  startNewGame() {
    return new WarGame();
  },

  gameSwitch(action) {
    var actionMap = {
      play: this.game.playOutCards.bind(this.game),
      resolveTie: this.game.resolveTurn.bind(this.game),
      ackResult: this.game.resolveTurn.bind(this.game)
    };

    var gameObj = actionMap[action]();
    var turnIsFinished = !this.game.inProgressTurn;
    var turnIsTied, turnIsDecided, turnDisplayCards, stateObject;

    if (turnIsFinished) {
      stateObject = {
        waitingForPlay: true,
        displayCards: {
          computer: {},
          user: {},
          extra: 0
        }
      };
    } else {
      turnIsTied = gameObj.result.winner === 'tie';
      turnIsDecided = !turnIsTied;
      
      stateObject = {
        waitingForPlay: false,
        turnIsTied: turnIsTied,
        needUserAck: turnIsDecided,
        displayCards: {
          computer: gameObj.computer.card,
          user: gameObj.user.card,
          extra: 0
        }
      };

      if (turnIsDecided) { stateObject.turnWinner = gameObj.result.winner; }
    }

    this.setState(stateObject);
  },

  render() {
    var buttonType;

    if (this.state.waitingForPlay) {
      buttonType = 'play';
    } else if (this.state.needUserAck) {
      buttonType = 'ackResult';
    } else if (this.state.turnIsTied) {
      buttonType = 'resolveTie';
    }

    return (
      <div className="App row-12">
        <HeaderBar />
        <div className="column-2"></div>
        <div className="column-8">
          <GameDash type="computer" status={this.state.players.computer} display={this.state.displayCards} />
          <PlayArea display={this.state.displayCards} />
          <GameDash 
            type="user"
            status={this.state.players.user}
            gameSwitch={this.gameSwitch}
            display={this.state.displayCards}
            buttonType={buttonType}
            winner={this.state.turnWinner}
          />
        </div>
        <div className="column-2"></div>

        <div className="clearfix"></div>
      </div>
    );
  }
});

class HeaderBar extends Component {
  render() {
    return (
      <div className="header-bar row-12">
        <div className="column-1"></div>
        <div className="column-3 title-text">War</div>
        <div className="column-4"></div>
        <div className="column-4 tag-text">a rendition of the classic card game by &copy;Dmitry White</div>

        <div className="clearfix"></div>
      </div>
    )
  }
}

class PlayArea extends Component {
  render() {
    return (
      <div className="playing-cards faceImages" >
        <div className="card-display">{this.props.display.computer.name}</div>
        <div className="card-display">{this.props.display.user.name}</div>
      </div>
    )
  }
}

class GameDash extends Component {
  dispatchClick() {
    this.props.gameSwitch(this.props.buttonType);
  }

  render() {
    var btnDisplay = {
      computer: 'none',
      user: 'inherit'
    };

    var btnTextMap = {
      play: 'PLAY',
      ackResult: 'YOU %$',
      resolveTie: 'BATTLE'
    };

    var wonLost = this.props.winner === this.props.type ? 'WON' : 'LOST';

    var buttonText = this.props.buttonType ? btnTextMap[this.props.buttonType].replace('%$', wonLost) : '';

    return (
      <div className="game-dash">
        <div className="column-1"></div>
        <div className="strength-circle column-1">{this.props.status.reserve.length}</div>
        <div className="column-1"></div>
        <div className="action-button column-6"
             onClick={this.dispatchClick.bind(this)} 
             style={{'display' : btnDisplay[this.props.type]}}
        >{buttonText}</div>
        <div className="column-1"></div>
        <div className="strength-circle column-1">{this.props.status.discard.length}</div>
        <div className="column-1"></div>

        <div className="clearfix"></div>
      </div>
    )
  }
}

export default App;
