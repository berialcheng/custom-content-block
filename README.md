# Salesforce MCE Custom Content Block - 产品推荐模块

一个用于 Salesforce Marketing Cloud Engagement 的自定义内容块，用于在邮件中展示产品推荐。

## 功能

- 📦 产品推荐展示（支持网格、列表、轮播三种布局）
- ✏️ 自定义标题文字
- 👀 实时预览
- 📱 响应式设计
- 🚀 适配 Vercel 部署

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看效果。

## 部署到 Vercel

### 方法一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 方法二：通过 GitHub

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. Vercel 会自动部署

## 在 Marketing Cloud 中配置

1. **创建 Installed Package**
   - 登录 Marketing Cloud Setup
   - 导航到 Platform Tools > Apps > Installed Packages
   - 创建新的 Package

2. **添加 Custom Content Block 组件**
   - 在 Package 中添加组件
   - 选择 "Custom Content Block"
   - 配置 Endpoint URL 为你的 Vercel URL

3. **更新 config.json**
   - 将 `public/config.json` 中的 `{{YOUR_VERCEL_URL}}` 替换为你的实际 URL
   - 将 `{{YOUR_APP_EXTENSION_KEY}}` 替换为你的 App Extension Key

## 配置说明

### config.json 参数

| 参数 | 说明 |
|------|------|
| `customText` | 自定义标题文字 |
| `products` | 产品数组 |
| `layout` | 布局方式: grid/list/carousel |
| `maxProducts` | 最大显示产品数量 |

### 产品数据结构

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "currency": "string",
  "imageUrl": "string",
  "productUrl": "string"
}
```

## 自定义产品数据

要使用真实产品数据，可以修改 `src/lib/mce-sdk.ts` 中的 `sampleProducts` 或集成您的产品 API。

## 技术栈

- Next.js 16
- TypeScript
- Tailwind CSS
- Salesforce MCE SDK (postmonger)

## License

MIT
