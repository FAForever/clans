var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'www');
var APP_DIR = path.resolve(__dirname, 'src');

// http://stackoverflow.com/a/39813511
const prod = process.argv.indexOf('-p') !== -1;

const definePlugin = new webpack.DefinePlugin({
    'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'https://api.dev.faforever.com'),
    'process.env.OAUTH_CLIENT_ID': JSON.stringify(process.env.OAUTH_CLIENT_ID || '83891c0c-feab-42e1-9ca7-515f94f808ef'),
    'process.env.OAUTH_REDIRECT_URI': JSON.stringify(process.env.OAUTH_REDIRECT_URI || 'http://localhost:8080'),
    'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development')
});

const babelLoader = {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
        presets: ['es2015', 'react']
    }
};

const sassLoader = {
    test: /\.scss$/,
    loaders: ['style', 'css', 'sass']
};

const cssLoader = {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
};

var config = {
    entry: APP_DIR + '/App.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [babelLoader, sassLoader, cssLoader]
    },
    devServer: {
        inline: true,
        historyApiFallback: true
    },
    plugins: [definePlugin]
};

module.exports = config;
