class Board {
	constructor() {
		this.board = [
			['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
			['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
			['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
		];
		this.turn = 0;
		this.numberOfPieces = 32;
		this.player = 'white';
		this.white = [];
		this.black = [];
		this.inCheck = false;
		this.castle = false;
		this.score = 0;
		this.done = false;
		//kan bli global med mindre caching
		this.playedMoves = [];
	}
	consoleBoard() {
		for (let row = 0; row < 8; row++) {
			let line = '';
			for (let col = 0; col <= 7; col++) {
				line += this.board[row][col];
			}
			console.log(line);
		}
	}
	printBoard() {
		let i = 0;
		for (let row = 7; row >= 0; row--) {
			for (let col = 0; col <= 7; col++) {
				if (this.board[row][col]) {
					squares[i].innerHTML = this.board[row][col];
				} else {
					squares[i].innerHTML = '';
				}
				i++;
			}
		}
	}
	doMove(move) {
		if (!this.done) {
			const nextBoard = this.simulateBoard(move);
			this.board = nextBoard.board.map(function (arr) {
				return [...arr];
			});
			console.log(
				`%c${this.player}` + ' turn: ' + g.turn + ', move: ' + move.piece + move.from + move.to + '-' + move.takes + '-val:' + move.value,
				'color:lime'
			);
			this.turn++;
			this.player = oppositeColor(this.player);
			this.printBoard();
			this.playedMoves.push(move);
			if (move.takes != 0) {
				this.numberOfPieces--;
			}
			this.inCheck = this.isCheck(this.player);
			this.calculateMoves(this.player);
			//this.consoleBoard();
			console.log('moves', this.player, this[this.player]);

			if (this.numberOfPieces == 2) {
				this.done = true;
				alert('Draw');
			} else if (this[this.player].length == 0) {
				if (g.isCheck(this.player)) {
					this.done = true;
					alert(oppositeColor(this.player) + ' won!');
				} else {
					this.done = true;
					alert('Draw');
				}
			}
			return this[this.player];
		}
	}
	simulateBoard(move) {
		let nextBoard = new Board();
		nextBoard.board = this.board.map(function (arr) {
			return [...arr];
		});

		let sRowColTo = getSquareRowAndCol(move.to);
		let sRowColFrom = getSquareRowAndCol(move.from);
		nextBoard.board[sRowColTo[0]][sRowColTo[1]] = isPiece(this.player, move.changeTo)
			? move.changeTo
			: nextBoard.board[sRowColFrom[0]][sRowColFrom[1]];
		nextBoard.board[sRowColFrom[0]][sRowColFrom[1]] = 0;
		return nextBoard;
	}
	isSelfCheck(move, color) {
		let retO = false;
		let simBoard = this.simulateBoard(move);
		let oppMoves = null;
		if (move.piece == pieces[color].king || this.inCheck) {
			oppMoves = simBoard.calculateMovesRaw(oppositeColor(color));
		} else {
			oppMoves = simBoard.checkCheck(oppositeColor(color));
		}

		oppMoves.forEach((m) => {
			if (m.takes == pieces[color].king) {
				retO = true;
			}
		});
		return retO;
	}
	calculateMoves(color) {
		let tempMoves = this.calculateMovesRaw(color);
		let removeMoves = [];
		tempMoves.forEach((move, i) => {
			if (this.isSelfCheck(move, color)) {
				removeMoves.push(move);
			}
		});

		tempMoves = tempMoves.filter((m) => !removeMoves.includes(m));
		this[color] = tempMoves;
		return tempMoves;
	}
	calculateMovesRaw(color) {
		let tempMoves = [];
		this.board.forEach((arr, row) => {
			arr.forEach((p, col) => {
				let from = nameOfSquare(row, col);

				if (p == pieces[color].pawn) {
					this.calculatePawn(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].rook) {
					this.calculateRook(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].knight) {
					this.calculateKnight(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].bishop) {
					this.calculateBishop(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].queen) {
					this.calculateQueen(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].king) {
					this.calculateKing(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				}
			});
		});
		return tempMoves;
	}
	calculatePawn(p, from, row, col, color) {
		let dir = color == 'white' ? 1 : -1;
		let endPawnRow = color == 'white' ? 6 : 1;
		let startPawnRow = color == 'white' ? 1 : 6;
		let moves = [];
		//start pawns
		if (row == startPawnRow) {
			if (this.board[startPawnRow + dir][col] == '0' && this.board[dir * 2 + startPawnRow][col] == '0') {
				moves.push(new Move(p, nameOfSquare(startPawnRow, col), nameOfSquare(2 * dir + startPawnRow, col), 0));
			}
		}
		//forward
		try {
			if (this.board[row + dir][col] == 0) {
				let to = nameOfSquare(row + dir, col);

				//promote
				if (row == endPawnRow) {
					let a = new Move(p, from, to, 0);
					a.changeTo = pieces[color].rook;
					moves.push(a);
					/*let b = new Move(p, from, to, 0);
					let c = new Move(p, from, to, 0);
					let d = new Move(p, from, to, 0);
					b.changeTo = pieces[color].knight;
					c.changeTo = pieces[color].bishop;
					d.changeTo = pieces[color].queen;
					moves.push(b);
					moves.push(c);
					moves.push(d);*/
				}

				//move forward
				else {
					moves.push(new Move(p, from, to, 0));
				}
			}
		} catch (e) {}
		//capture left
		try {
			let sqr = this.board[row + dir][col - 1];
			let to = nameOfSquare(row + dir, col - 1);
			if (isPiece(oppositeColor(color), sqr)) {
				if (row == endPawnRow) {
					let a = new Move(p, from, to, sqr);
					a.changeTo = pieces[color].rook;
					moves.push(a);
					/*let b = new Move(p, from, to, sqr);
					let c = new Move(p, from, to, sqr);
					let d = new Move(p, from, to, sqr);
					b.changeTo = pieces[color].knight;
					c.changeTo = pieces[color].bishop;
					d.changeTo = pieces[color].queen;
					moves.push(b);
					moves.push(c);
					moves.push(d);*/
				} else {
					moves.push(new Move(p, from, to, sqr));
				}
			}
		} catch (e) {}
		//capture right
		try {
			let sqr = this.board[row + dir][col + 1];
			let to = nameOfSquare(row + dir, col + 1);
			if (isPiece(oppositeColor(color), sqr)) {
				if (row == endPawnRow) {
					let a = new Move(p, from, to, sqr);
					a.changeTo = pieces[color].rook;
					moves.push(a);
					/*let b = new Move(p, from, to, sqr);
					let c = new Move(p, from, to, sqr);
					let d = new Move(p, from, to, sqr);
					b.changeTo = pieces[color].knight;
					c.changeTo = pieces[color].bishop;
					d.changeTo = pieces[color].queen;
					moves.push(b);
					moves.push(c);
					moves.push(d);*/
				} else {
					moves.push(new Move(p, from, to, sqr));
				}
			}
		} catch (e) {}
		return moves;
	}
	calculateRook(p, from, row, col, color) {
		let moves = [];
		//for hver retning
		outerLoop: for (let i = 0; i < 4; i++) {
			for (let j = 1; j < 8; j++) {
				try {
					let sqr = this.board[row + rookDir[i][0] * j][col + rookDir[i][1] * j];
					let to = nameOfSquare(row + rookDir[i][0] * j, col + rookDir[i][1] * j);
					//hvis fri rute
					if (sqr == 0) {
						moves.push(new Move(p, from, to, 0));
					} else if (isPiece(oppositeColor(color), sqr)) {
						//hvis motsatt brikke
						moves.push(new Move(p, from, to, sqr));
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
	calculateBishop(p, from, row, col, color) {
		let moves = [];
		outerLoop: for (let i = 0; i < 4; i++) {
			for (let j = 1; j < 8; j++) {
				try {
					let sqr = this.board[row + bishopDir[i][0] * j][col + bishopDir[i][1] * j];
					let to = nameOfSquare(row + bishopDir[i][0] * j, col + bishopDir[i][1] * j);
					//hvis fri rute
					if (sqr == 0) {
						moves.push(new Move(p, from, to, 0));
					} else if (isPiece(oppositeColor(color), sqr)) {
						//hvis motsatt brikke
						moves.push(new Move(p, from, to, sqr));
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
	calculateKnight(p, from, row, col, color) {
		let moves = [];
		for (let j = 0; j < 8; j++) {
			try {
				let sqr = this.board[row + knightAround1[j]][col + knightAround2[j]];
				let to = nameOfSquare(row + knightAround1[j], col + knightAround2[j]);

				if (sqr == 0) {
					moves.push(new Move(p, from, to, 0));
				} else if (isPiece(oppositeColor(color), sqr)) {
					moves.push(new Move(p, from, to, sqr));
				}
			} catch (e) {
				//utenfor brett
			}
		}
		return moves;
	}
	calculateQueen(p, from, row, col, color) {
		let a = this.calculateBishop(p, from, row, col, color);
		let b = this.calculateRook(p, from, row, col, color);
		return a.concat(b);
	}
	calculateKing(p, from, row, col, color) {
		let moves = [];
		for (let j = 0; j < 8; j++) {
			try {
				let sqr = this.board[row + kingAround1[j]][col + kingAround2[j]];
				let to = nameOfSquare(row + kingAround1[j], col + kingAround2[j]);
				if (sqr == 0) {
					moves.push(new Move(p, from, to, 0));
				} else if (isPiece(oppositeColor(color), sqr)) {
					moves.push(new Move(p, from, to, sqr));
				}
			} catch (e) {}
		}
		return moves;
	}
	isCheck(color) {
		let moves = this.calculateMovesRaw(oppositeColor(color));
		let bool = false;
		moves.forEach((m) => {
			if (m.takes == pieces[color].king) {
				bool = true;
			}
		});
		return bool;
	}
	isMate(color) {
		this.calculateMoves(color);
		if (this.isCheck && this.color.length == 0) {
			return true;
		} else {
			return false;
		}
	}
	checkCheck(color) {
		let tempMoves = [];
		this.board.forEach((arr, row) => {
			arr.forEach((p, col) => {
				let from = nameOfSquare(row, col);
				if (p == pieces[color].rook) {
					this.calculateRook(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].bishop) {
					this.calculateBishop(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].queen) {
					this.calculateQueen(p, from, row, col, color).forEach((e) => tempMoves.push(e));
				}
			});
		});
		return tempMoves;
	}
	v(move, depth, color) {
		console.time('🍿');
		this.addAllMoveChildren(move, depth, color);
		Move.calculateMoveValue(move, depth);
		console.log(move.value);
		console.timeEnd('🍿');
	}
	addAllMoveChildren(move, depth, color) {
		if (depth == 0) {
			return;
		} else {
			this.addMoveChildren(move, color);
			move.moves.forEach((m) => {
				this.addAllMoveChildren(m, depth - 1, oppositeColor(color));
			});
		}
	}
	addMoveChildren(move, color) {
		let nextState = this.simulateBoard(move);
		move.moves = nextState.calculateMoves(oppositeColor(color));
	}
}
