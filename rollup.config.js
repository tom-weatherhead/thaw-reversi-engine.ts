// rollup.config.js

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { terser } = require('rollup-plugin-terser');

export default [
	{
		input: './dist/types/main.js',
		output: [
			{
				file: 'dist/thaw-reversi-engine.cjs.js',
				format: 'cjs',
				exports: 'named'
			},
			{
				file: 'dist/thaw-reversi-engine.esm.js',
				format: 'es',
				compact: true,
				plugins: [terser()]
			},
			{
				file: 'dist/thaw-reversi-engine.js',
				name: 'thaw-reversi-engine.ts',
				format: 'umd',
				compact: true,
				plugins: [terser()]
			}
		]
	}
];
