#!/bin/bash

echo "🔍 测试 MailChannels DNS 配置"
echo ""

DOMAIN="_mailchannels.byvibe.ai"

echo "测试域名: $DOMAIN"
echo ""

# 使用 dig 测试
if command -v dig &> /dev/null; then
    echo "使用 dig 测试..."
    dig +short TXT $DOMAIN
    echo ""
fi

# 使用 nslookup 测试
if command -v nslookup &> /dev/null; then
    echo "使用 nslookup 测试..."
    nslookup -type=TXT $DOMAIN
    echo ""
fi

# 使用 host 测试
if command -v host &> /dev/null; then
    echo "使用 host 测试..."
    host -t TXT $DOMAIN
    echo ""
fi

echo "✅ 如果看到 'v=mc1;'，说明 DNS 配置正确！"
echo ""
echo "🌐 或者访问在线工具："
echo "   https://mxtoolbox.com/TXTLookup.aspx"
echo "   输入: $DOMAIN"
