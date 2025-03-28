<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Hole</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    <!-- Include your ad network SDK here -->
    <!-- Example: <script src="ad-sdk.js"></script> -->
</head>
<body>
    <div id="game-container"></div>
    <script>
        // Game configuration
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        // Initialize Phaser
        const game = new Phaser.Game(config);

        // Game variables
        let blackHole;
        let stars;
        let planets;
        let score = 0;
        let highScore = localStorage.getItem('highScore') || 0;
        let scoreText;
        let highScoreText;
        let gameOverText;

        // Preload assets (none needed, using simple graphics)
        function preload() {
            // No external assets; we use circles drawn by Phaser
        }

        // Set up the game
        function create() {
            // Reset score
            score = 0;

            // Create black hole (player-controlled)
            blackHole = this.add.circle(400, 300, 25, 0x000000); // Black circle, radius 25
            blackHole.setInteractive();
            this.input.setDraggable(blackHole);
            this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
                gameObject.x = dragX;
                gameObject.y = dragY;
            });

            // Create stars group (to eat)
            stars = this.add.group();
            for (let i = 0; i < 5; i++) {
                let star = this.add.circle(
                    Phaser.Math.Between(0, 800),
                    Phaser.Math.Between(0, 600),
                    10, // Radius 10
                    0xffffff // White
                );
                star.velocity = {
                    x: Phaser.Math.Between(-50, 50),
                    y: Phaser.Math.Between(-50, 50)
                };
                stars.add(star);
            }

            // Create planets group (to avoid)
            planets = this.add.group();
            for (let i = 0; i < 1; i++) {
                let planet = this.add.circle(
                    Phaser.Math.Between(0, 800),
                    Phaser.Math.Between(0, 600),
                    20, // Radius 20
                    0xff0000 // Red
                );
                planet.velocity = {
                    x: Phaser.Math.Between(-30, 30),
                    y: Phaser.Math.Between(-30, 30)
                };
                planets.add(planet);
            }

            // UI: Score and high score
            scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
            highScoreText = this.add.text(16, 50, 'High Score: ' + highScore, { fontSize: '32px', fill: '#fff' });

            // Game over text
            gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#fff' });
            gameOverText.setOrigin(0.5); // Center it
            gameOverText.visible = false;
        }

        // Game loop
        function update(time, delta) {
            // Move stars
            stars.children.iterate(star => {
                star.x += star.velocity.x * (delta / 1000);
                star.y += star.velocity.y * (delta / 1000);
                // Wrap around screen edges
                if (star.x < 0) star.x = 800;
                if (star.x > 800) star.x = 0;
                if (star.y < 0) star.y = 600;
                if (star.y > 600) star.y = 0;
            });

            // Move planets
            planets.children.iterate(planet => {
                planet.x += planet.velocity.x * (delta / 1000);
                planet.y += planet.velocity.y * (delta / 1000);
                // Wrap around screen edges
                if (planet.x < 0) planet.x = 800;
                if (planet.x > 800) planet.x = 0;
                if (planet.y < 0) planet.y = 600;
                if (planet.y > 600) planet.y = 0;
            });

            // Check collisions with stars
            stars.children.iterate(star => {
                if (Phaser.Math.Distance.between(blackHole.x, blackHole.y, star.x, star.y) < (blackHole.radius + star.radius)) {
                    star.destroy();
                    score += 1;
                    scoreText.setText('Score: ' + score);
                    if (score > highScore) {
                        highScore = score;
                        highScoreText.setText('High Score: ' + highScore);
                        localStorage.setItem('highScore', highScore);
                    }
                    // Spawn new star
                    let newStar = this.add.circle(
                        Phaser.Math.Between(0, 800),
                        Phaser.Math.Between(0, 600),
                        10,
                        0xffffff
                    );
                    newStar.velocity = {
                        x: Phaser.Math.Between(-50, 50),
                        y: Phaser.Math.Between(-50, 50)
                    };
                    stars.add(newStar);
                    // Chance to spawn a new planet (increases difficulty)
                    if (Math.random() < Math.min(0.1 * Math.floor(score / 10), 0.5)) {
                        let newPlanet = this.add.circle(
                            Phaser.Math.Between(0, 800),
                            Phaser.Math.Between(0, 600),
                            20,
                            0xff0000
                        );
                        newPlanet.velocity = {
                            x: Phaser.Math.Between(-30, 30),
                            y: Phaser.Math.Between(-30, 30)
                        };
                        planets.add(newPlanet);
                    }
                }
            });

            // Check collisions with planets
            planets.children.iterate(planet => {
                if (Phaser.Math.Distance.between(blackHole.x, blackHole.y, planet.x, planet.y) < (blackHole.radius + planet.radius)) {
                    gameOver.call(this);
                }
            });
        }

        // Handle game over
        function gameOver() {
            gameOverText.visible = true;
            this.input.off('drag'); // Disable dragging
            showAd(() => {
                gameOverText.visible = false;
                this.scene.restart(); // Restart the game
            });
        }

        // Placeholder for ad display
        function showAd(callback) {
            // Replace this with your ad network's code
            // For now, simulates an ad with a 2-second delay
            setTimeout(callback, 2000);
        }
    </script>
</body>
</html>
