import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
const beat = 1000;

const gameStartDiv = document.querySelector("#gameStart");
const gameEndDiv = document.querySelector("#gameEnd");
const gameStartBtn = document.querySelector("#startBtn");
const gameWinLoseSpan = document.querySelector("#winLoseSpan");
const gameEndScoreSpan = document.querySelector("#endScoreSpan");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.timerEvent;
    this.kick;
    this.quadrants;
    this.target;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("arrow_blue", "/assets/arrow_blue.png");
    this.load.image("arrow_red", "/assets/arrow_red.png");
    this.load.image("arrow_yellow", "/assets/arrow_yellow.png");
    this.load.image("arrow_purple", "/assets/arrow_purple.png");
    this.load.audio("kick", "/assets/kick.mp3");
  }

  create() {
    this.scene.pause("scene-game");

    this.kick = this.sound.add("kick");
    this.add.image(sizes.width/2, sizes.height/2, "bg").setOrigin(0.5,  0.5);

    this.quadrants = [["arrow_blue", (sizes.width/4)*3, sizes.height/4], ["arrow_red", sizes.width/4, sizes.height/4], ["arrow_yellow", sizes.width/4, (sizes.height/4)*3], ["arrow_purple", (sizes.width/4)*3, (sizes.height/4)*3]];

    this.timerEvent = this.time.addEvent({
      delay: beat, // Delay in milliseconds (1000 ms = 1 second)
      callback: this.triggerEvent, // Callback function to be called
      callbackScope: this, // Scope of the callback function
      loop: true // Whether the event should repeat
    });

    let position = this.getRandomQuadrant();
    this.target = this.add.image(position[1], position[2], position[0]).setOrigin(0.5, 0.5);
  }

  update() {
  }

  triggerEvent() {
    this.kick.play();
    let newPosition = this.getRandomQuadrant();
    this.target.setTexture(newPosition[0]);
    this.target.setX(newPosition[1]);
    this.target.setY(newPosition[2]);
  }

  getRandomQuadrant() {
    return this.quadrants[Math.floor(Math.random() * 4)];
  }

  gameOver() {
    this.sys.game.destroy(true);
    gameWinLoseSpan.textContent = "win!"
    gameEndDiv.style.display = "flex";
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gamecanvas,
  scene:[GameScene]
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});