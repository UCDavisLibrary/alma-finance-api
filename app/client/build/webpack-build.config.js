import webpackUtils from './webpack-utils.js';

export default {
  mode: 'production',
  entry: webpackUtils.entry,
  output: {
    path: webpackUtils.jsDir(true),
    filename: webpackUtils.bundleName,
    clean: true,
  },
};
