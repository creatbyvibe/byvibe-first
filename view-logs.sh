#!/bin/bash

echo "📋 查看 Cloudflare Workers 日志"
echo ""
echo "选择查看方式："
echo "1. 实时日志（推荐）"
echo "2. 查看提交工具的日志"
echo "3. 查看错误日志"
echo ""
read -p "请选择 (1-3): " choice

case $choice in
  1)
    echo ""
    echo "🔍 开始实时日志流..."
    echo "按 Ctrl+C 停止"
    echo ""
    npx wrangler tail
    ;;
  2)
    echo ""
    echo "🔍 查看提交工具的日志..."
    echo ""
    npx wrangler tail | grep -i "submit-tool\|新工具提交" --color=always
    ;;
  3)
    echo ""
    echo "🔍 查看错误日志..."
    echo ""
    npx wrangler tail | grep -i "error\|failed" --color=always
    ;;
  *)
    echo "无效选择"
    exit 1
    ;;
esac
