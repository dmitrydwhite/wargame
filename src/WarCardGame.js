'use strict';
// import uuid from 'node-uuid';
// import Deck from './DeckOfCards';

var uuid = require('node-uuid')
var Deck = require('./DeckOfCards.js');


class WarGame {
  constructor() {
    this.deck = new Deck().unWrap().shuffle();
    var len = this.deck.deck.length;

    this.TIE_CARDS_FACEDOWN = 3;

    this.gameState = 0;
    this.gameTurn = 0;
    this.gameId = uuid.v1();

    this.players = {
      user: {
        reserve: this.deck.deal(Math.floor(len/2)),
        discard: []
      },
      computer: {
        reserve: this.deck.deal(Math.floor(len/2)),
        discard: []
      }
    }

    this.losingPlayers = [];
  }

  playOutCards(cards) {
    if (!cards) {
      console.log('beginning next turn');
    } else {
      console.log('playing out cards because of tie');
    }
    var turnObj = this.inProgressTurn || {
      ties: 0,
      cardsInPlay: []
    };
    var winningCardValue = 0;
    var tiedPlayers = [];
    var winner;

    for (let player in this.players) {
      let playersCard;

      if (this.resetReserve(player)) break;

      playersCard = this.players[player].reserve.length ? this.players[player].reserve.pop() : null;

      if (!playersCard) {
        this.resolveLoss(player);
        break;
      }

      if (cards) {
        let reserve = this.players[player].reserve;

        if (reserve.length < cards) { cards = reserve.length; }

        turnObj.cardsInPlay = turnObj.cardsInPlay.concat(reserve.splice(reserve.length - cards, cards));
      }
    
      turnObj.cardsInPlay.push(playersCard);
      turnObj[player] = turnObj[player] || {};

      turnObj[player].card = playersCard;
      turnObj[player].card.name = playersCard.getName();
      turnObj[player].card.value = playersCard.getValue();

      if (playersCard.getValue() > winningCardValue) {
        winner = player;
        winningCardValue = playersCard.getValue();
      } else if (playersCard.getValue() === winningCardValue) {
        winner = 'tie';

        if (tiedPlayers.length) {
          tiedPlayers.push(player);
        } else {
          tiedPlayers = [winner, player];
        }
      }
    }

    turnObj.result = {
      winner: winner,
      hiValue: winningCardValue
    }

    this.inProgressTurn = turnObj;

    return turnObj;
  }

  resolveTurn() {
    if (!this.inProgressTurn) return 'Turn not in progress';

    var turn = this.inProgressTurn;
    var winner = turn.result.winner;


    if (this.players[winner]) {
      this.gameTurn += 1;
      turn.turnIndex = this.gameTurn;

      this.players[winner].discard = this.players[winner].discard.concat(turn.cardsInPlay);

      this.inProgressTurn = null;

      for (let player in this.players) {
        this.resetReserve(player);
      }

      return turn;
    } else {
      return this.resolveTie();
    }
  }

  resolveTie() {
    var turn = this.inProgressTurn;
    var isTie = turn ? turn.result.winner === 'tie' : false;

    if (!turn || !isTie) return 'Tied turn not in progress';

    turn.ties += 1;

    return this.playOutCards(this.TIE_CARDS_FACEDOWN);
  }

  resetReserve(player, force) {
    var shouldReset = this.players[player].reserve.length === 0 || force;
    var playerIsOutOfCards = this.players[player].reserve.length === 0 && this.players[player].discard.length === 0;

    if (playerIsOutOfCards) {
      return this.resolveLoss(player);
    } else if (shouldReset) {
      this.players[player].reserve = this.deck.shuffleHand(this.players[player].reserve.concat(this.players[player].discard));
      this.players[player].discard = [];
    }
  }

  resolveLoss(loser) {
    var survivingPlayers = [];

    for (let player in this.players) {
      if (player !== loser) {
        survivingPlayers.push(player);
      }
    }

    if (survivingPlayers.length === 1) {
      return this.declareWinner(survivingPlayers[0]);
    } else {
      this.eliminatePlayer(loser);
    }
  }

  declareWinner(winner) {
    console.log('winner is ' + winner + ' in turn ' + this.gameTurn);
    this.gameState = 1;
    return true;
  }

  eliminatePlayer(loser) {
    this.losingPlayers.push({ losingPlayer: loser, turnId: this.gameTurn });
  }
}

// Integration test for game engine
// var g = new WarGame();


// function playGame(game) {
//   if (game.inProgressTurn) {
//     if (game.inProgressTurn.result.winner === 'tie') {
//       game.resolveTurn();
//     } else {
//       let turn = game.resolveTurn();
//       let compCards = game.players.computer.discard.length + game.players.computer.reserve.length;
//       let userCards = game.players.user.discard.length + game.players.user.reserve.length;

//       console.log('TURN:[' + game.gameTurn + '] WINNER:[' + turn.result.winner + ']');
//       console.log('cards won:' + turn.cardsInPlay.length);
//       console.log('computer:' + compCards + ' user:' + userCards);
//     }
//   } else {
//     game.playOutCards();
//   }
// }

// while(g.gameState === 0) {
//   playGame(g);
// }
module.exports = WarGame;
// export default WarGame;