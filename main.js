import './style.css'
import Phaser from 'phaser';

const sizes = {
  width: 500,
  height: 500
};

const speedDown = 300;

const gameStartDiv = document.querySelector("#gameStart");
const gameEndDiv = document.querySelector("#gameEnd");
const gameStartBtn = document.querySelector("#startBtn");
const gameWinLoseSpan = document.querySelector("#winLoseSpan");
const gameEndScoreSpan = document.querySelector("#endScoreSpan");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 100;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.woum;
    this.bgMusic;
    this.emitter;
  }

  preload(){
    this.load.image('bg', 'assets/bg.png')
    this.load.image('basket', 'assets/basket.png')
    this.load.image('arrow', 'assets/arrow.png')
    this.load.audio('coinMusic', 'assets/coin.mp3')
    this.load.audio('bgMusic', 'assets/bgMusicAri.mp3')
    this.load.image('rhythm', 'assets/circle.png')
    this.load.image('bgCircle', 'assets/bgCircle.png')
    this.load.image('arrowCircle', 'assets/arrowCircle.png')
}

  create() {
    this.scene.pause("scene-game");

    this.coinMusic = this.sound.add('coinMusic');
    this.bgMusic = this.sound.add('bgMusic');
    this.bgMusic.play();
    this.add.image(0, 0, "bg").setOrigin(0, 0);

    var circleSprite = this.add.sprite(250, 250, 'bgCircle');
    circleSprite.alpha = 1;
    circleSprite.setScale(0.01);

    var arrowSprite = this.add.sprite(250, 250, 'arrowCircle');
    arrowSprite.alpha = 1;
    arrowSprite.setScale(0.01);


    this.tweens.add({
        targets: circleSprite,  // The sprite to tween
        scaleX: 1,          // Target scale on the x-axis
        scaleY: 1,          // Target scale on the y-axis
        yoyo: false,         // Make the tween reverse after reaching the target scale
        repeat: -1,         // Repeat indefinitely
        alpha: 1,           // Target alpha value
        //x: 250,             // Target x position
        //y: 250,             // Target y position
        duration: 500,     // Duration of the tween in milliseconds
        //ease: 'Power2'      // Ease-out
    });

    this.tweens.add({
        targets: arrowSprite,  // The sprite to tween
        scaleX: 1,          // Target scale on the x-axis
        scaleY: 1,          // Target scale on the y-axis
        yoyo: false,         // Make the tween reverse after reaching the target scale
        repeat: -1,         // Repeat indefinitely
        alpha: 1,           // Target alpha value
        //x: 250,             // Target x position
        //y: 250,             // Target y position
        duration: 500,     // Duration of the tween in milliseconds
        //ease: 'Power2'      // Ease-out
    });

    this.player = this.physics.add.image(0, sizes.height - 50, "basket").setOrigin(0,  0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.player.width - this.player.width/4, this.player.height/6).setOffset(this.player.width/10, this.player.height - this.player.height/10);

    this.target = this.physics.add
        .image(0, 0, "arrow")
        .setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);
    this.target.setSize(40,40).setOffset(40, 40);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000",
    });
    this.textTime = this.add.text(10, 10, "Remaining time: 00", {
      font: "25px Arial",
      fill: "#000",
    });

    this.timedEvent = this.time.delayedCall(10000, this.gameOver, [], this);

    this.emitter = this.add.particles(0, 0, "particle", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.04,
      duration: 100,
      emitting: false
    });
    this.emitter.startFollow(this.player, this.player.width/2, this.player.height/2, true);
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Remaining time: ${Math.round(this.remainingTime).toString()}`);

    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const {left, right} = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 480);
  }

  targetHit() {
    this.coinMusic.play();
    this.emitter.start();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);
  }

  gameOver() {
    this.sys.game.destroy(true);

    if (this.points >= 5) {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "win!";
    } else {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "lose!";
    }

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
      debug: true
    }
  },
  scene:[GameScene]
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});