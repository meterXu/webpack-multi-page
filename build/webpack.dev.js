const path = require("path");
const {merge} = require('webpack-merge')
const  baseConfig = require('./webpack.base.js');
const CopyPlugin  = require('copy-webpack-plugin')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpack = require("webpack");
const notifier = require('node-notifier')
const packageConfig = require('../package.json')

const webpackConfig = merge(baseConfig, {
    mode:'development',
    devtool:'eval-cheap-module-source-map',
    devServer: {
        hot: true,
        contentBase: false,
        compress: true,
        open:true,
        overlay:true,
        publicPath:'',
        proxy:{},
        quiet: true,
        watchOptions: {
            poll: false,
        },
        port:8080,
        host: 'localhost',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'development'
            }
        }),
        new CopyPlugin({
            patterns:[
                {
                    from: path.resolve(__dirname, '../static'),
                    to: 'static',
                },
            ],
            options:{
                concurrency: 100,
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader','postcss-loader' ]
            }
        ]
    }
})

function createNotifierCallback() {

    return (severity, errors) => {
        if (severity !== 'error') return
        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        })
    }
}

module.exports = new Promise((resolve,reject)=>{
    portfinder.basePort = webpackConfig.devServer.port
    portfinder.getPort((err,port)=>{
        if (err) {
            reject(err)
          } else {
            webpackConfig.devServer.port = port
            webpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                  messages: [`Your application is running here: http://${webpackConfig.devServer.host}:${port}`],
                },
                onErrors: createNotifierCallback
              }))
            resolve(webpackConfig)
          }
    })

})
