const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware({
  target: "https://www.google.com.hk",
  changeOrigin: true,
  secure: true,
  followRedirects: true,

  // 完整模拟Chrome浏览器请求瓦片的全套请求头
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.7,en;q=0.6",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.google.com.hk/maps",
    "Sec-Fetch-Dest": "image",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "DNT": "1",
    "Upgrade-Insecure-Requests": "1"
  },

  // 不修改路径
  pathRewrite: undefined,
});

module.exports = (req, res) => {
  // 跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,User-Agent,Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 强制覆盖奥维原生UA，彻底伪装成浏览器
  req.headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";
  req.headers["referer"] = "https://www.google.com.hk/maps";

  proxy(req, res);
};
