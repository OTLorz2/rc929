# rc929

🇺🇸 [English](README.md) | 🇨🇳 [简体中文](README.zh-CN.md)

**面向 Cursor / Claude Code 的代码库研究技能。** 把「这段代码怎么运作」这类问题，收敛成 **一份** 准确、可视化、可交互的自包含 HTML 报告 —— 先看图，再查证据。

在 AI 助手里直接提问即可：数据流、架构分层、请求生命周期、Agent 协作方式……rc929 会读实时源码、追踪调用链，并附上 `file:line` 引用。交付物不是 Markdown 长文，也不是一堆零散资源文件。

```
「梳理一下 CLI 启动后，一次请求是怎么走完的。」
/rc929 这些 agent 之间怎么协作？给我一份能点开看的说明。
```

最终你会得到 **一个** 文件：

```
research-<topic>-2026-05-24.html   用浏览器打开 —— 目录导航、Mermaid 图、可折叠证据块
```

---

## 它能做什么

rc929 是一套 **研究工作流技能**，不是 CLI 工具。Agent 会定位相关文件、追踪调用与数据变换，再把结论合成一页可交互 HTML。

| 原则 | 含义 |
|------|------|
| **准确优先** | 每条结论都要有证据（`path:line` 或符号引用）。不确定的标 `待验证`，不会画进图里当事实。 |
| **单一交付物** | 只产出一份自包含 `.html`（CSS/JS 内联；字体/Mermaid 可用 CDN）。 |
| **只描述现状** | 除非你明确要求，否则不做重构建议或「应该怎么做」的点评。 |
| **读活代码** | 以源码为准；不能单靠过时的文档。 |

适用于 **Cursor**、**Claude Code** 以及从 `.claude/skills/` 加载技能的其他助手。

---

## 安装

技能位于本仓库的 `.claude/skills/rc929/`。要在其他项目使用，把整个 `rc929` 文件夹复制到目标项目的 `.claude/skills/rc929/`（或安装到用户级 skills 目录）。

```
your-project/
└── .claude/
    └── skills/
        └── rc929/
            ├── SKILL.md
            └── references/
                ├── html-shell-template.html
                ├── html-report-guide.md
                ├── codebase-locator.md
                ├── codebase-analyzer.md
                └── template-sync-guide.md
```

在项目里打开 AI 助手 —— 用自然语言提问，或输入 `/rc929` 加研究问题来显式调用技能。

---

## 用法

两种调用方式：

### 1. 自然语言提问

直接描述你想搞懂的问题 —— 当你要求探索、梳理、追踪或文档化代码运作方式时，技能会自动触发：

```
探索这个仓库里数据从抓取到入库再到分析的完整流程。
梳理 API 层和 worker 队列之间的模块边界。
auth 中间件链在 HTTP 请求进来时是怎么工作的？
```

也可以指定输出路径或主题名：

```
研究 agent 工具调用链路，保存为 research-agents-2026-05-24.html
```

### 2. 斜杠命令

输入 `/rc929` 显式调用技能，后面跟上你的研究问题：

```
/rc929 梳理 CLI 启动后一次请求从入口到响应的完整路径
/rc929 delivery 插件是怎么加载的？和 InsightStore 怎么交互？
```

当你希望确保走 rc929 工作流、而不是依赖模型自行判断是否选用该技能时，用这种方式更稳妥。

### 示例提问

| 目标 | 提问 |
|------|------|
| 数据管道 | 「数据是怎么从抓取 → 入库 → 分析的？」 |
| 请求生命周期 | 「画一下 CLI 启动后一次请求的完整路径。」 |
| 多 Agent | 「这些 agent 怎么协作？给我能点开看的说明。」 |
| 换模板 + 研究 | 「我在 rc929 目录放了新的 template.html，按新风格研究 XXX。」 |

---

## 报告里有什么

- **主视觉图** —— 1–2 张 Mermaid 图直接回答问题（流程图、时序图、依赖图、状态机，按问题类型选择）。
- **要点** —— 精简结论列表，内联 `file:line` 引用。
- **证据面板** —— 可折叠代码片段，路径可回溯到仓库。
- **元数据** —— 仓库名/路径、日期、git 分支/commit（如有）、原始问题原文。
- **待验证项** —— 标为 `待验证` 或未覆盖的部分。

图表类型在研究开始前选定，**有证据才画**：

| 问题类型 | 推荐图表 |
|----------|----------|
| 管道、ETL、批处理 | `flowchart` / `graph` |
| 模块/包依赖 | `graph` |
| RPC、Webhook、Agent | `sequenceDiagram` |
| 状态机 | `stateDiagram-v2` |
| 分层架构 | 带 subgraph 的 `flowchart` |

---

## 工作流程

```
 intake → 规划（2–6 个方向）→ 定位（WHERE）→ 分析（HOW）→ 交叉验证 → 生成 HTML → 交付
```

1. **Intake** —— 确认问题；若你指定了文件，先完整读完再探索。
2. **规划** —— 拆成可调查的子方向；选定图表类型。
3. **定位** —— Grep/Glob 找关键词与命名模式；按角色分组文件（暂不深读实现）。
4. **分析** —— 读入口；追踪调用与数据变换；每步记录 `file:line`。
5. **交叉验证** —— 重读关键路径；删掉无法引用的图节点/边。代码与文档冲突时，以代码为准并简要注明。
6. **生成** —— 复制 `references/html-shell-template.html`，按 `references/html-report-guide.md` 填入 `<main>` 内容。
7. **交付** —— 给出 HTML 路径、2–3 句事实摘要、建议先看哪张图/哪一节、以及未闭合的缺口。

独立探索区域可并行子 Agent。模板同步（见下）始终在子 Agent 中执行，避免占用主上下文。

---

## 自定义报告样式

把新的 `template.html` 放到 `.claude/skills/rc929/`（与 `SKILL.md` 同级），然后发起研究请求。技能会检测到该文件并启动子 Agent：

1. 从你的模板提取 UI 结构、CSS、JS、布局（忽略示例研究内容）。
2. 更新 `references/html-shell-template.html` 和 `references/html-report-guide.md` 以匹配新样式。
3. 从技能根目录 **删除** `template.html`。

仓库根目录 [`templates/`](templates/) 下有可参考的 HTML 模板样例。

---

## 仓库结构

| 路径 | 用途 |
|------|------|
| `.claude/skills/rc929/` | 技能定义、HTML 壳、探索指南 |
| `templates/` | 可改编的报告模板示例 |
| `rc929-workspace/` | 技能开发迭代与 eval 产物 |
| `codebase-locator.md`、`codebase-analyzer.md` | 探索参考文档的独立副本 |

研究产出的 HTML 写到你指定的位置（或话题相关目录）—— **不会** 打包进技能文件夹。

---

## 使用建议

**适合需要「看懂结构」的问题。** 架构、流程、依赖关系 —— 比单行答案更适合 rc929。

**知道入口就点名。** 比如「从 `main.go` 开始」或「聚焦 `Worker` 类」，能加快分析。

**留意 `待验证`。** 报告会明确标出源码中未能完全证实的结论。

**别指望重构方案。** 技能只描述当前行为；改进建议需单独提出。

---

## 延伸阅读

- [SKILL.md](.claude/skills/rc929/SKILL.md) —— 完整工作流、质量检查清单、常见失败模式
- [html-report-guide.md](.claude/skills/rc929/references/html-report-guide.md) —— 页面结构、Mermaid 规则、UI 约定
- [template-sync-guide.md](.claude/skills/rc929/references/template-sync-guide.md) —— 模板同步机制
