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

let isReady = true;
let isEnd = false;

let app = new App();

let game = [];
const games = [];

// PRACTICAL FUNCTIONS

function isTextContentNotNull(element) {
  return element.childNodes[2].textContent !== '';
}

function getElementExtension(element) {
  return element.src.split('/').pop().split('.')[0];
}

function getCsvFormat(arrs) {
  const res = [];
  arrs.forEach((arr) => {
    res.push(arr.join(','));
  });
  return res.join('\n');
}

function init() {
  const player = new Player();
  let enemy = new Enemy();

  // RESET PLAYER EVENT HANDLERS

  player.rock.onclick = null;
  player.paper.onclick = null;
  player.scissors.onclick = null;

  // EVENT HANDLERS PLAYER & ENEMY CHOICES

  player.rock.onclick = () => {
    if (
      isTextContentNotNull(player.paper) && isTextContentNotNull(player.scissors)
    ) {
      game.push('rock');
    }
  };

  player.paper.onclick = () => {
    if (
      isTextContentNotNull(player.rock) && isTextContentNotNull(player.scissors)
    ) {
      game.push('paper');
    }
  };

  player.scissors.onclick = () => {
    if (
      isTextContentNotNull(player.rock) && isTextContentNotNull(player.paper)
    ) {
      game.push('scissors');
    }
  };

  const enemyMakeChoice = new MutationObserver(() => {
    enemy = new Enemy();
    if (enemy.rock.tagName === 'IMG') {
      game.push(getElementExtension(enemy.rock));
    } else if (enemy.paper.tagName === 'IMG') {
      game.push(getElementExtension(enemy.paper));
    } else if (enemy.scissors.tagName === 'IMG') {
      game.push(getElementExtension(enemy.scissors));
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

const ifEndThenRestart = new MutationObserver(() => {
  if (app.waitingScreen && isEnd) {
    isReady = true;
    games.push(game);
    game = [];
    console.log(getCsvFormat(games));
  }
});

ifEndThenRestart.observe(app.root, {
  childList: true,
  subtree: true,
});
