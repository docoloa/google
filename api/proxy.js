const { createProxyMiddleware } = require("http-proxy-middleware");

// 只创建一次代理（Vercel 必须）
const proxy = createProxyMiddleware({
  target: "https://www.google.com.hk", // 根域名，不带路径
  changeOrigin: true,
  secure: false, // 跳过 HTTPS 证书校验（关键）
  pathRewrite: {
    // 子域名请求路径重写到谷歌地图
    "^/": "/maps/",
  },
  // 处理谷歌地图的资源/跨域
  onProxyRes: (proxyRes, req, res) => {
    // 允许跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    // 修复缓存/重定向
    delete proxyRes.headers["x-frame-options"];
    delete proxyRes.headers["content-security-policy"];
  },
});

// Vercel 入口
module.exports = (req, res) => {
  // 处理 OPTIONS 预检
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // 执行代理
  proxy(req, res);
};
