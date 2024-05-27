const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "#": path.resolve(__dirname, "src"),
    },
  },
  devServer: (devServerConfig) => {
    devServerConfig.client = {
      overlay: false,
    };
    return devServerConfig;
  },
};
