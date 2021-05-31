const pieces = {
	white: {
		pawn: '♙',
		rook: '♖',
		knight: '♘',
		bishop: '♗',
		queen: '♕',
		king: '♔',
	},
	black: {
		pawn: '♟',
		rook: '♜',
		knight: '♞',
		bishop: '♝',
		queen: '♛',
		king: '♚',
	},
};
const rookDir = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
];
const bishopDir = [
	[1, 1],
	[-1, 1],
	[-1, -1],
	[1, -1],
];
const knightAround1 = [-2, -1, 1, 2, -2, -1, 1, 2];
const knightAround2 = [1, 2, -2, -1, -1, -2, 2, 1];

const kingAround1 = [-1, -1, -1, 0, 1, 1, 1, 0];
const kingAround2 = [-1, 0, 1, 1, 1, 0, -1, -1];

function oppositeColor(color) {
	if (color == 'black') {
		return 'white';
	} else {
		return 'black';
	}
}
function isPiece(color, value) {
	return Object.values(pieces[color]).includes(value);
}
function nameOfSquare(row, col) {
	return String.fromCharCode(col + 97) + (row + 1);
}
function nameOfClickedSquare(targetNum) {
	return String.fromCharCode((targetNum % 8) + 97) + (8 - Math.floor(targetNum / 8));
}
function nameTo64(sqr) {
	let col = sqr[0].charCodeAt(0) - 97;
	let row = 8 - sqr[1];
	return Number(8 * row + col);
}
function getSquareRowAndCol(string) {
	let row = Number(string[1]) - 1;
	let col = Number(string[0].charCodeAt(0)) - 97;
	return [row, col];
}
