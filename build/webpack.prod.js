process.env.NODE_ENV = 'production'
const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const {merge} = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ora = require('ora')
const chalk = require('chalk')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require("path");

const spinner = ora('building for production...')
spinner.start()
const webpackConfig = merge(baseConfig,{
    mode:'production',
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].css'
        }),
        new OptimizeCssAssetsPlugin({}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            }
        }),
        new UglifyJsPlugin({
            uglifyOptions:{
                warnings: false,
            },
            parallel: true
        }),
        new CopyWebpackPlugin({
            patterns:[
                {
                    from: path.resolve(__dirname, '../static'),
                    to: 'img',
                }
            ]
        })
    ],
    module: {
        rules: [{
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader,'css-loader']
        }]
    },
})

webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')
    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
    }
    console.log(chalk.cyan('  Build complete.\n'))
})
