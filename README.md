# Notion Portfolio / Notion 作品集

[English](#english) | [中文](#中文)

---

## English

### Project Description

A modern, full-featured portfolio website built with **Next.js 15** that automatically syncs project data from a **Notion database**. Designed for developers and designers who want a clean, professional portfolio without managing a separate CMS.

### Features

- **SSR / ISR Instant Loading** — Server-Side Rendering with Incremental Static Regeneration for blazing-fast page loads and up-to-date content
- **Day / Night Theme** — Seamless light and dark mode toggle with system preference detection
- **Category Filter** — One-click filtering to browse projects by category
- **Search** — Real-time project search by name or description
- **Project Detail Modal** — Smooth modal overlay with full project details, links, and metadata
- **Responsive Design** — Fully mobile-friendly layout built with Tailwind CSS

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Data Source | Notion API |
| Language | TypeScript |
| Containerization | Docker + Docker Compose |

### Notion Database Setup

Create a Notion database with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `Name` | Title | Project name |
| `Icon` | Text | Emoji or icon character |
| `Category` | Select | Project category (e.g. Web, Mobile, AI) |
| `Description` | Text | Short project description |
| `GitHub URL` | URL | Link to GitHub repository |
| `Live URL` | URL | Link to live demo |
| `Published` | Checkbox | Whether to show on portfolio |
| `Order` | Number | Display order (lower = higher priority) |

### Environment Configuration

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

**How to get these values:**
1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) and create a new integration
2. Copy the **Internal Integration Token** → `NOTION_TOKEN`
3. Open your Notion database, click **Share** → **Copy link**, extract the database ID from the URL → `NOTION_DATABASE_ID`
4. In your Notion database, click **...** → **Add connections** → add your integration

### Docker Deployment

```bash
# Clone the repository
git clone https://github.com/fidjiw/notion-portfolio.git
cd notion-portfolio

# Configure environment
cp .env.example .env
# Edit .env with your Notion credentials

# Start with Docker Compose
docker compose up -d

# The site will be available at http://localhost:3000
```

### Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 中文

### 项目简介

一个基于 **Next.js 15** 构建的现代化个人作品集网站，自动同步 **Notion 数据库**中的项目数据。专为开发者和设计师设计，无需维护独立的 CMS 系统，即可拥有简洁、专业的个人主页。

### 功能特性

- **SSR / ISR 即时加载** — 服务端渲染结合增量静态再生，页面加载极速且内容始终最新
- **日间 / 夜间主题** — 流畅的亮暗模式切换，自动检测系统偏好
- **分类筛选** — 一键按分类浏览项目
- **搜索功能** — 实时搜索项目名称或描述
- **项目详情弹窗** — 平滑弹出层展示完整项目信息、链接与元数据
- **响应式设计** — 基于 Tailwind CSS 的完整移动端适配布局

### 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 样式 | Tailwind CSS |
| 数据源 | Notion API |
| 语言 | TypeScript |
| 容器化 | Docker + Docker Compose |

### Notion 数据库配置

创建一个 Notion 数据库，包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `Name` | 标题 | 项目名称 |
| `Icon` | 文本 | Emoji 或图标字符 |
| `Category` | 选择 | 项目类别（如 Web、Mobile、AI） |
| `Description` | 文本 | 项目简短描述 |
| `GitHub URL` | URL | GitHub 仓库链接 |
| `Live URL` | URL | 在线演示链接 |
| `Published` | 复选框 | 是否在作品集中显示 |
| `Order` | 数字 | 展示顺序（数字越小越靠前） |

### 环境变量配置

将 `.env.example` 复制为 `.env.local` 并填入实际值：

```bash
cp .env.example .env.local
```

```env
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

**获取方式：**
1. 访问 [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) 创建新集成
2. 复制 **Internal Integration Token** → 填入 `NOTION_TOKEN`
3. 打开 Notion 数据库，点击 **分享** → **复制链接**，从 URL 中提取数据库 ID → 填入 `NOTION_DATABASE_ID`
4. 在 Notion 数据库中点击 **...** → **添加连接** → 选择你创建的集成

### Docker 部署

```bash
# 克隆仓库
git clone https://github.com/fidjiw/notion-portfolio.git
cd notion-portfolio

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的 Notion 凭据

# 使用 Docker Compose 启动
docker compose up -d

# 网站将在 http://localhost:3000 可访问
```

### 本地开发

```bash
npm install
npm run dev
# 打开 http://localhost:3000
```

---

## License

MIT
