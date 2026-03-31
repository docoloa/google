const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware({
  target: "https://www.google.com.hk",
  changeOrigin: true,
  secure: true,
  followRedirects: true,

  onProxyReq: (proxyReq) => {
    proxyReq.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/133.0.0.0 Safari/537.36");
    proxyReq.setHeader("Referer", "https://www.google.com/maps");
    proxyReq.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
  },

  // 关键：只代理地图相关路径，不直接反代 vt 瓦片
  pathFilter: (path) => {
    return path.includes("maps") || path.includes("kh");
  },
});

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  proxy(req, res);
};
