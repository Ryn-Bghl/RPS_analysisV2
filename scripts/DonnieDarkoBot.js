/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */

// APP, PLAYER, ENEMY: CLASSES

class App {
  constructor() {
    this.root = document.querySelector('body > app-root:nth-child(1)');
    this.room = document.querySelector(
      'body > app-root:nth-child(1) > app-room-page:nth-child(2)',
    );
    this.playingScreen = document.querySelector('.container > app-playing:nth-child(1)');
    this.finalScreen = document.querySelector('.play-page-final-screen__nav');
    this.waitingScreen = document.querySelector('.container > app-waiting:nth-child(1)');
    this.rounds = document.querySelector('.play-page-round');
    this.playAgainButton = document.querySelector('button.btn-primary');
  }
}

class Player {
  constructor() {
    [, this.rock, , this.paper, , this.scissors] = document.querySelector(
      '.play-page-gamer__choices',
    ).childNodes;
  }
}

class Enemy {
  constructor() {
    [, , , , , , this.rock, , this.paper, , this.scissors] = document.querySelectorAll('.play-page-gamer__choices')[1].childNodes;
    [, this.choice] = document.querySelectorAll('.play-page-gamer__choices');
  }
}

const stop = prompt('at how many games do you wanna stop?')

let isReady = true;
let isEnd = false;

let app = new App();

let game = [];
const games = [];

// PRACTICAL FUNCTIONS

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function downloadContent(name, content) {
  var atag = document.createElement("a");
  var file = new Blob([content], {type: 'text/plain'});
  atag.href = URL.createObjectURL(file);
  atag.download = name;
  atag.click();
}

function getElementExtension(element) {
  return element.src.split('/').pop().split('.')[0];
}

function getCsvFormat(arrs) {
  const res = [];
  arrs.forEach((arr) => {
    res.push(`${arr.join('')}-`);
  });
  return res.join('\n');
}

function init() {
  let player = new Player();
  let enemy = new Enemy();

  // BOT ACTIONS

  // eslint-disable-next-line no-extra-boolean-cast
  if (!!app.rounds && !app.finalScreen) {
    // eslint-disable-next-line prefer-const
    let rockPaperOrScissors = getRandomInt(3);
    if (app.rounds.textContent === 'Round 1') {
      if (rockPaperOrScissors === 0) {
        player.rock.childNodes[2].click();
        game.push('r');
      } else if (rockPaperOrScissors === 1) {
        player.paper.childNodes[2].click();
        game.push('p');
      } else if (rockPaperOrScissors === 2) {
        player.scissors.childNodes[2].click();
        game.push('s');
      }
    }
  }

  app.rounds.addEventListener('DOMCharacterDataModified', () => {
    player = new Player();
    // eslint-disable-next-line prefer-const
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!app.rounds && !app.finalScreen) {
      rockPaperOrScissors = getRandomInt(3);
      if (rockPaperOrScissors === 0) {
        player.rock.childNodes[2].click();
        game.push('r');
      } else if (rockPaperOrScissors === 1) {
        player.paper.childNodes[2].click();
        game.push('p');
      } else if (rockPaperOrScissors === 2) {
        player.scissors.childNodes[2].click();
        game.push('s');
      }
    }
  });

  // RESET PLAYER EVENT HANDLERS

  player.rock.onclick = null;
  player.paper.onclick = null;
  player.scissors.onclick = null;

  const enemyMakeChoice = new MutationObserver(() => {
    enemy = new Enemy();
    if (enemy.rock.tagName === 'IMG' && getElementExtension(enemy.rock) === 'rock') {
      game.push('r\n');
    } else if (enemy.paper.tagName === 'IMG' && getElementExtension(enemy.paper) === 'paper') {
      game.push('p\n');
    } else if (enemy.scissors.tagName === 'IMG' && getElementExtension(enemy.scissors) === 'scissors') {
      game.push('s\n');
    }
  });

  // RESET ENEMY EVENT HANDLERS

  enemyMakeChoice.disconnect();

  // USE ENEMY EVENT HANDLERS

  enemyMakeChoice.observe(enemy.choice, {
    childList: true,
  });
}
// EVENT HANDLERS STARTING & ENDING

const ifReadyThenGo = new MutationObserver(() => {
  app = new App();
  if (app.playingScreen && isReady && !app.finalScreen && !app.waitingScreen) {
    isReady = false;
    isEnd = true;
    init();
  }
});

ifReadyThenGo.observe(app.root, {
  childList: true,
  subtree: true,
});

const playAgain = new MutationObserver(() => {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!app.playAgainButton) {
    app.playAgainButton.click();
  }
});

playAgain.observe(app.root, {
  childList: true,
  subtree: true,
});

const ifEndThenRestart = new MutationObserver(() => {
  if (app.waitingScreen && isEnd) {
    isReady = true;
    games.push(game);
    game = [];
    if (games.length%stop === 0) {
      console.log(getCsvFormat(games));      
    }
  }
});

ifEndThenRestart.observe(app.root, {
  childList: true,
  subtree: true,
});
