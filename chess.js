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

class Board {
	constructor() {
		this.board = [
			['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
			['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
			['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
		];
		//kan fjernes
		this.turn = 0;
		this.numberOfPieces = 32;
		this.player = 'white';
		this.white = [];
		this.black = [];
		this.playedMoves = [];
	}
	consoleBoard() {
		let line = '';
		this.board.forEach((row) => {
			row.forEach((el) => {
				line += el + '	';
			});
			line += '\n';
		});
		console.log(line);
	}
	printBoard() {
		squares.forEach((sqr, i) => {
			if (this.board[Math.floor(i / 8)][i % 8]) {
				sqr.innerHTML = this.board[Math.floor(i / 8)][i % 8];
			} else {
				sqr.innerHTML = '';
			}
		});
	}
	doMove(move) {
		const nextBoard = this.simulateBoard(move);
		this.board = nextBoard.board.map(function (arr) {
			return [...arr];
		});
		console.log('turn: ' + g.turn + ', move: ' + move);
		this.turn++;
		this.player = oppositeColor(this.player);
		this.consoleBoard();
		this.printBoard();
		this.calculateMoves(this.player);
		this.playedMoves.push(move);
		console.log(this[this.player]);
		if (move.includes('x')) {
			this.numberOfPieces--;
		}
		return this[this.player];
	}
	simulateBoard(move) {
		let from = move.slice(0, 2);
		let to = move.slice(3, 5);
		let piece = move.slice(5);
		let nextBoard = new Board();
		nextBoard.board = this.board.map(function (arr) {
			return [...arr];
		});
		nextBoard.board[8 - to[1]][colToNum(to[0])] = move.length == 6 ? piece : nextBoard.board[8 - from[1]][colToNum(from[0])];
		nextBoard.board[8 - from[1]][colToNum(from[0])] = 0;
		return nextBoard;
	}
	checkMove(move, color) {
		let simBoard = this.simulateBoard(move);
		let retO = false;
		let a = simBoard.calculateMovesRaw(oppositeColor(color));
		a.forEach((el) => {
			if (el.indexOf('k') > -1) {
				retO = true;
			}
		});
		return retO;
	}
	calculateMoves(color) {
		let tempMoves = this.calculateMovesRaw(color);
		let removeMoves = [];
		tempMoves.forEach((move, i) => {
			if (this.checkMove(move, color)) {
				removeMoves.push(move);
			}
		});
		tempMoves = tempMoves.filter((m) => !removeMoves.includes(m));
		this[color] = [...tempMoves];
		return tempMoves;
	}
	calculateMovesRaw(color) {
		this[color] = [];
		let tempMoves = [];

		//start pawn
		if (color == 'white') {
			this.board[6].forEach((piece, col) => {
				if (piece == pieces.white.pawn && this.board[5][col] == '0' && this.board[4][col] == '0') {
					tempMoves.push(numToCol(col) + 2 + '|' + numToCol(col) + 4);
				}
			});
		} else {
			this.board[1].forEach((piece, col) => {
				if (piece == pieces.black.pawn && this.board[2][col] == '0' && this.board[3][col] == '0') {
					tempMoves.push(numToCol(col) + 7 + '|' + numToCol(col) + 5);
				}
			});
		}
		//check every square
		this.board.forEach((arr, row) => {
			arr.forEach((p, col) => {
				//PAWN
				let dir = color == 'white' ? 1 : -1;
				let from = numToCol(col) + (8 - row);

				if (p == pieces[color].pawn) {
					//forward
					try {
						if (this.board[row - dir][col] == 0) {
							let to = numToCol(col) + (8 + dir - row);

							//promote
							if (row == 1) {
								tempMoves.push(from + '|' + to + pieces[color].rook);
								tempMoves.push(from + '|' + to + pieces[color].knight);
								tempMoves.push(from + '|' + to + pieces[color].bishop);
								tempMoves.push(from + '|' + to + pieces[color].queen);
							}

							//move forward
							else {
								tempMoves.push(from + '|' + to);
							}
						}
					} catch (e) {}
					//capture king
					try {
						if (this.board[row - dir][col - 1] == pieces[oppositeColor(color)].king) {
							tempMoves.push(from + 'k' + numToCol(col - 1) + (8 + dir - row));
						} else if (this.board[row - dir][col + 1] == pieces[oppositeColor(color)].king) {
							tempMoves.push(from + 'k' + numToCol(col + 1) + (8 + dir - row));
						}
					} catch (e) {}
					//capture left
					try {
						if (isPiece(oppositeColor(color), this.board[row - dir][col - 1]) || this.board[row - dir][col - 1] == 1) {
							let to = numToCol(col - 1) + (8 + dir - row);
							if (row == 1) {
								tempMoves.push(from + 'x' + to + pieces[color].rook);
								tempMoves.push(from + 'x' + to + pieces[color].knight);
								tempMoves.push(from + 'x' + to + pieces[color].bishop);
								tempMoves.push(from + 'x' + to + pieces[color].queen);
							} else {
								tempMoves.push(from + 'x' + to);
							}
						}
					} catch (e) {}
					//capture right
					try {
						if (isPiece(oppositeColor(color), this.board[row - dir][col + 1]) || this.board[row - dir][col + 1] == 1) {
							let to = numToCol(col + 1) + (8 + dir - row);
							if (row == 1) {
								tempMoves.push(from + 'x' + to + pieces[color].rook);
								tempMoves.push(from + 'x' + to + pieces[color].knight);
								tempMoves.push(from + 'x' + to + pieces[color].bishop);
								tempMoves.push(from + 'x' + to + pieces[color].queen);
							} else {
								tempMoves.push(from + 'x' + to);
							}
						}
					} catch (e) {}
				}
				//ROOK and QUEEN straight
				else if (p == pieces[color].rook || p == pieces[color].queen) {
					outerLoop: for (let i = 0; i < 4; i++) {
						//for hver retning
						for (let j = 0; j < 7; j++) {
							try {
								let sqr = this.board[row - rookDir[i][0] * j][col + rookDir[i][1] * j];
								let to = numToCol(col + rookDir[i][1] * j) + (8 + rookDir[i][0] * j - row);
								//hvis fri rute
								if (sqr == 0) {
									tempMoves.push(from + '|' + to);
								} else if (sqr == pieces[oppositeColor(color)].king) {
									//hvis motsatt brikke
									tempMoves.push(from + 'k' + to);
									continue outerLoop;
								} else if (pieces[oppositeColor(color)].values.splice(5, 1).some((v) => sqr.includes(v))) {
									//hvis motsatt brikke
									tempMoves.push(from + 'x' + to);
									continue outerLoop;
								} else {
									//samme farge brikke
									continue outerLoop;
								}
							} catch (e) {
								//utenfor brett
								continue outerLoop;
							}
						}
					}
				}
				//KNIGHT
				else if (p == pieces[color].knight) {
					for (let j = 0; j < 8; j++) {
						try {
							let to = numToCol(col + knightAround2[j]) + (8 - knightAround1[j] - row);
							let sqr = this.board[row + knightAround1[j]][col + knightAround2[j]];
							if (sqr == 0 || sqr == 1) {
								tempMoves.push(from + '|' + to);
							} else if (sqr == opponentKing) {
								tempMoves.push(from + 'k' + to);
							} else if (isPiece(oppositeColor(color), sqr)) {
								tempMoves.push(from + 'x' + to);
							}
						} catch (e) {
							//utenfor brett
						}
					}
				}
				//BISHOP and QUEEN diagonal
				else if (p == pieces[color].bishop || p == pieces[color].queen) {
					outerLoop: for (let i = 0; i < 4; i++) {
						//up right
						for (let j = 0; j < 7; j++) {
							try {
								let sqr = this.board[row - bishopDir[i][0] * j][col + bishopDir[i][1] * j];
								let to = numToCol(col + bishopDir[i][1] * j) + (8 + bishopDir[i][0] * j - row);
								//hvis fri rute
								if (sqr == 0) {
									tempMoves.push(from + '|' + to);
								} else if (sqr == pieces[oppositeColor(color)].king) {
									//hvis konge
									tempMoves.push(from + 'k' + to);
									continue outerLoop;
								} else if (isPiece(oppositeColor(color), sqr)) {
									//hvis motsatt brikke
									tempMoves.push(from + 'x' + to);
									continue outerLoop;
								} else {
									//samme farge brikke
									continue outerLoop;
								}
							} catch (e) {
								//utenfor brett
								continue outerLoop;
							}
						}
					}
				}
				//KING
				else if (p == pieces[color].king) {
					for (let j = 0; j < 8; j++) {
						try {
							let sqr = this.board[row + kingAround1[j]][col + kingAround2[j]];
							let to = numToCol(col + kingAround2[j]) + (8 - kingAround1[j] - row);
							if (sqr == 0 || sqr == 1) {
								tempMoves.push(from + '|' + to);
							} else if (sqr == pieces[oppositeColor(color).king]) {
								tempMoves.push(from + 'k' + to);
							} else if (isPiece(oppositeColor(color), sqr)) {
								tempMoves.push(from + 'x' + to);
							}
						} catch (e) {}
					}
				}
			});
		});
		return tempMoves;
	}
	isCheck(color) {
		this.calculateMoves(oppositeColor(color), false);
		this[oppositeColor(color)].forEach((e) => {
			if (e.includes('k')) {
				return true;
			}
		});
		return false;
	}
}

function numToCol(n) {
	return String.fromCharCode(n + 97);
}
function colToNum(na) {
	return na.charCodeAt(0) - 97;
}

const g = new Board();
g.consoleBoard();
g.calculateMoves('white');
console.log(g.white);

//check move
//out of board
//legal for piece
//own piece on target
//enemy piece/king
//something in the way

//in check

//selfcheck

//en passant
//checkmate
//rokade
//promote
//50 trekks regel
//sjakkmatt i 1
//sjakkmatt i 2
//flere brikker i 1/2

/*let ans = g[g.player];
while (ans.length > 0 || g.turn > 50) {
	ans = g.doMove(ans[Math.floor(Math.random() * ans.length)]);
}*/

let ans = g[g.player];
//continueGame();
function continueGame() {
	ans = g.doMove(ans[Math.floor(Math.random() * ans.length)]);
	if (ans.length > 0 && g.numberOfPieces > 2) {
		requestAnimationFrame(continueGame);
	}
}

console.time('⏰');
intelligentGame();
function intelligentGame() {
	let moves = g[g.player];
	let doMove = g[g.player][Math.floor(Math.random() * ans.length)];
	if ((g.player = 'white')) {
		moves.forEach((m) => {
			let a = g.simulateBoard(m);
			if (a.calculateMoves('black').length == 0) {
				doMove = m;
			}
		});
	} else {
		moves.forEach((m) => {
			let a = g.simulateBoard(m);
			if (a.calculateMoves('white').length == 0) {
				doMove = m;
			}
		});
	}
	g.doMove(doMove);
	if (g[g.player].length > 0 && g.numberOfPieces > 2) {
		requestAnimationFrame(continueGame);
	}
}
console.timeEnd('⏰');
