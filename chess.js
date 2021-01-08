const whitePieces = [ '♙', '♖', '♘', '♗', '♕', '♔' ];
const blackPieces = [ '♟', '♜', '♞', '♝', '♛', '♚' ];
class Game {
	constructor() {
		this.board = [
			[ '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜' ],
			[ '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟' ],
			[ 0, 0, 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, '♖', 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0, 0, 0 ],
			[ '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙' ],
			[ '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖' ]
		];
		this.turn = 0;
		this.player = 'white';
		this.possibleMoves = [];
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
	calculateMoves() {
		this.possibleMoves = [];
		//white
		if ((this.player = 'white')) {
			//PAWNS
			//start
			this.board[6].forEach((e, col) => {
				if (e == '♙' && this.board[5][col] == '0' && this.board[4][col] == '0') {
					this.possibleMoves.push(numToCol(col) + 2 + '|' + numToCol(col) + 4);
				}
			});
			//check every square
			this.board.forEach((arr, row) => {
				arr.forEach((p, col) => {
					//1 forward
					if (p == '♙') {
						try {
							if (this.board[row - 1][col] == 0) {
								this.possibleMoves.push(numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 + 1 - row));
							}
						} catch (e) {}
						//capture left king
						try {
							if (this.board[row - 1][col] == '♚') {
								this.possibleMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col - 1) + (8 + 1 - row));
							}
						} catch (e) {}
						//capture right king
						try {
							if (this.board[row - 1][col] == '♚') {
								this.possibleMoves.push(numToCol(col) + (8 - row) + 'k' + numToCol(col + 1) + (8 + 1 - row));
							}
						} catch (e) {}
						//capture left (1 is en passant)
						try {
							if (
								blackPieces.some((v) => this.board[row - 1][col - 1].includes(v)) ||
								this.board[row - 1][col - 1] == 1
							) {
								this.possibleMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col - 1) + (8 + 1 - row));
							}
						} catch (e) {}
						//capture right (1 is en passant)
						try {
							if (
								blackPieces.some((v) => this.board[row - 1][col + 1].includes(v)) ||
								this.board[row - 1][col - 1] == 1
							) {
								his.possibleMoves.push(numToCol(col) + (8 - row) + 'x' + numToCol(col + 1) + (8 + 1 - row));
							}
						} catch (e) {}
					}

					//ROOK and QUEEN straight
					if (p == '♖' || p == '♕') {
						let rookMoving = 1;
						let rookBlocking = false;
						//oppover
						while (rookMoving < 8 && !rookBlocking) {
							try {
								//hvis fri rute
								if (this.board[row - rookMoving][col] == 0) {
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 + rookMoving - row)
									);
								} else if (this.board[row - rookMoving][col] == '♚') {
									//hvis motsatt brikke
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + 'k' + numToCol(col) + (8 + rookMoving - row)
									);
									rookBlocking = true;
								} else if (blackPieces.some((v) => this.board[row - rookMoving][col].includes(v))) {
									//hvis motsatt brikke
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + 'x' + numToCol(col) + (8 + rookMoving - row)
									);
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
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + '|' + numToCol(col + rookMoving) + (8 - row)
									);
								} else if (this.board[row][col + rookMoving] == '♚') {
									//hvis motsatt brikke
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + 'k' + numToCol(col + rookMoving) + (8 - row)
									);
									rookBlocking = true;
								} else if (blackPieces.some((v) => this.board[row][col + rookMoving].includes(v))) {
									//hvis motsatt brikke
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + 'x' + numToCol(col + rookMoving) + (8 - row)
									);
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
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + '|' + numToCol(col - rookMoving) + (8 - row)
									);
								} else if (this.board[row][col - rookMoving] == '♚') {
									//hvis motsatt brikke
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + 'k' + numToCol(col - rookMoving) + (8 - row)
									);
									rookBlocking = true;
								} else if (blackPieces.some((v) => this.board[row][col - rookMoving].includes(v))) {
									//hvis motsatt brikke
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + 'x' + numToCol(col - rookMoving) + (8 - row)
									);
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
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + '|' + numToCol(col) + (8 - rookMoving - row)
									);
								} else if (this.board[row + rookMoving][col] == '♚') {
									//hvis motsatt brikke
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + 'k' + numToCol(col) + (8 - rookMoving - row)
									);
									rookBlocking = true;
								} else if (blackPieces.some((v) => this.board[row + rookMoving][col].includes(v))) {
									//hvis motsatt brikke
									this.possibleMoves.push(
										numToCol(col) + (8 - row) + 'x' + numToCol(col) + (8 - rookMoving - row)
									);
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
					if (p == '♘') {
						const knightAround1 = [ -2, -1, 1, 2, -2, -1, 1, 2 ];
						const knightAround2 = [ 1, 2, -2, -1, -1, -2, 2, 1 ];
						for (let j = 0; j < 8; j++) {
							try {
								if (
									this.board[row + knightAround1[j]][col + knightAround2[j]] == 0 ||
									this.board[row + knightAround1[j]][col + knightAround2[j]] == 1
								) {
									this.possibleMoves.push(
										numToCol(col) +
											(8 - row) +
											'|' +
											numToCol(col + knightAround2[j]) +
											(8 - knightAround1[j] - row)
									);
								} else if (this.board[row + knightAround1[j]][col + knightAround2[j]] == '♚') {
									this.possibleMoves.push(
										numToCol(col) +
											(8 - row) +
											'k' +
											numToCol(col + knightAround2[j]) +
											(8 - knightAround1[j] - row)
									);
								} else if (
									blackPieces.some((v) =>
										this.board[row + knightAround1[j]][col + knightAround2[j]].includes(v)
									)
								) {
									this.possibleMoves.push(
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
				});
			});
		}
	}
}

function checkForCheck() {}

function numToCol(n) {
	return String.fromCharCode(n + 97);
}

function objectToCoord(obj) {
	return;
}

const g = new Game();
g.printBoard();
g.calculateMoves();
console.log(g.possibleMoves);

//check move
//out of board
//legal for piece
//own piece on target
//enemy piece/king
//something in the way
//selfcheck
//en passant
//checkmate
//in check
//rokade
