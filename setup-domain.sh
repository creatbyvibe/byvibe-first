#!/bin/bash

echo "🌐 配置自定义域名 byvibe.ai"
echo ""

# 检查是否已登录
echo "检查 Wrangler 登录状态..."
npx wrangler whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ 未登录，请先运行: npx wrangler login"
    exit 1
fi

echo "✅ 已登录"
echo ""

# 添加主域名路由
echo "添加路由: byvibe.ai/*"
npx wrangler routes add "byvibe.ai/*" --zone-name byvibe.ai

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 域名配置成功！"
    echo ""
    echo "📝 下一步："
    echo "1. 等待 DNS 生效（通常 1-5 分钟）"
    echo "2. 访问 https://byvibe.ai 测试"
    echo "3. 访问 https://byvibe.ai/toolbox/ 测试 VibeToolbox"
else
    echo ""
    echo "❌ 配置失败，请检查："
    echo "1. 域名是否已添加到 Cloudflare"
    echo "2. DNS 是否由 Cloudflare 管理"
    echo "3. 或者通过 Cloudflare Dashboard 手动配置"
fi
