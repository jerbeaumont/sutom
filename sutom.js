const word = atob('Y2FtYXJhZGU=');

const delay = 3e2;
const container = document.getElementById('container');

const handleKeywboard = (event) => {
  if (event.key === 'Enter') {
    checkWord();
    return;
  }

  if (event.key === 'Backspace') {
    removeLetter();
    return;
  }

  if (event.which >= 65 && event.which <= 90) {
    addLetter(event.key);
  }
}

const checkWord = async() => {
  const cells = Array.from(document.querySelectorAll('.current .cell'));
  // Don't check if missing a letter
  if (cells.map((cell) => cell.innerHTML).join('').includes('.')) {
    return;
  }

  const letters = [];
  for (let i = 0; i < cells.length; i++) {
    await sleep(delay);
    letters.push(checkLetter(cells[i], i));
  }

  if (letters.join('') === word) {
    const audioWin = new Audio('sound/win.mp3');
    audioWin.play();
    document.removeEventListener('keydown', handleKeywboard);
    return;
  }

  addLine(letters);
}

const sleep = (delay) => {
  let interval;

  return new Promise((resolve) => {
    interval = setInterval(() => {
      clearInterval(interval);
      resolve();
    }, delay);
  });
}

const checkLetter = (cell, index) => {
  const letter = word.charAt(index);

  if (cell.innerHTML === letter) {
    cell.classList.add('found');

    const audioFound = new Audio('sound/found.wav');
    audioFound.play();

    return letter;
  }

  if (word.includes(cell.innerHTML)) {
    cell.classList.add('wrong');

    const audioWrong = new Audio('sound/wrong.wav');
    audioWrong.play();

    return '.';
  }

  cell.classList.add('not-found');
  const audioNotFound = new Audio('sound/not-found.wav');
  audioNotFound.play();

  return '.';
}

const addLine = (letters) => {
  const current = document.querySelector('.current');
  if (current) {
    current.classList.remove('current');
  }

  let line = '<div class="line current">';
  letters.forEach(letter => {
    line += `<span class="cell">${letter}</span>`
  });
  line += '</div>';

  container.insertAdjacentHTML('beforeend', line);
}

const addLetter = (letter) => {
  const cells = document.querySelectorAll('.current .cell');
  const cell = Array.from(cells).find((cell) => cell.innerHTML === '.');
  if (!cell) {
    return cell;
  }

  cell.innerHTML = letter;
}

const removeLetter = () => {
  let index = 0;
  const cells = document.querySelectorAll('.current .cell');
  const cell = Array.from(cells).slice().reverse().find((cell, i) => {
    index = i;
    return cell.innerHTML !== '.'
  });

  if (!cell || index === word.length-1) {
    return;
  }

  cell.innerHTML = '.';
}

const init = () => {
  document.addEventListener('keydown', handleKeywboard);

  let i = 0;
  const initWord = [];
  for (i; i < word.length; i++) {
    if (i === 0) {
      initWord.push(word.charAt(i));
      continue;
    }

    initWord.push('.');
  }

  addLine(initWord);
}

init();