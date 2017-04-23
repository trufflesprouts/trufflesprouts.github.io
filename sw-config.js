module.exports = {
  runtimeCaching: [{
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
    handler: 'cacheFirst'
  }]
};
