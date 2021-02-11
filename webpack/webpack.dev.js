const merge = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: false,
        writeToDisk: true
    }
}

module.exports = merge(common, dev)
