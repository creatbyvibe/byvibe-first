#!/bin/bash
# 自动部署脚本
cd ~/byvibe-deploy
git add .
git commit -m "${1:-Auto deploy: Update files}"
git push
echo "✅ 代码已推送，Cloudflare 将自动部署！"
