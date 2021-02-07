class scnExample extends Phaser.Scene {
    constructor() {
        super('scnExample');
    }

    preload() {
        //Calling the function in PhaserAssetsLoader.php?folder=assets
        PhaserAssetsLoader_assets(this);
    }

    create() {

        //Showing images
        this.add.image(250, 250, 'IMAGE_CIRCLE1');
        this.add.image(350, 350, 'IMAGE_CIRCLE2');

        //Playing spritesheet
        this.anims.create({
            key: 'animeyes',
            frames: this.anims.generateFrameNumbers('spteyes', { start: 0, end: 8 }),
            frameRate: 9,
            repeat: -1
        });
        this.add.sprite(50, 50).play('SPRITE_EYES');

        //Playing sound
        this.sound.play('AUDIO_HORN');

        //Showing bitmap font
        this.add.bitmapText(100, 50, 'FONT_NINJA', 'Phaser Assets Packer', 32);

        //Showing some html contents (textbox)
        this.add.dom(350, 350).createFromCache('HTML_FRMNAME');

    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'divPhaser',
    dom: { createContainer: true }, //Important for HTML
    width: 500,
    height: 500,
    scene: scnExample,

};

var game = new Phaser.Game(config);
