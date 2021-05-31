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
		console.log('moves', this.player, this[this.player]);
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
			console.log(`%c${this.player}` + ' turn: ' + g.turn + ', move: ' + move, 'color:lime');
			this.turn++;
			this.player = oppositeColor(this.player);
			this.printBoard();
			this.playedMoves.push(move);
			if (Object.values(pieces['white']).includes(move[2]) || Object.values(pieces['black']).includes(move[2])) {
				this.numberOfPieces--;
			}
			this.inCheck = this.isCheck(this.player);
			this.calculateMoves(this.player);
			this.consoleBoard();
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
		let from = move.slice(0, 2);
		let to = move.slice(3, 5);
		let piece = move.slice(5, 6);
		let nextBoard = new Board();
		nextBoard.board = this.board.map(function (arr) {
			return [...arr];
		});

		let sRowColTo = getSquareRowAndCol(to);
		let sRowColFrom = getSquareRowAndCol(from);
		nextBoard.board[sRowColTo[0]][sRowColTo[1]] = move.length == 6 ? piece : nextBoard.board[sRowColFrom[0]][sRowColFrom[1]];
		nextBoard.board[sRowColFrom[0]][sRowColFrom[1]] = 0;
		return nextBoard;
	}
	isSelfcheck(move, color) {
		let simBoard = this.simulateBoard(move);
		let retO = false;
		let a = null;
		let sRowCol = getSquareRowAndCol(move.slice(0, 2));
		////er det her?
		if (this.board[sRowCol[0]][sRowCol[1]] == pieces[color].king || this.inCheck) {
			a = simBoard.calculateMovesRaw(oppositeColor(color));
		} else {
			a = simBoard.checkCheck(oppositeColor(color));
		}
		a.forEach((el) => {
			if (el.indexOf(pieces[color].king) > -1) {
				retO = true;
			}
		});
		return retO;
	}
	calculateMoves(color) {
		let tempMoves = this.calculateMovesRaw(color);
		let removeMoves = [];
		tempMoves.forEach((move, i) => {
			if (this.isSelfcheck(move, color)) {
				removeMoves.push(move);
			}
		});

		tempMoves = tempMoves.filter((m) => !removeMoves.includes(m));
		this[color] = [...tempMoves];
		return tempMoves;
	}
	calculateMovesRaw(color) {
		let tempMoves = [];
		this.board.forEach((arr, row) => {
			arr.forEach((p, col) => {
				let from = nameOfSquare(row, col);

				if (p == pieces[color].pawn) {
					this.calculatePawn(from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].rook) {
					this.calculateRook(from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].knight) {
					this.calculateKnight(from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].bishop) {
					this.calculateBishop(from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].queen) {
					this.calculateQueen(from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].king) {
					this.calculateKing(from, row, col, color).forEach((e) => tempMoves.push(e));
				}
			});
		});
		return tempMoves;
	}
	calculatePawn(from, row, col, color) {
		let dir = color == 'white' ? 1 : -1;
		let endPawnRow = color == 'white' ? 6 : 1;
		let startPawnRow = color == 'white' ? 1 : 6;
		let moves = [];
		//start pawns
		if (row == startPawnRow) {
			if (this.board[startPawnRow + dir][col] == '0' && this.board[dir * 2 + startPawnRow][col] == '0') {
				moves.push(nameOfSquare(startPawnRow, col) + 0 + nameOfSquare(2 * dir + startPawnRow, col));
			}
		}
		//forward
		try {
			if (this.board[row + dir][col] == 0) {
				let to = nameOfSquare(row + dir, col);

				//promote
				if (row == endPawnRow) {
					moves.push(from + 0 + to + pieces[color].rook);
					moves.push(from + 0 + to + pieces[color].knight);
					moves.push(from + 0 + to + pieces[color].bishop);
					moves.push(from + 0 + to + pieces[color].queen);
				}

				//move forward
				else {
					moves.push(from + 0 + to);
				}
			}
		} catch (e) {}
		//capture left
		try {
			let sqr = this.board[row + dir][col - 1];
			let to = nameOfSquare(row + dir, col - 1);
			if (isPiece(oppositeColor(color), sqr)) {
				if (row == endPawnRow) {
					moves.push(from + sqr + to + pieces[color].rook);
					moves.push(from + sqr + to + pieces[color].knight);
					moves.push(from + sqr + to + pieces[color].bishop);
					moves.push(from + sqr + to + pieces[color].queen);
				} else {
					moves.push(from + sqr + to);
				}
			}
		} catch (e) {}
		//capture right
		try {
			let sqr = this.board[row + dir][col + 1];
			let to = nameOfSquare(row + dir, col + 1);
			if (isPiece(oppositeColor(color), sqr)) {
				if (row == endPawnRow) {
					moves.push(from + sqr + to + pieces[color].rook);
					moves.push(from + sqr + to + pieces[color].knight);
					moves.push(from + sqr + to + pieces[color].bishop);
					moves.push(from + sqr + to + pieces[color].queen);
				} else {
					moves.push(from + sqr + to);
				}
			}
		} catch (e) {}
		return moves;
	}
	calculateRook(from, row, col, color) {
		let moves = [];
		//for hver retning
		outerLoop: for (let i = 0; i < 4; i++) {
			for (let j = 1; j < 8; j++) {
				try {
					let sqr = this.board[row + rookDir[i][0] * j][col + rookDir[i][1] * j];
					let to = nameOfSquare(row + rookDir[i][0] * j, col + rookDir[i][1] * j);
					//hvis fri rute
					if (sqr == 0) {
						moves.push(from + 0 + to);
					} else if (isPiece(oppositeColor(color), sqr)) {
						//hvis motsatt brikke
						moves.push(from + sqr + to);
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
			for (let j = 1; j < 8; j++) {
				try {
					let sqr = this.board[row + bishopDir[i][0] * j][col + bishopDir[i][1] * j];
					let to = nameOfSquare(row + bishopDir[i][0] * j, col + bishopDir[i][1] * j);
					//hvis fri rute
					if (sqr == 0) {
						moves.push(from + 0 + to);
					} else if (isPiece(oppositeColor(color), sqr)) {
						//hvis motsatt brikke
						moves.push(from + sqr + to);
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
				let sqr = this.board[row + knightAround1[j]][col + knightAround2[j]];
				let to = nameOfSquare(row + knightAround1[j], col + knightAround2[j]);

				if (sqr == 0) {
					moves.push(from + 0 + to);
				} else if (isPiece(oppositeColor(color), sqr)) {
					moves.push(from + sqr + to);
				}
			} catch (e) {
				//utenfor brett
			}
		}
		return moves;
	}
	calculateQueen(from, row, col, color) {
		let a = this.calculateBishop(from, row, col, color);
		let b = this.calculateRook(from, row, col, color);
		return a.concat(b);
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
				let to = nameOfSquare(row + kingAround1[j], col + kingAround2[j]);
				if (sqr == 0) {
					moves.push(from + 0 + to);
				} else if (isPiece(oppositeColor(color), sqr)) {
					moves.push(from + sqr + to);
				}
			}
		}
		return moves;
	}
	isCheck(color) {
		let moves = this.calculateMovesRaw(oppositeColor(color));
		let bool = false;
		moves.forEach((m) => {
			if (m.includes(pieces[color].king)) {
				bool = true;
			}
		});
		return bool;
	}
	checkCheck(color) {
		let tempMoves = [];
		this.board.forEach((arr, row) => {
			arr.forEach((p, col) => {
				let from = nameOfSquare(row, col);
				if (p == pieces[color].rook) {
					this.calculateRook(from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].bishop) {
					this.calculateBishop(from, row, col, color).forEach((e) => tempMoves.push(e));
				} else if (p == pieces[color].queen) {
					this.calculateQueen(from, row, col, color).forEach((e) => tempMoves.push(e));
				}
			});
		});
		return tempMoves;
	}
}
