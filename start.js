const g = new Board();
g.calculateMoves('white');
g.consoleBoard();
g.printBoard();

const play = prompt('Do you want to play? (y/n)') == 'y';

//RANDOM
/*let ans = g[g.player];
function continueGame() {
	ans = g.doMove(ans[Math.floor(Math.random() * ans.length)]);
	if (ans.length > 0 && g.numberOfPieces > 2) {
		requestAnimationFrame(continueGame);
	}
}*/
let targets = [];
let from = null;
let playerColor = 'white';

if (play) {
	playerColor = prompt('What color? (white/black)');
	squares.forEach((s) => {
		s.addEventListener('click', playerSelect);
	});
	if (playerColor == 'black') {
		aiMove();
	}

	function playerSelect(e) {
		if (g.player == playerColor) {
			if (targets.includes($(e.target).index())) {
				g[playerColor].forEach((m) => {
					if (m.includes(from) && m.includes(targetToSqr($(e.target).index()))) {
						g.doMove(m);
						aiMove();
					}
				});
			}

			targets = [];
			from = targetToSqr($(e.target).index());

			squares.forEach((s, i) => {
				s.style.backgroundColor = '#' + ((i + Math.floor(i / 8)) % 2 ? 'F6F9B2' : '437952');
			});
			$(e.target).css('background-color', '#3b93ff');
			g[playerColor].forEach((move) => {
				if (move.substring(0, 2) == from) {
					$(squares[sqrToTarget(move.substring(3, 5))]).css('background-color', '#ffc73b');
					targets.push(sqrToTarget(move.substring(3, 5)));
				}
			});
		}
	}
}

function aiMove() {
	console.time('⏰');
	let moves = g[g.player];
	let move = g[g.player][Math.floor(Math.random() * moves.length)];

	moves.forEach((m) => {
		let a = g.simulateBoard(m);
		if (a.calculateMoves(oppositeColor(g.player)).length == 0) {
			move = m;
		}
	});

	g.doMove(move);
	console.timeEnd('⏰');
}

if (!play) {
	intelligentGame();
}
function intelligentGame() {
	console.time('⏰');
	let moves = g[g.player];
	let move = g[g.player][Math.floor(Math.random() * moves.length)];

	moves.forEach((m) => {
		let a = g.simulateBoard(m);
		if (a.calculateMoves(oppositeColor(g.player)).length == 0) {
			move = m;
		}
	});

	g.doMove(move);
	if (g[g.player].length > 0 && g.numberOfPieces > 2) {
		requestAnimationFrame(intelligentGame);
	}
	console.timeEnd('⏰');
}
