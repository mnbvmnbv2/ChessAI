const boardEl = document.getElementById('board');

for (let i = 0; i < 64; i++) {
	let squareEl = document.createElement('div');
	squareEl.classList.add('square');
	squareEl.style.backgroundColor = '#' + ((i + Math.floor(i / 8)) % 2 ? 'F6F9B2' : '437952');
	boardEl.appendChild(squareEl);
}

const squares = Array.from(document.getElementsByClassName('square'));

let target = null;

squares.forEach((s) => {
	s.addEventListener('click', playerSelect);
});

function playerSelect(e) {
	console.log($(e.target).index());
	target = $(e.target).index();
	squares.forEach((s, i) => {
		s.style.backgroundColor = '#' + ((i + Math.floor(i / 8)) % 2 ? 'F6F9B2' : '437952');
	});
	$(e.target).css('background-color', '#1A659E');
}
//FF6B35

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
