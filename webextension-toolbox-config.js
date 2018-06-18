const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
  webpack: (config, env) => {
    const target = env.target.replace('[vendor]', env.vendor);

    // need to add an entrypoint for our main.css
    const entries = config.entry.bind({});
    config.entry = () => {
      const out = entries();
      out['styles/style'] = [resolve(env.src, 'styles/style.scss')];
      return out;
    };

    // add the rule to process our sass/scss
    config.module.rules.push({
      test: /\.(sa|sc|c)ss$/,
      exclude: /node_modules/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    });

    // add the css extract plugin
    config.plugins.push(new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }));

    if (process.env.NODE_ENV === 'production') {
      // optimize CSS assets
      config.plugins.push(new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }));

      const ZipPlugin = config.plugins.find(plugin => plugin.constructor ? plugin.constructor.name === 'ZipPlugin' : false);

      config.plugins.push(new FileManagerPlugin({
        onEnd: [
          {
            delete: [
              `${target}/styles/**/*.{sass,scss,js,map}`
            ]
          },
          {
            archive: [
              {
                source: target,
                destination: `packages/${ZipPlugin.options.filename}`
              }
            ]
          }
        ]
      }));

      config.plugins.splice(config.plugins.indexOf(ZipPlugin), 1); // remove zip plugin
    }

    return config;
  }
};
