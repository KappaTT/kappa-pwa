module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@secrets': './src/secrets',
            '@backend': './src/backend',
            '@backend/*': './src/backend/*',
            '@components': './src/components',
            '@components/*': './src/components/*',
            '@constants': './src/constants',
            '@constants/*': './src/constants/*',
            '@navigation': './src/navigation',
            '@navigation/*': './src/navigation/*',
            '@pages': './src/pages',
            '@pages/*': './src/pages/*',
            '@reducers': './src/reducers',
            '@reducers/*': './src/reducers/*',
            '@screens': './src/screens',
            '@screens/*': './src/screens/*',
            '@services': './src/services',
            '@services/*': './src/services/*',
            '@argon': './libs/argon',
            '@argon/*': './libs/argon/*',
            '@galio': './libs/galio',
            '@galio/*': './libs/galio/*'
          }
        }
      ]
    ]
  };
};
