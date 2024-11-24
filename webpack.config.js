const webpack = require('webpack');

module.exports = [];

let packs = ['App'];

for(const pack of packs)
{
	// Pack par défaut du framework static au global
	module.exports.push({
		entry: './htdocs/js/dist/app/' + pack + '.js',
		output: {
			path: __dirname + '/htdocs/js/pack/',
			filename: pack + '.js'
		},
		plugins: [
			new webpack.optimize.LimitChunkCountPlugin({
				maxChunks: 1,
			}),
		]
	});
}

