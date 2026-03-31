const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware({
  target: "http://www.google.com.hk",
  changeOrigin: true,
  secure: false,
  protocolRewrite: "http",
  followRedirects: false,

  // 强制伪装成浏览器，谷歌不会校验你
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Referer": "http://www.google.com.hk/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
  }
});

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  proxy(req, res);
};
