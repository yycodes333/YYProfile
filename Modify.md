# Modify.md — 深色视觉改版与首页精修规格（v2.0）

> 日期：2026-10-28
> 依据：本文根据本轮 12 条修改意见、15 张截图（现状与参考）和 2 个参考网站整理。
> 关系：本文是这一轮改版的施工依据。与 [`Improve.md`](Improve.md) 冲突的地方，以本文为准；不改变 [`PRD.md`](PRD.md)、[`TECH_DESIGN.md`](TECH_DESIGN.md) 里的工程约定（Next.js App Router、TypeScript、Tailwind、Cloudflare 部署、内容层分层）。
> 范围：先落文档，再按 §13 的阶段实施。本文不包含代码改动。

---

## 0. 先看结论

这次不是“在现有浅色页面上修几个细节”，而是一次视觉方向调整：

1. **全站改为独特的深色**。不是纯黑，也不是常见的蓝黑仪表盘，而是“深空墨色”：墨蓝黑底、暖象牙白文字、紫罗兰到品红的光带；照片和证书像被一束暖光打亮，浮在深空里。
2. **顶栏只留导航**。删除左上角“苑阳 Mike Jason”，右侧导航字号放大、右对齐。
3. **Hero 重新排布**。照片改成圆形；姓名变成大幅衬线字；GitHub / B 站改成无边框裸图标；角色改成低饱和灰紫、宽字距的小字。
4. **原来的五条波纹换成一条丝带**。用 36–48 条贝塞尔曲线组成有厚度、有交叉、有渐变和辉光的丝带，参考图 3 的高级感。
5. **五个区块标题只留字**。关于 / 技能 / 作品 / 证书 / 联系统一为大幅、飘逸的衬线标题，去掉紫色下划线和英文小标签。
6. **技能区改成真正的“星轨”**。删除左侧分类栏和暂停按钮；五个分类框沿一个椭圆公转，框内只列技术名；椭圆底是 `星空.gif`；鼠标进入暂停，离开继续。
7. **作品卡变成静态陈列**。删除“查看项目详情”和整个项目详情/列表路由；项目卡不再可点；图片比例重新适配。
8. **两个视频统一外框**。都用深色显示器外框；左侧不再拿竖版机械臂图硬塞 16:9；回退链接改到 GitHub。
9. **笔记区换成证书区**。三张占位证书卡，全部使用 `中国机器人.png`、日期 `2026.7`、PDF `中国机器人.pdf`；导航“笔记”改为“证书”。
10. **博客路由保留但退出导航和 sitemap**。`/blog` 与 `/blog/[slug]` 仍可直接访问，不再从首页、页脚、404 和站点地图进入。

---

## 1. 需求总表：你的原话 → 整理后的目标

| # | 你的原话（整理） | 目标效果 | 主要落点 |
|---|---|---|---|
| 1 | 图 1 第一栏去除“苑阳 Mike Jason”；右侧栏目字号放大 | 顶栏只留导航，导航右对齐，字号更大、更清楚 | [`components/layout/SiteHeader.tsx`](components/layout/SiteHeader.tsx)、[`app/globals.css`](app/globals.css) |
| 2 | 图 1 框选的图片改成圆形，比例大小适配周围 | Hero 右侧照片变成圆形，去掉方形背板，尺寸与姓名块平衡 | [`app/page.tsx`](app/page.tsx)、[`app/globals.css`](app/globals.css) |
| 3 | “算法控制工程师”修改配色以及字体 | 去掉紫色加粗，改成低饱和灰紫、常规字重、宽字距 | [`app/globals.css`](app/globals.css) |
| 4 | 图 2 的纹路线条单调，缺乏高级感，参考图 3 | 五条平线改成多层丝带：渐变、粗细、交叉、辉光、缓慢漂移 | [`components/ui/WaveTransition.tsx`](components/ui/WaveTransition.tsx)、[`app/globals.css`](app/globals.css) |
| 5 | “苑阳”字号字体修改；B 站/GitHub 图标与角色的位置搭配，参考图 3 | 姓名成为视觉主角；图标裸化并贴近姓名；角色退到姓名下方 | [`app/page.tsx`](app/page.tsx)、[`components/home/HeroSocials.tsx`](components/home/HeroSocials.tsx)、[`app/globals.css`](app/globals.css) |
| 6 | 关于/技能/作品/笔记/联系：字体飘逸、字号变大、去掉下划线，只留字 | 五个标题变成大幅衬线标题，无下划线、无英文标签、无装饰线 | [`app/page.tsx`](app/page.tsx)、[`app/globals.css`](app/globals.css) |
| 7 | 技能区：删除暂停按钮；鼠标停留暂停、移出恢复；椭圆背景用 `星空.gif`；一个圈代表一个分类框；五个分类框绕椭圆；框内只显示技术名；删除左侧栏，轨道放大 | 单行全宽星轨：五个分类框公转，框内只有类名和技术名，无角标/注释/计数 | [`components/home/SkillOrbit.tsx`](components/home/SkillOrbit.tsx)、[`lib/content/skills.ts`](lib/content/skills.ts)、[`app/globals.css`](app/globals.css) |
| 8 | 删除技能下“把学过的技术摆到台面上。”和作品下“项目、讲解与演示。” | 两个区块只保留大标题和内容，不再有第二层大标题 | [`app/page.tsx`](app/page.tsx) |
| 9 | 图 12：调整图片，保留干净描述，删除“查看项目详情”，项目详情跳转界面全部删除 | 项目卡静态陈列；无 CTA、无链接、无详情页 | [`app/page.tsx`](app/page.tsx)、[`app/projects/page.tsx`](app/projects/page.tsx)、[`app/projects/[slug]/page.tsx`](<app/projects/[slug]/page.tsx>)、[`next.config.ts`](next.config.ts) |
| 10 | 图 12 右侧图片与框比例不全，调整图片比例或框内大小 | 竖版机械臂图放进方形/竖向媒体框，`contain` 完整显示 | [`app/page.tsx`](app/page.tsx)、[`app/globals.css`](app/globals.css)、[`components/ui/ProjectCover.tsx`](components/ui/ProjectCover.tsx) |
| 11 | 图 13 左侧封面与电脑框尺寸不匹配；右侧视频也放入电脑外框；“视频打不开？看项目详情”改到 GitHub，旧链接界面删除 | 两个演示统一深色显示器外框；左侧用视频首帧当封面；回退到 GitHub | [`lib/content/projects.ts`](lib/content/projects.ts)、[`components/ui/VideoFrame.tsx`](components/ui/VideoFrame.tsx)、[`components/media/LocalVideo.tsx`](components/media/LocalVideo.tsx) |
| 12 | 图 14 整段换成证书，参考图 15；保留三个证书展示；图片 `中国机器人.png`、日期 `2026.7`、PDF `中国机器人.pdf`，三个样例共用一个；同步修改标题和栏 | `#notes` 整段替换为 `#certs` 证书区；导航“笔记”改“证书”；三张占位卡 | [`app/page.tsx`](app/page.tsx)、新增 [`lib/content/certifications.ts`](lib/content/certifications.ts)、新增 [`components/home/Certifications.tsx`](components/home/Certifications.tsx)、[`lib/constants.ts`](lib/constants.ts) |

---

## 2. 参考图语言：我到底想要什么效果

这一节先把“图里看到了什么、为什么现在不够、想要变成什么”说清楚。后续的尺寸和颜色都服务于这一节的感觉。

### 2.1 图 1：现在的首页首屏

图 1 是暖白纸感的首页。红框标出五处：左上角“苑阳 Mike Jason”、右上角五个导航、右侧方形照片、标题下方的五条波纹、姓名块里的图标/姓名/角色，再往下是带紫色下划线的“关于”。

信息本身没有问题，问题是**视觉重心分散**：品牌和导航都在抢第一眼，照片是硬边方块，波纹像一条普通分隔线，姓名和角色的重量又太接近。整页缺少一个“先看这里”的绝对主角。

### 2.2 图 2：现在的波纹为什么单调

图 2 把波纹放大了。五条线的振幅、相位、间距几乎一样，只有粗细和透明度不同；没有渐变、没有交叉、没有体积。它像“用尺子画出来的五条线”，所以只能当分隔线，不能当视觉资产。

参考图 3 的丝带不是“线更多”，而是线**成束**：几十条曲线共享一条运动轨迹，在中间拧紧、在两端散开；颜色从品红过渡到靛蓝，最外层再叠一层很淡的辉光。远看是一条有厚度、有方向的丝带，近看才是很多条线。这个“远看是面、近看是线”的层次，就是高级感的来源。

### 2.3 图 3：Yuji Sato 首页给我的参考

图 3 是深色底。一条紫到品红的丝带从画面左下升起，在中间扭结，再甩向右上；左上/居中位置是圆形头像，头像右侧上方是一排裸图标，下面是很大的姓名，再下面是一行很小的灰色角色。导航在右上角，字号不大。

它高级的原因不是“颜色多”，而是**黑、亮、空的比例**：大面积近黑，少量高亮，文字周围留出足够的空。丝带只负责制造流动感，不抢文字。姓名是唯一主角，图标和角色都是配角。

### 2.4 图 4：当前姓名块特写

图 4 里，图标是 44px 的圆角方框，姓名是黑色无衬线大字，角色是紫色加粗、字距很宽的“算法控制工程师”。三者的“重量”太接近：方框图标很显眼，紫色角色又和标题紫色下划线重复，姓名反而没有压住全场。

想要的效果：图标退成裸图标，姓名变得更大、更有笔画气质，角色退成一行安静的小字。视线顺序变成“姓名 → 角色 → 图标”，而不是三个元素同时说话。

### 2.5 图 5–图 9：五个区块标题

五张图分别是“关于”“技能”“作品”“笔记”“联系”。共同问题是：字号小、紫色、像标签；“关于”还有一条 3px 紫色下划线。

标题应该像杂志的章首页：一个字就能压住一屏，读者先看到“关于”，再看到正文。去掉下划线、去掉英文小标签、去掉前面的小横线，只留下字本身；用衬线、宽字距、大字号做出“飘逸”和留白。

### 2.6 图 10：现在的技能轨道

图 10 是技能区。左边是分类清单，右边是椭圆轨道；轨道上只有当前分类的 3 张卡，右下角有“暂停转动”。卡片里有角标“在学 / 练过 / 落地”和一段说明。

阅读顺序是“先选分类，再看卡片”，用户要先做一次选择才能看全技能。这不是“五个框在一个椭圆里”，而是“一个框的内容在绕圈”。同时，左侧清单占了接近 1/4 宽度，把轨道挤小了。

### 2.7 图 11：左侧分类清单

图 11 是左侧清单特写：五行、数字、说明。它本身很整齐，但让技能区看起来像筛选器，而不是“技能星空”。这一栏要整体删除。

### 2.8 图 12：作品卡

图 12 是作品卡。左边是学习教案仓库截图，右边是 PiPER 机械臂；两张卡底部都有“查看项目详情 →”。右侧机械臂图是竖构图，却放在 4:3 的横框里，上下/左右留白不均，看起来“图没有装满框”。卡片整体可点，但用户只想看摘要，不想再跳一层。

想要的效果：卡片变成静态陈列，图片完整、比例舒服，文字干净，没有 CTA，没有“点进去还有一页”的预期。

### 2.9 图 13：配套视频

图 13 是配套视频。左边是深色电视框，封面是竖版机械臂 PNG，塞进 16:9 屏幕后被裁切；右边是浅色镜框，封面是 16:9 的 Typora 截图。两个框的视觉语言不一致，左边的封面和屏幕比例不匹配。下面还有“视频打不开？看项目详情”。

想要的效果：两台视频都放进同一种深色显示器外框；封面用视频真正的首帧，不再拿竖版图片硬撑 16:9；回退链接指向 GitHub，不再指向已经删除的项目详情页。

### 2.10 图 14：笔记区

图 14 是笔记区。三张卡：标签、日期、分钟数、标题、摘要。信息干净，但这一整段要被证书替换。博客文章本身不删除，只是不再从首页进入。

### 2.11 图 15：Wilson Costa 的证书区

图 15 是近黑背景上的证书区。白色大标题“Certifications”，灰色小字“Credentials and professional training.”，三张深色横卡：左边徽章缩略图，中间标题/颁发机构/日期，右边浅蓝 PDF 胶囊按钮。卡片有细边框和圆角，信息密度低，像“证书陈列柜”。

想要的效果：把这种“陈列柜”语言搬到本站。三张卡横排，徽章小而清楚，PDF 按钮是唯一的操作；没有多余装饰。

### 2.12 一句话总结我想要的感觉

> 深、静、贵。大面积深空色把内容托起来；丝带和星空只负责“流动”，不负责“热闹”；标题用大字和衬线撑住版面；照片、证书、视频像被一束光照亮的小岛。不要赛博霓虹满屏，也不要纯黑一片死寂。

---

## 3. 视觉决策记录（与旧文档的冲突）

| 编号 | 决策 | 说明 |
|---|---|---|
| D1 | **全站深色** | 与 [`AGENTS.md`](AGENTS.md) 里“明亮、简洁”的描述冲突。这是本轮明确要求；后续应同步 AGENTS/PRD2 的视觉描述，避免文档与实现分歧。 |
| D2 | **删除 `/projects` 与 `/projects/[slug]`** | 与 AGENTS“核心页面包括项目列表/详情”的清单冲突。本轮按用户要求执行；首页作品区保留摘要，作为唯一项目展示。 |
| D3 | **首页笔记区下线，博客路由保留** | `/blog`、`/blog/[slug]` 仍可访问，但退出主导航、页脚、404 和 sitemap。首页不再展示精选文章。 |
| D4 | **技能区不再有暂停按钮** | 取代 [`Improve.md`](Improve.md) §7.6 的“可见暂停控件”。暂停完全由鼠标悬停触发，移出椭圆恢复；移动端不承担公转，改为静态网格。 |
| D5 | **视频统一为深色显示器外框** | 取代 [`Improve.md`](Improve.md) §8.3 的 `tv / mirror` 双变体。本轮只保留 `tv` 语言；`mirror` 代码可留可删，但页面不再使用。 |
| D6 | **尊重 `prefers-reduced-motion`** | 与 Improve.md §2.1 的“不降级”不同。丝带和星轨在减少动态偏好下冻结，技能卡改为静态排列。理由：AGENTS 明确要求尊重该偏好；悬停暂停不能覆盖键盘/触控用户。 |

---

## 4. 深色视觉体系

### 4.1 色板

不是纯黑，也不是冷蓝灰。底色带一点墨蓝，文字用暖象牙白，强调色用紫罗兰，品红只出现在丝带和极少数光晕里。

```css
:root {
  color-scheme: dark;

  /* 标题衬线：具体字体文件按 §4.3 接入，这里给出回落栈 */
  --font-serif: 'Noto Serif SC', 'Songti SC', 'STSong', 'Noto Serif CJK SC', 'SimSun', serif;

  /* 背景层 */
  --bg: #07080f;
  --bg-deep: #05060b;
  --surface: #10121d;
  --surface-2: #161927;
  --surface-3: #1d2133;

  /* 文字 */
  --fg: #f4f1ea;
  --fg-muted: #a7a3b6;
  --fg-dim: #7f7c90;

  /* 线与描边 */
  --line: rgba(255, 255, 255, 0.09);
  --line-strong: rgba(255, 255, 255, 0.16);

  /* 强调色 */
  --accent: #8b7cff;
  --accent-hover: #a99eff;
  --accent-soft: rgba(139, 124, 255, 0.12);
  --accent-ring: rgba(139, 124, 255, 0.35);
  --magenta: #d946ef;
  --cyan: #67e8f9;

  /* 深色板块 */
  --ink-panel: #0b0d17;
  --ink-panel-fg: #f4f1ea;
  --ink-panel-muted: #a7a3b6;

  /* 状态 */
  --focus: #b9a7ff;
  --danger: #ff8a8a;
  --success: #5eead4;

  /* 阴影与光晕 */
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.5), 0 24px 60px rgba(0, 0, 0, 0.45);
  --glow: 0 0 0 1px rgba(139, 124, 255, 0.18), 0 0 40px rgba(139, 124, 255, 0.18);

  --radius: 18px;
  --radius-sm: 12px;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

用法约束：

- `--accent` 只用于链接、焦点、少量标签和装饰，不用于大段正文。
- `--magenta` 只出现在丝带、星轨边缘光和极少数 hover 光晕里，不用于按钮底色。
- `--cyan` 是“星尘”辅助色，只在丝带末端或星空背景里点一下，不进入文字体系。
- 所有卡片文字优先用 `--fg` / `--fg-muted`，保证对比度。

### 4.2 页面背景

```css
.site-body {
  background:
    radial-gradient(62% 46% at 86% -6%, rgba(124, 58, 237, 0.2), transparent 62%),
    radial-gradient(46% 40% at 0% 58%, rgba(56, 189, 248, 0.06), transparent 62%),
    linear-gradient(180deg, #07080f 0%, #080a13 48%, #07080f 100%);
  color: var(--fg);
}
```

- 顶部偏右有一团很淡的紫光，左侧中部有一点冷蓝，像远处星云。
- 不加满屏噪点，避免压缩后出现脏点；如果实现时觉得太“平”，可以用 `body::before` 叠一层 2% 透明度的细网格，`pointer-events: none`。
- `--bg-warm` 这个旧 token 不再表示“暖白”，改为深色板块色 `#0b0d17`，或直接删除并替换引用。

### 4.3 字体与字号

目标：中文标题“飘逸”，正文“清楚”，数字“利落”。

| 角色 | 字体 | 字重 | 字号 | 字距 | 行高 |
|---|---|---|---|---|---|
| Hero 姓名 | 衬线（Noto Serif SC / 思源宋体） | 500–600 | `clamp(3.5rem, 8vw, 6rem)` | `0.06em` | `1.02` |
| 区块标题 | 同上 | 500 | `clamp(2.8rem, 6vw, 4.5rem)` | `0.14em` | `1.1` |
| 卡片标题 | 现有 Inter + 中文黑体 | 600 | `clamp(1rem, 1.3vw, 1.15rem)` | `-0.01em` | `1.3` |
| 导语 | 黑体 | 400 | `1.0625rem` | `0` | `1.85` |
| 正文 | 黑体 | 400 | `1rem` | `0` | `1.75` |
| 标签/日期/序号 | 等宽 | 500 | `0.75rem` | `0.06em` | `1.4` |

中文衬线字体的接入按以下优先级：

1. **推荐**：`next/font/google` 的 `Noto_Serif_SC`，只选 500 / 600 两个字重，`display: 'swap'`。构建后检查 `.next/static/media` 的中文字体体积与首屏请求；如果首屏字体超过约 300 KB，改用方案 2。
2. **更稳**：`next/font/local` + `pyftsubset`，只保留标题用到的字符（关于、技能、作品、证书、联系、苑阳等），生成 WOFF2。通常只有几十 KB；以后新增标题文案时需要重新子集化。
3. **兜底**：系统宋体栈 `'Songti SC', 'STSong', 'Noto Serif CJK SC', 'SimSun', serif`。零请求，但 Windows 的 SimSun 在大字号下会略显生硬。

如果希望更手写、更飘逸，可以考虑 **霞鹜文楷（LXGW WenKai，OFL）**，同样建议子集化；它比宋体更轻松，但技术作品集里要控制用量，只用于姓名和区块标题，不要正文整段使用。

如果构建环境访问 Google Fonts 不稳定，直接改用系统宋体栈或本地子集，不要让构建依赖外网。

正文继续用现有 Inter；中文回落 `PingFang SC / Microsoft YaHei`。拉丁数字可以继续用 Newsreader，和衬线标题呼应。

“飘逸”不靠斜体实现。中文没有真正的斜体，强行 skew 会变形；靠的是衬线、轻字重、宽字距、大字号和足够的留白。

### 4.4 卡片、边框、阴影

深色页面里，纯白卡片会像一块刺眼的灯箱。统一用“深色玻璃”：

```css
.card-recipe {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02)),
    var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(14px);
}
```

- hover 只做三件事：边框提到 `--line-strong`、轻微上移 2–3px、加一圈很淡的紫色光晕。
- 不做大面积白色背景，不做玻璃拟态的高光扫过，不做彩色渐变边框。
- 图片统一加 `1px` 半透明描边；照片本身不要批量调暗，必要时 `filter: saturate(0.92) contrast(1.02)`。

### 4.5 旧浅色硬编码清理

`app/globals.css` 里还有不少写死的浅色值。改完 token 后必须逐条清理，否则会出现“深色页面上突然一块白”。

重点检查：

- `:root` 旧 token（`#fbfaf7`、`#f7f3ec`、`#ffffff`、`#141418` 等）。
- `.site-body` 的浅色渐变。
- `.site-header` 的 `rgba(251,250,247,.88)` 背景、浅色边框。
- `.button.secondary` 的 `#d2ccc0` 边框。
- `.demo-banner` 的浅紫底。
- `.cover-block[data-tone='warm']` 的米色渐变；`ink` / `violet` 可保留但整体压暗。
- `.skill-card:hover`、`.work-card:hover`、`.filter-chip` 的 `#c9c1b3` / `#cfc8bb` 边界。
- `.pinwall-frame` 的白色相纸底与白色图钉。
- `.skill-chip-tier` 的浅绿/浅紫/浅米角标（新技能卡不再使用）。
- `.tv-frame[data-variant='mirror']` 的浅色镜框（页面不再使用）。
- 联系表单的浅色输入框、`.form-status`、博客卡片、404 按钮。
- `--shadow` 里偏浅的阴影色，改为黑底阴影。

验收时跑一遍：

```bash
rg -n "#[0-9a-fA-F]{3,8}|rgba\(" app/globals.css
```

逐个确认：要么已经换成 token，要么是深色体系里合理的写死值（例如视频屏幕的 `#05050a`）。

### 4.6 动效预算

| 类型 | 时长 | 位移/尺度 | 曲线 | 限制 |
|---|---|---|---|---|
| 丝带漂移 | 32–40s | 水平 ±1.2% | `ease-in-out alternate` | 只动 `transform`，不改变布局 |
| 星轨公转 | 60s / 圈 | 椭圆轨迹 | `linear` | 只动 `translate`，卡片不自转 |
| 卡片 hover | 220ms | `translateY(-2px)` | `--ease-out` | 不超过 4px |
| 图片推近 | 480ms | `scale(1.03)` | `--ease-out` | 只用于仍可点击的 B 站卡 |
| 滚动入场 | 560ms | `translateY(24px)` → 0 | `--ease-out` | 沿用现有 `Reveal` |

`prefers-reduced-motion: reduce` 下：丝带停止漂移，星轨停止公转并把五张卡排成静态网格；其余入场动效降为淡入。不要用 `display: none` 隐藏内容。

### 4.7 对比度

- `--fg` 在 `--bg` 上约 18:1，正文和标题都安全。
- `--fg-muted` 在 `--surface` 上约 7:1，可用于 14px 以上说明文字。
- `--accent` 在 `--surface` 上约 5.4:1，可用于链接和小标签；更小的文字用 `--accent-hover`。
- 品红、青色只做装饰，不承载文字信息。
- 焦点环统一 `3px solid var(--focus)`，`outline-offset: 3px`；深色页面上不要用默认蓝环。

---

## 5. 顶栏（需求 1）

### 5.1 结构

现在：

```tsx
<Link className="brand" href="/" onClick={handleBrandClick}>
  {siteConfig.name}
  <span>{siteConfig.nameEn}</span>
</Link>
<nav className="nav-desktop">...</nav>
```

改为：

```tsx
<nav className="nav-desktop" aria-label="主导航">...</nav>
```

- 删除 `brand` 链接、`handleBrandClick`，以及只服务于品牌的 `siteConfig` 引用。
- `.header-inner` 改为 `justify-content: flex-end`；桌面端导航靠右。
- 移动端仍保留汉堡菜单，`menu-toggle` 在右侧；导航面板从右侧展开或整行下拉，沿用现有 `nav-mobile` 逻辑。

### 5.2 尺寸

```css
.nav-desktop {
  gap: 10px 30px;
  font-size: clamp(1.0625rem, 1.3vw, 1.1875rem);
  font-weight: 500;
  color: var(--fg-muted);
}

.nav-desktop a {
  min-height: 44px;
  padding-inline: 2px;
}

.nav-desktop a:hover,
.nav-desktop a[aria-current='location'] {
  color: var(--fg);
}
```

- 字号从 `0.94rem` 提到约 `1.06rem–1.19rem`（17–19px），这是需求 1 的硬指标，要肉眼可见地变大。
- 当前区块的识别保留：2px 渐变下划线（紫 → 品红），`scaleX(0) → 1`。
- 顶栏背景：`rgba(7,8,15,.72)` + `backdrop-filter: blur(18px)` + 底部 `1px solid var(--line)`。
- 滚动进度条保留，改成紫到品红的渐变。

### 5.3 取舍

删除品牌后，顶栏没有“回首页”的入口，只能靠浏览器返回或页脚“返回顶部”。这是需求 1 的直接结果。如果后续觉得不方便，可以加一个极简的“苑”字标记，但本轮不做，避免又回到“品牌和导航抢视线”。

---

## 6. Hero（需求 2、3、4、5）

### 6.1 布局

保留左右两栏，但让文字和圆形照片形成“一个人 + 一个场景”的关系：

```css
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.95fr);
  gap: clamp(32px, 6vw, 88px);
  align-items: center;
  padding-block: clamp(64px, 9vw, 128px) clamp(40px, 6vw, 80px);
}
```

移动端（`max-width: 900px`）改为单列，文案在前、圆形照片在后，照片居中。

### 6.2 圆形照片（需求 2）

```css
.home-hero-visual {
  position: relative;
  width: clamp(240px, 30vw, 360px);
  aspect-ratio: 1 / 1;
  margin-inline: auto;
}

.hero-visual {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 0 0 10px rgba(139, 124, 255, 0.05),
    0 30px 90px rgba(0, 0, 0, 0.55);
}

.hero-visual img {
  object-fit: cover;
  object-position: 55% 38%;
  transform: scale(1.12);
}
```

- 删除原来的方形 `hero-plate`；改成圆形的光晕 `hero-halo`：

```css
.hero-halo {
  position: absolute;
  inset: -12%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 124, 255, 0.22), transparent 65%);
  filter: blur(30px);
  pointer-events: none;
}
```

- 照片 `个人01.jpg` 是 3000×4000 的全身照，人物在画面中占比不大。`object-position: 55% 38%` 先对准人物，再按实际效果微调 `scale(1.1–1.3)`；不要裁掉头部和脚，也不要让人物贴到圆边。
- `sizes="(max-width: 900px) 70vw, 360px"`，保留 `priority`。
- 参考站的头像只有约 100px，放在姓名左侧。我们保留 300–360px 的大圆，是因为现有照片是场景照而不是头像；大圆能保留场景的氛围。如果你更想要参考站那种“小头像 + 姓名”的锁排，可以把圆缩到 120–160px 并移到姓名左侧，但本文默认大圆。

### 6.3 姓名（需求 5）

```css
.hero-name {
  margin: 18px 0 10px;
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: 0.06em;
  color: var(--fg);
  text-shadow: 0 0 40px rgba(139, 124, 255, 0.15);
}
```

- 从现在的无衬线 4rem 左右，提升到衬线 3.5–6rem；两个汉字在桌面端大约 96px 高，成为首屏绝对主角。
- 字距不要太夸张（不超过 0.08em），否则“苑阳”两个字会散。
- 不加渐变文字，不加描边；靠字号、衬线和光晕就够。

### 6.4 社交图标（需求 5）

- `.hero-socials` 去掉每个链接的方框、背景和边框：

```css
.hero-socials {
  display: flex;
  gap: 18px;
  margin: 0 0 18px -10px;
  padding: 0;
  list-style: none;
}

.hero-socials a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  color: var(--fg-muted);
  transition: color 0.2s ease, transform 0.2s var(--ease-out);
}

.hero-socials a:hover {
  color: var(--fg);
  transform: translateY(-2px);
}

.hero-socials svg {
  width: 24px;
  height: 24px;
}
```

- 视觉上图标是 24px 的裸图形，触控区仍是 44×44。
- 图标放在姓名上方，左边缘与姓名对齐；负 margin 让图标的视觉左边缘和文字左边缘对齐。
- 如果图标和姓名之间的留白太大，优先减小 `margin-bottom`，不要缩小姓名。

### 6.5 角色（需求 3）

```css
.hero-role {
  margin: 0;
  color: var(--fg-muted);
  font-family: var(--font-sans);
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  font-weight: 500;
  letter-spacing: 0.28em;
  line-height: 1.6;
}
```

- 去掉紫色和 600/700 的加粗。
- 宽字距是“角色”的气质来源：中文每个字之间拉开，像一行小型的题注。
- 可选：在角色前加一个 6px 的紫色小圆点，作为唯一的重音；不要加长横线，避免又变成“标题下划线”。

### 6.6 丝带波纹（需求 4）

这是本轮最重要的视觉改造之一。目标不是“更多波浪”，而是“一条有厚度的丝带”。

#### 6.6.1 结构

保留组件名 `WaveTransition` 和类名 `.wave-band`，减少调用处改动；内部重写：

```tsx
export function WaveTransition() {
  return (
    <div className="wave-band" aria-hidden="true">
      <svg viewBox="0 0 1440 240" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="42%" stopColor="#8b5cf6" />
            <stop offset="78%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
          <filter id="ribbonGlow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* 两层柔光：只负责体积，不画细节 */}
        <g className="ribbon-glow" filter="url(#ribbonGlow)" opacity="0.18">
          <path d="..." stroke="url(#ribbon)" strokeWidth="18" fill="none" />
          <path d="..." stroke="url(#ribbon)" strokeWidth="12" fill="none" />
        </g>

        {/* 主丝带：36–48 条曲线，按 i 做很小的高差 */}
        <g className="ribbon-lines">
          {Array.from({ length: 40 }, (_, i) => (
            <path
              key={i}
              d={ribbonPath(i)}
              fill="none"
              stroke="url(#ribbon)"
              strokeWidth={0.6 + (i % 5) * 0.28}
              opacity={0.14 + (i / 40) * 0.68}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* 反方向的一小束，在中间形成“拧”的交叉 */}
        <g className="ribbon-counter" opacity="0.55">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={counterPath(i)} fill="none" stroke="url(#ribbon)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
    </div>
  );
}
```

`ribbonPath(i)` / `counterPath(i)` 只是示意：用两组固定控制点，按 `i` 做 0.8–1.6px 的高差；不要写 40 条完全独立的手工路径，否则很难保持“同一束光”的平行感。

#### 6.6.2 几何

- 主丝带从左下 `(-80, 210)` 起，经过 `C(320, 20) (620, 250) (900, 120)`，再 `C(1120, 20) (1300, 60) (1520, 40)` 收尾。
- 每一条线的控制点只做很小的高差（`i * 0.8` 到 `i * 1.6`），让它们看起来是同一束光被切开，而不是 40 条独立的波浪。
- 在 `x ≈ 760` 处让主丝带和反向丝带交叉；交叉处线条间距收紧到 2–3px，两端再散开。这个“收—放”的节奏，是图 3 高级感的关键。
- 线宽 0.6–2.2px，透明度 0.14–0.82；最外层再叠两条 10–18px 的模糊粗线做辉光，透明度 0.18。
- 用 `vector-effect="non-scaling-stroke"`，保证全宽缩放时线不会变粗成色块。

#### 6.6.3 容器与动画

```css
.wave-band {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  height: clamp(140px, 18vw, 240px);
  margin-top: clamp(8px, 1.4vw, 18px);
  overflow: clip;
  pointer-events: none;
}

.wave-band svg {
  display: block;
  width: 106%;
  height: 100%;
  margin-left: -3%;
}

.ribbon-lines {
  animation: ribbon-drift 34s ease-in-out infinite alternate;
}

.ribbon-counter {
  animation: ribbon-drift 42s ease-in-out infinite alternate-reverse;
}

@keyframes ribbon-drift {
  from { transform: translate3d(-1.2%, 0, 0); }
  to   { transform: translate3d(1.2%, 0, 0); }
}
```

- 边缘用 `mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)` 让丝带从画面两侧“淡入淡出”，不要硬切。
- 丝带放在 Hero 和关于区之间，作为“从首屏进入正文”的接缝，不占语义、不阻塞内容。
- 移动端高度降到 120–160px，线条数量可以减半（20–24 条），避免细线在窄屏糊成一片。
- `prefers-reduced-motion` 下停止 `ribbon-drift`。

---

## 7. 区块标题（需求 6、8）

### 7.1 目标结构

现在首页有两套标题：`.eyebrow-link`（小号紫色标签）和 `.section-heading h2`（第二层大标题）。这次合并成一个：

```tsx
<h2 id="about-title" className="section-title">
  <a href="#about">关于</a>
</h2>
```

技能、作品、证书、联系同理：

```tsx
<h2 id="skills-title" className="section-title"><a href="#skills">技能</a></h2>
<h2 id="work-title" className="section-title"><a href="#work">作品</a></h2>
<h2 id="certs-title" className="section-title"><a href="#certs">证书</a></h2>
<h2 id="contact-title" className="section-title"><a href="#contact">联系</a></h2>
```

### 7.2 样式

```css
.section-title {
  margin: 0 0 clamp(24px, 3vw, 40px);
  font-family: var(--font-serif);
  font-size: clamp(2.8rem, 6vw, 4.5rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  line-height: 1.1;
  color: var(--fg);
}

.section-title a {
  display: inline-block;
  min-height: 44px;
  padding-block: 8px;
  color: inherit;
  border: 0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.section-title a:hover,
.section-title a:focus-visible {
  color: var(--accent-hover);
}
```

必须删除：

- `.section-title .eyebrow-link` 的 `border-bottom: 3px solid var(--accent)`；
- `.eyebrow-link` 在首页的用法（英文小标签、紫色、`letter-spacing: 0.14em`、`min-height: 44px` 等）；
- `.section-heading .eyebrow::before` 的横线展开动画（首页不再使用）；
- 所有“关于 / 技能 / 作品 / 证书 / 联系”（原来的“笔记”）前面的小横线或小圆点。

### 7.3 需求 8：删除两个副标题

在 [`app/page.tsx`](app/page.tsx) 中删除：

- `<h2 id="skills-title">把学过的技术摆到台面上。</h2>`
- `<h2 id="work-title">项目、讲解与演示。</h2>`

删除后，技能区和作品区的 `aria-labelledby` 指向新的 `.section-title` 的 `id`。技能区标题下保留那行说明文字，但建议改写为：

> 五类技术沿椭圆缓慢公转，鼠标停留即可暂停。

作品区标题下没有说明文字，直接进入“GitHub 项目”分组。

### 7.4 联系区

联系区原来的问句“想聊聊机械臂、具身智能或学习方法？”不要再当 `h2`。改成 `.lead`：

```tsx
<h2 id="contact-title" className="section-title"><a href="#contact">联系</a></h2>
<p className="lead">想聊聊机械臂、具身智能或学习方法？</p>
```

这样“联系”是唯一的大标题，问句是导语，层级不会打架。

### 7.5 关于区

关于区原来的 `.section-title` 只有“关于”，正文在下面。改造后它仍然是 `h2`，`aria-labelledby="about-title"` 不变；删掉 `.section-title .eyebrow-link` 的下划线即可。

---

## 8. 技能星轨（需求 7）

### 8.1 目标形态

一句话：**五个分类框在一个椭圆里绕圈，每个框里只写这个分类的技术名。**

- 删除左侧分类清单、分类计数、说明文字。
- 删除“暂停转动”按钮。
- 删除“选中某个分类 → 显示该分类的卡片”的逻辑。
- 五个分类框同时存在，按 72° 分布，沿同一个椭圆匀速公转。
- 每个框内只显示：分类名 + 技术名（如“编程语言 / C++、Python、TypeScript”）。
- 椭圆内部是 `星空.gif`，外面是深色页面。
- 鼠标进入椭圆区域：公转暂停；移出：继续。
- 移动端：不公转，五个框改成静态网格。

### 8.2 数据模型

[`lib/content/skills.ts`](lib/content/skills.ts) 现在每个分类有 `items: OrbitSkill[]`，每项带 `tier` 和 `note`。新卡片不渲染这些字段，但推荐先保留数据，避免丢失内容：

```ts
// 推荐沿用现有类型：卡片只读 item.name，tier / note 留在数据里不渲染
export type SkillCategory = {
  id: string;
  label: string;
  caption: string;
  items: OrbitSkill[];
};
```

如果确认以后不再需要“在学 / 练过 / 落地”和说明文字，再把 `items` 简化成 `string[]` 或 `{ name: string }[]`，并同步清理 `tierLabels` 与 `SkillChip`。本轮不动内容层字段，只改渲染。

五个分类和条目（沿用现有内容，不新增、不改真实程度）：

| 分类 | 框内显示 |
|---|---|
| 编程语言 | Python、TypeScript、C++ |
| 机器人 | ROS2、MoveIt2、ROS、SLAM |
| AI 与视觉 | OpenCV、PyTorch、LLM |
| 嵌入式 | STM32、C、模拟 / 数字电路 |
| 工具链 | Git、npm、Markdown |

### 8.3 组件

[`components/home/SkillOrbit.tsx`](components/home/SkillOrbit.tsx) 改成 Server Component，不再需要 `'use client'`、`useState`、`useMemo`、`useId`：

```tsx
import type { CSSProperties } from 'react';
import type { SkillCategory } from '@/lib/content/skills';

export function SkillOrbit({ categories }: { categories: readonly SkillCategory[] }) {
  return (
    <div className="skill-orbit">
      <div className="orbit-field">
        <div className="orbit-ellipse" aria-hidden="true">
          <div className="orbit-sky">
            <img src="/images/星空.gif" alt="" loading="lazy" decoding="async" />
          </div>
          <svg className="orbit-track" viewBox="0 0 1000 520" preserveAspectRatio="none">
            {/* 椭圆虚线 + 箭头 */}
          </svg>
        </div>

        <ul className="orbit-list" aria-label="技能分类">
          {categories.map((category, index) => (
            <li
              className="orbit-item"
              key={category.id}
              style={{ '--i': index, '--n': categories.length } as CSSProperties}
            >
              <article className="skill-category-card">
                <h3>{category.label}</h3>
                <p>{category.items.map((item) => item.name).join(' · ')}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- 不需要 `SkillChip`；可以删除 [`components/ui/SkillChip.tsx`](components/ui/SkillChip.tsx)，或保留但不再引用。
- 不再有 `aria-pressed`、`role="group"`、按钮、计数。
- 卡片不是链接，不需要键盘焦点；列表本身有语义，屏幕阅读器可以按顺序读到五个分类。

### 8.4 几何与尺寸

```css
.skill-orbit {
  display: block;
  margin-top: 24px;
}

/* hover 暂停的作用域：椭圆外接矩形再留出卡片半宽，避免鼠标刚移出椭圆就恢复 */
.orbit-field {
  position: relative;
  width: min(100%, calc(var(--orbit-rx) * 2 + 220px));
  min-height: calc(var(--orbit-ry) * 2 + 160px);
  margin-inline: auto;
  display: grid;
  place-items: center;
  overflow: hidden;
}

:root {
  --orbit-rx: clamp(300px, 37vw, 460px);
  --orbit-ry: clamp(150px, 18vw, 220px);
}

.orbit-ellipse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(var(--orbit-rx) * 2);
  height: calc(var(--orbit-ry) * 2);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 0 90px rgba(5, 6, 14, 0.92),
    0 0 70px rgba(88, 28, 135, 0.18);
}

.orbit-sky,
.orbit-sky img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.orbit-sky img {
  object-fit: cover;
  opacity: 0.9;
}

.orbit-ellipse::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(5, 6, 14, 0.18), rgba(5, 6, 14, 0.58));
  pointer-events: none;
}

.orbit-list {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.orbit-item {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(168px, 17vw, 208px);
  height: auto;
  min-height: 112px;
  margin: 0;
  /* 减 50% 是为了让卡片中心落在椭圆轨迹上，而不是左上角 */
  translate: calc(cos(var(--orbit-angle)) * var(--orbit-rx) - 50%)
    calc(sin(var(--orbit-angle)) * var(--orbit-ry) - 50%);
  animation: orbit-travel 60s linear infinite;
  animation-delay: calc(var(--i) * -60s / var(--n));
}
```

- 保留现有的 `@property --orbit-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }`，否则 `--orbit-angle` 不会按角度插值，卡片不会公转。
- 椭圆宽度 `2 × rx`，桌面约 888–920px；高度约 440px。比现在的轨道大一圈，五个框能同时放下。
- 卡片尺寸约 168–208px 宽、112–130px 高；五个框在椭圆上不会挤成一团。
- 当前 `--orbit-angle` + `cos()/sin()` 的实现可以复用，只改半径和时长。
- `orbit-item` 只做 `translate`，卡片自身不旋转；卡片内部 hover 用 `transform`，两者不冲突。

### 8.5 星轨线与箭头

- 椭圆轨道：1px 虚线，`stroke-dasharray: 2 10`，颜色 `rgba(185, 167, 255, 0.45)`；外面再叠一条 10px 的模糊紫光，透明度 0.12。
- 箭头：沿椭圆四个角度放小三角，方向与公转方向一致；透明度 0.5。
- 轨道线本身也在流动：`stroke-dashoffset` 动画和卡片同向，时长 60s。
- 轨道 SVG 的 `viewBox` 用 `1000 520`，`rx=460`、`ry=220`；CSS 尺寸与 `--orbit-rx/--orbit-ry` 对齐。`preserveAspectRatio="none"` 时给椭圆加 `vector-effect="non-scaling-stroke"`，避免线宽被拉扁。

### 8.6 卡片视觉

```css
.skill-category-card {
  display: grid;
  gap: 8px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
    rgba(10, 12, 22, 0.82);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s var(--ease-out);
}

.skill-category-card:hover {
  border-color: rgba(185, 167, 255, 0.45);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(139, 124, 255, 0.18);
  transform: translateY(-2px);
}

.skill-category-card h3 {
  margin: 0;
  color: var(--accent-hover);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.16em;
}

.skill-category-card p {
  margin: 0;
  color: #ded9ee;
  font-size: 0.82rem;
  line-height: 1.65;
  overflow-wrap: anywhere;
}
```

- 分类名用紫色小标签，技术名用象牙白正文。
- 技术名用 `·` 分隔，不做成小胶囊，避免“框里还有框”。
- 卡片背景要足够不透明（0.8 左右），否则星空会穿透文字。
- 不加角标、不加计数、不加“在学 / 练过 / 落地”。

### 8.7 悬停暂停

```css
.orbit-field:hover .orbit-item,
.orbit-field:hover .orbit-track-line {
  animation-play-state: paused;
}
```

- 不写 JS，不用 `useState`，不渲染任何按钮或提示。
- `.orbit-field` 的 hover 区域是椭圆外接矩形（含卡片外沿），不是整个 section；鼠标移到页面上但不在椭圆附近时，星轨继续转。
- 鼠标进入卡片、从一个卡片移到另一个卡片、移到椭圆空白处，都保持暂停；只有离开这块区域才恢复。
- 移动端没有 hover，公转本身关闭，不存在“暂停”需求。

### 8.8 星空背景

- 使用 `public/images/星空.gif`（800×450，约 2.98 MB）。用普通 `<img loading="lazy" decoding="async" alt="">`，不要用 `next/image`（GIF 优化会改变动画）。如果 ESLint 的 `@next/next/no-img-element` 报错，按 [`components/media/LocalVideo.tsx`](components/media/LocalVideo.tsx) 的做法加一行 disable 注释；不要让 lint 失败。
- 图片放在椭圆里，`object-fit: cover`；上面叠一层深色渐变，保证卡片文字对比度。
- 源图只有 800px 宽，椭圆最大约 920px，会有轻微放大；深色遮罩可以掩盖这一点。不要再放大到 1200px 以上。
- GIF 在首屏之外，懒加载；不要在 `<head>` 预加载。
- 移动端（`max-width: 900px`）建议隐藏 GIF，用深色径向渐变代替，节省 3 MB 流量；如果希望保留星空，把它放在网格顶部作为 16:9 背景条，透明度 0.5。

### 8.9 响应式

```css
@media (max-width: 900px) {
  .orbit-field {
    width: 100%;
    min-height: 0;
    display: block;
    overflow: visible;
  }

  .orbit-ellipse {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: 180px;
    transform: none;
    margin-bottom: 16px;
  }

  .orbit-list {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .orbit-item {
    position: static;
    width: auto;
    translate: none;
    animation: none;
  }
}
```

- 900px 以下：五张卡两列网格（最后一张跨两列或自然排布），不再公转。
- 640px 以下：单列。
- 不支持 `cos()/sin()` 的浏览器：沿用现有 `@supports not (translate: calc(cos(0deg) * 1px))` 的静态网格兜底。
- `prefers-reduced-motion: reduce`：停止公转，按静态网格排列；星空图仍显示，但不闪动。

### 8.10 性能与可访问性

- 公转只动 `translate`，由合成器处理；不要同时给卡片加 `box-shadow` 动画（只在 hover 时）。
- `orbit-list` 是语义列表，屏幕阅读器可以读到五个分类和条目；公转本身是装饰。
- 卡片不是交互元素，不需要 `tabindex`。
- 椭圆和星空 `aria-hidden="true"`；`orbit-list` 保留 `aria-label="技能分类"`。
- 如果未来把分类卡做成链接，需要给每个链接 44px 触控区，并在 `:focus-within` 时暂停；本轮不做。

---

## 9. 作品与视频（需求 9、10、11）

### 9.1 作品区标题

删除 `<h2 id="work-title">项目、讲解与演示。</h2>`。作品区只保留大幅“作品”标题，然后直接进入三个分组：

1. GitHub 项目
2. B 站视频讲解
3. 配套视频演示

### 9.2 项目卡静态化（需求 9）

现在：

```tsx
<Link className="work-card-inner" href={`/projects/${notesProject.slug}`}>
  ...
  <span className="work-cta">查看项目详情 →</span>
</Link>
```

改为：

```tsx
<div className="work-card-inner">
  ...
  {/* 不放 work-cta */}
</div>
```

- 删除两处 `查看项目详情 →`。
- 删除整张卡的外层 `<Link>`；卡片不再可点。
- 删除 `.work-cta` 的 CSS（或保留但不再使用）。
- 项目卡加 `data-static="true"`，CSS 去掉抬升和图片推近，避免暗示可点击：

```css
.work-card[data-static='true'] {
  cursor: default;
}

.work-card[data-static='true']:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--line);
}

.work-card[data-static='true']:hover .work-media img {
  transform: none;
}
```

- B 站视频卡仍然可点，保留 hover 抬升和图片推近。
- 项目描述保留一句 `summary`，不要加“查看详情”“了解更多”之类的文案。

### 9.3 右侧 PiPER 图片比例（需求 10）

问题：`robot-arm.png` 是 744×802 的竖构图，放在 `aspect-ratio: 4 / 3` 的横框里，`object-fit: contain` 会左右留白，视觉上“图没有装满框”。

修复：

```tsx
<article className="work-card" data-layout="stack" data-static="true" data-media="portrait">
  <div className="work-card-inner">
    <div className="work-media">
      <div className="work-media-inner">
        <ProjectCover ... />
      </div>
    </div>
    ...
  </div>
</article>
```

```css
.work-card[data-media='portrait'] .work-media {
  aspect-ratio: 1 / 1;
  background: var(--surface-2);
}

/* padding 不能直接加在 .work-media 上：next/image 的 fill 会盖住内边距，
   用一个绝对定位的内层把图片往里收 */
.work-card[data-media='portrait'] .work-media-inner {
  position: absolute;
  inset: clamp(14px, 2vw, 26px);
}

.work-card[data-media='portrait'] .work-media img {
  object-fit: contain;
}
```

- 方形框 + 内边距，让机械臂完整、居中，不再被横框裁切或留出奇怪的空。
- 如果卡片高度和左侧不一致，`.work-grid { align-items: start; }`，让两张卡各自按内容高度排列。
- 不要为了对齐而强行拉高图片；宁可右侧卡矮一点，也不要裁掉机械臂。

### 9.4 左侧仓库截图

`only-me-notebook.png` 是 1936×1696（接近 8:7），现在放在 16:9 的 `work-media` 里，`cover` 会裁掉上下。给左侧卡加 `data-media="screenshot"`，然后：

```css
.work-card[data-media='screenshot'] .work-media {
  aspect-ratio: 4 / 3;
}

.work-card[data-media='screenshot'] .work-media img {
  object-fit: cover;
  object-position: top center;
}
```

- 保留顶部（仓库标题、文件列表），裁掉底部空白。
- 如果希望完整看到整张截图，把 `object-fit` 改为 `contain`，背景用 `var(--surface-2)`；但这样在宽卡里会左右留白。默认用 `cover + top`，信息更满。

### 9.5 视频统一外框（需求 11）

[`lib/content/projects.ts`](lib/content/projects.ts) 的 `localDemos`：

```ts
{
  id: 'piper-grasp',
  title: 'PiPER 机械臂抓取演示',
  note: '视觉识别 → 坐标转换 → 通信控制，一次完整抓取过程。',
  src: '/video/robot-arm-01.mp4',
  // 不再指定 poster，让 useVideoPoster 捕获视频真正的首帧
  frame: 'tv',
  fallback: {
    label: '视频打不开？去 GitHub 查看',
    href: 'https://github.com/yycodes333',
    external: true,
  },
},
{
  id: 'typora-guide',
  title: 'Typora 安装演示（本地录屏）',
  note: '完整录屏版，和 B 站那期内容一致。',
  src: '/video/typora-install-guide.mp4',
  poster: '/images/projects/typora-tutorial.jpg',
  frame: 'tv', // 不再用 mirror
  fallback: {
    label: '去 B 站观看',
    href: 'https://www.bilibili.com/video/BV1j77r69ENx',
    external: true,
  },
},
```

- 两个视频都用 `tv` 变体：深色边框、屏幕反光、底部支脚。
- 如果你说的“电脑外框”特指笔记本外形，可以复用现有 [`components/home/DeviceVideoCarousel.tsx`](components/home/DeviceVideoCarousel.tsx) 的 `laptop-frame`；但两台必须用同一种外框，不要一台 TV、一台笔记本。
- 左侧去掉 `poster: '/images/robot-arm.png'`，让 `useVideoPoster` 从视频里抓一张 16:9 首帧。这样封面和屏幕比例天然一致。
- 右侧保留 16:9 的 Typora 封面；它本来就是 16:9。
- 删除 `mirror` 在页面里的使用；`VideoFrame` 的 `mirror` 变体可以保留在代码里，也可以一起删除，但不要再出现在首页。
- `LocalVideo` 的海报改为 `object-fit: contain`，背景 `#05050a`，作为兜底：即使未来又传入竖版封面，也不会被裁切。

```css
.local-video-poster {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #05050a;
}
```

- 回退链接：左侧从 `/projects/piper-grasping` 改为 `https://github.com/yycodes333`，`external: true`，新窗口打开。右侧保持 B 站。
- 删除旧的“视频打不开？看项目详情”文案；新文案用“视频打不开？去 GitHub 查看”。

### 9.6 删除项目详情与列表

- 删除 [`app/projects/page.tsx`](app/projects/page.tsx)。
- 删除 [`app/projects/[slug]/page.tsx`](<app/projects/[slug]/page.tsx>)。
- [`next.config.ts`](next.config.ts) 增加重定向：

```ts
async redirects() {
  return [
    { source: '/about', destination: '/#about', permanent: true },
    { source: '/skills', destination: '/#skills', permanent: true },
    { source: '/contact', destination: '/#contact', permanent: true },
    { source: '/projects', destination: '/#work', permanent: true },
    { source: '/projects/:path*', destination: '/#work', permanent: true },
  ];
}
```

- 保留 `projects` 数据中的长字段（problem / goals / process / results / figures），本轮不做内容层大清理；只删除页面和入口。后续确认不再需要详情时，再单独清理 `getProjectFigures`、`getProjectNeighbors`、`getRelatedProjects`、`getProjects` 等只服务详情/列表的导出。
- [`app/blog/[slug]/page.tsx`](<app/blog/[slug]/page.tsx>) 里的“相关项目”区块要删掉，因为它会链接到已删除的 `/projects/[slug]`。`relatedProjectSlugs` 数据可以暂时保留，不再渲染。
- [`app/not-found.tsx`](app/not-found.tsx) 的“浏览作品”改为 `/#work`；删除“浏览笔记”按钮，或改为 `/#certs`。不要再指向 `/projects`。
- [`components/layout/SiteFooter.tsx`](components/layout/SiteFooter.tsx) 的“作品”改为 `/#work`，“笔记”改为 `/#certs`，删除 `/projects` 和 `/blog` 链接。
- [`app/sitemap.ts`](app/sitemap.ts) 只保留 `/`；移除 `/projects`、`/blog`、项目详情和文章详情的条目。
- 如果希望博客页面彻底不被搜索引擎收录，可以在 `app/blog` 的 metadata 里加 `robots: { index: false }`；本轮只要求退出 sitemap 与站内导航，是否 noindex 作为待确认项（见 §15）。

---

## 10. 证书区（需求 12）

### 10.1 结构

把 [`app/page.tsx`](app/page.tsx) 里整个 `#notes` 区块替换为 `#certs`。建议新建独立组件 [`components/home/Certifications.tsx`](components/home/Certifications.tsx)，保持首页文件可读。

```tsx
import Image from 'next/image';
import { certifications } from '@/lib/content/certifications';

export function Certifications() {
  return (
    <section id="certs" className="section certs-section" aria-labelledby="certs-title">
      <h2 id="certs-title" className="section-title">
        <a href="#certs">证书</a>
      </h2>
      <p className="lead">竞赛与专业认证。</p>

      <ul className="cert-grid">
        {certifications.map((cert) => (
          <li className="cert-card" key={cert.id}>
            <span className="cert-badge">
              <Image
                src={cert.image.src}
                alt={cert.image.alt}
                width={cert.image.width}
                height={cert.image.height}
              />
            </span>
            <span className="cert-body">
              <span className="cert-title">{cert.title}</span>
              <span className="cert-meta">
                {cert.issuer} · <time dateTime={cert.dateTime}>{cert.date}</time>
              </span>
            </span>
            <a
              className="cert-pdf"
              href={cert.pdf}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`查看证书 PDF：${cert.title}`}
            >
              PDF
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### 10.2 数据

新增 [`lib/content/certifications.ts`](lib/content/certifications.ts)：

```ts
export type Certification = {
  id: string;
  title: string;
  issuer: string;
  /** 显示用日期，例如 2026.7 */
  date: string;
  /** <time dateTime> 用，例如 2026-07 */
  dateTime: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  pdf: string;
};

/**
 * 三条占位数据：除 id 外字段完全相同。
 * 后续拿到真实证书时，只替换 title / issuer / date / dateTime / image / pdf，
 * 不需要改组件。
 */
export const certifications: Certification[] = [
  {
    id: 'cert-01',
    title: '中国机器人及人工智能大赛',
    issuer: '证书信息待补充',
    date: '2026.7',
    dateTime: '2026-07',
    image: {
      src: '/images/中国机器人.png',
      alt: '中国机器人及人工智能大赛证书徽标',
      width: 119,
      height: 88,
    },
    pdf: '/Certifications/中国机器人.pdf',
  },
  // cert-02、cert-03 复制同一份字段，只改 id
];
```

- 三条数据除 `id` 外完全相同，这是“当前三个样例均使用一个”的明确实现。
- `title` 暂用赛事名，不写奖项等级（避免编造国家一等奖/二等奖等未确认信息）。
- `issuer` 用“证书信息待补充”，拿到 PDF 里的真实颁发机构后替换；不要编造组委会全称。
- 日期显示 `2026.7`，`dateTime` 用 `2026-07`，格式一致。
- PDF 路径大小写严格按 `public/Certifications/中国机器人.pdf`；图片路径是 `public/images/中国机器人.png`（`images` 小写）。Cloudflare/Linux 区分大小写，不要写错。

### 10.3 视觉

参考图 15 的“证书陈列柜”：

```css
.certs-section {
  position: relative;
}

.certs-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 80% at 50% 0%, rgba(139, 124, 255, 0.08), transparent 70%);
  pointer-events: none;
}

.cert-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.cert-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02)),
    var(--surface);
  transition: border-color 0.2s ease, transform 0.2s var(--ease-out), box-shadow 0.2s ease;
}

.cert-card:hover {
  border-color: var(--line-strong);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), 0 0 30px rgba(139, 124, 255, 0.12);
}

.cert-badge {
  display: grid;
  place-items: center;
  width: 72px;
  height: 56px;
  padding: 8px;
  border-radius: 10px;
  background: #f4f1ea;
}

.cert-badge img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cert-body {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.cert-title {
  color: var(--fg);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
}

.cert-meta {
  color: var(--fg-muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.cert-pdf {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  background: #cfe3ff;
  color: #0b1b33;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: background 0.2s ease, transform 0.2s var(--ease-out);
}

.cert-pdf:hover {
  background: #e3efff;
  transform: translateY(-1px);
}
```

- 徽章缩略图用 72×56 的浅色小方块，原图 119×88 不会被拉大糊掉。
- 标题、机构、日期用两行；日期用 `<time>`。
- PDF 胶囊是浅蓝底、深色字，和参考图一致；它是卡片里唯一的操作。
- 如果首页其余区块都用 `Reveal`，把 `<Certifications />` 外层改成 `<Reveal as="section" ...>`，或在组件内部用 `Reveal` 包一层；不要出现“其他区块淡入、证书区突然出现”的割裂感。
- 三列在 1100px 以下变两列，760px 以下变一列：

```css
@media (max-width: 1100px) {
  .cert-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .cert-grid { grid-template-columns: minmax(0, 1fr); }
}
```

- 如果卡片在窄屏里挤，PDF 按钮换到下一行：`grid-template-columns: auto minmax(0, 1fr);`，PDF `grid-column: 2; justify-self: start;`。

### 10.4 导航与标题同步

[`lib/constants.ts`](lib/constants.ts)：

```ts
export const navLinks = [
  { label: '关于', href: '/#about', section: 'about' },
  { label: '技能', href: '/#skills', section: 'skills' },
  { label: '作品', href: '/#work', section: 'work' },
  { label: '证书', href: '/#certs', section: 'certs' },
  { label: '联系', href: '/#contact', section: 'contact' },
] as const;
```

- 删除“笔记”项，加入“证书”。
- [`components/layout/SiteHeader.tsx`](components/layout/SiteHeader.tsx) 的 `sectionFromPath('/blog')` 现在返回 `'notes'`；导航里没有 `notes` 了，改为返回 `''`，或直接删掉博客前缀的特判。
- `SiteHeader` 的滚动观察会自动使用新的 `certs` id。
- 首页 metadata 描述同步：把“笔记”改为“证书”。`siteConfig.tagline` 里的“项目、笔记与公开教学视频”也建议改成“项目、证书与公开教学视频”。

### 10.5 笔记区删除

- 删除 [`app/page.tsx`](app/page.tsx) 里的 `getFeaturedPosts` 导入、`featuredPosts` 变量和整个 `#notes` 区块。
- 删除首页对 `post-card` 的使用；`.post-card` 的 CSS 继续给 `/blog` 列表页使用，不要一起删。
- 博客列表和详情页保留，暗色主题通过全局 CSS 自动适配；不要删除 `app/blog`。

---

## 11. 路由、导航与内容清理

### 11.1 路由变化

| 路由 | 处理 | 说明 |
|---|---|---|
| `/` | 保留 | 首页；区块改为 `#about / #skills / #work / #certs / #contact` |
| `/projects` | 删除 + 308 到 `/#work` | 列表页不再存在 |
| `/projects/[slug]` | 删除 + 308 到 `/#work` | 三个详情页全部删除 |
| `/blog` | 保留 | 不在导航、页脚、404、sitemap |
| `/blog/[slug]` | 保留 | 移除“相关项目”链接；文章内容不变 |
| `/about`、`/skills`、`/contact` | 保留现有 308 | 继续回到首页锚点 |

### 11.2 导航与页脚

- 顶栏：关于 / 技能 / 作品 / 证书 / 联系。
- 页脚：作品 `/#work`、证书 `/#certs`、联系 `/#contact`、邮箱、返回顶部。
- 404：返回首页、浏览作品 `/#work`；删除 `/projects` 和 `/blog` 按钮。
- 不再有任何指向 `/projects` 的内部链接。

### 11.3 sitemap

[`app/sitemap.ts`](app/sitemap.ts) 改为：

```ts
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
    },
  ];
}
```

- 博客文章虽然保留，但退出 sitemap；如果以后恢复首页笔记区，再把文章加回来。
- `robots.ts` 不需要改；如果希望博客不被索引，在 blog 页面 metadata 里单独处理（见 §15）。

### 11.4 死链检查

改完后全局搜索：

```bash
rg -n "/projects|查看项目详情|piper-grasping|/blog" app components lib
```

预期：

- `app/`、`components/`、`lib/` 里不再有 `/projects` 或 `查看项目详情`。
- `/blog` 只出现在 blog 自身的路由、内容和 `posts.ts` 里，不再出现在首页/页脚/404/sitemap。
- `piper-grasping` 只可能出现在内容数据里，不再出现在链接里。

---

## 12. 文件改动清单

| 文件 | 动作 | 关键内容 |
|---|---|---|
| [`app/globals.css`](app/globals.css) | 大改 | 深色 token、背景、标题、Hero、丝带、星轨、作品卡、视频框、证书区、表单、博客/404 适配；清理浅色硬编码 |
| [`app/layout.tsx`](app/layout.tsx) | 小改 | 如采用 Noto Serif SC，加入 `--font-serif`；`color-scheme: dark`；可选 `viewport.themeColor = '#07080F'` |
| [`app/page.tsx`](app/page.tsx) | 大改 | Header 之外的 Hero 结构、区块标题、删除技能/作品副标题、项目卡静态化、删除笔记区、加入证书区；清理不再使用的 import |
| [`components/layout/SiteHeader.tsx`](components/layout/SiteHeader.tsx) | 中改 | 删除 brand 链接与 `handleBrandClick`；导航右对齐、字号放大；`sectionFromPath('/blog')` 改回空 |
| [`components/layout/SiteFooter.tsx`](components/layout/SiteFooter.tsx) | 小改 | 作品/证书/联系锚点；删除 `/projects`、`/blog` |
| [`components/home/HeroSocials.tsx`](components/home/HeroSocials.tsx) | 可选 | 结构可不动，主要靠 CSS 裸化；如需调整图标尺寸，改 `BrandIcons` 或 CSS |
| [`components/home/SkillOrbit.tsx`](components/home/SkillOrbit.tsx) | 重写 | 去掉 `'use client'`、state、分类按钮、暂停按钮；五分类公转；星空椭圆；CSS hover 暂停 |
| [`components/ui/SkillChip.tsx`](components/ui/SkillChip.tsx) | 删除/保留不用 | 新卡片只显示分类名 + 技术名；如保留，不再被引用 |
| [`components/home/Certifications.tsx`](components/home/Certifications.tsx) | 新增 | 证书区组件；三张卡、徽章、PDF |
| [`components/ui/WaveTransition.tsx`](components/ui/WaveTransition.tsx) | 重写 | 40 条主丝带 + 16 条反向丝带 + 柔光层；渐变、交叉、漂移 |
| [`components/ui/VideoFrame.tsx`](components/ui/VideoFrame.tsx) | 小改/不改 | 页面统一传 `tv`；如不再需要 `mirror`，可删除对应分支/CSS |
| [`components/media/LocalVideo.tsx`](components/media/LocalVideo.tsx) | 不改/小改 | 海报 `object-fit: contain` 由 CSS 控制；`useVideoPoster` 已能抓首帧 |
| [`lib/constants.ts`](lib/constants.ts) | 小改 | navLinks 改为 5 项；tagline 去掉“笔记” |
| [`lib/content/skills.ts`](lib/content/skills.ts) | 小改 | 保留五个分类；卡片只渲染 `name`；`tier`/`note` 可保留不渲染 |
| [`lib/content/projects.ts`](lib/content/projects.ts) | 小改 | `localDemos` 左侧去掉 poster、`frame: 'tv'`、fallback 改 GitHub；详情页专用导出可后续清理 |
| [`lib/content/certifications.ts`](lib/content/certifications.ts) | 新增 | 三条占位证书数据 |
| [`app/projects/page.tsx`](app/projects/page.tsx) | 删除 | 项目列表页下线 |
| [`app/projects/[slug]/page.tsx`](<app/projects/[slug]/page.tsx>) | 删除 | 项目详情页下线 |
| [`app/blog/[slug]/page.tsx`](<app/blog/[slug]/page.tsx>) | 小改 | 删除“相关项目”区块和 `getProjectBySlug` 导入 |
| [`app/not-found.tsx`](app/not-found.tsx) | 小改 | 作品链接改 `/#work`；删除 `/blog` 或改 `/#certs` |
| [`app/sitemap.ts`](app/sitemap.ts) | 小改 | 只保留 `/` |
| [`next.config.ts`](next.config.ts) | 小改 | 新增 `/projects`、`/projects/:path*` → `/#work` 的 308 |
| [`lib/content/featured.ts`](lib/content/featured.ts) | 可选 | 如简化 `skills.ts` 的类型，同步这里的 re-export；当前无引用，也可删除 |
| [`public/images/星空.gif`](public/images/星空.gif) | 不改 | 技能椭圆背景，懒加载 |
| [`public/images/中国机器人.png`](public/images/中国机器人.png) | 不改 | 证书徽章，119×88，显示不超过 72px |
| [`public/Certifications/中国机器人.pdf`](public/Certifications/中国机器人.pdf) | 不改 | 证书 PDF，路径大小写严格 |

---

## 13. 实施阶段

| 阶段 | 内容 | 涉及文件 | 完成判据 |
|---|---|---|---|
| 0 | 记录基线 | 当前首页、博客、404 截图；`npm run typecheck` / `lint` / `build` | 已知当前状态全部通过，后续可对比 |
| 1 | 深色底座 + 顶栏 + Hero + 标题 | `globals.css`、`layout.tsx`、`SiteHeader.tsx`、`page.tsx` | 全站无浅色残留；顶栏无品牌；导航字号放大；圆形照片；大标题无下划线 |
| 2 | 丝带波纹 | `WaveTransition.tsx`、`globals.css` | 40 条左右曲线、渐变、交叉、辉光；无横向滚动；reduce-motion 停止漂移 |
| 3 | 技能星轨 | `skills.ts`、`SkillOrbit.tsx`、新卡片、`globals.css`；删除 `SkillChip` 引用 | 五个分类框公转；框内只有技术名；星空 GIF；hover 暂停/离开恢复；无暂停按钮；移动端静态 |
| 4 | 作品与视频 + 路由删除 | `page.tsx`、`projects.ts`、`VideoFrame.tsx`、`LocalVideo` CSS、删除 `app/projects`、`next.config.ts`、`blog/[slug]`、`SiteFooter`、`not-found`、`sitemap` | 无“查看项目详情”；图片比例正确；两个视频同框；GitHub 回退；`/projects` 308；无死链 |
| 5 | 证书区 + 导航 | 新增 `certifications.ts`、`Certifications.tsx`；`page.tsx`、`constants.ts`、`globals.css` | 三张证书卡；PDF 可打开；导航“证书”与 `#certs` 生效；首页不再有笔记区 |
| 6 | 全量 QA 与清理 | 全仓库 | typecheck/lint/build 通过；三视口无横向溢出；对比度、键盘、reduce-motion、死链检查全部通过 |

依赖关系：阶段 1 必须先做；阶段 2/3/4/5 可以在 1 完成后并行；阶段 6 最后。

---

## 14. 验收清单

### 14.1 顶栏与 Hero

- [ ] 顶栏没有“苑阳 / Mike Jason”品牌文字。
- [ ] 导航在右侧，字号不小于 `1.0625rem`，五个入口为关于 / 技能 / 作品 / 证书 / 联系。
- [ ] 当前区块有清晰但克制的 active 状态；移动端汉堡菜单可用。
- [ ] Hero 照片是圆形，不是圆角方形；没有方形背板。
- [ ] 圆形照片没有裁掉头部/脚，人物不变形；桌面 240–360px，移动端不溢出。
- [ ] 姓名是衬线大字，桌面接近 96px；不再是原来的黑色无衬线 4rem。
- [ ] GitHub / B 站是裸图标，没有方框；触控区仍 ≥44×44。
- [ ] “算法控制工程师”是灰紫、常规字重、宽字距，不再是紫色加粗。
- [ ] 丝带是 36–48 条曲线的“束”，有渐变、交叉、辉光；不是 5 条平线。
- [ ] 丝带没有横向滚动条，`aria-hidden="true"`，不阻塞首屏文字。

### 14.2 区块标题

- [ ] 关于 / 技能 / 作品 / 证书 / 联系五个标题都是大号衬线字。
- [ ] 五个标题都没有下划线、没有英文小标签、没有前置横线。
- [ ] “把学过的技术摆到台面上。”已删除。
- [ ] “项目、讲解与演示。”已删除。
- [ ] 联系区问句降为导语，不再和“联系”抢层级。
- [ ] 每个 section 的 `aria-labelledby` 指向新的标题 id。

### 14.3 技能星轨

- [ ] 左侧分类清单已删除。
- [ ] “暂停转动”按钮已删除，页面上没有任何暂停图标/文字。
- [ ] 五个分类框同时存在，沿一个椭圆公转，间隔约 72°。
- [ ] 每个框内只有分类名和技术名，没有“在学 / 练过 / 落地”、没有说明、没有计数。
- [ ] 椭圆内部是 `星空.gif`，图片懒加载，文字对比度足够。
- [ ] 鼠标进入椭圆区域，公转暂停；移到椭圆外，恢复。
- [ ] 没有左右横向溢出；卡片在 375 / 768 / 1440 三档都不互相遮挡。
- [ ] 移动端不公转，五张卡静态网格排列。
- [ ] `prefers-reduced-motion` 下不公转。
- [ ] 不支持 `cos()/sin()` 的浏览器有静态网格兜底。

### 14.4 作品与视频

- [ ] 两个项目卡都没有“查看项目详情 →”。
- [ ] 项目卡不再是链接，鼠标不是 pointer，hover 不抬升、不缩放。
- [ ] 左侧仓库截图顶部信息完整，没有被裁掉标题/侧栏。
- [ ] 右侧机械臂图完整显示在方形/竖向框里，不被裁切、不奇怪留白。
- [ ] 两个视频都是同一种深色显示器外框，右侧不再是浅色镜框。
- [ ] 左侧视频封面是 16:9 首帧，不是竖版 `robot-arm.png`。
- [ ] 左侧回退链接是 `https://github.com/yycodes333`，不再指向 `/projects/piper-grasping`。
- [ ] 视频不自动播放、不自动出声；点击后才加载。
- [ ] `/projects` 和 `/projects/*` 返回 308 到 `/#work`。

### 14.5 证书

- [ ] 首页 `#notes` 整段已替换为 `#certs`。
- [ ] 标题是“证书”，导航第四项是“证书”。
- [ ] 三张证书卡显示 `中国机器人.png` 徽章、`2026.7`、PDF 按钮。
- [ ] 三张卡的图片、日期、PDF 均使用同一份占位数据；除 id 外一致。
- [ ] PDF 打开 `/Certifications/中国机器人.pdf`；文件名大小写正确。
- [ ] 徽章没有被拉大/拉糊；119×88 原图显示在 72×56 左右的浅色小方块里。
- [ ] 三列在桌面、两列在 1100px 以下、单列在 760px 以下。
- [ ] 博客 `/blog` 和 `/blog/[slug]` 仍可直接访问，但不在导航、页脚、404、sitemap。
- [ ] 博客详情页不再有“相关项目”链接。

### 14.6 全局质量

- [ ] 首页、博客列表、博客详情、404 都是深色，无白色残块。
- [ ] 正文、说明、卡片标题、PDF 按钮对比度 ≥4.5:1。
- [ ] 焦点环在所有可交互元素上清晰可见。
- [ ] 375 / 768 / 1440 三视口无横向滚动、无遮挡、无严重布局跳动。
- [ ] 星空 GIF 懒加载；首屏不请求 3 MB GIF。
- [ ] 所有图片有合适的 `alt`；装饰图 `alt=""`。
- [ ] `npm run typecheck` 通过。
- [ ] `npm run lint` 通过。
- [ ] `npm run build` 通过。
- [ ] 全局搜索 `/projects`、`查看项目详情`、`piper-grasping` 无内部链接残留（内容数据里的 slug 可以保留，但不能再生成链接）。

---

## 15. 风险与待确认

| 风险/待确认 | 影响 | 处理 |
|---|---|---|
| 中文衬线字体体积 | Noto Serif SC 可能让首屏字体请求变大 | 先按 §4.3 方案 1 试；超过约 300 KB 改用本机子集或系统宋体栈 |
| `星空.gif` 约 2.98 MB | 移动端流量与首屏后的加载 | 懒加载；<900px 可隐藏或用 CSS 星空替代；不要预加载 |
| 三条证书是占位数据 | 视觉上三张卡一模一样；标题/机构可能不准确 | 保留 `id` 区分；拿到真实 PDF 后逐条替换；不写奖项等级 |
| 圆形裁切 | `个人01.jpg` 是全身场景照，人物较小 | 用 `object-position: 55% 38%` + `scale(1.1–1.3)` 微调；必要时换一张半身照 |
| Cloudflare 下 `#` 重定向 | `/projects` → `/#work` 可能丢失 hash | 部署后实测；若丢失，改用页面级 `permanentRedirect('/#work')` 或保留一个薄壳页 |
| `中国机器人.png` 只有 119×88 | 放大就糊 | 只做 72px 徽章，不做大图；以后有高清图再替换 |
| 深色与 AGENTS 的“明亮”描述冲突 | 文档与实现不一致 | 本轮按用户要求执行；后续同步 AGENTS/PRD2 的视觉描述 |
| 博客保留但被隐藏 | 内容可有可无，外部可能找不到 | 本轮按要求退出导航/sitemap；是否 noindex 待确认 |
| `prefers-reduced-motion` 处理 | 与 Improve.md §2.1 的“不降级”不同 | 本文按 AGENTS 要求降级；如果坚持不降级，删除 D6 并保留悬停暂停 |

待确认（不阻塞文档，实施前可以再定）：

1. 中文标题字体最终选 Noto Serif SC、霞鹜文楷，还是系统宋体？本文默认 Noto Serif SC / 思源宋体。
2. 证书三条占位卡的标题是否统一用“中国机器人及人工智能大赛”，还是先用“证书 01/02/03”？
3. 博客页面是否需要 `noindex`，还是只退出 sitemap？
4. 左侧项目卡是否要完整显示整张仓库截图（`contain`），还是保留顶部裁切（`cover + top`）？

---

## 16. 变更记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v2.0 | 2026-10-28 | 首版：根据 12 条修改意见，确立全站深色、星轨技能区、静态作品卡、统一视频框、证书区替换笔记区、项目详情/列表下线等决策；给出视觉 token、组件规格、文件清单、实施阶段与验收清单 |