module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node":true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "files": [
              "**/*.test.js",
            ],
            "env": {
              "jest": true
            }
          }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-unused-vars": "off",
    }
}
