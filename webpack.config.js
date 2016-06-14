var ExtractTextPlugin = require('extract-text-webpack-plugin');

function getDevTool() {
    if (process.env.NODE_ENV !== 'production') {
        return 'source-map'; //enables source map
    }

    return 'source-map'; // Should be false in production
}

module.exports = {
    entry: {
        main: './src/main.js'
    },
    output: {
        filename: './dist/[name].js'
    },
    target: 'node-webkit',
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'react-hot'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('dist/main.css', {
            allChunks: true
        })
    ]
};