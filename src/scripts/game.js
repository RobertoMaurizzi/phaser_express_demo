import Phaser from 'phaser'
import { PhaserAssetsLoader_assets } from '../assets/assets.js'
import assets from '../assets.json'

class scnExample extends Phaser.Scene {
    constructor() {
        super('scnExample');
        this.controlConfig = null;
        this.controls = null;
    }

    preload() {
        //Calling the function in PhaserAssetsLoader.php?folder=assets
        // PhaserAssetsLoader_assets(this);

        // this.load.tilemapTiledJSON('map', 'assets/tilemaps/super-mario.json');
        // this.load.image('tiles', 'assets/images/mario_tiles.png');

        let scene = this
        Object.keys(assets).forEach(methodName => {
            assets[methodName].forEach(args => {
                // bitmapFont needs to rework packing and ordeer of its args
                if (methodName === 'bitmapFont') args = [args[0], args[1][1], args[1][0]]
                console.log(methodName, args.join(','))
                scene.load[methodName](...args)
            })
        })

        // game.load.tilemap('map', 'images/test11.json', null, Phaser.Tilemap.TILED_JSON);
        // game.load.image('tiles', 'images/tilesets.png');
    }

    create() {

        // tiles from phaser examples
        var map = this.make.tilemap({ key: 'TILEMAP_super_mario' });
        var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'IMAGE_mario_tiles');
        var layer = map.createLayer('World1', tileset, 0, 300);

        // Map size
        layer.width = 400;


        //Showing images
        this.add.image(250, 250, 'IMAGE_circle1');
        this.add.image(350, 350, 'IMAGE_circle2');

        //Playing spritesheet
        this.anims.create({
            key: 'animeyes',
            frames: this.anims.generateFrameNumbers('IMAGE_eyes', { start: 0, end: 8 }),
            frameRate: 9,
            repeat: -1
        });
        this.add.sprite(50, 50).play('animeyes');

        //Playing sound
        this.sound.play('AUDIO_horn');

        //Showing bitmap font
        this.add.bitmapText(100, 50, 'FONT_ninja', 'Phaser Assets Packer', 32);

        //Showing some html contents (textbox)
        this.add.dom(350, 350).createFromCache('HTML_frmName');

        var cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, layer.x + layer.width, 0);

        this.controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            speed: 0.5
        };

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(this.controlConfig);
        this.cameras.main.setBounds(0, 0, layer.x + layer.width + 3000, 0);
    }

    update (time, delta)
    {
        this.controls.update(delta);
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'divPhaser',
    dom: { createContainer: true }, //Important for HTML
    width: 800,
    height: 600,
    pixelArt: true,
    scene: scnExample,
};

var game = new Phaser.Game(config);
