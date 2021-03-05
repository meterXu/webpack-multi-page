const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports ={
    entry: {
        index:'./src/index.js',
        hello:'./src/pages/hello/index.js',
        world:'./src/pages/hello/index.js'
    },
    output: {
        filename: process.env.NODE_ENV === 'production'?'js/[name].[chunkhash].js':'js/[name].js',
        path: path.resolve(__dirname, '../dist'),
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            chunks: ['index'],
            template: "index.html",
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            hash: true,
            chunks: ['hello'],
            template: "src/pages/hello.html",
            filename: "pages/hello.html"
        }),
        new HtmlWebpackPlugin({
            hash: true,
            chunks: ['world'],
            template: "src/pages/world.html",
            filename: "pages/world.html"
        }),
    ],
    module: {
        rules: [
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
                        }
                    }
                ]
            }
        ]
    }
}
