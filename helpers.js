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
	return Object.values(pieces[color]).splice(0, 5).includes(value);
}
function numToCol(n) {
	return String.fromCharCode(n + 97);
}
function colToNum(na) {
	return na.charCodeAt(0) - 97;
}

function targetToSqr(targetNum) {
	let col = numToCol(targetNum % 8);
	let num = 8 - Math.floor(targetNum / 8);
	return col + num;
}
function sqrToTarget(sqr) {
	let col = colToNum(sqr[0]);
	let row = 64 - 8 * sqr[1];
	return Number(col + row);
}
