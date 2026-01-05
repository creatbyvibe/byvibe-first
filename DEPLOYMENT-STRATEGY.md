# 部署策略指南

## 🎯 推荐方案：合并部署（一次完成）

**最佳实践**：将两个项目合并到一个 GitHub 仓库，然后一次性部署到 Cloudflare Pages。

### 为什么推荐合并部署？

✅ **优点**：
- 一次配置，长期使用
- 统一管理，维护简单
- 路径配置更清晰（`/` 和 `/toolbox`）
- 部署更快，只需一次构建
- 版本控制更统一

❌ **分步部署的问题**：
- 需要配置两次 Cloudflare Pages
- 路径可能冲突
- 维护更复杂

---

## 📋 三种部署方案对比

### 方案一：合并部署（⭐ 推荐）

**流程**：
1. 创建一个新的 GitHub 仓库
2. 将 Hero 页面和 VibeToolbox 构建产物合并
3. 一次性部署到 Cloudflare Pages

**目录结构**：
```
byvibe-deploy/
├── index.html          # Hero 页面
├── styles.css
├── script.js
├── toolbox/            # VibeToolbox
│   ├── index.html
│   └── assets/
└── _redirects          # Cloudflare 路由配置
```

**步骤**：
```bash
# 1. 创建新仓库目录
mkdir byvibe-deploy
cd byvibe-deploy
git init

# 2. 复制 Hero 页面文件
cp -r /path/to/byvibe-hero/* .

# 3. 构建 VibeToolbox
cd /path/to/vibetoolbox
pnpm build

# 4. 复制 VibeToolbox 构建产物
mkdir -p ../byvibe-deploy/toolbox
cp -r dist/public/* ../byvibe-deploy/toolbox/

# 5. 创建 _redirects 文件
echo "/toolbox/*  /toolbox/index.html  200" > ../byvibe-deploy/_redirects

# 6. 提交到 GitHub
cd ../byvibe-deploy
git add .
git commit -m "Initial deployment: Hero + VibeToolbox"
git remote add origin <your-github-repo-url>
git push -u origin main

# 7. 在 Cloudflare Pages 连接仓库
# - 选择仓库
# - Build command: echo "No build needed" 或留空
# - Build output directory: . (当前目录)
```

---

### 方案二：分步部署（不推荐）

**流程**：
1. 先部署 Hero 页面到 GitHub + Cloudflare
2. 再部署 VibeToolbox 到另一个路径

**问题**：
- 需要两个 Cloudflare Pages 项目
- 或者需要手动配置路径
- 维护更复杂

---

### 方案三：使用 GitHub Actions 自动构建（高级）

**流程**：
1. 将两个项目的源代码都放在一个仓库
2. 使用 GitHub Actions 自动构建 VibeToolbox
3. 自动部署到 Cloudflare Pages

**优点**：
- 自动化程度高
- 每次 push 自动更新
- 源代码和构建产物分离

---

## 🚀 推荐的具体步骤

### 第一步：准备 GitHub 仓库

```bash
# 创建新仓库（在 GitHub 网页上创建，或使用 GitHub CLI）
gh repo create byvibe-deploy --public

# 或者使用现有仓库
```

### 第二步：本地准备部署文件

```bash
# 创建部署目录
mkdir ~/byvibe-deploy
cd ~/byvibe-deploy

# 初始化 Git
git init
git branch -M main

# 复制 Hero 页面
cp -r /Users/wubinyuan/Downloads/byvibe-hero/* .

# 构建 VibeToolbox
cd "/Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox"
pnpm install
pnpm build

# 复制 VibeToolbox 到部署目录
mkdir -p ~/byvibe-deploy/toolbox
cp -r dist/public/* ~/byvibe-deploy/toolbox/

# 创建路由配置文件
cd ~/byvibe-deploy
cat > _redirects << EOF
/toolbox/*  /toolbox/index.html  200
EOF

# 创建 .gitignore
cat > .gitignore << EOF
node_modules/
.DS_Store
*.log
EOF
```

### 第三步：提交到 GitHub

```bash
cd ~/byvibe-deploy
git add .
git commit -m "Initial deployment: Hero page + VibeToolbox"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 第四步：连接 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages** → **Create a project**
3. 选择 **Connect to Git**
4. 授权并选择你的仓库
5. 配置：
   - **Project name**: `byvibe`
   - **Production branch**: `main`
   - **Build command**: 留空（因为已经构建好了）
   - **Build output directory**: `.` (当前目录)
   - **Root directory**: `/` (留空)
6. 点击 **Save and Deploy**

### 第五步：配置自定义域名

1. 在项目设置中点击 **Custom domains**
2. 添加 `byvibe.ai` 和 `www.byvibe.ai`
3. Cloudflare 会自动配置 DNS

---

## 🔄 后续更新流程

### 更新 Hero 页面

```bash
cd ~/byvibe-deploy
# 修改文件
cp /path/to/updated/files/* .
git add .
git commit -m "Update hero page"
git push
# Cloudflare 会自动重新部署
```

### 更新 VibeToolbox

```bash
# 1. 重新构建 VibeToolbox
cd "/Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox"
pnpm build

# 2. 更新部署目录
rm -rf ~/byvibe-deploy/toolbox/*
cp -r dist/public/* ~/byvibe-deploy/toolbox/

# 3. 提交更新
cd ~/byvibe-deploy
git add toolbox/
git commit -m "Update VibeToolbox"
git push
```

---

## 📝 检查清单

部署前确认：
- [ ] Hero 页面文件完整（index.html, styles.css, script.js）
- [ ] VibeToolbox 已构建（`pnpm build` 成功）
- [ ] `toolbox/` 目录包含所有构建产物
- [ ] `_redirects` 文件已创建
- [ ] `.gitignore` 已配置
- [ ] GitHub 仓库已创建
- [ ] 文件已提交到 GitHub
- [ ] Cloudflare Pages 已连接仓库
- [ ] 自定义域名已配置

部署后验证：
- [ ] https://byvibe.ai 显示 Hero 页面
- [ ] https://byvibe.ai/toolbox 显示 VibeToolbox
- [ ] Hero 页面的按钮可以跳转
- [ ] 移动端响应式正常
- [ ] 所有资源加载正常

---

## ❓ 常见问题

### Q: 必须先部署 Hero 再部署 VibeToolbox 吗？

**A:** 不需要！推荐一次性合并部署，更简单高效。

### Q: 可以分开部署吗？

**A:** 可以，但不推荐。如果必须分开：
- Hero 页面：部署到根路径 `/`
- VibeToolbox：部署到 `/toolbox` 路径
- 需要配置 Cloudflare 的路由规则

### Q: 如何测试部署？

**A:** 
1. 使用 Cloudflare Pages 的预览部署功能
2. 或者先在本地测试完整结构
3. 参考 `BUILD-AND-TEST.md`

### Q: 更新时需要重新构建吗？

**A:** 
- Hero 页面：直接更新文件即可
- VibeToolbox：需要重新构建后更新 `toolbox/` 目录

---

## 🎯 总结

**推荐流程**：
1. ✅ 本地准备：合并两个项目的文件
2. ✅ 提交到 GitHub：一次性提交所有文件
3. ✅ 连接 Cloudflare：一次配置完成
4. ✅ 享受：两个页面都在线！

**不需要分步部署**，合并部署更简单、更高效！
