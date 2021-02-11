Expanded Phaser ES6 template with Express
=========================================


Introduction
------------

This template project a merge mainly of https://github.com/yandeu/phaser-project-template-es6 and a very old
"Phaser with Express" template (https://github.com/nazimboudeffa/phaser-express)

This 'experiment' was started because of a post on Facebook mentioning the lack of an easy solution to add
existing assets to a Phaser game without having to write boilerplate code to load them.

Naveed Rehman posted an example solution with a PHP server serving a JS file dynamically created from what
asset files were available in the ./assets folder but many people weren't happy because
they don't have PHP knowledge and don't like to pick it up and would prefer "something based on Node/Express"
so they could use the same language and knowledge as Phaser "also on the server"

So I went and rewrote his script in Javascript with the idea of doing the same he did inside an Express
server: that way I could write my code in the `public/` folder and have my assets automatically loaded every
time I started the server or launched a refresh command...

But what about importing other JS modules? Axios for REST? Socket.io for direct communication? What about the
megabytes of code that will be on my disk in JS files, potentially served to browsers even if I use only 1 function
of a JS package that's 13 MB? What if I want to package it as an Electron or Android application?
This wasn't the better approach if I wanted to have a game written with modern Javascript and JS libraries and
able to run almost everywhere.

OK, so what do we need exactly?
-------------------------------

Unfortunately *it's not quite that simple*: we first need to learn the difference between what is called
frontend (i.e. that runs inside the players' browser) and what is called server (or backend: the program
that allows a browser to actually download the JS code and the other assets that make up the game).

You **need** a server to serve those file because browsers refuse to execute Javascript from the local
file system for very valid security reasons.

The nice thing about Phaser however is that you can use *any* HTTP server able to serve files to serve
your games, no need for Node/Express, PHP/Laravel, Python/Django.

So you still need a way to serve your game's files while you're developing: of course you can run a
server in any language and Phaser has been designed to help you in this without many further complications:
download the library on your disk, write your index.html page that loads Phaser and contains your game code,
serve it with a minimal HTTP server (my favorite: run `python3 -m http.server 8080` in your gane files' directory)
and you're done: no "advanced JS" but it works(tm) without the typical JS madness so common nowadays.

Part of that same madness has actually been introduced to "help" making sense of all that complexity, especially
during the time when you had to worry about numerous incompatible browser programs all supporting different version
of the Javascript "standard" that thanks to commercial wars and slowpoke committees had become a veritable *madhouse*,
more complex than setting up a C/C++ development environment on OS/2 in 1992 (believe me, I've done both).

While there are many tools that help during development (all written in JS and running in Node) the most
popular and rich in plugins and information on the web (*cough* StackExchange *cough*) is Webpack. That's
what the most popular JS web application frameworks are currently using for their setup tools and so,
even if it's far from the simplest or nicest, it's likely you'll (have to learn and) use it at work for
other "webdev" efforts. React and Vue (and the quite amazing Vue-based Quasar) all use it.

With Webpack when you need to pre-process files that will become part of your final application you use a
Webpack plugin, so I searched to see if somebody had written one to manage Phaser 3 assets and (of course?) I found
one: https://github.com/laineus/phaser-assets-webpack-plugin

At this point I changed my direction: instead of (or, in addition to) having a Node/Express setup able to
pre-process my assets and serve the game demo, I wanted a Webpack-powered development system that would allow me
to do that AND also easily add more libraries, process my code so that it can run on old browsers,
cleanup the code so that it's smaller (and obfuscate it too) and eventually enable me to add other functionality
like image optimization, application packaging and more.


What's in the package
---------------------

In this template you have the following directories:

  * `src/`: it contains your code. You can use `import` and you can import JS and css files installed
    with `npm install`. You normally edit files and add assets etc. here, and if you run the Webpack dev
    server (see below) they'll be processed and served on http://localhost:8080 with so-called hot-reload
    (if you save a file, your browser page ~~will~~ should reload automatically and only for the parts
    you changed).  When you want to 'ship' a version of your game, Webpack's `build` command will create
    an optimized 'production' version of the game inside...
  * `dist/`: contains the 'final' version of the game, with the code transpiled to a more compatible
    version of JS, packed together few files instead of one per module, minified, obfuscated, with assets
    copied over from `src/assets` , with the JSON file describing them and possibly more things like image
    optimization if you add other Webpack plugins.
    This is the directory you can upload to a hosting provider to have them serve your game to players over
    the internet
  * `webpack/`: contains Webpack's configuration files
  * `express/`: contains a server.js that creates a very simple web server that will serve your game from
    the `dist` folder on http://localhost:3000 . This is the directory where you might want to add more code to
    implement a server side leaderboard, player chat, multiplayer and other "game server" functionality.
  * `package.json`: describes what's inside this directory: the name of the project, version, its authors,
    webpages, what commands it can accept, what are the necessary *dependencies* to develop and build it,
    configurations for additional Javascript dev utilities and possibly more.
  * `node_modules`: contains all the Javascript modules the game is using, like Phaser itself, plus Express
    and of course all their dependencies, that can be [quite a lot...][1]

[1]: <https://raw.githubusercontent.com/RobertoMaurizzi/phaser_express_demo/master/src/assets/images/node_modules.jpg> "heaviest things in the universe"

Wait a second... it's :8080 or :3000?
-------------------------------------

Well... it depends. If you're developing the game, you should run Webpack development server with `npm run dev`
so that you can load your game in a browser, debug it seeing non-minified JS code and have your assets updated
when you change or add one. This Dev Web server runs on http://localhost:8080

If you've already built your game with `npm run build` you can serve it on your computer and maybe your local
network by running `npm run express`. Like you could with any other local webserver you might run on your
computer if it's able to serve the `dist` directory. This is only marginally useful *unless* you get serious
and add server-side functions to your game that connect to that Express server: in that case *the code in*
*your game will connect to, for example,* `http://localhost/api` *and read data, or send high scores* to the
Node/Express code you've written in `express/server.js` or other files in that directory.
Other files or modules that, this being a server application running Node, you'll have to make available to
your code using `require()` instead of `import`, *because Javascript ecosystem madhouse*
That's the reason Phaser uses `require()` in its code: it needs to be able to run on a Node server so you can
write game servers that run synchronized games.

Install it all
--------------

Node, Webpack and much of the tooling of the aforementioned 'Javascript *madhouse*' run using Node, a command
line implementation of the Javascript virtual machine that also powers Chrome, called V8. Node also enable us to
search, install into our project and update Javascript libraries that we need for our game.

If things in JS were sane, you could [install Node from here][2] picking the LTS version... but I'm still using
the *previous* LTS version 12.x *because work reasons*. If you download the LTS and nothing works, it's probably
because they released a new and shiny version that broke compatibility with some older piece of software that
has been included here.

[2]: <https://nodejs.org/en/download/>

Since this is a template I've already set up the necessary configuration (actually, @yandeu did most of it) after
Node is installed you can directly try to install all the dependencies then "run it" (see below).

Running it
----------

To test the demo application clone the repository, then inside the newly created directory, run `npm install`
to install the packages listed in `package.json`.

You can then run:

  * `npm run serve` to start the local Webpack Development server that will, in one go, pre-process your JS, serve
                  your game and update everything every time you change your code or change/rename/create a new asset

  * `npm run build` to process and package all files from `src/` into `dist`. This `dist` folder can be uploaded as is
                  on any remote server able to serve HTTP files. No Node support required (or PHP or...)

  * `npm run start` to start the server on your system, on port 3000 (http://127.0.0.1:3000)
  * `npm run recreate` to recreate the asset.js file after the server is started (from another shell)

More details
------------

### webpack configuration files

Webpack is a Node application composed by a main program plus many (many many many) plugins. Its configuration is
usually a Javascript file called `webpack.js` but in this template it was chosen to split it in multiple file,
mostly because we want to do different things to the file depending on if we're still working on the game
(development) or we're ready to ship a final version for our users (production). There is a common file that,
based on the use of the code it runs on, will include the dev or production file.

### phaser-assets-webpack-plugin

The configuration for the plugin is in the `webpack/webpack.common.js` file and it looks like this:

```javascript
    plugins: [
        new PhaserAssetsWebpackPlugin(
            [
                { type: 'image', prefix: 'IMAGE_', dir: 'assets/images', rule: /^\w+\.(png|jpg|jpeg)$/ },
                { type: 'image', prefix: 'IMAGE_', dir: 'assets/images/more', rule: /^\w+\.(png|jpg|jpeg)$/ },
                { type: 'audio', prefix: 'AUDIO_', dir: 'assets/audio', rule: /^\w+\.(mp3|m4a|ogg)$/ },
                { type: 'html', prefix: 'HTML_', dir: 'assets/htmls', rule: /^\w+\.(html|htm)$/ },
                { type: 'bitmapFont', prefix: 'FONT_', dir: 'assets/fonts', rule: /^\w+\.(fnt|png)$/ },
                { type: 'tilemapTiledJSON', prefix: 'TILEMAP_', dir: 'assets/tilemaps', rule: /^\w+\.(json)$/ },
                { type: 'tilemapTiledJSON', prefix: 'TILEMAP_', dir: 'assets/tilemaps/test_tilemap/tiled/', rule: /^\w+\.(json)$/ },
            ],
            { documentRoot: './src', output: './src/assets.json' }
        ),
        ...,
        ...
    ]
```

The summary of it is that you tell it which type of file (has to match Phaser's load function) you can find in
which directory, which prefix the loaded assets should use and the file mask for the files for each assets as a
regular expression. The example is taken almost straight from the docs, adding support for `bitmapFont` and
`tilemapTiledJSON`. Keep in mind that `\w` selects WORDS, not anything (`_` is part of a word, `-` isn't. Use `.*`
instead of `\w+` if you want to match any file name).

Loading assets during `preload()` also became a bit more complicated than in the official doc nut it's still
a single loop:

```javascript
    let scene = this
    Object.keys(assets).forEach(methodName => {
        assets[methodName].forEach(args => {
            // bitmapFont needs to rework packing and ordeer of its args
            if (methodName === 'bitmapFont') args = [args[0], args[1][1], args[1][0]]
            // open the browser's console to check the assets' names
            console.log(methodName, args.join(','))
            scene.load[methodName](...args)
        })
    })

```

Acknowledgements
----------------

Javascript import code in `assets.js` adapted from a PHP example written by Naveed Rehman you can find at https://github.com/naveedurrehman/PhaserAssetsLoader

Express support taken from https://github.com/nazimboudeffa/phaser-express

Transformed in a Webpack-enable system by merging the template at https://github.com/yandeu/phaser-project-template-es6
