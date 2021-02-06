var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('dude', 'assets/sprites/phaser-dude.png');

}

function create() {

    //  This simply creates a sprite using the mushroom image we loaded above and positions it at 200 x 200
    var test = game.add.sprite(this.world.centerX, this.world.centerY, 'dude');

}
