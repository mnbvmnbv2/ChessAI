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
	} else {
	}
	console.timeEnd('⏰');
}
