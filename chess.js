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
		this.score = 0;
		this.done = false;
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
		console.log('moves', this.player, this[this.player]);
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
		if (!this.done) {
			const nextBoard = this.simulateBoard(move);
			this.board = nextBoard.board.map(function (arr) {
				return [...arr];
			});
			console.log(`%c${this.player}` + ' turn: ' + g.turn + ', move: ' + move, 'color:lime');
			this.turn++;
			this.player = oppositeColor(this.player);
			this.printBoard();
			this.playedMoves.push(move);
			if (move.includes('x')) {
				this.numberOfPieces--;
			}
			this.consoleBoard();
			this.calculateMoves(this.player);
			if (this.numberOfPieces == 2) {
				this.done = true;
				alert('Patt');
			} else if (this[this.player].length == 0) {
				let mate = g.isCheck(this.player);
				if (mate) {
					this.done = true;
					alert(oppositeColor(this.player) + ' vant!');
				} else {
					this.done = true;
					alert('Patt');
				}
			}
			return this[this.player];
		}
	}
	simulateBoard(move) {
		let from = move.slice(0, 2);
		let to = move.slice(3, 5);
		let piece = move.slice(5, 6);
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
		//denne kjøres 1 gang for mye
		let tempMoves = [];
		//check every square
		this.board.forEach((arr, row) => {
			arr.forEach((p, col) => {
				let from = numToCol(col) + (8 - row);
				//PAWN
				if (p == pieces[color].pawn) {
					this.calculatePawn(from, row, col, color).forEach((e) => tempMoves.push(e));
				}
				//ROOK
				else if (p == pieces[color].rook) {
					this.calculateRook(from, row, col, color).forEach((e) => tempMoves.push(e));
				}
				//KNIGHT
				else if (p == pieces[color].knight) {
					this.calculateKnight(from, row, col, color).forEach((e) => tempMoves.push(e));
				}
				//BISHOP
				else if (p == pieces[color].bishop) {
					this.calculateBishop(from, row, col, color).forEach((e) => tempMoves.push(e));
				}
				//QUEEN
				else if (p == pieces[color].queen) {
					this.calculateQueen(from, row, col, color).forEach((e) => tempMoves.push(e));
				}
				//KING
				else if (p == pieces[color].king) {
					this.calculateKing(from, row, col, color).forEach((e) => tempMoves.push(e));
				}
			});
		});
		return tempMoves;
	}
	calculatePawn(from, row, col, color) {
		let dir = color == 'white' ? 1 : -1;
		let endPawnRow = color == 'white' ? 1 : 6;
		let startPawnRow = color == 'white' ? 6 : 1;
		let moves = [];
		//start pawns
		if (color == 'white' && row == startPawnRow) {
			if (this.board[5][col] == '0' && this.board[4][col] == '0') {
				moves.push(numToCol(col) + 2 + '|' + numToCol(col) + 4);
			}
		} else if (color == 'black' && row == startPawnRow) {
			if (this.board[2][col] == '0' && this.board[3][col] == '0') {
				moves.push(numToCol(col) + 7 + '|' + numToCol(col) + 5);
			}
		}
		//forward
		try {
			if (this.board[row - dir][col] == 0) {
				let to = numToCol(col) + (8 + dir - row);

				//promote
				if (row == endPawnRow) {
					moves.push(from + '|' + to + pieces[color].rook);
					moves.push(from + '|' + to + pieces[color].knight);
					moves.push(from + '|' + to + pieces[color].bishop);
					moves.push(from + '|' + to + pieces[color].queen);
				}

				//move forward
				else {
					moves.push(from + '|' + to);
				}
			}
		} catch (e) {}
		//capture king
		try {
			if (this.board[row - dir][col - 1] == pieces[oppositeColor(color)].king) {
				moves.push(from + 'k' + numToCol(col - 1) + (8 + dir - row));
			} else if (this.board[row - dir][col + 1] == pieces[oppositeColor(color)].king) {
				moves.push(from + 'k' + numToCol(col + 1) + (8 + dir - row));
			}
		} catch (e) {}
		//capture left
		try {
			if (isPiece(oppositeColor(color), this.board[row - dir][col - 1]) || this.board[row - dir][col - 1] == 1) {
				let to = numToCol(col - 1) + (8 + dir - row);
				if (row == endPawnRow) {
					moves.push(from + 'x' + to + pieces[color].rook);
					moves.push(from + 'x' + to + pieces[color].knight);
					moves.push(from + 'x' + to + pieces[color].bishop);
					moves.push(from + 'x' + to + pieces[color].queen);
				} else {
					moves.push(from + 'x' + to);
				}
			}
		} catch (e) {}
		//capture right
		try {
			if (isPiece(oppositeColor(color), this.board[row - dir][col + 1]) || this.board[row - dir][col + 1] == 1) {
				let to = numToCol(col + 1) + (8 + dir - row);
				if (row == endPawnRow) {
					moves.push(from + 'x' + to + pieces[color].rook);
					moves.push(from + 'x' + to + pieces[color].knight);
					moves.push(from + 'x' + to + pieces[color].bishop);
					moves.push(from + 'x' + to + pieces[color].queen);
				} else {
					moves.push(from + 'x' + to);
				}
			}
		} catch (e) {}
		return moves;
	}
	calculateRook(from, row, col, color) {
		let moves = [];
		outerLoop: for (let i = 0; i < 4; i++) {
			//for hver retning
			for (let j = 1; j < 7; j++) {
				try {
					let sqr = this.board[row - rookDir[i][0] * j][col + rookDir[i][1] * j];
					let to = numToCol(col + rookDir[i][1] * j) + (8 + rookDir[i][0] * j - row);
					//hvis fri rute
					if (sqr == 0) {
						moves.push(from + '|' + to);
					} else if (sqr == pieces[oppositeColor(color)].king) {
						//hvis motsatt brikke
						moves.push(from + 'k' + to);
						continue outerLoop;
					} else if (pieces[oppositeColor(color)].values.splice(5, 1).some((v) => sqr.includes(v))) {
						//hvis motsatt brikke
						moves.push(from + 'x' + to);
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
		return moves;
	}
	calculateBishop(from, row, col, color) {
		let moves = [];
		outerLoop: for (let i = 0; i < 4; i++) {
			//up right
			for (let j = 1; j < 7; j++) {
				try {
					let sqr = this.board[row - bishopDir[i][0] * j][col + bishopDir[i][1] * j];
					let to = numToCol(col + bishopDir[i][1] * j) + (8 + bishopDir[i][0] * j - row);
					//hvis fri rute
					if (sqr == 0) {
						moves.push(from + '|' + to);
					} else if (sqr == pieces[oppositeColor(color)].king) {
						//hvis konge
						moves.push(from + 'k' + to);
						continue outerLoop;
					} else if (isPiece(oppositeColor(color), sqr)) {
						//hvis motsatt brikke
						moves.push(from + 'x' + to);
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
		return moves;
	}
	calculateKnight(from, row, col, color) {
		let moves = [];
		for (let j = 0; j < 8; j++) {
			try {
				let to = numToCol(col + knightAround2[j]) + (8 - knightAround1[j] - row);
				let sqr = this.board[row + knightAround1[j]][col + knightAround2[j]];
				if (sqr == 0 || sqr == 1) {
					moves.push(from + '|' + to);
				} else if (sqr == pieces[oppositeColor(color)].king) {
					moves.push(from + 'k' + to);
				} else if (isPiece(oppositeColor(color), sqr)) {
					moves.push(from + 'x' + to);
				}
			} catch (e) {
				//utenfor brett
			}
		}
		return moves;
	}
	calculateQueen(from, row, col, color) {
		let moves = [];
		outerLoop: for (let i = 0; i < 4; i++) {
			//up right
			for (let j = 1; j < 7; j++) {
				try {
					let sqr = this.board[row - bishopDir[i][0] * j][col + bishopDir[i][1] * j];
					let to = numToCol(col + bishopDir[i][1] * j) + (8 + bishopDir[i][0] * j - row);
					//hvis fri rute
					if (sqr == 0) {
						moves.push(from + '|' + to);
					} else if (sqr == pieces[oppositeColor(color)].king) {
						//hvis konge
						moves.push(from + 'k' + to);
						continue outerLoop;
					} else if (isPiece(oppositeColor(color), sqr)) {
						//hvis motsatt brikke
						moves.push(from + 'x' + to);
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
		outerLoop: for (let i = 0; i < 4; i++) {
			//for hver retning
			for (let j = 1; j < 7; j++) {
				try {
					let sqr = this.board[row - rookDir[i][0] * j][col + rookDir[i][1] * j];
					let to = numToCol(col + rookDir[i][1] * j) + (8 + rookDir[i][0] * j - row);
					//hvis fri rute
					if (sqr == 0) {
						moves.push(from + '|' + to);
					} else if (sqr == pieces[oppositeColor(color)].king) {
						//hvis motsatt brikke
						moves.push(from + 'k' + to);
						continue outerLoop;
					} else if (isPiece(oppositeColor(color), sqr)) {
						//hvis motsatt brikke
						moves.push(from + 'x' + to);
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
		return moves;
	}
	calculateKing(from, row, col, color) {
		let moves = [];
		for (let j = 0; j < 8; j++) {
			if (row + kingAround1[j] == 8) {
			} else if (row + kingAround1[j] == -1) {
			} else if (col + kingAround2[j] == 8) {
			} else if (col + kingAround2[j] == -1) {
			} else {
				let sqr = this.board[row + kingAround1[j]][col + kingAround2[j]];
				let to = numToCol(col + kingAround2[j]) + (8 - kingAround1[j] - row);
				if (sqr == 0 || sqr == 1) {
					moves.push(from + '|' + to);
				} else if (sqr == pieces[oppositeColor(color)].king) {
					moves.push(from + 'k' + to);
				} else if (isPiece(oppositeColor(color), sqr)) {
					moves.push(from + 'x' + to);
				}
			}
		}
		return moves;
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
	nameOfSquare(number) {}
}
