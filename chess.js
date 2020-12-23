let board2 = `
8	♜	♞	♝	♛	♚	♝	♞	♜
7	♟	♟	♟	♟	♟	♟	♟	♟
6	
5	
4	
3	
2	♙	♙	♙	♙	♙	♙	♙	♙
1	♖	♘	♗	♕	♔	♗	♘	♖
    a	b	c	d	e	f	g	h
`;

class Piece {
	constructor(color){
		this.color = color;
	}
	move(){

	}
}
class Pawn extends Piece {
	constructor(color){
		super(color)
		if(this.color == 'w'){
			this.char = '♙';
		} else {
			this.char = '♟';
		}
	}
	move(){
		if(this.color = 'w'){
			return [(1,0)];
		} else {
			return [(-1,0)];
		}
	}
	take(){
		if(this.color = 'w'){
			return [(1,1),(1,-1)];
		} else {
			return [(-1,1),(-1,-1)];
		}
	}
}

class Game {
	constructor() {
		this.board = {
			r : [1,2,3,4,5,6,7,8],
			a : [0,new Pawn('w'),0,0,0,0,0,0],
			b : [0,new Pawn('w'),0,0,0,0,0,0],
			c : [0,new Pawn('w'),0,0,0,0,0,0],
			d : [0,0,0,0,0,0,0,0],
			e : [0,0,0,0,0,0,0,0],
			f : [0,0,0,0,0,0,0,0],
			g : [0,0,0,0,0,0,0,0],
			h : [0,0,0,0,0,0,0,0]
		}
	}
	print() {
		let b = '';
		for(let column in this.board){
			console.log(column)
			let col = column;
			this.board[column].forEach(e => {
				if(typeof e == 'object'){
					col += '	'+e.char;
				} else {
					col += '	'+e;
				}
			});
			col += '\n';
			b += col;
		} 
		console.log(b);
	}
}



const g = new Game;
console.log(g.print())	

//check move
//out of board
//legal for piece
//own piece on target
//enemy piece/king
//something in the way
//selfcheck