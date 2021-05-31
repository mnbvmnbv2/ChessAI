const g = new Board();
g.calculateMoves('white');
g.consoleBoard();
g.printBoard();

const play = prompt('Do you want to play? (y/n)') == 'y';
let playerColor = 'white';
if (play) {
	playerColor = prompt('What color? (white/black)');
}
const aiLevel = prompt('AI-level, (0,1,2)');

if (play) {
	playerGame();
} else {
	aiGame();
}

function playerGame() {
	squares.forEach((s) => {
		s.addEventListener('click', playerSelect);
	});
	if (playerColor == 'black') {
		aiMove();
	}
}
function aiGame() {
	aiMove();
	if (g[g.player].length > 0 && g.numberOfPieces > 2) {
		requestAnimationFrame(aiGame);
	}
}
function aiMove() {
	console.time('⏰');
	if (aiLevel == 0) {
		let moves = g[g.player];
		let move = moves[Math.floor(Math.random() * moves.length)];
		g.doMove(move);
	} else if (aiLevel == 1) {
		let moves = g[g.player];
		let move = moves[Math.floor(Math.random() * moves.length)];

		moves.forEach((m) => {
			let a = g.simulateBoard(m);
			if (a.calculateMoves(oppositeColor(g.player)).length == 0) {
				move = m;
			}
		});

		g.doMove(move);
	} else if (aiLevel == 2) {
		let moves = g[g.player];
		let move = moves[Math.floor(Math.random() * moves.length)];
		let val = 0;
		moves.forEach((m) => {
			if (Number(m.slice(6)) > val) {
				val = Number(m.slice(6));
			}
			console.log('val', val, 'a', Number(m.slice(6)));
		});
		b = moves.filter((m) => Number(m.slice(6)) == val);

		move = b[Math.floor(Math.random() * b.length)];
		console.log('new Moves', b);

		g.doMove(move);
	} else if (aiLevel == 3) {
		let moves = g[g.player];
		let move = moves[Math.floor(Math.random() * moves.length)];
		moves.forEach((m) => {
			if (m.includes('99')) {
				move = m;
			}
		});

		g.doMove(move);
	}
	console.timeEnd('⏰');
}
