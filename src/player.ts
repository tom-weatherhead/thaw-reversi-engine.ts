// github:tom-weatherhead/thaw-reversi-engine.ts/src/player.ts

import { getRandomArrayElement } from 'thaw-common-utilities.ts';

import {
	blackPlayerToken,
	Board,
	boardArea,
	boardHeight,
	boardWidth,
	ICoordinates,
	whitePlayerToken
} from './board';
import { Game } from './game';
import { PlayerColour } from './player-colour';

export interface IFindBestMovesResult {
	bestColumn: number;
	bestMoves: any[];
	bestRow: number;
	bestScore: number;
}

export class Player {
	public readonly colour: PlayerColour;
	public readonly token: string;
	public game: Game;
	public piecePopulation: number;
	public opponent: Player;

	constructor(colour: PlayerColour, game: Game, piecePopulation: number) {
		let token: string | undefined;

		switch (colour) {
			case PlayerColour.White:
				token = whitePlayerToken;
				break;

			case PlayerColour.Black:
				token = blackPlayerToken;
				break;

			default:
				throw new Error(
					`Player constructor: Illegal PlayerColour '${PlayerColour[colour]}' (${colour})`
				);
		}

		this.colour = colour;
		this.piecePopulation = piecePopulation;
		this.token = token;
		// this.name = PlayerColour[colour];
		this.game = game;
		this.opponent = this;
	}

	// public get board(): Board {
	// 	return this.game.board;
	// }

	public findBestMove(
		nPly: number,
		nParentScore = NaN,
		nBestUncleRecursiveScore = NaN
	): IFindBestMovesResult {
		// nParentScore and nBestUncleRecursiveScore are for alpha-beta pruning.

		const returnObject: IFindBestMovesResult = {
			bestColumn: NaN,
			bestMoves: [],
			bestRow: NaN,
			bestScore: NaN
			// , numberOfLegalMoves: 0
		};
		let nBestScore = NaN;
		let bestMoves: ICoordinates[] = [];
		let doneSearching = false;

		for (let row = 0; row < boardHeight && !doneSearching; ++row) {
			for (let column = 0; column < boardWidth; ++column) {
				const placePieceResult = this.game.board.placePiece(
					this,
					row,
					column
				);

				if (typeof placePieceResult === 'undefined') {
					continue;
				}

				// returnObject.numberOfLegalMoves++;

				let nScore = placePieceResult.score;

				if (this.opponent.piecePopulation === 0) {
					// The opposing player has been annihilated.
					nScore = this.game.victoryScore;
				} else if (
					nPly > 1 &&
					this.piecePopulation + this.opponent.piecePopulation <
						boardArea
				) {
					const childReturnObject = this.opponent.findBestMove(
						nPly - 1,
						nScore,
						nBestScore
					);

					nScore -= childReturnObject.bestScore;
				}

				this.game.board.setSquareState(row, column, undefined);

				for (const squareCoordinates of placePieceResult.flippedPieces) {
					this.game.board.setSquareState(
						squareCoordinates.row,
						squareCoordinates.column,
						this.opponent
					);
				}

				this.piecePopulation -=
					placePieceResult.flippedPieces.length + 1;
				this.opponent.piecePopulation +=
					placePieceResult.flippedPieces.length;

				if (Number.isNaN(nBestScore) || nScore > nBestScore) {
					nBestScore = nScore;
					bestMoves = [];
					bestMoves.push({ row, column });

					if (
						!Number.isNaN(nParentScore) &&
						!Number.isNaN(nBestUncleRecursiveScore) &&
						nParentScore - nBestScore < nBestUncleRecursiveScore
					) {
						// *** Here is where the alpha-beta pruning happens ****
						// Because of the initial parameters for the top-level move, this break is never executed for the top-level move.
						doneSearching = true;
						break; // ie. return.
					}
				} else if (nScore === nBestScore) {
					bestMoves.push({ row, column });
				}
			}
		}

		// bestMoves.sort((move1, move2) => {

		// 	if (move1.row !== move2.row) {
		// 		return move1.row - move2.row;
		// 	} else {
		// 		return move1.column - move2.column;
		// 	}
		// });

		const selectedBestMove = getRandomArrayElement(bestMoves);

		if (typeof selectedBestMove !== 'undefined') {
			returnObject.bestRow = selectedBestMove.row;
			returnObject.bestColumn = selectedBestMove.column;
		} else {
			nBestScore = 0; // No legal moves are possible.
		}

		returnObject.bestScore = nBestScore;
		returnObject.bestMoves = bestMoves;

		return returnObject;
	}
}
