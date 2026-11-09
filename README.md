# AI Coding Workflow Lab

**AI 编程工作流实验室**：面向 AI Coding Agent 的工程方法、工作流与实战。

在线站点：https://shuge-x.github.io/ai-engineering-lab/

## 产品结构

- **任务入口**：从真实开发场景开始，进入对应工作流实战。
- **01 需求与架构**：7 个工具中立知识主题。
- **02 开发与交付**：8 个工具中立知识主题。
- **03 质量与演进**：7 个工具中立知识主题。
- **04 工作流实战**：当前第一套方法论包为 Matt Pocock Skills + CodeGraph，包含六条可操作实战路线。

Matt Pocock Skills + CodeGraph 是第一套实践体系，不是平台永久绑定的唯一工具。未来可以加入 Superpowers、OpenSpec、Spec Kit 等，但必须先经过研究和课程设计。

## 内容模型

- **Scenario**：真实工程场景、用户目标和约束。
- **Playbook**：用某套方法论解决该场景的完整工作流。
- **Knowledge Lesson**：解释工程方法、机制和原则。
- **Methodology Pack**：一套工作流方法论及其上游工具。

首页故事卡和 04 目录使用同一 Playbook 路由、数据源和学习进度。未来一个 Scenario 可以对应不同 Methodology Pack 的多个 Playbook。

## 当前六条实战路线

| 编号 | 工作流 | 场景 |
|---|---|---|
| 01 | 快速修改 | 优化任务看板空状态 |
| 02 | 需求探索 | 设计任务逾期提醒 |
| 03 | 常规功能开发 | 任务指派与成员协作 |
| 04 | 大型架构 | 单团队看板升级为多团队 SaaS |
| 05 | 复杂 Bug 诊断 | 拖动任务后刷新，状态恢复原样 |
| 06 | 架构重构 | TaskService 职责过载 |

每条 Playbook 包含真实场景、工作流选择、开发准备、逐步执行、Agent 预期行为、工件与交接、异常与人工决策、最终验收与复盘。每个步骤提供准确的命令 / 操作、完整 Prompt、预期行为、工件、检查清单和交接条件。

## 配套教学项目

配套项目仓库已创建：[`shuge-x/ai-coding-workflow-demo`](https://github.com/shuge-x/ai-coding-workflow-demo)，使用 Team Task Board 作为六条实战路线的统一可运行教学项目。

推荐技术栈：Next.js App Router、React、TypeScript、Tailwind CSS、Prisma + SQLite、Vitest、Playwright。每条故事有独立起始 Tag / 分支，不要求学习者先完成前一条故事。

配套项目已提交第一版基础实现，GitHub Actions 的安装、Prisma 初始化、TypeScript、ESLint、Vitest、Next.js build、Playwright 和任务指派行为检查均已通过。六个起始 Tag 仍需逐一验证后发布。

## 内容与工具边界

- 人掌握业务决策、工作流入口、实施授权和最终验收。
- Agent 在授权范围内执行；设计认可不等于编码授权。
- 业务意图由 GLOSSARY、ADR、Spec 和模块知识保存；代码结构由 CodeGraph 探索。
- CodeGraph 不是业务知识库、通用 SQL 血缘工具或运行时正确性验证器。
- 自动化测试通过不等于需求满足，更不等于人工验收完成。
- Skill 名称、调用权限和行为以 Matt Pocock 上游当前版本为准。

## 上游项目

- Matt Pocock Skills: https://github.com/mattpocock/skills
- CodeGraph: https://github.com/colbymchenry/codegraph
- K8s Learning Lab（交互教学形式参考）: https://github.com/shuge-x/k8s-learning-lab

## 本地预览与部署

纯静态站点，无需后端。直接打开 `index.html` 或使用任意静态 HTTP 服务。GitHub Actions 校验课程数据和浏览器交互后部署 GitHub Pages。
