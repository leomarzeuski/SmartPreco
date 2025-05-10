module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
    "unused-imports",
    "simple-import-sort"
  ],
  rules: {
    "no-trailing-spaces": "warn",
    "semi-spacing": [ "warn", { before: false, after: true } ],
    "semi": [ "warn", "always" ],
    "space-in-parens": [ "warn", "never" ],
    "object-curly-spacing": [ "warn", "always" ],
    "array-bracket-spacing": [ "warn", "always" ],
    "brace-style": [ "warn", "1tbs" ],
    "camelcase": [ "warn", { properties: "always" } ],
    "eqeqeq": [ "warn", "always" ],
    "no-console": "warn",
    "no-debugger": "warn",
    "no-var": "warn",
    "prefer-const": "warn",
    "max-len": [
      "warn",
      {
        code: 120,
        ignoreUrls: true,
        ignoreComments: false,
        ignorePattern: "^import\\s.+\\sfrom\\s.+;$"
      }
    ],

    // TypeScript rules
    "@typescript-eslint/explicit-member-accessibility": [
      "warn",
      { accessibility: "explicit" }
    ],
    "@typescript-eslint/no-unused-vars": [ "warn", { argsIgnorePattern: "^_" } ],
    "@typescript-eslint/no-explicit-any": "off",

    // Unused imports rules
    "unused-imports/no-unused-imports": "warn"
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  }
};
