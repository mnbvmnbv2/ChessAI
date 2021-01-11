const whitePieces = [ '♙', '♖', '♘', '♗', '♕' ];
const blackPieces = [ '♟', '♜', '♞', '♝', '♛' ];
const whiteKing = '♔';
const blackKing = '♚';
class Board {
	constructor() {
		this.board = [
			[ '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜' ],
			[ '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟' ],
			[ 0, 0, 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0, 0, 0 ],
			[ '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙' ],
			[ '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖' ]
		];
		this.turn = 0;
		this.numberOfPieces = 32;
		this.player = 'white';
		this.white = [];
		this.black = [];
		this.playedMoves = [];
	}
	printBoard() {
		let b = '';
		this.board.forEach((r, i) => {
			let row = 8 - i;
			this.board[i].forEach((e) => {
				row += '	' + e;
			});
			row += '\n';
			b += row;
		});
		console.log('	a	b	c	d	e	f	g	h');
		console.log(b);
	}
	doMove(move) {
		const nextBoard = this.simulateBoard(move);
		this.board = nextBoard.board.map(function(arr) {
			return [ ...arr ];
		});
		console.log('turn: ' + g.turn + ', move: ' + move);
		this.turn++;
		if (this.player == 'white') {
			this.player = 'black';
		} else {
			this.player = 'white';
		}
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
		//promote
		if (move.length == 6) {
			let from = move.slice(0, 2);
			let to = move.slice(3, 5);
			let pis = move.slice(5);
			let nextBoard = new Board();
			nextBoard.board = this.board.map(function(arr) {
				return [ ...arr ];
			});
			nextBoard.board[8 - to[1]][colToNum(to[0])] = pis;
			nextBoard.board[8 - from[1]][colToNum(from[0])] = 0;
			return nextBoard;
		} else {
			let from = move.slice(0, 2);
			let to = move.slice(3);
			let nextBoard = new Board();
			nextBoard.board = this.board.map(function(arr) {
				return [ ...arr ];
			});
			nextBoard.board[8 - to[1]][colToNum(to[0])] = nextBoard.board[8 - from[1]][colToNum(from[0])];
			nextBoard.board[8 - from[1]][colToNum(from[0])] = 0;
			return nextBoard;
		}
	}
	checkMove(move, color) {
		let simBoard = this.simulateBoard(move);
		let retO = false;
		if (color == 'white') {
			let a = simBoard.calculateMovesRaw('black');
			a.forEach((el) => {
				if (el.indexOf('k') > -1) {
					retO = true;
				}
			});
		} else {
			let a = simBoard.calculateMovesRaw('white');
			a.forEach((el) => {
				if (el.indexOf('k') > -1) {
					retO = true;
				}
			});
		}
		return retO;
	}
	calculateMoves(color) {
		this[color] = [];
		let tempMoves = this.calculateMovesRaw(color);
		let removeMoves = [];
		tempMoves.forEach((move, i) => {
			if (this.checkMove(move, color)) {
				removeMoves.push(move);
			}
		});
		tempMoves = tempMoves.filter((m) => !removeMoves.includes(m));
		this[color] = [ ...tempMoves ];
		return tempMoves;
	}
	calculateMovesRaw(color) {
		this[color] = [];
		let tempMoves = [];
		let pieces = whitePieces;
		let opponent = blackPieces;
		let opponentKing = blackKing;
		let selfKing = whiteKing;
		let opponentColor = 'black';

		//start pawn
		if (color == 'white') {
			this.board[6].forEach((e, col) => {
				if (e == pieces[0] && this.board[5][col] == '0' && this.board[4][col] == '0') {
					tempMoves.push(numToCol(col) + 2 + '|' + numToCol(col) + 4);
				}
			});
		} else {
			pieces = blackPieces;
			opponent = whitePieces;
			opponentKing = whiteKing;
			selfKing = blackKing;
			opponentColor = 'white';
			this.board[1].forEach((e, col) => {
				if (e == pieces[0] && this.board[2][col] == '0' && this.board[3][col] == '0') {
					tempMoves.push(numToCol(col) + 7 + '|' + numToCol(col) + 5);
				}
			});
		}
		//check every square
		this.board.forEach((arr, row) => {
			arr.forEach((p, col) => {
				//PAWN
				if (color == 'white' && p == pieces[0]) {
					try {
						if (this.board[row - 1][col] == 0) {
							if (row == 1) {
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 + 1 - row) + pieces[1]);
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 + 1 - row) + pieces[2]);
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 + 1 - row) + pieces[3]);
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 + 1 - row) + pieces[4]);
							} else {
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 + 1 - row));
							}
						}
					} catch (e) {}
					//capture left king
					try {
						if (this.board[row - 1][col - 1] == opponentKing) {
							tempMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col - 1) + (8 + 1 - row));
						}
					} catch (e) {}
					//capture right king
					try {
						if (this.board[row - 1][col + 1] == opponentKing) {
							tempMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col + 1) + (8 + 1 - row));
						}
					} catch (e) {}
					//capture left (1 is en passant)
					try {
						if (
							opponent.some((v) => this.board[row - 1][col - 1].includes(v)) ||
							this.board[row - 1][col - 1] == 1
						) {
							if (row == 1) {
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 + 1 - row) + pieces[1]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 + 1 - row) + pieces[2]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 + 1 - row) + pieces[3]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 + 1 - row) + pieces[4]
								);
							} else {
								tempMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 + 1 - row));
							}
						}
					} catch (e) {}
					//capture right (1 is en passant)
					try {
						if (
							opponent.some((v) => this.board[row - 1][col + 1].includes(v)) ||
							this.board[row - 1][col + 1] == 1
						) {
							if (row == 1) {
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 + 1 - row) + pieces[1]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 + 1 - row) + pieces[2]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 + 1 - row) + pieces[3]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 + 1 - row) + pieces[4]
								);
							} else {
								tempMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 + 1 - row));
							}
						}
					} catch (e) {}
				}

				if (color == 'black' && p == pieces[0]) {
					try {
						if (this.board[row + 1][col] == 0) {
							if (row == 6) {
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 - 1 - row) + pieces[1]);
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 - 1 - row) + pieces[2]);
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 - 1 - row) + pieces[3]);
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 - 1 - row) + pieces[4]);
							} else {
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 - 1 - row));
							}
						}
					} catch (e) {}
					//capture left king
					try {
						if (this.board[row + 1][col - 1] == opponentKing) {
							tempMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col - 1) + (8 - 1 - row));
						}
					} catch (e) {}
					//capture right king
					try {
						if (this.board[row + 1][col + 1] == opponentKing) {
							tempMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col + 1) + (8 - 1 - row));
						}
					} catch (e) {}
					//capture left (1 is en passant)
					try {
						if (
							opponent.some((v) => this.board[row - 1][col - 1].includes(v)) ||
							this.board[row + 1][col - 1] == 1
						) {
							if (row == 6) {
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 - 1 - row) + pieces[1]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 - 1 - row) + pieces[2]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 - 1 - row) + pieces[3]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 - 1 - row) + pieces[4]
								);
							} else {
								tempMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 - 1 - row));
							}
						}
					} catch (e) {}
					//capture right (1 is en passant)
					try {
						if (
							opponent.some((v) => this.board[row - 1][col + 1].includes(v)) ||
							this.board[row + 1][col - 1] == 1
						) {
							if (row == 6) {
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 - 1 - row) + pieces[1]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 - 1 - row) + pieces[2]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 - 1 - row) + pieces[3]
								);
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 - 1 - row) + pieces[4]
								);
							} else {
								this[color].push(numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 - 1 - row));
							}
						}
					} catch (e) {}
				}

				//ROOK and QUEEN straight
				if (p == pieces[1] || p == pieces[4]) {
					let rookMoving = 1;
					let rookBlocking = false;
					//oppover
					while (rookMoving < 8 && !rookBlocking) {
						try {
							//hvis fri rute
							if (this.board[row - rookMoving][col] == 0) {
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 + rookMoving - row));
							} else if (this.board[row - rookMoving][col] == opponentKing) {
								//hvis motsatt brikke
								tempMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col) + (8 + rookMoving - row));
								rookBlocking = true;
							} else if (opponent.some((v) => this.board[row - rookMoving][col].includes(v))) {
								//hvis motsatt brikke
								tempMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col) + (8 + rookMoving - row));
								rookBlocking = true;
							} else {
								//samme farge brikke
								rookBlocking = true;
							}
						} catch (e) {}
						rookMoving++;
					}
					//hoyre
					rookMoving = 1;
					rookBlocking = false;
					while (rookMoving < 8 && !rookBlocking) {
						try {
							//hvis fri rute
							if (this.board[row][col + rookMoving] == 0) {
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col + rookMoving) + (8 - row));
							} else if (this.board[row][col + rookMoving] == opponentKing) {
								//hvis motsatt brikke
								tempMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col + rookMoving) + (8 - row));
								rookBlocking = true;
							} else if (opponent.some((v) => this.board[row][col + rookMoving].includes(v))) {
								//hvis motsatt brikke
								tempMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col + rookMoving) + (8 - row));
								rookBlocking = true;
							} else {
								//samme farge brikke
								rookBlocking = true;
							}
						} catch (e) {}
						rookMoving++;
					}
					//venstre
					rookMoving = 1;
					rookBlocking = false;
					while (rookMoving < 8 && !rookBlocking) {
						try {
							//hvis fri rute
							if (this.board[row][col - rookMoving] == 0) {
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col - rookMoving) + (8 - row));
							} else if (this.board[row][col - rookMoving] == opponentKing) {
								//hvis motsatt brikke
								tempMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col - rookMoving) + (8 - row));
								rookBlocking = true;
							} else if (opponent.some((v) => this.board[row][col - rookMoving].includes(v))) {
								//hvis motsatt brikke
								tempMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col - rookMoving) + (8 - row));
								rookBlocking = true;
							} else {
								//samme farge brikke
								rookBlocking = true;
							}
						} catch (e) {}
						rookMoving++;
					}
					//nedover
					rookMoving = 1;
					rookBlocking = false;
					while (rookMoving < 8 && !rookBlocking) {
						try {
							//hvis fri rute
							if (this.board[row + rookMoving][col] == 0) {
								tempMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 - rookMoving - row));
							} else if (this.board[row + rookMoving][col] == opponentKing) {
								//hvis motsatt brikke
								tempMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col) + (8 - rookMoving - row));
								rookBlocking = true;
							} else if (opponent.some((v) => this.board[row + rookMoving][col].includes(v))) {
								//hvis motsatt brikke
								tempMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col) + (8 - rookMoving - row));
								rookBlocking = true;
							} else {
								//samme farge brikke
								rookBlocking = true;
							}
						} catch (e) {}
						rookMoving++;
					}
				}

				//KNIGHT
				if (p == pieces[2]) {
					const knightAround1 = [ -2, -1, 1, 2, -2, -1, 1, 2 ];
					const knightAround2 = [ 1, 2, -2, -1, -1, -2, 2, 1 ];
					for (let j = 0; j < 8; j++) {
						try {
							if (
								this.board[row + knightAround1[j]][col + knightAround2[j]] == 0 ||
								this.board[row + knightAround1[j]][col + knightAround2[j]] == 1
							) {
								tempMoves.push(
									numToCol(col) +
										(8 - row) +
										'|' +
										numToCol(col + knightAround2[j]) +
										(8 - knightAround1[j] - row)
								);
							} else if (this.board[row + knightAround1[j]][col + knightAround2[j]] == opponentKing) {
								tempMoves.push(
									numToCol(col) +
										(8 - row) +
										'k' +
										numToCol(col + knightAround2[j]) +
										(8 - knightAround1[j] - row)
								);
							} else if (
								opponent.some((v) => this.board[row + knightAround1[j]][col + knightAround2[j]].includes(v))
							) {
								tempMoves.push(
									numToCol(col) +
										(8 - row) +
										'x' +
										numToCol(col + knightAround2[j]) +
										(8 - knightAround1[j] - row)
								);
							}
						} catch (e) {}
					}
				}
				//BISHOP
				if (p == pieces[3] || p == pieces[4]) {
					let bishopMoving = 1;
					let bishopBlocking = false;
					//up right
					while (bishopMoving < 8 && !bishopBlocking) {
						try {
							//hvis fri rute
							if (this.board[row - bishopMoving][col + bishopMoving] == 0) {
								tempMoves.push(
									numToCol(col) + (8 - row) + '|' + numToCol(col + bishopMoving) + (8 + bishopMoving - row)
								);
							} else if (this.board[row - bishopMoving][col + bishopMoving] == opponentKing) {
								//hvis motsatt brikke
								tempMoves.push(
									numToCol(col) + (8 - row) + 'k' + numToCol(col + bishopMoving) + (8 + bishopMoving - row)
								);
								bishopBlocking = true;
							} else if (
								opponent.some((v) => this.board[row - bishopMoving][col + bishopMoving].includes(v))
							) {
								//hvis motsatt brikke
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + bishopMoving) + (8 + bishopMoving - row)
								);
								bishopBlocking = true;
							} else {
								//samme farge brikke
								bishopBlocking = true;
							}
						} catch (e) {}
						bishopMoving++;
					}
					//up left
					bishopMoving = 1;
					bishopBlocking = false;
					while (bishopMoving < 8 && !bishopBlocking) {
						try {
							//hvis fri rute
							if (this.board[row - bishopMoving][col - bishopMoving] == 0) {
								tempMoves.push(
									numToCol(col) + (8 - row) + '|' + numToCol(col - bishopMoving) + (8 + bishopMoving - row)
								);
							} else if (this.board[row - bishopMoving][col - bishopMoving] == opponentKing) {
								//hvis motsatt brikke
								tempMoves.push(
									numToCol(col) + (8 - row) + 'k' + numToCol(col - bishopMoving) + (8 + bishopMoving - row)
								);
								bishopBlocking = true;
							} else if (
								opponent.some((v) => this.board[row - bishopMoving][col - bishopMoving].includes(v))
							) {
								//hvis motsatt brikke
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - bishopMoving) + (8 + bishopMoving - row)
								);
								bishopBlocking = true;
							} else {
								//samme farge brikke
								bishopBlocking = true;
							}
						} catch (e) {}
						bishopMoving++;
					}
					//down left
					bishopMoving = 1;
					bishopBlocking = false;
					while (bishopMoving < 8 && !bishopBlocking) {
						try {
							//hvis fri rute
							if (this.board[row + bishopMoving][col - bishopMoving] == 0) {
								tempMoves.push(
									numToCol(col) + (8 - row) + '|' + numToCol(col - bishopMoving) + (8 - bishopMoving - row)
								);
							} else if (this.board[row + bishopMoving][col - bishopMoving] == opponentKing) {
								//hvis motsatt brikke
								tempMoves.push(
									numToCol(col) + (8 - row) + 'k' + numToCol(col - bishopMoving) + (8 - bishopMoving - row)
								);
								bishopBlocking = true;
							} else if (
								opponent.some((v) => this.board[row + bishopMoving][col - bishopMoving].includes(v))
							) {
								//hvis motsatt brikke
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col - bishopMoving) + (8 - bishopMoving - row)
								);
								bishopBlocking = true;
							} else {
								//samme farge brikke
								bishopBlocking = true;
							}
						} catch (e) {}
						bishopMoving++;
					}
					//down right
					bishopMoving = 1;
					bishopBlocking = false;
					while (bishopMoving < 8 && !bishopBlocking) {
						try {
							//hvis fri rute
							if (this.board[row + bishopMoving][col + bishopMoving] == 0) {
								tempMoves.push(
									numToCol(col) + (8 - row) + '|' + numToCol(col + bishopMoving) + (8 - bishopMoving - row)
								);
							} else if (this.board[row + bishopMoving][col + bishopMoving] == opponentKing) {
								//hvis motsatt brikke
								tempMoves.push(
									numToCol(col) + (8 - row) + 'k' + numToCol(col + bishopMoving) + (8 - bishopMoving - row)
								);
								bishopBlocking = true;
							} else if (
								opponent.some((v) => this.board[row + bishopMoving][col + bishopMoving].includes(v))
							) {
								//hvis motsatt brikke
								tempMoves.push(
									numToCol(col) + (8 - row) + 'x' + numToCol(col + bishopMoving) + (8 - bishopMoving - row)
								);
								bishopBlocking = true;
							} else {
								//samme farge brikke
								bishopBlocking = true;
							}
						} catch (e) {}
						bishopMoving++;
					}
				}

				//KING
				if (p == selfKing) {
					const kingAround1 = [ -1, -1, -1, 0, 1, 1, 1, 0 ];
					const kingAround2 = [ -1, 0, 1, 1, 1, 0, -1, -1 ];
					for (let j = 0; j < 8; j++) {
						try {
							if (
								this.board[row + kingAround1[j]][col + kingAround2[j]] == 0 ||
								this.board[row + kingAround1[j]][col + kingAround2[j]] == 1
							) {
								tempMoves.push(
									numToCol(col) +
										(8 - row) +
										'|' +
										numToCol(col + kingAround2[j]) +
										(8 - kingAround1[j] - row)
								);
							} else if (this.board[row + kingAround1[j]][col + kingAround2[j]] == opponentKing) {
								tempMoves.push(
									numToCol(col) +
										(8 - row) +
										'k' +
										numToCol(col + kingAround2[j]) +
										(8 - kingAround1[j] - row)
								);
							} else if (
								opponent.some((v) => this.board[row + kingAround1[j]][col + kingAround2[j]].includes(v))
							) {
								tempMoves.push(
									numToCol(col) +
										(8 - row) +
										'x' +
										numToCol(col + kingAround2[j]) +
										(8 - kingAround1[j] - row)
								);
							}
						} catch (e) {}
					}
				}
			});
		});
		return tempMoves;
	}
	isCheck(color) {
		if (color == 'white') {
			this.calculateMoves('black', false);
			this.black.forEach((e) => {
				if (e.includes('k')) {
					return true;
				}
			});
		} else {
			this.calculateMoves('white', false);
			this.white.forEach((e) => {
				if (e.includes('k')) {
					return true;
				}
			});
		}
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
g.printBoard();
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
