const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware({
  target: "https://www.google.com.hk",
  changeOrigin: true,
  secure: true,
  followRedirects: true,
  ws: false,

  // 核心：动态伪装请求头，对抗谷歌风控
  onProxyReq: (proxyReq, req, res) => {
    // 随机UA，避免固定UA被标记
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
    ];
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    proxyReq.setHeader("User-Agent", randomUA);

    // 强制正确Referer，谷歌瓦片必查
    proxyReq.setHeader("Referer", "https://www.google.com.hk/maps");

    // 图像请求专用Accept，更像浏览器
    proxyReq.setHeader("Accept", "image/webp,image/apng,image/*,*/*;q=0.8");

    // 移除可能暴露代理的头
    proxyReq.removeHeader("X-Forwarded-For");
    proxyReq.removeHeader("X-Real-IP");
  },

  // 路径重写（适配奥维瓦片路径）
  pathRewrite: (path) => {
    // 保留原路径，谷歌瓦片路径不变
    return path;
  }
});

module.exports = (req, res) => {
  // 跨域（奥维必须）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  proxy(req, res);
};
