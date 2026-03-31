const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware({
  target: "https://www.google.com.hk",
  changeOrigin: true,
  secure: true,

  onProxyReq: (proxyReq) => {
    // 只加伪装，不换域名
    proxyReq.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36");
    proxyReq.setHeader("Referer", "https://www.google.com.hk/maps");
    proxyReq.setHeader("Accept", "image/webp,image/*,*/*;q=0.8");

    // 去掉代理特征
    proxyReq.removeHeader("X-Forwarded-For");
    proxyReq.removeHeader("X-Real-IP");
    proxyReq.removeHeader("X-Forwarded-Host");
  }
});

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  proxy(req, res);
};
