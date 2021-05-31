class Move {
	constructor(piece, from, to, takes) {
		this.piece = piece;
		this.to = to;
		this.from = from;
		this.takes = takes;
		this.changeTo = 0;
		this.check = false;
		this.value = values[takes];
	}
}
