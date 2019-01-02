var path = require('path')

const PATHS = {
	src: path.join(__dirname, './src'),
	build: path.join(__dirname, './build')
}

module.exports = {
	mode: 'development',
	entry: {
		'common': PATHS.src + '/index.js'
	},
	output: {
		path: PATHS.build,
		filename: 'index.js',
		library: 'ExtCommons',
		libraryTarget: 'umd'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{ loader: "babel-loader" },
					{ loader: 'eslint-loader' },
				],
				exclude: /demo/
			},
		]
	},
	resolve: {
		extensions: ['.js']
	},
}