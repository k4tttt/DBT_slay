import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 1440,
  height: 816
};
let beat = 1000;
let bpm = 60;

const gameStartDiv = document.querySelector("#gameStart");
const gameEndDiv = document.querySelector("#gameEnd");
const gameStartBtn = document.querySelector("#startBtn");
const gameWinLoseSpan = document.querySelector("#winLoseSpan");
const gameEndScoreSpan = document.querySelector("#endScoreSpan");

// Access the slider element
const slider = document.getElementById("slider");
// Access the element to display the slider value
const sliderValue = document.getElementById("sliderValue");

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
    this.load.image('redCircle', 'assets/redCircle.png')
    this.load.image('blueCircle', 'assets/blueCircle.png')
    this.load.image('yellowCircle', 'assets/yellowCircle.png')
    this.load.image('purpleCircle', 'assets/purpleCircle.png')
    this.load.image('arrow', 'assets/arrowEmpty.png')
    this.load.image('smoke', 'assets/smoke.png')

  }

  create() {
    this.scene.pause("scene-game");

    this.kick = this.sound.add("kick");
    this.add.image(0, 0, "bg").setOrigin(0,  0);

    this.quadrants = [['blueCircle', (sizes.width/4)*3, sizes.height/4], ['redCircle', sizes.width/4, sizes.height/4], ['yellowCircle', sizes.width/4, (sizes.height/4)*3], ['purpleCircle', (sizes.width/4)*3, (sizes.height/4)*3]];

    // Inside the slider event listener
    slider.addEventListener("input", () => {
        // Update the value displayed next to the slider
        sliderValue.textContent = slider.value;
        // Update your variable with the slider value
        bpm = parseInt(slider.value); // Convert the value to an integer if needed
        beat = Math.round(60000 / bpm); // Calculate the new beat value
        console.log("Beat (ms) updated:", beat);

        // Check if timerEvent is defined before destroying it
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }

        // Recreate the timer event with the updated delay
        this.timerEvent = this.time.addEvent({
            delay: beat,
            callback: this.triggerEvent,
            callbackScope: this,
            loop: true
        });
    });

    let position = this.getRandomQuadrant();
    this.target = this.add.image(position[1], position[2], position[0]).setOrigin(0.5, 0.5);

    var circleSprite = this.add.sprite(sizes.width/2, sizes.height/2, 'smoke').setOrigin(0.5, 0.5);
    circleSprite.alpha = 1;
    circleSprite.setScale(0.001);

    this.tweens.add({
        targets: circleSprite,  // The sprite to tween
        scaleX: 4,          // Target scale on the x-axis
        scaleY: 4,          // Target scale on the y-axis
        yoyo: false,         // Make the tween reverse after reaching the target scale
        repeat: -1,         // Repeat indefinitely
        alpha: 1,           // Target alpha value
        //x: 250,             // Target x position
        //y: 250,             // Target y position
        duration: beat,     // Duration of the tween in milliseconds
        //ease: 'Power2'      // Ease-out
    });

  }

  update() {
  }

  triggerEvent() {
    this.kick.play();
    let newPosition = this.getRandomQuadrant();
    this.target.setX(newPosition[1]);
    this.target.setY(newPosition[2]);
    this.target.setTexture(newPosition[0]);
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

