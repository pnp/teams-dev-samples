'use strict';
const build = require('@microsoft/sp-build-web');
const { IgnorePlugin } = require('webpack');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const postCssLoader = {
    loader: "postcss-loader",
    options: {
      plugins: () => [
        // https://github.com/ai/browserslist
        require("autoprefixer")()
      ]
    }
  };

build.configureWebpack.mergeConfig({
    additionalConfiguration: (generatedConfiguration) => {
        generatedConfiguration.module.rules.push(

            {
                test: /\.s?css$/,
                use: [postCssLoader, {loader:'sass-loader'}]
            }
        );
        generatedConfiguration.plugins.push(
            new IgnorePlugin({
                resourceRegExp: /moment$/, // Moment is optionally included by Pikaday, but is not needed in our bundle
            })
        );
        return generatedConfiguration;
    }
});

build.initialize(require('gulp'));
