#!/bin/bash

# 快速部署脚本 - 用于 Workers 手动部署

echo "🚀 开始部署..."

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 检测到未提交的更改"
    read -p "是否先提交到 GitHub? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 提交到 GitHub..."
        git add .
        git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
        git push
        echo "✅ 已推送到 GitHub"
    fi
fi

# 部署到 Cloudflare Workers
echo "☁️  部署到 Cloudflare Workers..."
npx wrangler deploy

echo ""
echo "✅ 部署完成！"
echo "🌐 访问: https://byvibe.ai"
