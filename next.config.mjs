/** @type {import('next').NextConfig} */

const nextConfig = {
    sassOptions: {
        additionalData: `
          @import "styles/_extends.scss";
          @import "styles/_functions.scss";
          @import "styles/_mixins.scss";
        `,
    },
    webpack: (config) => {
        // Add rule to transpile @firebase/auth
        config.module.rules.push({
            test: /\.m?js$/,
            include: /node_modules\/@firebase/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },
        });
        return config;
    },
    // output: 'export',
};

export default nextConfig;
