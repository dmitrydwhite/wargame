import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
    var stateObject = this.startNewGame();

    stateObject.displayCards = {
      player: {},
      user: {},
      extra: 0
    };

    stateObject.needUserAck = false;
    stateObject.gameReady = true;

    return stateObject;
  },

  startNewGame() {
    return new WarGame();
  },

  advanceGame(evt, cards) {

  },

  // componentDidMount() {
  //   this.state = this.startNewGame();
  // }

  render() {
    return (
      <div className="App row-12">
        <div className="column-2"></div>
        <div className="column-8">
          <GameDash type="computer" status={this.state.players.computer} display={this.state.displayCards} />
          <PlayArea />
          <GameDash 
            type="user"
            status={this.state.players.user}
            advanceGame={this.advanceGame}
            userAckBtn={this.completeTurn}
            display={this.state.displayCards}
          />
        </div>
        <div className="column-2"></div>

        <div className="clearfix"></div>
      </div>
    );
  }
});

class PlayArea extends Component {
  render() {
    return (
      <div className="play-area" >Play Area Placeholder</div>
    )
  }
}

class GameDash extends Component {
  render() {
    var btnDisplay = {
      computer: 'none',
      user: 'inherit'
    };

    return (
      <div className="game-dash">
        <div className="column-1"></div>
        <div className="strength-circle column-1">{this.props.status.reserve.length}</div>
        <div className="column-1"></div>
        <div className="action-button column-6" onClick={this.props.advanceGame} style={{'display' : btnDisplay[this.props.type]}}>ACTION</div>
        <div className="column-1"></div>
        <div className="strength-circle column-1">{this.props.status.discard.length}</div>
        <div className="column-1"></div>

        <div className="clearfix"></div>
      </div>
    )
  }
}

export default App;
