const { createProxyMiddleware } = require("http-proxy-middleware");

// 只创建一次代理 ✅ 关键修复
const proxy = createProxyMiddleware({
  target: "https://www.google.com.hk", // 修复：必须是根域名
  changeOrigin: true,
  pathRewrite: {
    "^/": "/maps", // 路径重写
  },
});

// Vercel 入口
module.exports = (req, res) => {
  // 修复跨域 ✅
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // 处理 OPTIONS 预检 ✅
  if (req.method === "OPTIONS") return res.status(200).end();

  // 执行代理
  proxy(req, res);
};
