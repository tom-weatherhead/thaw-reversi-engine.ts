# thaw-reversi-engine.ts
A Node.js Reversi (Othello) game engine with alpha-beta pruning and a heuristic, packaged for npm.

[![build status](https://secure.travis-ci.org/tom-weatherhead/thaw-reversi-engine.ts.svg)](https://travis-ci.org/tom-weatherhead/thaw-reversi-engine.ts)
[![npm version](https://img.shields.io/npm/v/thaw-reversi-engine.ts.svg)](https://www.npmjs.com/package/thaw-reversi-engine.ts)
[![npm total downloads](https://img.shields.io/npm/dt/thaw-reversi-engine.ts.svg)](https://www.npmjs.com/package/thaw-reversi-engine.ts)
[![known vulnerabilities](https://snyk.io/test/github/tom-weatherhead/thaw-reversi-engine.ts/badge.svg?targetFile=package.json&package-lock.json)](https://snyk.io/test/github/tom-weatherhead/thaw-reversi-engine.ts?targetFile=package.json&package-lock.json)
[![maintainability](https://api.codeclimate.com/v1/badges/0123456789abcdef0123/maintainability)](https://codeclimate.com/github/tom-weatherhead/thaw-reversi-engine.ts/maintainability)
[![test coverage](https://api.codeclimate.com/v1/badges/0123456789abcdef0123/test_coverage)](https://codeclimate.com/github/tom-weatherhead/othello-angular-electron/test_coverage)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/tom-weatherhead/thaw-reversi-engine.ts/blob/master/LICENSE)

### Git Installation Instructions

```
git clone https://github.com/tom-weatherhead/thaw-reversi-engine.ts.git
cd thaw-reversi-engine.ts
npm run all
```

### npm Installation Instructions

```
npm install [--save] thaw-reversi-engine.ts
```

### Sample Usage of the npm Package

```js
let engine = require('thaw-reversi-engine.ts');

let boardString = engine.createInitialBoard();
let player = 'X';
let maxPly = 5;

try {
	let result = engine.findBestMove(boardString, player, maxPly);

	console.log(result);
} catch (error) {
	console.error('engine.findBestMove() threw an exception:', error);
}
```

Output: E.g.

```js
{
	bestRow: 4,
	bestColumn: 2,
	bestScore: 3,
	bestMoves: [
		{ row: 2, column: 4 },
		{ row: 3, column: 5 },
		{ row: 4, column: 2 },
		{ row: 5, column: 3 }
	]
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
