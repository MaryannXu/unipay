// next.config.mjs
var nextConfig = {
  sassOptions: {
    additionalData: `
          @import "styles/_extends.scss";
          @import "styles/_functions.scss";
          @import "styles/_mixins.scss";
        `
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/@firebase/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    });
    return config;
  }
  // output: 'export',
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
