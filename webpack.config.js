const baseConfig = require("./webpack.remote.base.js");

module.exports = baseConfig({
  name: "accountSettings",
  port: 5006,
  exposes: {
    "./App": "./src/App.tsx",
  },
});
