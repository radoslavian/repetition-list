const esModules = [ // Copy from here
  "react-markdown",
  "vfile",
  "unist-.+",
  "unified",
  "bail",
  "is-plain-obj",
  "trough",
  "remark-.+",
  "mdast-util-.+",
  "micromark",
  "parse-entities",
  "character-entities",
  "property-information",
  "comma-separated-tokens",
  "hast-util-whitespace",
  "remark-.+",
  "space-separated-tokens",
  "decode-named-character-reference",
  "ccount",
  "escape-string-regexp",
  "markdown-table",
  "trim-lines",
].join("|"); // To here

module.exports = {
    transform: {
	'^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/config/jest/babelTransform.js',
	[`(${esModules}).+\\.js$`]: '<rootDir>/config/jest/babelTransform.js',
	'^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
	'^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)':
	'<rootDir>/config/jest/fileTransform.js',
    },
    transformIgnorePatterns: [
	`[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx|mjs|cjs|ts|tsx)$`,
	'^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
	'next/router': '<rootDir>/__mocks__/next/router.js',
	'^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
	'^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/file-mock.js',
	'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
    },
};
