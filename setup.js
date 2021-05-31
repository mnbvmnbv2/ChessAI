const boardEl = document.getElementById('board');

for (let i = 0; i < 64; i++) {
	let squareEl = document.createElement('div');
	squareEl.classList.add('square');
	squareEl.style.backgroundColor = '#' + ((i + Math.floor(i / 8)) % 2 ? '437952' : 'F6F9B2');
	boardEl.appendChild(squareEl);
}

const squares = Array.from(document.getElementsByClassName('square'));

let targets = [];
let from = null;

function playerSelect(e) {
	if (g.player == playerColor) {
		if (targets.includes($(e.target).index())) {
			g[playerColor].forEach((m) => {
				if (m.includes(from) && m.includes(nameOfClickedSquare($(e.target).index()))) {
					g.doMove(m);
					aiMove();
				}
			});
		}

		targets = [];
		from = nameOfClickedSquare($(e.target).index());

		squares.forEach((s, i) => {
			s.style.backgroundColor = '#' + ((i + Math.floor(i / 8)) % 2 ? '437952' : 'F6F9B2');
		});
		$(e.target).css('background-color', '#3b93ff');
		g[playerColor].forEach((move) => {
			if (move.substring(0, 2) == from) {
				$(squares[nameTo64(move.substring(3, 5))]).css('background-color', '#ffc73b');
				targets.push(nameTo64(move.substring(3, 5)));
			}
		});
	}
}

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
