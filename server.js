var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var proxy = require('http-proxy-middleware');
var ip = require('ip');
var http = require('http');
var config = require('./webpack.config.js');

var app = express()
var compiler = webpack(config)
var middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'dist/',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
})
app.use(middleware)
app.use(webpackHotMiddleware(compiler))
// 以下跨域配置
var options = {
    target: 'http://m.leadfund.com.cn', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    pathRewrite: {
        // '^/api/old-path' : '/api/new-path',     // rewrite path
        // '^/api/remove/path' : '/path'           // remove base path
    },
    router: {
        // when request.headers.host == 'dev.localhost:3000',
        // override target 'http://www.example.org' to 'http://localhost:8000'
        // 'http://m.leadfund.com.cn' : 'http://localhost:8000'
    }
};
var exampleProxy = proxy(options);
// 接口跨域配置
app.use('/wealthgateway', exampleProxy);

var server = http.createServer(app)
server.listen(3002, ip.address(), (err) => {
  if (err) throw err
  var addr = server.address()
  console.log('==> 🌎 Listening on  http://%s:%d', addr.address, addr.port);
})
