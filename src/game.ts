// github:tom-weatherhead/thaw-reversi-engine.ts/src/game.ts

import { Board, boardArea } from './board';
import { Player } from './player';
import { PlayerColour } from './player-colour';

export class Game {
	public static readonly initialBoardAsString =
		Board.createInitialBoardString();

	public readonly victoryScore: number;
	public readonly board: Board;
	public readonly whitePlayer: Player;
	public readonly blackPlayer: Player;

	// TODO: constructor(options = {}) { ... } ?
	constructor(boardString = '') {
		this.victoryScore = boardArea;

		this.whitePlayer = new Player(
			PlayerColour.White,
			this,
			(boardString.match(/X/g) || []).length
		);
		this.blackPlayer = new Player(
			PlayerColour.Black,
			this,
			(boardString.match(/O/g) || []).length
		);

		this.whitePlayer.opponent = this.blackPlayer;
		this.blackPlayer.opponent = this.whitePlayer;

		this.board = new Board(this.whitePlayer, this.blackPlayer, boardString);
	}

	public noLegalMovesForPlayer(player: Player): boolean {
		const result = player.findBestMove(1);

		// return result.numberOfLegalMoves === 0; // Or:

		return result.bestMoves.length === 0;
	}

	public isGameDeadlocked(): boolean {
		return (
			this.noLegalMovesForPlayer(this.whitePlayer) &&
			this.noLegalMovesForPlayer(this.blackPlayer)
		);
	}

	public isGameNotOver(): boolean {
		return (
			this.whitePlayer.piecePopulation > 0 &&
			this.blackPlayer.piecePopulation > 0 &&
			this.whitePlayer.piecePopulation +
				this.blackPlayer.piecePopulation <
				boardArea &&
			!this.isGameDeadlocked()
		);
	}
}
