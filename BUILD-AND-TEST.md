# 构建和测试指南

## 🚀 快速测试链接功能

我已经创建了一个测试页面，你可以立即测试链接是否正常工作。

### 方法一：使用测试页面（最快）

1. **启动 Hero 页面服务器**（如果还没启动）：
```bash
cd /Users/wubinyuan/Downloads/byvibe-hero
python3 -m http.server 8080
```

2. **访问测试页面**：
   - Hero 页面：http://localhost:8080
   - 测试的 VibeToolbox：http://localhost:8080/toolbox

3. **测试链接**：
   - 在 Hero 页面点击 "Explore VibeToolbox" 按钮
   - 应该能跳转到测试页面
   - 在测试页面点击 "返回 Hero 页面" 可以返回

### 方法二：构建真实的 VibeToolbox

#### 步骤 1：安装 pnpm（如果还没有）

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 或者使用 Homebrew (macOS)
brew install pnpm
```

#### 步骤 2：安装依赖

```bash
cd "/Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox"
pnpm install
```

#### 步骤 3：构建项目

```bash
pnpm build
```

构建产物会在 `dist/public` 目录。

#### 步骤 4：复制构建产物到测试目录

```bash
# 创建测试目录结构
cd /Users/wubinyuan/Downloads/byvibe-hero
mkdir -p test-deploy/toolbox

# 复制 Hero 页面文件
cp index.html styles.css script.js test-deploy/

# 复制 VibeToolbox 构建产物
cp -r "/Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox/dist/public/"* test-deploy/toolbox/
```

#### 步骤 5：启动测试服务器

```bash
cd test-deploy
python3 -m http.server 8080
```

访问 http://localhost:8080 测试完整功能。

## 📝 检查清单

- [ ] Hero 页面正常显示
- [ ] "Explore VibeToolbox" 按钮可见
- [ ] 点击按钮跳转到 `/toolbox`
- [ ] VibeToolbox 页面正常加载
- [ ] 返回链接正常工作
- [ ] 移动端响应式正常

## 🔧 常见问题

### Q: 点击链接显示 404

**A:** 确保：
1. 测试页面 `toolbox/index.html` 存在
2. 服务器在正确的目录启动
3. 路径是 `/toolbox` 而不是 `/toolbox/`

### Q: 如何替换测试页面为真实项目

**A:** 
1. 构建 VibeToolbox：`pnpm build`
2. 将 `dist/public` 中的所有文件复制到 `toolbox/` 目录
3. 确保 `vite.config.ts` 中设置了 `base: '/toolbox/'`

### Q: 开发环境如何同时运行两个项目

**A:** 使用两个终端：

**终端 1 - Hero 页面：**
```bash
cd /Users/wubinyuan/Downloads/byvibe-hero
python3 -m http.server 8080
```

**终端 2 - VibeToolbox：**
```bash
cd "/Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox"
pnpm dev
# 访问 http://localhost:3000/toolbox
```

## 🎯 下一步

测试成功后：
1. 构建生产版本的 VibeToolbox
2. 按照 `DEPLOYMENT-GUIDE.md` 部署到 Cloudflare Pages
3. 配置自定义域名
4. 享受你的网站！🎉
