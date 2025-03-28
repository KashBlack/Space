const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [MenuScene, GameScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }
};
const game = new Phaser.Game(config);

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }
    create() {
        this.add.text(400, 200, 'Space Hole', { fontSize: '64px', color: '#fff' }).setOrigin(0.5);
        const playButton = this.add.text(400, 400, 'Play', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerdown', () => this.scene.start('GameScene'));
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    preload() {}
    create() {
        this.score = 0;
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '24px', color: '#fff' });
        this.blackHole = this.add.circle(400, 300, 20, 0x000000);
        this.blackHole.setInteractive();
        this.input.setDraggable(this.blackHole);
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.stars = this.add.group();
        this.planets = this.add.group();
        this.spawnObjects();
        this.time.addEvent({ delay: 2000, callback: this.spawnObjects, callbackScope: this, loop: true });
    }
    update() {
        this.stars.getChildren().forEach(star => {
            if (this.checkCollision(this.blackHole, star)) {
                star.destroy();
                this.score += 1;
                this.scoreText.setText(`Score: ${this.score}`);
            }
        });
        this.planets.getChildren().forEach(planet => {
            if (this.checkCollision(this.blackHole, planet)) {
                this.scene.start('GameOverScene', { score: this.score });
            }
        });
    }
    spawnObjects() {
        for (let i = 0; i < 2 + Math.floor(this.score / 5); i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            this.stars.create(x, y, null, null).setCircle(10, 0xffffff);
        }
        if (Phaser.Math.Between(0, 100) < 20 + this.score) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            this.planets.create(x, y, null, null).setCircle(30, 0xff0000);
        }
    }
    checkCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.width / 2 + obj2.width / 2);
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }
    create(data) {
        this.add.text(400, 200, 'Game Over', { fontSize: '64px', color: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, `Score: ${data.score}`, { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
        const playAgainButton = this.add.text(400, 400, 'Play Again', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
        playAgainButton.setInteractive();
        playAgainButton.on('pointerdown', () => {
            console.log('Show interstitial ad here');
            this.scene.start('GameScene');
        });
    }
}