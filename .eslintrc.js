module.exports = {
  "extends": "google",
  "parserOptions": {
    "ecmaVersion": 7
  },
  "rules": {
    "require-jsdoc": [
      "error", {
        "require": {
          "FunctionDeclaration": false,
        }
      }
    ],
    "prefer-rest-params": 0
  },
  "parser": "babel-eslint"
};
