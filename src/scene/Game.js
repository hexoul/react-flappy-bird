import * as Phaser from "phaser";

import { assets, preload } from "./asset";

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "FlappyBirdScene" });
  }

  preload() {
    preload(this.load);
  }

  create() {
    const moveBird = this._moveBird.bind(this);
    this.backgroundDay = this.add
      .image(assets.scene.width, 256, assets.scene.background.day)
      .setInteractive();
    this.backgroundDay.on("pointerdown", moveBird);
    this.backgroundNight = this.add
      .image(assets.scene.width, 256, assets.scene.background.night)
      .setInteractive();
    this.backgroundNight.visible = false;
    this.backgroundNight.on("pointerdown", moveBird);

    this.gapsGroup = this.physics.add.group();
    this.pipesGroup = this.physics.add.group();
    this.scoreboardGroup = this.physics.add.staticGroup();

    this.ground = this.physics.add.sprite(
      assets.scene.width,
      458,
      assets.scene.ground
    );
    this.ground.setCollideWorldBounds(true);
    this.ground.setDepth(10);

    this.messageInitial = this.add.image(
      assets.scene.width,
      156,
      assets.scene.messageInitial
    );
    this.messageInitial.setDepth(30);
    this.messageInitial.visible = false;

    this.upButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    );

    // Ground animations
    this.anims.create({
      key: assets.animation.ground.moving,
      frames: this.anims.generateFrameNumbers(assets.scene.ground, {
        start: 0,
        end: 2,
      }),
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: assets.animation.ground.stop,
      frames: [{ key: assets.scene.ground, frame: 0 }],
      frameRate: 20,
    });

    // Bird animations
    this.anims.create({
      key: assets.animation.bird.clapWings,
      frames: this.anims.generateFrameNumbers(assets.bird, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: assets.animation.bird.stop,
      frames: [{ key: assets.bird, frame: 1 }],
      frameRate: 20,
    });

    this._prepareGame();

    this.gameOverBanner = this.add.image(
      assets.scene.width,
      206,
      assets.scene.gameOver
    );
    this.gameOverBanner.setDepth(20);
    this.gameOverBanner.visible = false;

    this.restartButton = this.add
      .image(assets.scene.width, 300, assets.scene.restart)
      .setInteractive();
    this.restartButton.on("pointerdown", this._restartGame.bind(this));
    this.restartButton.setDepth(20);
    this.restartButton.visible = false;
  }

  update(time, delta) {
    if (this.gameOver || !this.gameStarted) return;

    if (this.framesMoveUp > 0) {
      this.framesMoveUp--;
    } else if (Phaser.Input.Keyboard.JustDown(this.upButton)) {
      this._moveBird();
    } else {
      this.player.setVelocityY(200);
      if (this.player.angle < 90) this.player.angle += 1;
    }

    const pipeVelocityX = -140;
    this.pipesGroup.children.iterate((child) => {
      if (child === undefined) return;

      if (child.x < -50) child.destroy();
      else child.setVelocityX(pipeVelocityX);
    });

    this.gapsGroup.children.iterate((child) => {
      child.body.setVelocityX(pipeVelocityX);
    });

    this.nextPipes++;
    if (this.nextPipes === 130) {
      this._makePipes();
      this.nextPipes = 0;
    }
  }

  _prepareGame() {
    this.framesMoveUp = 0;
    this.nextPipes = 0;
    this.currentPipe = assets.obstacle.pipe.green;
    this.score = 0;
    this.gameOver = false;
    this.backgroundDay.visible = true;
    this.backgroundNight.visible = false;
    this.messageInitial.visible = true;

    this.player = this.scene.scene.physics.add.sprite(60, 265, assets.bird);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play(assets.animation.bird.clapWings, true);
    this.player.body.allowGravity = false;

    const hitBird = this._hitBird.bind(this);
    this.scene.scene.physics.add.collider(
      this.player,
      this.ground,
      hitBird,
      null
    );
    this.scene.scene.physics.add.collider(
      this.player,
      this.pipesGroup,
      hitBird,
      null
    );

    this.scene.scene.physics.add.overlap(
      this.player,
      this.gapsGroup,
      this._updateScore.bind(this),
      null
    );

    this.ground.anims.play(assets.animation.ground.moving, true);
  }

  _startGame() {
    this.gameStarted = true;
    this.messageInitial.visible = false;

    const score0 = this.scoreboardGroup.create(
      assets.scene.width,
      30,
      assets.scoreboard.number0
    );
    score0.setDepth(20);

    this._makePipes();
  }

  _restartGame() {
    this.pipesGroup.clear(true, true);
    this.gapsGroup.clear(true, true);
    this.scoreboardGroup.clear(true, true);
    this.player.destroy();
    this.gameOverBanner.visible = false;
    this.restartButton.visible = false;

    this._prepareGame();

    this.scene.scene.physics.resume();
  }

  _moveBird() {
    if (this.gameOver) return;

    if (!this.gameStarted) {
      this._startGame();
    }

    this.player.setVelocityY(-270);
    this.player.angle = -20;
    this.framesMoveUp = 8;
  }

  _hitBird() {
    this.scene.scene.physics.pause();

    this.gameOver = true;
    this.gameStarted = false;

    this.player.anims.play(assets.animation.bird.stop);
    this.ground.anims.play(assets.animation.ground.stop);

    this.gameOverBanner.visible = true;
    this.restartButton.visible = true;
  }

  _makePipes() {
    if (!this.gameStarted || this.gameOver) return;

    const pipeTopY = Phaser.Math.Between(-120, 120);

    const x = 288;
    const gap = this.scene.scene.add.line(x, pipeTopY + 210, 0, 0, 0, 98);
    this.gapsGroup.add(gap);
    gap.body.allowGravity = false;
    gap.visible = false;

    const pipeTop = this.pipesGroup.create(x, pipeTopY, this.currentPipe.top);
    pipeTop.body.allowGravity = false;

    const pipeBottom = this.pipesGroup.create(
      x,
      pipeTopY + 420,
      this.currentPipe.bottom
    );
    pipeBottom.body.allowGravity = false;
  }

  _updateScore(_, gap) {
    this.score++;
    gap.destroy();

    if (this.score % 10 === 0) {
      this.backgroundDay.visible = !this.backgroundDay.visible;
      this.backgroundNight.visible = !this.backgroundNight.visible;

      if (this.currentPipe === assets.obstacle.pipe.green) {
        this.currentPipe = assets.obstacle.pipe.red;
      } else {
        this.currentPipe = assets.obstacle.pipe.green;
      }
    }

    this._updateScoreboard();
  }

  _updateScoreboard() {
    this.scoreboardGroup.clear(true, true);

    const scoreStr = this.score.toString();
    if (scoreStr.length === 1) {
      this.scoreboardGroup
        .create(assets.scene.width, 30, assets.scoreboard.base + this.score)
        .setDepth(10);
      return;
    }

    let initialPosition =
      assets.scene.width - (scoreStr.length * assets.scoreboard.width) / 2;

    for (const score of scoreStr) {
      this.scoreboardGroup
        .create(initialPosition, 30, assets.scoreboard.base + score)
        .setDepth(10);
      initialPosition += assets.scoreboard.width;
    }
  }
}

export { Game };
