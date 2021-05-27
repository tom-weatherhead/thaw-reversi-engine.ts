// github:tom-weatherhead/thaw-reversi-engine.ts/src/test-descriptors.ts

'use strict';

import { whitePlayerToken } from './board';
import {
	createInitialState,
	getURLFriendlyBoardStringFromGameState,
	IGameState,
	moveAutomatically
} from './engine';
import { IFindBestMovesResult } from './player';

const defaultPlayer = whitePlayerToken;
const defaultMaxPly = 5;

interface IInitialData {
	boardAsString: string;
	gameState: IGameState;
	maxPly: number;
	player: string;
}

function createInitialDataForStartOfGame(): IInitialData {
	const gameState = createInitialState();

	return {
		boardAsString: getURLFriendlyBoardStringFromGameState(gameState),
		gameState, // This is the object literal shorthand.
		maxPly: defaultMaxPly,
		player: defaultPlayer
	};
}

export const testDescriptors = [
	{
		// . . . . . . . .
		// . . . . . . . .
		// . . . . . . . .
		// . . . X O . . .
		// . . . O X . . .
		// . . . . . . . .
		// . . . . . . . .
		// . . . . . . . .
		name: 'InitialBoardStringTest',
		arrangeFunction: (): IInitialData => createInitialDataForStartOfGame(),
		actFunction: (initialData: IInitialData): string => {
			return initialData.gameState.game.board.getPrintedBoardAsString();
		},
		assertFunction: (
			initialData: IInitialData,
			expect: jest.Expect,
			result: string
		): void => {
			const expectedResult = [
				'8  + + + +',
				'7 + + + + ',
				'6  + + + +',
				'5 + +OX + ',
				'4  + XO+ +',
				'3 + + + + ',
				'2  + + + +',
				'1 + + + + ',
				'',
				'  abcdefgh',
				''
			].join('\n');

			expect(result).toBe(expectedResult);
		}
	},
	{
		// . . . . . . . .
		// . . . . . . . .
		// . . . . . . . .
		// . . . X O . . .
		// . . . O X . . .
		// . . . . . . . .
		// . . . . . . . .
		// . . . . . . . .
		name: 'FirstMoveTest',
		arrangeFunction: (): IInitialData => createInitialDataForStartOfGame(),
		actFunction: (initialData: IInitialData): IGameState => {
			return moveAutomatically(initialData.gameState, initialData.maxPly);
		},
		assertFunction: (
			initialData: IInitialData,
			expect: jest.Expect,
			result: IGameState
		): void => {
			expect(result).toBeTruthy();

			const lastBestMoveInfo = result.lastBestMoveInfo;

			expect(lastBestMoveInfo).toBeDefined();

			if (typeof lastBestMoveInfo !== 'undefined') {
				expect(lastBestMoveInfo.bestRow).toBeTruthy();
				expect(lastBestMoveInfo.bestColumn).toBeTruthy();

				expect(lastBestMoveInfo.bestScore).toBe(3);

				expect(lastBestMoveInfo.bestMoves).toStrictEqual([
					{ row: 2, column: 4 },
					{ row: 3, column: 5 },
					{ row: 4, column: 2 },
					{ row: 5, column: 3 }
				]);
			}
		}
	},
	{
		name: 'UndoTest',
		doNotTestThroughWebService: true,
		arrangeFunction: (): IInitialData => createInitialDataForStartOfGame(),
		actFunction: (initialData: IInitialData): IFindBestMovesResult => {
			return initialData.gameState.player.findBestMove(
				initialData.maxPly
			);
		},
		assertFunction: (
			initialData: IInitialData,
			expect: jest.Expect,
			result: IFindBestMovesResult
		): void => {
			const actualBoardAsString = getURLFriendlyBoardStringFromGameState(
				initialData.gameState
			);

			expect(result).toBeTruthy();
			expect(actualBoardAsString).toBe(initialData.boardAsString);
		}
	}
];
