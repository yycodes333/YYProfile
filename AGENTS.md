# AGENTS.md

本文件为参与本项目的 AI 编码代理和开发者提供工作约定。开始修改前先阅读本文件及相关的 `PRD.md`、`TECH_DESIGN.md`，以它们作为产品范围和技术架构的依据。

## 项目概述

这是一个明亮、简洁、现代、适配桌面/平板/手机的个人展示网站，面向招聘者、潜在客户、合作伙伴、技术同行和内容读者。网站展示个人介绍、技能、项目案例、博客文章、精选 B 站视频以及公开联系方式，帮助访客快速了解个人背景与能力，并能轻松查看作品或建立联系。

一期是公开只读的内容型网站：不包含登录、评论、后台 CMS、站内私信或复杂搜索。项目与文章以 MDX/结构化内容维护；架构允许以后接入动态 API、管理能力和数据库。首页首屏应清晰表达“我是谁、擅长什么、做过什么”，重要内容和 CTA 不得被动画或第三方内容阻塞。

## 技术架构约定

- 前端使用 Next.js App Router、TypeScript 和 Tailwind CSS；优先使用 Server Components，仅在需要浏览器状态、事件或交互时使用 Client Components。
- 一期从 MDX/结构化文件读取内容，统一经 `lib/content` 解析和校验、经 `lib/services` 提供给页面。页面和组件不应自行散落解析内容或读数据库的逻辑。
- 动态后端能力按需使用 Next.js Route Handlers/Server Actions；浏览器不得直接访问数据库。
- 数据库确定为 **MySQL**，ORM 使用 Prisma。数据库是后续动态能力的扩展层；除非任务明确要求，不要为了静态展示内容提前引入数据库运行时依赖。
- 部署目标为 **Cloudflare**。涉及 Next.js SSR、静态生成、图片优化、环境变量或缓存时，需按项目采用的 Cloudflare 部署适配方式验证兼容性；不要默认假设 Vercel 专有能力可用。
- 图片使用适配项目部署方式的优化方案；媒体应提供明确尺寸/宽高比，避免布局偏移。
- 技术版本和命令以仓库现有 `package.json`、配置文件和锁文件为准。不要臆测版本或擅自迁移框架、包管理器、部署平台。

## 开发规范

1. **先调查再改动**：检查现有实现、相邻组件和配置，复用已存在的模式。除非用户要求，不重写无关模块、不修改 PRD 或技术设计文档。
2. **控制范围**：只实现当前任务和必要的配套改动。不要擅自增加登录、CMS、评论、统计、搜索或额外依赖。
3. **保持分层**：`app` 组织路由和页面；`components` 负责可复用展示与交互；`lib/content` 处理内容；`lib/services` 提供领域数据；`lib/repositories` 和 Prisma 仅在启用数据库后负责持久化。
4. **类型与边界校验**：保持 TypeScript 严格类型；在 MDX frontmatter、API 请求和外部输入边界进行运行时校验（优先使用现有 Zod 方案）。避免 `any` 和未经校验的类型断言。
5. **内容正确性**：项目和文章 slug 唯一且 URL 友好；日期格式一致；草稿不出现在公开页面和 sitemap；可选字段缺失时隐藏对应模块，不输出空卡片或无效按钮。
6. **安全**：不提交真实密钥、`.env`、数据库凭据或未公开个人信息；不要把服务端密钥、Prisma Client 或数据库连接导入客户端代码。外部链接、iframe 权限和内容渲染需遵循最小权限原则。
7. **依赖管理**：只有在现有技术无法合理满足需求时才加依赖；使用仓库当前包管理器，并同步更新锁文件。
8. **文档同步**：若实现变更了既定技术选择、数据模型、内容字段或运行方式，告知用户并按要求同步相关文档；不要悄悄造成文档与实现分歧。

## 代码风格

- 遵守仓库的 ESLint、Prettier、TypeScript 和 Tailwind 现有配置；若没有明确配置，遵循周边代码风格，不自行引入相互冲突的规范。
- 使用清晰、语义化的命名；组件、类型和类使用符合项目约定的 PascalCase，函数与变量使用 camelCase，常量使用现有项目约定。
- 优先写小而聚焦的组件和函数；避免重复实现、过度抽象和不必要的客户端状态。
- 使用语义化 HTML，如 `header`、`nav`、`main`、`section`、`article`、`footer`；按钮用于操作，链接用于导航。
- UI 保持明亮、克制、专业、友好；遵循现有色彩、间距、字体、网格、卡片和按钮规范，不随意增加视觉体系。
- 响应式布局以内容为依据，避免固定设备尺寸和横向溢出；交互不依赖 hover，触控目标建议至少 44×44px。
- 图片提供准确的 `alt`（装饰图使用空 alt），链接和图标按钮提供可理解名称；焦点状态清晰可见。
- 动效使用轻量实现，不能延迟核心内容或阻塞导航；必须尊重 `prefers-reduced-motion: reduce`。
- 不添加只复述代码的注释。仅对非显而易见的意图、约束或取舍添加注释。

## 测试与验证要求

根据改动范围运行可用的检查；使用仓库现有脚本，不要假设脚本名称或测试配置：

- TypeScript 类型检查。
- ESLint / 项目规定的格式检查。
- 单元或组件测试；涉及路由、导航、筛选、内容详情和响应式关键流程时运行相关 E2E 测试。
- 生产构建，尤其是新增/修改 Next.js 路由、MDX、metadata、图片或 Cloudflare 运行适配时。
- 视觉或交互改动需检查桌面、平板和移动视口，确认没有横向溢出、遮挡和严重布局跳动。
- 对键盘操作、可见焦点、图片替代文本、iframe 标题及减少动态效果偏好进行适当验证。
- 内容相关改动检查必填字段、唯一 slug、日期、内部路由、图片和外部链接；视频需验证失败时的备用链接。

如果某项检查无法运行，最终说明具体未运行项和原因；不要宣称未实际执行的检查已通过。

## 产品体验与质量注意事项

- 核心页面包括首页、关于、技能、项目列表/详情、博客列表/详情和 404；联系信息可在首页或独立页面展示。
- 首页可包含 Hero、主要 CTA、个人摘要、精选技能、精选项目、精选文章、热门 B 站视频和联系入口；没有配置的可选内容应隐藏。
- 项目筛选应有清晰空状态和清除筛选入口；筛选条件尽可能体现在 URL 中，便于分享与浏览器返回。
- 博客应保持清晰标题层级；长文章可提供目录；代码块可横向滚动，但页面整体不可横向溢出。
- B 站视频不自动播放、不自动发声；优先延迟加载或点击后加载，提供响应式比例、明确标题和外链回退，不得阻塞首屏。
- 为页面设置唯一的 title/description、canonical URL 和适用的分享元信息；草稿和不存在页面不得进入 sitemap。
- 外部内容失效不应影响站内主要内容。联系信息只展示站点所有者明确愿意公开的内容。
- 真实性优先：不得编造项目成果、量化数据、履历或技能熟练度。

## 完成任务前

- 查看变更 diff，确保没有意外文件或无关改动。
- 对改动文件运行可用的 lint/诊断；修复本次引入的问题。
- 总结修改内容、重要决策、运行过的验证及未验证事项。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
