const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
        create: create
    }
};
const game = new Phaser.Game(config);

function create() {
    this.add.text(400, 300, 'Space Hole Works!', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
}
