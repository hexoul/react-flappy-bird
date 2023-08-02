import * as Phaser from "phaser";

import { assets } from "./asset";

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "FlappyBirdScene" });
  }

  preload() {
    this.load.image(assets.scene.background.day, "background-day.png");
    this.load.image(assets.scene.background.night, "background-night.png");
  }

  create() {
    return;
  }

  update(time, delta) {
    return;
  }
}

export { Game };
