// Netlify 边缘函数将环境变量注入 HTML
export default async (request, context) => {
  const url = new URL(request.url);
  
  // 仅处理HTML页面
  const isHtmlPage = url.pathname.endsWith('.html') || url.pathname === '/';
  if (!isHtmlPage) {
    return; // 让请求原样通过
  }

  // 获取原始响应
  const response = await context.next();
  
  // 检查是否是HTML响应
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    返回响应; // 如果不是HTML，返回原始响应
  }

  // 获取HTML内容
  const originalHtml = await response.text();
  
  // 用于 Netlify Edge Functions 的简单 SHA-256 实现
  异步函数 sha256 消息) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // 将占位符替换为实际的环境变量
  const password = Netlify.env.get('PASSWORD') || '';
  let passwordHash = '';
  if (密码) {
    passwordHash = await sha256(password);
  }
  
  const modifiedHtml = originalHtml.replace(
    'window.__ENV__.PASSWORD = "{{PASSWORD}}";'
    `window.__ENV__.PASSWORD = "${passwordHash}"; // SHA-256 哈希`
  );
  
  // 创建一个带有修改后HTML的新响应
  返回新的 Response(modifiedHtml, {
    状态: response.status,
    状态文本: 响应的状态文本
    标题: response.headers
  });
}

导出 const 配置 = {
  路径: ["/*"]
}
