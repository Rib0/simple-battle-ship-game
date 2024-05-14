module.exports = {
	root: true, // ESLint stops looking in parent folders for another config file
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'airbnb', // 'eslint-plugin' in plugin name 'eslint-plutin-airbnb' can be omitted
		'airbnb/hooks',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:mobx/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json', './tsconfig.eslint.json'],
		tsconfigRootDir: __dirname,
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	}, // prettier плагин для eslint работает медленно, использовать его не стоит
	rules: {
		'react/jsx-filename-extension': [1, { extensions: ['.tsx'], allow: 'as-needed' }],
		'react/react-in-jsx-scope': 'off',
		'react/function-component-definition': 'off',
		'react/prop-types': 'off',
		'react/jsx-props-no-spreading': 'off',
		'@typescript-eslint/no-shadow': ['error'],
		'@typescript-eslint/no-misused-promises': [
			'error',
			{
				checksVoidReturn: false,
			},
		],
		'import/prefer-default-export': 'off',
		'import/extensions': 'off',
		'no-shadow': 'off',
		'global-require': 'off',
		'no-plusplus': [1, { allowForLoopAfterthoughts: true }],
	},
	plugins: ['@typescript-eslint', 'import'],
	ignorePatterns: ['vite.config.ts'],
	reportUnusedDisableDirectives: true,
	settings: {
		'import/resolver': {
			node: {
				paths: ['src'],
				extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
			},
			typescript: {
				project: './tsconfig.json',
			},
			alias: {
				// eslint-disable-next-line
				map: [['@', require('path').resolve(__dirname, './src')]],
				extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
			},
		},
		react: {
			version: 'detect', // let eslint detect react version of project itself
		},
	},
	overrides: [
		{
			files: 'src/server/**/*',
			rules: {
				'no-param-reassign': 'off',
			},
		},
	],
};

// из плагина можно наследовать также и такие поля как env, parseOptions и тд.
// плагин содержит rules и опционально остальной конфиг, и дает возможность их использовать по желанию. Конфиг же,
// имеет полный набор настроек, от которого мы наследуемся и переопределяем отдельные поля по желанию.

// eslint может выполнять роль prettier, так как содержит в себе style rules, которые отвечают за форматирование кода и могут исправить форматирование с eslint --fix
// но так делать не рекомендуется так как это медленнее чем запускать форматирование через prettier напрямую, для запуска форматирования через prettier
// следует наследоваться от eslint-config-prettier в eslint-config.js, чтобы отключить возможные stylistic правила, которые есть в некоторых конфигах
// от которых вы можете наследоваться до этого. Если же вы используете eslint как prettier, то следует в settings.json в vscode отключить formatOnSave и в целом убрать prettier из проекта, чтобы
// не было конфликтов, так как многие стилистические правила из некоторых конфигов eslint могут конфликтовать с конфигом prettier
