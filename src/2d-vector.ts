// github:tom-weatherhead/thaw-reversi-engine.ts/src/2d-vector.ts

export class TwoDimensionalVector {
	public static readonly eightDirections = [
		new TwoDimensionalVector(-1, -1),
		new TwoDimensionalVector(0, -1),
		new TwoDimensionalVector(1, -1),
		new TwoDimensionalVector(-1, 0),
		new TwoDimensionalVector(1, 0),
		new TwoDimensionalVector(-1, 1),
		new TwoDimensionalVector(0, 1),
		new TwoDimensionalVector(1, 1)
	];

	public readonly dx: number;
	public readonly dy: number;

	constructor(dx: number, dy: number) {
		this.dx = dx;
		this.dy = dy;
	}
}
