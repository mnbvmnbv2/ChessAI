class Move {
	constructor(piece, from, to, takes) {
		this.piece = piece;
		this.to = to;
		this.from = from;
		this.takes = takes;
		this.changeTo = 0;
		this.check = false;
		this.value = values[takes];
		this.moves = [];
	}
	static calculateMoveValue(move, depth) {
		if (depth == 0) {
			return move.value;
		} else {
			let highestVal = -100;
			let arr = [];
			move.moves.forEach((m) => {
				let a = Move.calculateMoveValue(m, depth - 1);
				arr.push(a);
				if (a > highestVal) {
					highestVal = a;
				}
			});
			move.value -= highestVal;
			return highestVal;
		} /* else if (depth % 2) {
			let lowestVal = 100;
			let arr = [];
			move.moves.forEach((m) => {
				let a = Move.calculateMoveValue(m, depth - 1);
				arr.push(a);
				if (a < lowestVal) {
					lowestVal = a;
				}
			});
			move.value += lowestVal;
			return lowestVal;
		}*/
	}
}
