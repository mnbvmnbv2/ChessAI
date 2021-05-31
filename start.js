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
		let val = -100;
		moves.forEach((m) => {
			if (m.value > val) {
				val = m.value;
			}
		});
		let b = moves.filter((m) => m.value >= val);

		if (b.length == 0) {
			move = moves[Math.floor(Math.random() * moves.length)];
		} else {
			move = b[Math.floor(Math.random() * b.length)];
		}
		let moveVals = [];
		b.forEach((m) => moveVals.push(m.value));
		console.log('new Moves vals', moveVals);

		g.doMove(move);
	} else if (aiLevel == 3) {
		let moves = g[g.player];
		let move = moves[Math.floor(Math.random() * moves.length)];
		moves.forEach((m) => {
			if (m.value > 50) {
				move = m;
			}
		});

		g.doMove(move);
	}
	console.timeEnd('⏰');
}
