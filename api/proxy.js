const { createProxyMiddleware } = require("http-proxy-middleware");



const proxy = createProxyMiddleware({

  target: "https://www.google.com.hk",

  changeOrigin: true,

  secure: false,



  // 核心：强制模拟真人浏览器，骗过谷歌检测

  headers: {

    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",

    "Accept-Language": "zh-CN,zh;q=0.9",

    "Referer": "https://www.google.com.hk/",

  },



  // 不写 pathRewrite ?

});



module.exports = (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  res.setHeader("Access-Control-Allow-Headers", "*");



  if (req.method === "OPTIONS") return res.status(200).end();



  proxy(req, res);

};
