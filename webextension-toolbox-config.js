const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SuppressChunksPlugin = require('suppress-chunks-webpack-plugin');

module.exports = {
  webpack: (config, env) => {

    // need to remove the webextensions-toolbox CopyPlugin and add our own ignoring scss files.
    const plugin = config.plugins.find(plugin => plugin.constructor.name === 'Object' && plugin.apply);
    config.plugins.splice(config.plugins.indexOf(plugin), 1);
    config.plugins.push(new CopyPlugin([
      {
        context: resolve(env.src),
        from: resolve(env.src, '**/*'),
        ignore: ['**/*.js', '**/*.json', '**/*.scss', '**/*.scss'],
        to: resolve(env.target.replace('[vendor]', env.vendor))
      },
      {
        context: resolve(env.src),
        from: resolve(env.src, '_locales/**/*.json'),
        to: resolve(env.target.replace('[vendor]', env.vendor))
      }
    ]));

    // need to add an entrypoint for our main.css
    const entries = config.entry.bind({});
    config.entry = () => {
      const out = entries();
      // our sass to css entry for style.css, be sure if you change/add to these to update the SuppressChunksPlugin config as well
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

    // optimize CSS assets
    config.plugins.push(new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }));

    // uses the entry name from from entries to suppress the .js and .js.map
    config.plugins.push(new SuppressChunksPlugin.default([
      { name: 'styles/style', match: /\.(js|js\.map)$/ }
    ]));

    return config;
  }
};
