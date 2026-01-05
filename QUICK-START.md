# 快速开始：Hero 页面 + VibeToolbox 联合部署

## 🎯 目标

将 Hero 页面（byvibe.ai）和 VibeToolbox 项目联合部署，实现：
- Hero 页面在根路径：`https://byvibe.ai/`
- VibeToolbox 在子路径：`https://byvibe.ai/toolbox`

## ⚡ 快速步骤

### 1. 配置 VibeToolbox 的 Base 路径

编辑 `vibetoolbox/vite.config.ts`，添加 `base` 配置：

```typescript
export default defineConfig({
  base: '/toolbox/',  // 添加这行
  plugins,
  // ... 其他配置保持不变
});
```

### 2. 构建 VibeToolbox

```bash
cd /Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox
pnpm install  # 如果还没安装依赖
pnpm build
```

构建产物会在 `dist/public` 目录。

### 3. 准备部署目录结构

创建部署目录并组织文件：

```bash
# 创建部署目录
mkdir -p ~/byvibe-deploy/public/toolbox

# 复制 Hero 页面文件到 public 根目录
cp -r /Users/wubinyuan/Downloads/byvibe-hero/* ~/byvibe-deploy/public/

# 复制 VibeToolbox 构建产物到 public/toolbox
cp -r /Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox/dist/public/* ~/byvibe-deploy/public/toolbox/
```

### 4. 部署到 Cloudflare Pages

#### 方式 A：通过 Git（推荐）

1. 将 `~/byvibe-deploy` 初始化为 Git 仓库
2. 推送到 GitHub/GitLab
3. 在 Cloudflare Pages 中连接仓库
4. 构建配置：
   - **Build command**: `echo "No build needed"`
   - **Build output directory**: `public`
   - **Root directory**: `/`

#### 方式 B：直接上传

1. 在 Cloudflare Pages 中创建新项目
2. 选择 "Upload assets"
3. 上传 `public` 目录中的所有文件

### 5. 配置路由重定向（Cloudflare Pages）

在 `public` 目录创建 `_redirects` 文件：

```
/toolbox/*  /toolbox/index.html  200
```

这确保所有 `/toolbox/*` 路径都正确路由到 VibeToolbox。

## 🧪 本地测试

### 测试 Hero 页面

```bash
cd /Users/wubinyuan/Downloads/byvibe-hero
python3 -m http.server 8080
```

访问 http://localhost:8080

### 测试 VibeToolbox（需要配置 base）

```bash
cd /Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox
# 先修改 vite.config.ts 添加 base: '/toolbox/'
pnpm dev
```

访问 http://localhost:3000/toolbox

### 测试完整部署结构

```bash
# 创建测试目录
mkdir -p ~/test-deploy/public/toolbox

# 复制文件
cp -r /Users/wubinyuan/Downloads/byvibe-hero/* ~/test-deploy/public/
cp -r /Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox/dist/public/* ~/test-deploy/public/toolbox/

# 启动服务器
cd ~/test-deploy/public
python3 -m http.server 8080
```

访问：
- http://localhost:8080/ （Hero 页面）
- http://localhost:8080/toolbox/ （VibeToolbox）

## ✅ 验证清单

- [ ] Hero 页面正常显示
- [ ] "Explore VibeToolbox" 按钮可见
- [ ] 点击按钮跳转到 `/toolbox`
- [ ] VibeToolbox 页面正常加载
- [ ] VibeToolbox 内的导航和路由正常
- [ ] 移动端响应式正常

## 🔧 故障排除

### 问题：点击链接后 404

**解决**：
1. 检查 `_redirects` 文件是否存在且配置正确
2. 确认 VibeToolbox 构建时使用了 `base: '/toolbox/'`
3. 检查文件路径是否正确

### 问题：VibeToolbox 资源加载失败

**解决**：
1. 确认 `vite.config.ts` 中设置了 `base: '/toolbox/'`
2. 重新构建 VibeToolbox
3. 检查浏览器控制台的资源路径

### 问题：开发环境无法测试

**解决**：
- 使用两个不同的端口分别运行
- 或者先构建后测试完整结构

## 📝 下一步

部署成功后，你可以：
1. 自定义 VibeToolbox 的内容和样式
2. 添加更多工具到 VibeToolbox
3. 优化两个页面的过渡动画
4. 添加分析统计

---

**需要帮助？** 查看 `DEPLOYMENT-GUIDE.md` 获取更详细的部署选项。
