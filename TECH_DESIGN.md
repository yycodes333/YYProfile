# 个人展示网站技术设计文档

- **文档版本**：v1.0
- **对应 PRD**：`PRD.md` v1.0
- **目标**：为个人展示网站提供易开发、易维护、性能良好并可持续扩展的技术方案。
- **一期原则**：网站以公开只读内容为主，优先静态生成和低运维成本；不为了尚未存在的后台管理、评论或复杂统计引入不必要的运行时服务。

## 1. 技术方案概览

### 1.1 推荐架构

采用 **Next.js 全栈应用 + TypeScript + MDX 内容 + PostgreSQL 扩展层** 的架构：

```text
访客浏览器
    |
    v
CDN / cloudflare 
    |
    v
Next.js App Router
    |-- Server Components：页面渲染、SEO、读取内容
    |-- Client Components：筛选、菜单、动画、视频交互
    |-- Route Handlers：未来联系表单、统计或管理 API
    |
    |-- MDX 文件：一期项目、博客和个人内容
    |-- Mysql + Prisma：二期动态数据、管理后台、统计扩展
    |
    |-- 图片/CDN 存储：头像、项目截图、文章封面、简历
    `-- B 站 iframe/外链：第三方视频内容
```

一期可以只部署 Next.js 与 MDX 内容，不连接数据库；数据库和 API 层保留清晰的扩展边界。这样既满足后续数据库需求，也避免静态个人网站在首期承担不必要的数据库运维成本。

### 1.2 技术栈选择


| 层次    | 技术                                                           | 选择理由                                                 |
| ----- | ------------------------------------------------------------ | ---------------------------------------------------- |
| 前端框架  | Next.js App Router                                           | 同时支持静态生成、服务端渲染、路由、SEO、图片优化和后续 API；适合内容型网站            |
| 编程语言  | TypeScript                                                   | 为内容字段、组件参数、接口和数据库访问提供类型约束，降低内容维护错误                   |
| UI 样式 | Tailwind CSS                                                 | 适合快速建立响应式布局和设计令牌，避免页面样式分散；复杂组件使用 CSS Modules 或局部样式补充 |
| UI 组件 | 自建语义化组件，必要时采用 Radix UI primitives                            | 保留视觉定制能力，同时获得菜单、Dialog、Tabs 等交互的可访问性基础               |
| 内容格式  | MDX                                                          | 博客和项目内容可版本化、可审查，支持 Markdown 与可控 React 内容组件           |
| 内容处理  | `next-mdx-remote` 或基于 Next.js 的 MDX 集成                       | 将 frontmatter、正文和自定义组件组织为可复用内容管线；最终以项目锁定的稳定版本为准      |
| 数据库   | MySql                                                        | 关系模型成熟，适合项目、文章、技能、标签及未来用户管理；便于云端托管和迁移                |
| ORM   | Prisma                                                       | 类型安全、迁移清晰、与 TypeScript/Next.js 集成成本低                 |
| 后端    | Next.js Server Components、Server Actions/Route Handlers      | 一期不需要独立后端；未来可在同一代码库中增加联系表单、动态内容 API 或管理能力            |
| 数据校验  | Zod                                                          | 在内容读取、API 请求和环境变量边界进行运行时校验，与 TypeScript 类型推导配合       |
| 动画    | CSS transitions/keyframes + Intersection Observer；必要时 Motion | 优先使用轻量原生能力，避免动画库影响首屏性能；复杂翻阅动效再引入 Motion              |
| 图片    | `next/image` + WebP/AVIF                                     | 提供尺寸约束、懒加载和响应式图片，减少布局偏移与流量                           |
| 测试    | Vitest、React Testing Library、Playwright                      | 分别覆盖数据函数/组件逻辑和导航、筛选、响应式核心流程                          |
| 代码质量  | ESLint、Prettier、TypeScript strict                            | 统一风格并尽早发现类型、可访问性和无效导入问题                              |
| 部署    | cloudflare                                                   | 与 Next.js 集成简单，支持 CDN、预览部署、环境变量和按需重新部署               |




### 1.3 前后端边界

**一期不设置独立后端服务。** 页面数据在构建阶段从 MDX 文件读取，由 Next.js 生成静态页面或可缓存的服务端页面。浏览器只负责交互，不直接访问数据库。

后续需要动态功能时再增加以下边界：

- 浏览器 → Route Handler/Server Action → Zod 校验 → Service 层 → Prisma → MySQL。
- 数据库访问只允许发生在服务端，禁止把数据库连接、密钥或 Prisma Client 打包到浏览器端。
- 页面层不直接拼接 SQL 或散落数据库查询，统一通过 `lib/services` 或 `lib/repositories` 访问。



## 2. 项目结构

建议使用单一 Next.js 应用，按页面、组件、内容和服务职责组织代码：

```text
MyProfile/
├── app/
│   ├── layout.tsx                 # 全局布局、字体、metadata 基础配置
│   ├── page.tsx                   # 首页
│   ├── not-found.tsx              # 404 页面
│   ├── globals.css                # 全局样式、设计令牌、动画基础样式
│   ├── about/page.tsx             # 个人介绍
│   ├── skills/page.tsx            # 技能展示
│   ├── projects/
│   │   ├── page.tsx               # 项目列表与筛选
│   │   └── [slug]/page.tsx        # 项目详情
│   ├── blog/
│   │   ├── page.tsx               # 博客列表
│   │   └── [slug]/page.tsx        # 文章详情
│   ├── contact/page.tsx            # 可选联系页
│   ├── sitemap.ts                  # sitemap 生成
│   ├── robots.ts                   # robots 生成
│   └── api/                       # 仅在需要动态能力时增加
│       └── contact/route.ts       # 后续联系表单接口
├── components/
│   ├── layout/                    # Header、Footer、MobileNav、Container
│   ├── home/                      # Hero、FeaturedProjects、FeaturedPosts、VideoSection
│   ├── profile/                   # Timeline、ContactLinks
│   ├── skills/                    # SkillGroup、SkillItem
│   ├── projects/                  # ProjectCard、ProjectFilter、ProjectMedia
│   ├── blog/                      # PostCard、PostFilter、PostNavigation、TableOfContents
│   ├── media/                     # ResponsiveVideo、ResponsiveImage
│   ├── ui/                        # Button、Badge、Card、EmptyState、IconButton
│   └── motion/                    # FadeIn、PageTransition 等可选动画封装
├── content/
│   ├── profile/                   # profile、experience、education 等结构化内容
│   ├── projects/                 # 项目 MDX 文件
│   └── blog/                     # 博客 MDX 文件
├── lib/
│   ├── content/                  # frontmatter 读取、MDX 编译、内容排序与筛选
│   ├── services/                 # profile、project、post 等业务查询
│   ├── repositories/             # 数据库读写，二期启用
│   ├── validation/               # Zod schema
│   ├── seo/                      # metadata、Open Graph、canonical URL
│   ├── analytics/                # 隐私友好的统计封装，可选
│   ├── db.ts                     # Prisma Client 单例，二期启用
│   └── constants.ts              # 站点名称、导航、外部链接等常量
├── public/
│   ├── images/                   # 头像、封面、项目截图等静态资源
│   ├── icons/                    # favicon、社交图标
│   └── resume/                   # 可选简历文件
├── prisma/
│   ├── schema.prisma             # 数据库模型，二期启用
│   └── migrations/               # 数据库迁移
├── tests/
│   ├── unit/                     # 工具函数、数据转换测试
│   ├── components/               # 组件测试
│   └── e2e/                      # Playwright 端到端测试
├── .env.example                  # 环境变量示例，不放真实密钥
├── next.config.ts
├── tailwind.config.ts            # 若项目版本仍使用独立 Tailwind 配置
├── tsconfig.json
├── eslint.config.*
└── package.json
```



### 2.1 组织原则

- `app` 只负责路由、页面组合和页面级 metadata，不承载复杂业务逻辑。
- `components` 负责展示和交互；可复用组件不直接读取文件或数据库。
- `lib/content` 统一处理 MDX，不允许每个页面自行解析 frontmatter。
- `lib/services` 返回页面需要的领域数据，页面不关心数据来自 MDX 还是数据库。
- `content` 是可审查的内容源，图片路径、slug、发布日期和外部链接发布前校验。
- 只在真正需要浏览器状态、事件监听、Intersection Observer 或播放器控制时使用 `use client`。



## 3. 数据流与渲染策略



### 3.1 一期静态内容流

```text
MDX/JSON 内容
   -> 内容解析与 Zod 校验
   -> service 查询、排序、筛选
   -> Server Component
   -> 静态生成 HTML/metadata
   -> CDN 缓存
   -> 浏览器端仅处理筛选、菜单、动画等交互
```

- 首页、关于、技能、项目和博客等页面优先静态生成。
- 项目详情和文章详情通过 `generateStaticParams` 预生成已发布 slug。
- 草稿内容不参与构建和 sitemap。
- 标签筛选优先使用 URL 查询参数，例如 `/projects?tag=react`，便于分享和返回。



### 3.2 二期数据库流

```text
MySQL
   -> Prisma Repository
   -> Service 层
   -> Server Component / Route Handler
   -> 页面或受控客户端交互
```

数据库接入后，仍保持页面接口与内容来源解耦，使 MDX 到数据库的迁移不需要重写主要 UI。

## 4. 数据模型



### 4.1 一期内容模型

一期以文件为存储介质，但字段设计与数据库模型保持一致。

#### Profile


| 字段            | 类型           | 必填  | 说明         |
| ------------- | ------------ | --- | ---------- |
| `name`        | string       | 是   | 姓名或展示名     |
| `role`        | string       | 是   | 职业/角色      |
| `headline`    | string       | 是   | Hero 一句话主张 |
| `bio`         | string/MDX   | 是   | 个人简介       |
| `avatar`      | string       | 否   | 头像路径       |
| `location`    | string       | 否   | 公开所在地或时区   |
| `email`       | string       | 是   | 公开联系邮箱     |
| `resumeUrl`   | string       | 否   | 简历链接       |
| `socialLinks` | SocialLink[] | 否   | 社交平台链接     |




#### Experience / Education

- `id`：唯一标识。
- `organization` / `school`：组织或学校名称。
- `title` / `major`：职位或专业。
- `startDate`、`endDate`：开始和结束日期，当前经历允许为空。
- `description`：职责、成果或补充说明。
- `sortOrder`：展示顺序。



#### Skill

- `id`：唯一标识。
- `name`：技能名称。
- `category`：技能分类。
- `level`：可选的 `basic`、`familiar`、`proficient`、`expert` 等描述值。
- `description`：使用场景或经验说明。
- `projectSlugs`：关联项目 slug 列表。
- `featured`：是否在首页展示。
- `sortOrder`：分类内排序。



#### Project

- `slug`：URL 唯一标识，只允许小写字母、数字和连字符。
- `title`：项目名称。
- `summary`：列表摘要。
- `cover`：封面资源对象，包含 `src`、`alt`、`width`、`height`。
- `tags`：标签列表。
- `role`：个人职责。
- `stack`：技术栈名称列表。
- `period`：项目周期。
- `content`：详情正文，建议使用 MDX。
- `results`：成果列表，不虚构指标。
- `media`：截图、演示视频等媒体列表。
- `demoUrl`、`repoUrl`：可选外部链接。
- `featured`：是否首页精选。
- `publishedAt`：发布时间。
- `updatedAt`：更新时间。
- `status`：`draft`、`published`、`archived`。



#### Post

- `slug`：URL 唯一标识。
- `title`：文章标题。
- `excerpt`：摘要。
- `cover`：可选封面。
- `category`：文章分类。
- `tags`：标签列表。
- `publishedAt`、`updatedAt`：发布日期和更新时间。
- `readingTime`：阅读时长，单位分钟。
- `content`：MDX 正文。
- `featured`：是否首页精选。
- `status`：`draft`、`published`、`archived`。



#### Video

- `id`：B 站视频 BV 号或内部唯一标识。
- `title`：视频标题。
- `description`：文字摘要。
- `coverUrl`：封面地址，可选。
- `bilibiliUrl`：B 站页面地址。
- `embedUrl`：经校验的嵌入地址，可选。
- `featured`：是否在首页展示。
- `sortOrder`：展示顺序。



### 4.2 二期 PostgreSQL 模型

推荐的关系：

```text
Profile 1 --- N Experience
Profile 1 --- N Education
Skill N --- N Project
Project N --- N Tag
Post N --- N Tag
Project 1 --- N ProjectMedia
Post 1 --- N PostMedia
Video N --- N Tag（可选）
```

建议表：`profiles`、`experiences`、`educations`、`skills`、`projects`、`tags`、`project_tags`、`posts`、`post_tags`、`media`、`videos`。

数据库约束：

- `slug`、`email`、外部视频 ID 等字段按业务需要添加唯一约束。
- `status`、`published_at`、`updated_at`、`featured` 建立常用查询索引。
- 多对多关系使用显式关联表，避免将来无法存储排序和关联属性。
- 所有时间统一使用 UTC 存储，展示时按站点配置或用户浏览器时区格式化。
- 内容正文可先存 Markdown/MDX 原文；不把未经处理的 HTML 直接插入页面。



## 5. 关键技术点与注意事项



### 5.1 MDX 内容安全与一致性

- frontmatter 使用 Zod 校验，缺少必填字段或 slug 重复时让构建失败，而不是生成半成品页面。
- 只开放白名单内的 MDX 组件，禁止任意执行用户提交的 React/JavaScript。
- 外部链接、图片路径、日期、标签和状态在构建阶段校验。
- 博客代码块使用语法高亮和横向滚动容器，不能造成页面整体溢出。



### 5.2 SEO、路由与缓存

- 为首页、项目详情、文章详情生成独立 metadata、canonical URL 和 Open Graph 图片。
- 使用 `generateStaticParams` 预生成稳定内容，草稿不进入公开路由。
- 404、失效 slug 和已下线内容返回正确状态，不通过前端空白页伪装成功。
- 使用 sitemap 和 robots 文件；发布新内容后通过部署或重新验证刷新缓存。



### 5.3 B 站嵌入

- 默认不自动播放、不自动发声，避免影响用户体验和移动端流量。
- 使用响应式宽高比容器，例如 `aspect-ratio: 16 / 9`，限制 iframe 权限为必要范围。
- 优先显示封面或占位内容，用户点击后再加载 iframe，降低第三方脚本对首屏的影响。
- 不将 B 站视频下载或代理到本站；保存 BV 号、展示地址和必要的嵌入地址即可。
- 播放器不可用时保留标题、摘要和前往 B 站的链接。



### 5.4 响应式与可访问性

- 使用 CSS Grid/Flex 和内容驱动断点，禁止为单一设备写死布局。
- 菜单、筛选、目录和翻页交互必须支持键盘和触屏，不能只依赖 hover。
- 使用语义 HTML、可见 focus、正确的 heading 层级、图片 `alt` 和 iframe 标题。
- 移动端菜单打开时管理焦点，按 Escape 关闭，关闭后返回菜单按钮。
- 动画默认对全部访客生效（本项目已移除 `prefers-reduced-motion` 降级，政策见 `PRD2.md` §3.7）；无限循环动效只用于装饰元素，且必须由容器裁剪，不得产生横向溢出；首屏文本和按钮不等待动画才出现。



### 5.5 动效实现

- 滚动淡入优先使用 `IntersectionObserver` 和 CSS class，避免给每个卡片引入大型客户端运行时。
- 只有需要复杂页面过渡、手势或可中断时间线时再使用 Motion。
- 页面切换动效不应影响 URL、浏览器后退、键盘导航和屏幕阅读器阅读顺序。
- 动画组件放在 `components/motion`，业务组件只声明需要的动效类型，避免动画逻辑散落。



### 5.6 图片与性能

- 使用 `next/image` 声明图片尺寸和 `sizes`，避免 CLS；封面、头像和截图准备合理尺寸的源文件。
- 首屏关键图像优先加载，非首屏媒体懒加载；图片压缩并优先使用现代格式。
- B 站 iframe、第三方字体和统计脚本延迟加载，不阻塞首屏。
- 对项目详情和文章正文建立缓存策略，只有内容更新时重新生成相关页面。



### 5.7 数据库与 API 安全

- 数据库连接只在服务端使用，生产环境通过环境变量注入，不提交 `.env`。
- Route Handler 接收请求后先用 Zod 校验，再执行业务逻辑；错误信息不泄露数据库细节。
- 若增加联系表单，需加入限流、反垃圾策略、长度限制和 CSRF/Origin 检查，并避免直接把用户输入渲染为 HTML。
- Prisma 迁移纳入版本控制；生产环境执行迁移前备份并验证回滚策略。



### 5.8 观测与隐私

- 一期可不接统计；若接入，优先选择隐私友好的匿名统计，并明确隐私说明。
- 记录构建失败、接口错误和第三方视频加载失败，不记录不必要的个人信息。
- 关键指标可围绕首页到项目、博客和联系入口的点击链路设计，避免过度采集。



## 6. 测试与发布策略



### 6.1 测试重点

- 单元测试：slug 解析、frontmatter 校验、排序、筛选、阅读时长和 metadata 生成。
- 组件测试：导航菜单、项目筛选、空状态、视频回退、动效入场与滚动进度反馈。
- E2E 测试：首页 CTA、项目详情、博客详情、URL 筛选、404、移动端菜单和键盘流程。
- 可访问性测试：使用 axe 或 Lighthouse 检查语义、对比度、焦点和名称。
- 链接检查：发布前检查内部路由、图片、Demo、代码仓库和 B 站地址。



### 6.2 发布流程

1. 本地运行类型检查、Lint、测试和构建。
2. 提交 Pull Request，自动生成预览部署。
3. 在桌面、平板和移动视口检查布局、视频、动画和键盘操作。
4. 合并到主分支后部署生产环境。
5. 发布后检查首页、主要详情页、sitemap、robots 和外部链接。



## 7. 分阶段实施建议



### 阶段一：内容型 MVP

- 初始化 Next.js、TypeScript、Tailwind、Lint 和测试工具。
- 完成公共布局、首页、关于、技能、项目列表/详情、博客列表/详情和 404。
- 接入 MDX、图片优化、metadata、sitemap、robots 和 B 站延迟加载。
- 完成响应式、无障碍、动效减少偏好和基础 E2E 测试。



### 阶段二：内容管理与动态能力

- 引入MySQL、Prisma 和迁移脚本。
- 增加受保护的内容管理入口，或迁移到 Headless CMS。
- 增加联系表单、邮件通知、限流、错误监控和隐私友好的统计。
- 根据内容量增加博客搜索、RSS、相关文章和更多视频平台适配。



## 8. 技术决策总结

- **前端**：Next.js + TypeScript + Tailwind CSS，兼顾静态性能、SEO 和组件化开发。
- **后端**：一期使用 Next.js 服务端能力，不设置独立后端；动态功能通过 Route Handlers/Server Actions 扩展。
- **数据库**：二期使用 MySQL + Prisma；一期内容使用 MDX 文件，减少运维成本。
- **内容策略**：项目和博客 Markdown/MDX 化并纳入版本控制，结构化字段与未来数据库模型保持一致。
- **部署策略**：优先 cloudflare/CDN，使用预览部署保障内容和视觉改动可验证。
- **核心原则**：静态优先、服务端优先、客户端最小化、内容可校验、动态能力可渐进增加。

