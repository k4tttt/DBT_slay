import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 774,
  height: 500
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("bar", "/assets/bar.png");
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0,  0);
    this.player = this.add.image(0, sizes.height - 50, "bar").setOrigin(0,  0);
  }

  update() {}
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gamecanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y:speedDown},
      debug: true
    }
  },
  scene:[GameScene]
};

const game = new Phaser.Game(config);