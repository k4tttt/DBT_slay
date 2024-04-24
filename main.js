import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 800,
  height: 600,
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.tweensArray = [];
    this.currentImageIndex = 0;
    this.imageOrder = ['bild1', 'bild2', 'bild3', 'bild4']; // Ordning för bilderna
  }

  preload() {
    this.load.image('bg', 'bakgrund.png');
    this.load.image("bild1", "bild1.png");
    this.load.image("bild2", "bild2.png");
    this.load.image("bild3", "bild3.png");
    this.load.image("bild4", "bild4.png");
    // Ladda de andra bilderna här
  }

  create() {
    const background = this.add.image(sizes.width / 2, sizes.height / 2, "bg");
    background.setSize(sizes.width, sizes.height); 

    // Skapa en grupp för bilderna
    this.imageGroup = this.add.group();

    // Skapa en timeout för att kontrollera när varje bild visas
    this.timeout = setInterval(() => {
      const imageName = this.imageOrder[this.currentImageIndex % this.imageOrder.length];
      this.createTweenedImage(imageName, background);
      this.currentImageIndex++;
    }, 5000); // Visa en ny bild var 5 sekund
  }

  update() {
    // Uppdateringslogik här
  }

  createTweenedImage(imageName, background) {
    // Hämta en slumpmässig fyrkant att placera bilden i
    const randomSquareIndex = Phaser.Math.Between(0, 3);
    const squarePositions = [
      { x: 100, y: 100 }, // Övre vänstra hörnet
      { x: sizes.width - 100, y: 100 }, // Övre högra hörnet
      { x: 100, y: sizes.height - 100 }, // Nedre vänstra hörnet
      { x: sizes.width - 100, y: sizes.height - 100 } // Nedre högra hörnet
    ];
    const squarePosition = squarePositions[randomSquareIndex];

    // Skapa en bild och sätt dess storlek till 0 för att börja med
    const image = this.add.image(squarePosition.x, squarePosition.y, imageName).setScale(0);

    // Lägg till bilden i gruppen
    this.imageGroup.add(image);

    // Skapa en tween för att gradvis öka storleken på bilden till dess fulla storlek på 4 sekunder
    const tween = this.tweens.add({
      targets: image,
      scale: 1,
      duration: 4000,
      ease: 'Linear',
      onComplete: () => {
        // Ta bort bilden och tweenet när det är klart
        image.destroy();
        tween.remove();
      }
    });

    // Lägg till tween till arrayen
    this.tweensArray.push(tween);

    // Kontrollera om det finns fler än en bild i arrayen
    if (this.tweensArray.length > 1) {
      // Ta bort den äldsta tweenen och bilden när en ny bild skapas för att endast visa en åt gången
      this.tweensArray.shift().stop();
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
