const whitePieces = [ '♙', '♖', '♘', '♗', '♕', '♔' ];
const blackPieces = [ '♟', '♜', '♞', '♝', '♛', '♚' ];
class Game {
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
		this.player = 'white';
		this.possibleMoves = [];
	}
	print() {
		let b = '';
		this.board.forEach((r, i) => {
			let row = i + 1;
			this.board[i].forEach((e) => {
				row += '	' + e;
			});
			row += '\n';
			b += row;
		});
		console.log('0	a	b	c	d	e	f	g	h');
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
			//1 forward and capture
			this.board.forEach((row, i) => {
				row.forEach((p, col) => {
					//1 forward
					try {
						if (p == '♙' && this.board[i - 1][col] == '0') {
							this.possibleMoves.push(numToCol(col) + (8 - i) + '|' + numToCol(col) + (9 - i));
						}
					} catch (e) {}
					//capture left
					try {
						if (p == '♙' && blackPieces.some((v) => this.board[i - 1][col - 1].includes(v))) {
							this.possibleMoves.push(numToCol(col) + (8 - i) + '|' + numToCol(col - 1) + (9 - i));
						}
					} catch (e) {}
					//capture right
					try {
						if (p == '♙' && blackPieces.some((v) => this.board[i - 1][col + 1].includes(v))) {
							this.possibleMoves.push(numToCol(col) + (8 - i) + '|' + numToCol(col + 1) + (9 - i));
						}
					} catch (e) {}

					//ROOK
					let rookMoving = 0;
					let rookBlocking = false;
					while (rookMoving < 7 && !rookBlocking) {
						try {
							if (p == '♖' && blackPieces.some((v) => this.board[i - 1][col + 1].includes(v))) {
								this.possibleMoves.push(numToCol(col) + (8 - i) + '|' + numToCol(col + 1) + (9 - i));
							}
						} catch (e) {}
					}
				});
			});

			//ROOK
		}
	}
}

function checkForCheck() {}

function numToCol(n) {
	return String.fromCharCode(n + 97);
}

const g = new Game();
console.log(g.print());
g.calculateMoves();
console.log(g.possibleMoves);

//check move
//out of board
//legal for piece
//own piece on target
//enemy piece/king
//something in the way
//selfcheck
