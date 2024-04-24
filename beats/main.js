import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 1440,
  height: 816
};

const speedDown = 400;

const gameStartDiv = document.querySelector("#gameStart");
const gameEndDiv = document.querySelector("#gameEnd");
const gameStartBtn = document.querySelector("#startBtn");
const gameWinLoseSpan = document.querySelector("#winLoseSpan");
const gameEndScoreSpan = document.querySelector("#endScoreSpan");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.timedEvent;
    this.remainingTime;
    this.prevTime;
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
    this.add.image(0, 0, "bg").setOrigin(0,  0);

    this.quadrants = [["arrow_blue", (sizes.width/4)*3, sizes.height/4], ["arrow_red", sizes.width/4, sizes.height/4], ["arrow_yellow", sizes.width/4, (sizes.height/4)*3], ["arrow_purple", (sizes.width/4)*3, (sizes.height/4)*3]];
    console.log(this.quadrants);
    console.log(this.quadrants[0]);
    console.log(this.quadrants[0][0]);

    this.timedEvent = this.time.delayedCall(10000, this.gameOver, [], this);
    this.prevTime = Math.round(this.timedEvent.getRemainingSeconds());

    let position = this.getRandomQuadrant();
    this.target = this.add.image(position[1], position[2], position[0]).setOrigin(0.5, 0.5);
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();

    if (Math.round(this.remainingTime) < this.prevTime) {
      this.kick.play();
      this.prevTime = Math.round(this.remainingTime);

      let newPosition = this.getRandomQuadrant();

      this.target.setX(newPosition[1]);
      this.target.setY(newPosition[2]);
      this.target.setTexture(newPosition[0]);
    }
  }

  getRandomQuadrant() {
    return this.quadrants[Math.floor(Math.random() * 4)];
  }

  gameOver() {
    this.sys.game.destroy(true);

    /*
    if (this.points >= 20) {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "win!";
    } else {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "lose!";
    }*/
    gameWinLoseSpan.textContent = "win!"

    gameEndDiv.style.display = "flex";
  }
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
      debug: false
    }
  },
  scene:[GameScene]
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});