# rc929

🇺🇸 [English](README.md) | 🇨🇳 [简体中文](README.zh-CN.md)

**面向 Cursor / Claude Code 的代码库研究技能。** 把「这段代码怎么运作」这类问题，收敛成 **一份** 准确、可编辑的 **`.drawio`** 图 —— 先看 Overview，再按主题打开 Flow 页，旁注 Feynman 说明并附 `path:line` 证据。

在 AI 助手里直接提问即可：数据流、架构分层、请求生命周期、Agent 协作方式……rc929 会读实时源码、追踪调用链。交付物是单个 draw.io 文件，可在 diagrams.net 或 Obsidian Draw.io 中打开编辑。

```
「梳理一下 CLI 启动后，一次请求是怎么走完的。」
/rc929 这些 agent 之间怎么协作？给我一份能打开编辑的图。
```

最终你会得到 **一个** 文件：

```
2026-05-24-research-<topic>.drawio   用 draw.io 打开 —— Overview + Flow 页、Feynman 旁注、path:line 引用
```

---

## 它能做什么

rc929 是一套 **研究工作流技能**，不是 CLI 工具。Agent 会定位相关文件、追踪调用与数据变换，再把结论写成未压缩的 `.drawio`。

| 原则 | 含义 |
|------|------|
| **准确优先** | 每条结论都要有证据（`path:line` 或符号引用）。不确定的标 `待验证`，不会画进图里当事实。 |
| **单一交付物** | 只产出一份未压缩 `.drawio`。Agent 复制 starter 模板、填写页面，再用内置 Python 脚本做审计。 |
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
            ├── scripts/
            │   └── audit_drawio.py
            ├── templates/
            │   └── research-starter.drawio
            └── references/
                ├── drawio-content-guide.md
                ├── drawio-layout-guide.md
                ├── drawio-editing-rules.md
                ├── codebase-locator.md
                └── codebase-analyzer.md
```

在项目里打开 AI 助手 —— 用自然语言提问，或输入 `/rc929` 加研究问题来显式调用技能。

**需要 Python 3** 用于运行 `audit_drawio.py`（仅标准库，无需 `pip install`）。

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

也可以指定输出路径（默认：`thoughts/research/`）：

```
研究 agent 工具调用链路，保存为 2026-05-24-research-agents.drawio
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
| 多 Agent | 「这些 agent 怎么协作？给我能打开编辑的图。」 |

---

## 图里有什么

- **Overview 页** —— 问题、元数据、要点（含 `file:line`）、待验证项。
- **Flow 页** —— 每个关注点一页（约 8 个内容节点，上限 10），原生 draw.io 图形与连线，旁侧 Feynman 说明。
- **证据** —— 节点与旁注上的短 `path:line` 引用（不再使用 HTML 折叠面板）。
- **校验** —— 交付前用 `audit_drawio.py` 检查结构、引用、边界、重叠与走线。

版式遵循内置 draw.io 布局指南：管道从左到右、多方交互用序列式、错误路径走边槽，过密则拆页。

---

## 工作流程

```
Intake → 规划（2–6 个方向）→ 定位（WHERE）→ 分析（HOW）→ 交叉验证 → 编写 .drawio → 审计 → 交付
```

1. **Intake** —— 确认问题；若你指定了文件，先完整读完再探索。
2. **规划** —— 拆成可调查的子方向；决定如何拆 Flow 页。
3. **定位** —— Grep/Glob 找关键词与命名模式；按角色分组文件（暂不深读实现）。
4. **分析** —— 读入口；追踪调用与数据变换；每步记录 `file:line`。
5. **交叉验证** —— 重读关键路径；删掉无法引用的图节点/边。代码与文档冲突时，以代码为准并简要注明。
6. **编写** —— 复制 `templates/research-starter.drawio`，填写 Overview，按主题复制 Flow 页。
7. **审计** —— 运行 `python3 .claude/skills/rc929/scripts/audit_drawio.py <path.drawio>`（编辑时配合 snapshot/baseline）。
8. **交付** —— 给出 `.drawio` 路径、2–3 句事实摘要、建议先看哪一页、以及未闭合的缺口。

独立探索区域可并行子 Agent。主上下文负责写图并跑审计。

---

## 仓库结构

| 路径 | 用途 |
|------|------|
| `.claude/skills/rc929/` | 技能定义、starter 图、探索与 drawio 指南 |
| `docs/superpowers/specs/` | 设计规格 |
| `docs/superpowers/plans/` | 实现计划 |

研究产出的 `.drawio` 默认写到项目根目录的 `thoughts/research/`，也可指定其他路径。产出文件 **不会** 打包进技能文件夹。

---

## 使用建议

**适合需要「看懂结构」的问题。** 架构、流程、依赖关系 —— 比单行答案更适合 rc929。

**知道入口就点名。** 比如「从 `main.go` 开始」或「聚焦 `Worker` 类」，能加快分析。

**留意 `待验证`。** Overview 会明确标出源码中未能完全证实的结论。

**别指望重构方案。** 技能只描述当前行为；改进建议需单独提出。

---

## 延伸阅读

- [SKILL.md](.claude/skills/rc929/SKILL.md) —— 完整工作流、质量检查清单、常见失败模式
- [drawio-content-guide.md](.claude/skills/rc929/references/drawio-content-guide.md) —— 图内 Overview / Feynman / 引用规范
- [drawio-layout-guide.md](.claude/skills/rc929/references/drawio-layout-guide.md) —— 页面布局与连线
- [drawio-editing-rules.md](.claude/skills/rc929/references/drawio-editing-rules.md) —— XML 编辑与审计期望
