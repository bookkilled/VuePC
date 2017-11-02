var webpack = require('webpack'),
	path = require('path'), // node文件路径操作模块
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	TransferWebpackPlugin = require('transfer-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
	entry: [
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
		path.resolve(__dirname, 'src/index.js')
	],
	output: {
		path: path.join(__dirname, '/build/'),
		filename: 'build/[name].[hash:4].js',
		chunkFilename: 'build/chunk.[id].[hash:4].js',
		publicPath: '/'
	},
	module: {
		loaders: [{
			test: /\.vue$/,
			loader: 'vue-loader'
		},{
			test: /\.html$/,
			loader: "html"
		},{
			test: /\.less$/,
			loader: 'style!css!postcss!less'
		},{
			test: /\.css$/, 
			loader: ExtractTextPlugin.extract('style-loader', 'css!autoprefixer')
		},{
			test: /\.(jpe?g|gif|png|ico|svg)$/,
			loader: 'url?limit=8192&name=build/[name].[hash:4].[ext]'
		}, {
			test: /\.(woff2?|otf|eot|ttf)$/i,
			loader: 'url?name=fonts/[name].[hash:4].[ext]'
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.(js)$/,
			exclude: /node_modules/,
			loaders: ['babel']
		}]
	},
	resolve: {
		modulesDirectories: [
			'src',
			'node_modules',
			'src/assets'
		],
		extensions: ['', '.js', '.png', '.vue', '.json'],
		alias: {
			'vue': 'vue/dist/vue.common.js',
			'src': path.resolve(__dirname, '../src'),
			'assets': path.resolve(__dirname, '../src/assets'),
			'components': path.resolve(__dirname, '../src/components')
		}
	},
	postcss: function() {
		return [
			require('precss'),
			require('autoprefixer')
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			inject: 'body',
			template: "src/index.tpl.html"
		}),
		new TransferWebpackPlugin([
			{ from: 'assets/lib', to: 'build'},
			{ from: 'mock', to: 'build'}
		], path.join(__dirname, 'src')),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.AggressiveMergingPlugin({
			minSizeReduce: 1.5,
			moveToParents: true
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	],
	devtool: 'source-map'
};