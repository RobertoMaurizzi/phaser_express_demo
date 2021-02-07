## Installing and running the game

For the client, Phaser is included in the code (`js/phaser.min.js` at least until I can't set up Webpack properly). You will need [npm](https://www.npmjs.com/) installed globally in your system to download the packages required for the server.
To run the server on some remote hosting, you'll have to pick one that cam host Node applications.

To test the demo application clone the repository, then inside the newly created directory, run `npm install` to install the packages listed in `package.json`.

You can then run:

  * `npm run start` to start the server on your system, on port 3000 (http://127.0.0.1:3000)
  * `npm run recreate` to recreate the asset.js file after the server is started (from another shell)

## Acknowledgements

Adapted from a PHP example written by Naveed Rehman you can find at https://github.com/naveedurrehman/PhaserAssetsLoader

Created from https://github.com/nazimboudeffa/phaser-express but only because I didn't notice it was still using Phaser2 :D
