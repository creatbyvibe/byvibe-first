// Cloudflare Workers - 静态网站处理 + API 端点 + 邮件通知（使用 EmailJS）
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
              headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            });
          }

          // 使用 EmailJS 发送邮件
          let emailSent = false;
          let emailError = null;
          
          try {
            const emailjsUrl = 'https://api.emailjs.com/api/v1.0/email/send';
            const emailjsData = {
              service_id: env.EMAILJS_SERVICE_ID || 'service_j63bagv',
              template_id: env.EMAILJS_TEMPLATE_ID || 'template_qk7iehb',
              user_id: env.EMAILJS_PUBLIC_KEY || 'Mzftc3ck16pifmUA8',
              template_params: {
                tool_name: data.name,
                tool_url: data.url,
                tool_category: data.category,
                tool_description: data.description,
                submit_time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
                to_email: 'bwu2026@163.com'
              }
            };

            console.log('📧 Sending email via EmailJS...');
            console.log('Service ID:', env.EMAILJS_SERVICE_ID ? '***' : 'service_j63bagv');
            console.log('Template ID:', env.EMAILJS_TEMPLATE_ID ? '***' : 'template_qk7iehb');

            const emailResponse = await fetch(emailjsUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(emailjsData),
            });

            const responseStatus = emailResponse.status;
            const responseText = await emailResponse.text();

            console.log(`📊 EmailJS response status: ${responseStatus}`);
            console.log(`📄 EmailJS response body: ${responseText}`);

            if (emailResponse.ok) {
              emailSent = true;
              console.log('✅ Email sent successfully via EmailJS');
            } else {
              emailError = `HTTP ${responseStatus}: ${responseText}`;
              console.error('❌ EmailJS send failed:', emailError);
            }
          } catch (err) {
            emailError = `Exception: ${err.message || String(err)}`;
            console.error('❌ EmailJS error:', emailError);
            console.error('Error stack:', err.stack);
          }

          // 即使邮件发送失败，也返回成功（避免用户看到错误）
          // 邮件状态会记录在 Worker 日志中
          return new Response(JSON.stringify({ 
            success: true,
            message: 'Tool submitted successfully',
            emailSent: emailSent,
            emailError: emailError || null
          }), {
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
          }), {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }

      // 处理 CORS 预检请求
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
      }

      // 处理 /submit 路径 - 返回 VibeToolbox（让 SPA 路由处理）
      if (pathname === '/submit' || pathname === '/submit/') {
        const toolboxIndexRequest = new Request(new URL('/toolbox/index.html', request.url), request);
        const toolboxResponse = await env.ASSETS.fetch(toolboxIndexRequest);
        if (toolboxResponse.status === 200) {
          return toolboxResponse;
        }
      }

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
