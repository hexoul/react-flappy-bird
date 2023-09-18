export const assets = {
  bird: "bird",
  obstacle: {
    pipe: {
      green: {
        top: "pipe-green-top",
        bottom: "pipe-green-bottom",
      },
      red: {
        top: "pipe-red-top",
        bottom: "pipe-red-bo",
      },
    },
  },
  scene: {
    width: 144,
    background: {
      day: "background-day",
      night: "background-night",
    },
    ground: "ground",
    gameOver: "game-over",
    guide: "guide-text",
    restart: "restart-button",
    messageInitial: "message-initial",
  },
  scoreboard: {
    width: 25,
    base: "number",
    number0: "number0",
    number1: "number1",
    number2: "number2",
    number3: "number3",
    number4: "number4",
    number5: "number5",
    number6: "number6",
    number7: "number7",
    number8: "number8",
    number9: "number9",
  },
  animation: {
    bird: {
      clapWings: "clap-wings",
      stop: "stop",
    },
    ground: {
      moving: "moving-ground",
      stop: "stop-ground",
    },
  },
  audio: {
    flap: "flap",
    groundHit: "ground-hit",
    pipeHit: "pipe-hit",
    ouch: "ouch",
    score: "score",
  },
};

export const preload = (load) => {
  // Backgrounds and ground
  load.image(assets.scene.background.day, "background-day.png");
  load.image(assets.scene.background.night, "background-night.png");
  load.spritesheet(assets.scene.ground, "ground-sprite.png", {
    frameWidth: 336,
    frameHeight: 112,
  });

  // Pipes
  load.image(assets.obstacle.pipe.green.top, "pipe-green-top.png");
  load.image(assets.obstacle.pipe.green.bottom, "pipe-green-bottom.png");
  load.image(assets.obstacle.pipe.red.top, "pipe-red-top.png");
  load.image(assets.obstacle.pipe.red.bottom, "pipe-red-bottom.png");

  // Start game
  load.image(assets.scene.messageInitial, "message-initial.png");

  // End game
  load.image(assets.scene.gameOver, "gameover.png");
  load.image(assets.scene.guide, "guide-text.png");
  load.image(assets.scene.restart, "restart-button.png");

  // Bird
  load.spritesheet(assets.bird, "bird-sprite.png", {
    frameWidth: 34,
    frameHeight: 24,
  });

  // Numbers
  load.image(assets.scoreboard.number0, "number0.png");
  load.image(assets.scoreboard.number1, "number1.png");
  load.image(assets.scoreboard.number2, "number2.png");
  load.image(assets.scoreboard.number3, "number3.png");
  load.image(assets.scoreboard.number4, "number4.png");
  load.image(assets.scoreboard.number5, "number5.png");
  load.image(assets.scoreboard.number6, "number6.png");
  load.image(assets.scoreboard.number7, "number7.png");
  load.image(assets.scoreboard.number8, "number8.png");
  load.image(assets.scoreboard.number9, "number9.png");

  // Audio
  load.audio(assets.audio.flap, "flap.wav");
  load.audio(assets.audio.groundHit, "ground-hit.wav");
  load.audio(assets.audio.pipeHit, "pipe-hit.wav");
  load.audio(assets.audio.ouch, "ouch.wav");
  load.audio(assets.audio.score, "score.wav");
};
