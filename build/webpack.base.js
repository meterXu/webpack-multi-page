const path = require('path');
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");


const baseConfig={
    entry:{},
    output: {
        filename: process.env.NODE_ENV === 'production'?'js/[name].[chunkhash].js':'js/[name].js',
        path: path.resolve(__dirname, '../dist'),
    },
    experiments: {
        topLevelAwait: true
    },
    plugins:[
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    esModule: false,
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: 'img/[name].[hash:6].[ext]',
                            publicPath: '../',
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: 'fonts/[name].[hash:6].[ext]',
                            publicPath: '../',
                        }
                    }
                ]
            }
        ]
    }
}

function dealWithEntries(baseConfig){
    const allObj = fs.readdirSync(path.join(__dirname,'../src/pages'),{
        withFileTypes:true
    })
    const entry = {
        index:'./src/index.js',
    }
    const htmlWebpackPlugins = [new HtmlWebpackPlugin({
        hash: true,
        chunks: ['index'],
        template: "index.html",
        filename: "index.html"
    })]
    allObj.filter(c=>c.isDirectory()).forEach(c=>{
        entry[c.name] = `./src/pages/${c.name}/index.js`
        htmlWebpackPlugins.push(new HtmlWebpackPlugin({
            hash: true,
            chunks: [c.name],
            template: `src/pages/${c.name}.html`,
            filename: `pages/${c.name}.html`
        }),)
    })
    baseConfig.entry = entry
    baseConfig.plugins = baseConfig.plugins.concat(htmlWebpackPlugins)
    return baseConfig
}


module.exports = dealWithEntries(baseConfig)
