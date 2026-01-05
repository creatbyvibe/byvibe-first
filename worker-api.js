// Cloudflare Workers - 添加 API 端点处理工具提交
export default {
  async fetch(request, env, ctx) {
    try {
      if (!env || !env.ASSETS) {
        return new Response('Worker configuration error: ASSETS binding not found', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      const url = new URL(request.url);
      let pathname = url.pathname;

      // 处理工具提交 API
      if (pathname === '/api/submit-tool' && request.method === 'POST') {
        try {
          const data = await request.json();
          
          // 验证数据
          if (!data.name || !data.url || !data.category || !data.description) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Missing required fields' 
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // 发送邮件通知（使用 Cloudflare Email Workers 或第三方服务）
          const emailContent = `
新工具提交：

工具名称：${data.name}
网站链接：${data.url}
分类：${data.category}
推荐理由：${data.description}

提交时间：${new Date().toLocaleString('zh-CN')}
`;

          // 使用 Cloudflare Email Workers 发送邮件
          // 注意：需要先在 Cloudflare Dashboard 中配置 Email Workers
          const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalizations: [{
                to: [{ email: 'make@byvibe.ai' }],
              }],
              from: { email: 'noreply@byvibe.ai', name: 'VibeToolbox' },
              subject: `新工具提交：${data.name}`,
              content: [{
                type: 'text/plain',
                value: emailContent
              }],
            }),
          });

          if (emailResponse.ok) {
            return new Response(JSON.stringify({ 
              success: true,
              message: 'Tool submitted successfully' 
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            // 如果邮件发送失败，仍然返回成功（避免用户看到错误）
            // 但可以记录日志
            console.error('Email send failed:', await emailResponse.text());
            return new Response(JSON.stringify({ 
              success: true,
              message: 'Tool submitted successfully' 
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // 原有的静态文件处理逻辑...
      // （这里需要包含原来的 worker.js 的所有逻辑）
      
      // 处理 /toolbox 路径（重定向到 /toolbox/）
      if (pathname === '/toolbox') {
        return Response.redirect(new URL('/toolbox/', request.url), 301);
      }

      // 处理 /toolbox/ 路径
      if (pathname.startsWith('/toolbox/')) {
        const directRequest = new Request(new URL(pathname, request.url), request);
        let response = await env.ASSETS.fetch(directRequest);
        if (response.status === 200) {
          return response;
        }
        if (pathname === '/toolbox/' || (!pathname.includes('.') && pathname.startsWith('/toolbox/'))) {
          const toolboxIndexRequest = new Request(new URL('/toolbox/index.html', request.url), request);
          const toolboxResponse = await env.ASSETS.fetch(toolboxIndexRequest);
          if (toolboxResponse.status === 200) {
            return toolboxResponse;
          }
        }
        return response;
      }

      // 处理根路径
      if (pathname === '/') {
        const indexRequest = new Request(new URL('/index.html', request.url), request);
        const indexResponse = await env.ASSETS.fetch(indexRequest);
        if (indexResponse.status === 200) {
          return indexResponse;
        }
      }

      // 尝试直接获取请求的文件
      let response = await env.ASSETS.fetch(request);
      
      if (response.status === 404) {
        if (!pathname.includes('.') && !pathname.endsWith('/')) {
          const indexRequest = new Request(new URL(pathname + '/index.html', request.url), request);
          const indexResponse = await env.ASSETS.fetch(indexRequest);
          if (indexResponse.status === 200) {
            return indexResponse;
          }
        }
        if (pathname.endsWith('/')) {
          const indexRequest = new Request(new URL(pathname + 'index.html', request.url), request);
          const indexResponse = await env.ASSETS.fetch(indexRequest);
          if (indexResponse.status === 200) {
            return indexResponse;
          }
        }
      }
      
      return response;
    } catch (error) {
      return new Response(`Worker error: ${error.message}\nStack: ${error.stack}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
