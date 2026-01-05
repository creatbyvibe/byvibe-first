# Hero 页面与 VibeToolbox 联合部署指南

本指南将帮助你将 Hero 页面（byvibe.ai）和 VibeToolbox 项目联合部署。

## 📁 项目结构

```
byvibe.ai/
├── index.html          # Hero 页面（根路径 /）
├── styles.css
├── script.js
└── toolbox/            # VibeToolbox 项目（路径 /toolbox）
    ├── index.html
    ├── assets/
    └── ...
```

## 🚀 部署方案

### 方案一：Cloudflare Pages（推荐）

#### 1. 准备 Hero 页面

Hero 页面已经是静态文件，可以直接部署。

#### 2. 构建 VibeToolbox

```bash
cd /Users/wubinyuan/Downloads/如何丰富Hero页并构建后续项目链接/vibetoolbox
pnpm install
pnpm build
```

构建产物会在 `dist/public` 目录。

#### 3. 合并项目结构

```bash
# 在 Cloudflare Pages 项目根目录
mkdir -p public/toolbox
# 将 VibeToolbox 的构建产物复制到 public/toolbox
cp -r vibetoolbox/dist/public/* public/toolbox/
# 将 Hero 页面文件复制到 public 根目录
cp byvibe-hero/* public/
```

#### 4. Cloudflare Pages 配置

在 Cloudflare Dashboard 中：
- **Build command**: `pnpm build`（如果需要构建）
- **Build output directory**: `public`
- **Root directory**: `/`

#### 5. 路由配置

在 `public` 目录创建 `_redirects` 文件（如果使用 Cloudflare Pages）：

```
/toolbox/*  /toolbox/index.html  200
```

### 方案二：使用 Nginx（自托管）

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name byvibe.ai www.byvibe.ai;

    # Hero 页面（根路径）
    location / {
        root /var/www/byvibe;
        try_files $uri $uri/ /index.html;
    }

    # VibeToolbox（/toolbox 路径）
    location /toolbox {
        alias /var/www/byvibe/toolbox;
        try_files $uri $uri/ /toolbox/index.html;
    }
}
```

### 方案三：使用 Vite 开发服务器（开发环境）

#### 1. 修改 VibeToolbox 的 Vite 配置

编辑 `vibetoolbox/vite.config.ts`：

```typescript
export default defineConfig({
  // ... 其他配置
  base: '/toolbox/',  // 添加这行
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public/toolbox"),
    // ... 其他配置
  },
});
```

#### 2. 启动开发服务器

```bash
# 启动 VibeToolbox（端口 3000）
cd vibetoolbox
pnpm dev

# 启动 Hero 页面（端口 8080）
cd byvibe-hero
python3 -m http.server 8080
```

#### 3. 使用代理（可选）

使用 `vite-plugin-proxy` 或 Nginx 反向代理将两个服务合并。

## 🔗 链接配置

### 当前配置

Hero 页面中的链接指向 `/toolbox`，这是相对路径，会根据部署方式自动适配。

### 如果需要修改链接

编辑 `byvibe-hero/index.html`：

```html
<!-- 相对路径（推荐，适用于同域名部署） -->
<a href="/toolbox" class="toolbox-link">Explore VibeToolbox</a>

<!-- 绝对路径（适用于不同子域名） -->
<a href="https://toolbox.byvibe.ai" class="toolbox-link">Explore VibeToolbox</a>

<!-- 完整 URL -->
<a href="https://byvibe.ai/toolbox" class="toolbox-link">Explore VibeToolbox</a>
```

## 📝 部署检查清单

- [ ] Hero 页面在根路径 `/` 正常显示
- [ ] VibeToolbox 在 `/toolbox` 路径正常显示
- [ ] Hero 页面的 "Explore VibeToolbox" 按钮可以正常跳转
- [ ] 所有静态资源（CSS、JS、图片）正常加载
- [ ] 移动端响应式正常
- [ ] 浏览器控制台无错误

## 🛠️ 常见问题

### Q: 点击链接后显示 404

**A:** 检查路由配置：
- Cloudflare Pages: 确保 `_redirects` 文件配置正确
- Nginx: 确保 `try_files` 配置正确
- Vite: 确保 `base` 路径配置正确

### Q: 静态资源加载失败

**A:** 检查资源路径：
- VibeToolbox 构建时使用 `base: '/toolbox/'`
- 确保所有资源路径都是相对路径或使用正确的 base

### Q: 开发环境如何测试

**A:** 
1. 使用两个不同的端口分别运行两个项目
2. 使用代理服务器合并
3. 或者直接构建后测试

## 📚 相关文档

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Nginx 配置指南](https://nginx.org/en/docs/)

---

**提示**: 部署前建议在本地测试所有链接和功能是否正常。
