#!/bin/bash

echo "📋 查看 Cloudflare Worker 日志"
echo ""
echo "方法 1：使用命令行（实时日志）"
echo "运行：npx wrangler tail"
echo ""
echo "方法 2：访问 Cloudflare Dashboard"
echo "1. 登录 https://dash.cloudflare.com"
echo "2. 进入 Workers & Pages → byvibe"
echo "3. 点击 Logs 标签"
echo "4. 查找 'MailChannels' 或 'Email' 相关的错误"
echo ""
echo "按 Enter 启动实时日志查看（Ctrl+C 退出）..."
read
npx wrangler tail
