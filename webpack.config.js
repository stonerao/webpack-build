const path = require('path');
const webpack = require("webpack");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")


const glob = require("glob");

// 放入output的默认为输出路径
function getEntry() {
    var entry = {};
    //读取src目录所有page入口
    glob.sync('./src/output/**/*.js').forEach(function (name) {
        const fileArr = name.split("/");
        const fileName = fileArr.pop();
        if (fileName.lastIndexOf('.js')) {
            const val = fileName.substring(0, fileName.length - 3);
            entry[val] = name;
        }

    });
    return entry;
};

module.exports = {
    // mode: 'production',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    entry: {
        'lib.min': './src/Library/index.js',
        ...getEntry(),
        // 单独担保的放在此处
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            title: 'THREE',
            inject: true,
            // chunks: chunks,//页面要引入的包
            filename: "index.html", // 文件名
            template: "./index.html" // 模板地址
        }),
        new TerserPlugin({
            terserOptions: {
                ecma: undefined,
                parse: {},
                compress: {},
                mangle: true, // Note `mangle.properties` is `false` by default.
                module: false,
                output: null,
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_classnames: undefined,
                keep_fnames: false,
                safari10: false,
            },
        }),
        new webpack.optimize.SplitChunksPlugin({
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                //打包重复出现的代码
                vendor: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0, // This is example is too small to create commons chunks
                    name: 'vendor'
                },
                //打包第三方类库
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: Infinity
                }
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()

    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [{
                        'plugins': ['@babel/plugin-proposal-class-properties']
                    }]
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ],
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './'

    }
};