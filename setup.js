const boardEl = document.getElementById('board');

for (let i = 0; i < 64; i++) {
	let squareEl = document.createElement('div');
	squareEl.classList.add('square');
	squareEl.style.backgroundColor = '#' + ((i + Math.floor(i / 8)) % 2 ? 'F6F9B2' : '437952');
	boardEl.appendChild(squareEl);
}

const squares = Array.from(document.getElementsByClassName('square'));
