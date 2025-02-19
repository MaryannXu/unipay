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
  },
  // output: 'export',
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: process.env.NODE_ENV === "development" ? "http://127.0.0.1:5000/:path*" : "https://flask-fire-611946450050.us-central1.run.app/:path*"
        // Cloud Run in production
      }
    ];
  }
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
