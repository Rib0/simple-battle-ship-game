const postcssImport = require('postcss-import');
const postcssGlobalData = require('@csstools/postcss-global-data');
const postcssPresenEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');

module.exports = {
	plugins: [
		postcssImport(),
		postcssGlobalData({ files: ['./src/root.css'] }),
		postcssPresenEnv({
			features: {
				'nesting-rules': false,
			},
		}),
		postcssNested(),
	],
};
