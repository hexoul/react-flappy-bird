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
    this.backgroundDay = this.add
      .image(assets.scene.width, 256, assets.scene.background.day)
      .setInteractive();
    this.backgroundDay.on("pointerdown", this._moveBird.bind(this));
    this.backgroundNight = this.add
      .image(assets.scene.width, 256, assets.scene.background.night)
      .setInteractive();
    this.backgroundNight.visible = false;
    this.backgroundNight.on("pointerdown", this._moveBird.bind(this));

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
    return;
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

    this.scene.scene.physics.add.collider(
      this.player,
      this.ground,
      this._hitBird.bind(this),
      null,
      this.scene
    );
    this.scene.scene.physics.add.collider(
      this.player,
      this.pipesGroup,
      this._hitBird.bind(this),
      null,
      this.scene
    );

    this.scene.scene.physics.add.overlap(
      this.player,
      this.gapsGroup,
      this._updateScore.bind(this),
      null,
      this.scene
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

  _restartGame() {}

  _moveBird() {
    if (this.gameOver) {
      return;
    }

    if (!this.gameStarted) {
      this._startGame();
    }

    this.player.setVelocityY(-400);
    this.player.angle = -15;
    this.framesMoveUp = 5;
  }

  _hitBird() {}

  _updateScore() {}

  _makePipes() {
    if (!this.gameStarted || this.gameOver) return;

    const pipeTopY = Phaser.Math.Between(-120, 120);

    const gap = this.scene.scene.add.line(288, pipeTopY + 210, 0, 0, 0, 98);
    this.gapsGroup.add(gap);
    gap.body.allowGravity = false;
    gap.visible = false;

    const pipeTop = this.pipesGroup.create(288, pipeTopY, this.currentPipe.top);
    pipeTop.body.allowGravity = false;

    const pipeBottom = this.pipesGroup.create(
      288,
      pipeTopY + 420,
      this.currentPipe.bottom
    );
    pipeBottom.body.allowGravity = false;
  }
}

export { Game };