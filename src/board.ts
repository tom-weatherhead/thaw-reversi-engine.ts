// github:tom-weatherhead/thaw-reversi-engine.ts/src/board.ts

import { createArrayFromElement } from 'thaw-common-utilities.ts';

import { TwoDimensionalVector } from './2d-vector';
import { Player } from './player';

export const boardSize = 8;
export const boardWidth = boardSize;
export const boardHeight = boardWidth; // Ensures that the board is square.
export const boardArea = boardWidth * boardHeight;

export const whitePlayerToken = 'X'; // 'W' ?
export const blackPlayerToken = 'O'; // 'B' ?
const emptySquareToken = ' '; // 'E' ? This would make the board string URL-safe.

export interface ICoordinates {
	column: number;
	row: number;
}

interface IPlacePieceResult {
	flippedPieces: ICoordinates[];
	score: number;
}

export class Board {
	public static createInitialBoardString(): string {
		const boardArray = createArrayFromElement(
			emptySquareToken,
			boardArea
		);
		const halfWidth = Math.floor(boardWidth / 2);
		const halfHeight = Math.floor(boardHeight / 2);

		// JavaScript strings are immutable.
		// See https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
		// Change boardArray before the join() instead of trying to change the resulting string after.
		boardArray[
			(halfHeight - 1) * boardWidth + halfWidth - 1
		] = whitePlayerToken;
		boardArray[
			(halfHeight - 1) * boardWidth + halfWidth
		] = blackPlayerToken;
		boardArray[
			halfHeight * boardWidth + halfWidth - 1
		] = blackPlayerToken;
		boardArray[halfHeight * boardWidth + halfWidth] = whitePlayerToken;

		return boardArray.join('');
	}

	public readonly boardArray: (Player | undefined)[];

	constructor(whitePlayer: Player, blackPlayer: Player, boardString = '') {
		boardString = boardString || Board.createInitialBoardString();

		if (boardString.length !== boardArea) {
			throw new Error(
				`Board constructor: The length of boardString is not ${boardArea}.`
			);
		}

		this.boardArray = this.generateFromString(
			boardString,
			whitePlayer,
			blackPlayer
		);
	}

	public getAsString() {
		return this.generateAsString();
	}

	public areCoordinatesOnBoard(row: number, column: number): boolean {
		return (
			!Number.isNaN(row) &&
			!Number.isNaN(column) &&
			row >= 0 &&
			row < boardHeight &&
			column >= 0 &&
			column < boardWidth
		);
	}

	public getSquareState(row: number, column: number): Player | undefined {
		if (!this.areCoordinatesOnBoard(row, column)) {
			return undefined;
		}

		return this.boardArray[row * boardWidth + column];
	}

	public setSquareState(
		row: number,
		column: number,
		player?: Player
	): void {
		if (!this.areCoordinatesOnBoard(row, column)) {
			throw new Error(
				'Board.setSquareState() : Coordinates are off the board.'
			);
		}

		this.boardArray[row * boardWidth + column] = player;
	}

	public placePiece(
		player: Player,
		row: number,
		column: number
	): IPlacePieceResult | undefined {
		const returnObject: IPlacePieceResult = {
			flippedPieces: [],
			score: 0
		};

		if (
			!this.areCoordinatesOnBoard(row, column) ||
			typeof this.getSquareState(row, column) !== 'undefined'
		) {
			return undefined;
		}

		for (const direction of TwoDimensionalVector.eightDirections) {
			// Pass 1: Scan.
			let canFlipInThisDirection: boolean | undefined;
			const undoBuffer: ICoordinates[] = [];
			let row2 = row;
			let column2 = column;

			for (;;) {
				row2 += direction.dy;
				column2 += direction.dx;

				if (
					typeof canFlipInThisDirection !== 'undefined' ||
					!this.areCoordinatesOnBoard(row2, column2)
				) {
					break;
				}

				const squareState = this.getSquareState(row2, column2);

				if (typeof squareState === 'undefined') {
					canFlipInThisDirection = false;
				} else if (squareState.colour === player.colour) {
					canFlipInThisDirection = true;
				} else {
					// squareState === opponentToken
					undoBuffer.push({ row: row2, column: column2 });
				}
			}

			if (canFlipInThisDirection && undoBuffer.length > 0) {
				returnObject.flippedPieces = returnObject.flippedPieces.concat(
					undoBuffer
				);
			}
		}

		if (returnObject.flippedPieces.length === 0) {
			// No opposing pieces were flipped; thus the move fails.
			return undefined;
		}

		// Pass 2: Flip.

		for (const coord of returnObject.flippedPieces) {
			this.setSquareState(coord.row, coord.column, player);
			returnObject.score +=
				2 * this.squareScore(coord.row, coord.column);
		}

		this.setSquareState(row, column, player);
		returnObject.score += this.squareScore(row, column);
		player.piecePopulation += returnObject.flippedPieces.length + 1;
		player.opponent.piecePopulation -= returnObject.flippedPieces.length;

		return returnObject;
	}

	public getPrintedBoardAsString(): string {
		const rowLabels = '12345678';
		const columnLabels = 'abcdefgh';
		let boardAsString = '';

		// Display row 7 first, row 0 last.

		for (let row = boardSize - 1; row >= 0; --row) {
			boardAsString = boardAsString + rowLabels[row] + ' ';

			for (let col = 0; col < boardSize; ++col) {
				let output = '?';
				const player = this.getSquareState(row, col);

				if (typeof player === 'undefined') {
					output = (row + col) % 2 === 0 ? '+' : ' ';
				} else {
					output = player.token;
				}

				boardAsString = boardAsString + output;
			}

			boardAsString = boardAsString + '\n';
		}

		boardAsString = boardAsString + '\n  ' + columnLabels + '\n';

		return boardAsString;
	}

	// public printBoard(): void {
	// 	console.log(this.getPrintedBoardAsString());
	// }

	private squareScore(row: number, column: number): number {
		// Calculate a useful heuristic.
		const interiorSquareScore = 1;
		const edgeSquareScore = 2;
		const cornerSquareScore = 8;

		const isInEdgeColumn = column === 0 || column === boardWidth - 1;

		if (row === 0 || row === boardHeight - 1) {
			if (isInEdgeColumn) {
				return cornerSquareScore;
			} else {
				return edgeSquareScore;
			}
		} else if (isInEdgeColumn) {
			return edgeSquareScore;
		} else {
			return interiorSquareScore;
		}
	}

	private generateFromString(
		boardString: string,
		whitePlayer: Player,
		blackPlayer: Player
	): (Player | undefined)[] {
		const result: (Player | undefined)[] = [];

		// Split a string into an array of characters:
		// see https://stackoverflow.com/questions/4547609/how-do-you-get-a-string-to-a-character-array-in-javascript/34717402#34717402

		for (const c of boardString.split('')) {
			if (c === emptySquareToken) {
				result.push(undefined);
			} else if (c === whitePlayer.token) {
				result.push(whitePlayer);
			} else if (c === blackPlayer.token) {
				result.push(blackPlayer);
			} else {
				throw new Error('Board.generateFromString() error');
			}
		}

		return result;
	}

	private generateAsString(): string {
		return this.boardArray
			.map((player?: Player): string =>
				typeof player !== 'undefined'
					? player.token
					: emptySquareToken
			)
			.join('');
	}
}
