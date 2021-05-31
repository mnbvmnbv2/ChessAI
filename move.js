class Move {
	constructor(from, to) {
		this.from = from;
		this.to = to;
		this.takes = 0;
		this.change = 0;
		this.check = false;
		this.value = 0;
		this.takes = false;
	}
}
