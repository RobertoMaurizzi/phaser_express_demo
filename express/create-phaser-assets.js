const path = require('path')
const fs = require('fs');
const fg = require('fast-glob')

function createPhaserAssets(assetsRootFolder = 'assets', jsOutputFile = './dist/assets/assets.js', public = 'src/') {

    const assetTypes = {
        image: ["png", "jpg", "jpeg"],
        audio: ['mp3', 'wav', 'ogg'],
        font: ['fnt'],
        html: ['html', 'htm']
    }

    const assetExtensions = [...assetTypes.image, ...assetTypes.audio, ...assetTypes.font, ...assetTypes.html]

    const assetIntroComments = {
        image: '/* Loading Images */',
        spritesheet: '/* Loading Sprite Sheets */',
        audio: '/* Loading Audio */',
        font: '/* Loading Fonts */',
        html: '/* Loading HTML */'
    }

    console.log("Scanning for: " + public + assetsRootFolder + "/**/*.{" + assetExtensions.join(",") + "}\n")

    let assets = fg.sync(public + assetsRootFolder + "/**/*.{" + assetExtensions.join(",") + "}", { braceExpansion: true })

    let sorter = {}

    assets.forEach(file =>
        {
            let fileparts = path.parse(file)
            let ext = fileparts.ext.slice(1)
            let assetType = Object.keys(assetTypes).filter(k => assetTypes[k].includes(ext))
            if (sorter[assetType] === undefined) sorter[assetType] = []
            fileparts.full= file.slice(public.length)
            sorter[assetType].push(fileparts)
        })

    let output = {}

    // font assets
    sorter.font.forEach(file => {
        let PNGFile = sorter.image.filter(
            f => f.dir === file.dir && f.name === file.name && f.ext === '.png'
        )
        if (PNGFile.length) {
            // remove the image from images
            let removed = sorter.image.splice(sorter.image.indexOf(PNGFile[0]),1)[0]
            output.font = (output.font || []).concat([
                `obj.load.bitmapFont('FONT_${file.name.toUpperCase()}', '${removed.full}', '${file.full}')`
            ])
        }
    })

    // image and spritemap assets
    sorter.image.forEach(file => {
        // check if the image has spritesheet information
        if (file.name.includes('@')) {
            let [name, sheetInfo] = file.name.split('@')
            let [width, height, frames] = sheetInfo.split('x')
            output.spritesheet = (output.sprite || []).concat([
                `obj.load.spritesheet(`
                + `'SPRITE_${name.toUpperCase()}', '${file.full}',`
                + ` { frameWidth: ${width}, frameHeight: ${height}, endFrame: ${frames}})`
            ])
        } else {
            output.image = (output.image || []).concat([
                `obj.load.image('IMAGE_${file.name.toUpperCase()}', '${file.full}')`
            ])
        }
    })

    //HTML assets
    sorter.html.forEach(file => {
        output.html = (output.html || []).concat([
            `obj.load.html('HTML_${file.name.toUpperCase()}', '${file.full}')`
        ])
    })

    //audio assets
    sorter.audio.forEach(file => {
        output.audio= (output.audio|| []).concat([
            `obj.load.audio('AUDIO_${file.name.toUpperCase()}', ['${file.full}'])`
        ])
    })

    let fileContent = 'function PhaserAssetsLoader_assets(obj) {\n\n'
    Object.keys(output).forEach(key => {
        fileContent += '  ' + assetIntroComments[key] + '\n'
        output[key].map(e => fileContent += '  ' + e + '\n')
        fileContent += '\n'
    })
    fileContent += '}'

    fs.writeFileSync(jsOutputFile, fileContent, function(err) {if (err) throw err});
    console.log(`File ${jsOutputFile} created`)
}

exports.createPhaserAssets = createPhaserAssets
