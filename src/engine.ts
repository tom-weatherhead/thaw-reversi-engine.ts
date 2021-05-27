// github:tom-weatherhead/thaw-reversi-engine.ts/src/engine.ts

'use strict';

import { blackPlayerToken } from './board';
import { Game } from './game';
import { IFindBestMovesResult, Player } from './player';

export interface IGameState {
	blackPopulation: number;
	boardAsString: string;
	game: Game;
	isGameOver: boolean;
	lastBestMoveInfo?: IFindBestMovesResult;
	numPiecesFlippedInLastMove: number;
	player: Player;
	whitePopulation: number;
}

// TODO: Pass an optional 'descriptor = {}' parameter? See avoidwork's filesize.js

function findBestMove(
	gameState: IGameState,
	maxPly: number
): IFindBestMovesResult {
	return gameState.player.findBestMove(maxPly);
}

export function createInitialState(
	boardAsString?: string,
	playerToken?: string
): IGameState {
	boardAsString = boardAsString || Game.initialBoardAsString;

	const game = new Game(boardAsString);

	return {
		blackPopulation: game.blackPlayer.piecePopulation,
		boardAsString,
		game,
		isGameOver: false,
		numPiecesFlippedInLastMove: 0,
		player:
			playerToken === blackPlayerToken
				? game.blackPlayer
				: game.whitePlayer,
		whitePopulation: game.whitePlayer.piecePopulation
	};
}

export function moveManually(
	gameState: IGameState,
	row: number,
	column: number
): IGameState {
	const resultOfPlacePiece = gameState.game.board.placePiece(
		gameState.player,
		row,
		column
	);

	return {
		blackPopulation: gameState.game.blackPlayer.piecePopulation,
		boardAsString: gameState.game.board.getAsString(),
		game: gameState.game,
		isGameOver: !gameState.game.isGameNotOver(),
		numPiecesFlippedInLastMove:
			typeof resultOfPlacePiece !== 'undefined'
				? resultOfPlacePiece.flippedPieces.length
				: 0,
		player: gameState.player.opponent,
		whitePopulation: gameState.game.whitePlayer.piecePopulation
	};
}

export function moveAutomatically(
	gameState: IGameState,
	maxPly: number
): IGameState {
	const lastBestMoveInfo = findBestMove(gameState, maxPly);

	const result = moveManually(
		gameState,
		lastBestMoveInfo.bestRow,
		lastBestMoveInfo.bestColumn
	);

	result.lastBestMoveInfo = lastBestMoveInfo;

	return result;
}

export function getURLFriendlyBoardStringFromGameState(
	gameState: IGameState
): string {
	return gameState.game.board.getAsString().replace(/ /g, 'E');
}

// export function createInitialBoard(): string {
// 	return Game.initialBoardAsString;
// }

// module.exports = {
// 	// Pre-0.2.0 API:
// 	createInitialBoard: () => Game.initialBoardAsString,
// 	findBestMove: findBestMove,

// 	// Version 0.2.0 API:
// 	boardSize: boardSize,
// 	tokens: tokens,
// 	createInitialState: createInitialState,
// 	moveManually: moveManually,
// 	moveAutomatically: moveAutomatically,
// 	testDescriptors: require('./test-descriptors'),
// 	getURLFriendlyBoardStringFromGameState: getURLFriendlyBoardStringFromGameState
// };
