# AI Engineering Lab

面向中文开发者的 AI 编程工程实践实验室。以 Matt Pocock Skills 为核心工程工作流，以 CodeGraph 补充代码结构知识。

## 在线站点

https://shuge-x.github.io/ai-engineering-lab/

## 两种入口：实践故事与知识课程

### 任务入口：从真实开发问题开始

首页优先呈现六个真实开发案例，而不是把知识点目录当作用户故事：

1. 修改 Workspace 页面空状态（快速修改）
2. Workspace 多用户共享功能（需求探索）
3. Workspace 邀请成员功能（常规功能）
4. Workspace Runtime 迁移机制（大型架构）
5. 容器已启动但 Workspace 仍显示失败（复杂 Bug）
6. WorkspaceService 职责过载（架构重构）

每个故事包含背景、适用条件、完整主流程、阶段产物、操作指令、常见错误，以及关联知识课程。顶部「任务入口」始终可以返回故事首页。

### 知识课程：系统掌握工程方法

三个领域、22 个知识主题：

- **01 需求与架构（7 课）**：Grill、领域建模、Research / Prototype、Wayfinder、ADR、架构设计、变更控制。
- **02 开发与交付（8 课）**：任务分级、Spec、Tickets、TDD、多 Agent、Code Review、跨会话知识、交付同步。
- **03 质量与演进（7 课）**：Bug 诊断、测试策略、规格符合性、CodeGraph、人工验收、安全重构、Retro。

顶部三个领域导航进入知识课程；课程页提供左侧主题目录、中间学习画布、右侧机制讲解和底部执行轨迹。

## 三种学习视角

知识课程支持任务入口、机制演示和知识图谱三种视角。机制演示支持阶段切换、主流程 / 典型错误切换、播放与逐步推进。

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
- 交互教学形式参考: https://github.com/shuge-x/k8s-learning-lab

## 本地预览与部署

纯静态站点，无需后端。直接打开 `index.html` 或使用任意静态 HTTP 服务。GitHub Actions 校验脚本、六个实践故事和课程数据后部署 GitHub Pages。
