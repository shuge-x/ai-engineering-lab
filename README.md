# AI Engineering Lab

面向中文开发者的 AI 编程工程实践实验室。以 Matt Pocock Skills 为主工作流，以 CodeGraph 补充代码结构知识，并通过任务故事、机制演示和知识关系图帮助开发者掌握实际工程方法。

## 在线站点

https://shuge-x.github.io/ai-engineering-lab/

## 当前阶段：交互工作台骨架

- 任务入口：六种开发场景及适用边界。
- 机制演示：工作流阶段图、步骤切换、播放 / 暂停、速度控制。
- 知识图谱：展示用户意图、Skills、工程工件、测试与知识同步之间的关系。
- 右侧机制说明：机制、可复制 Prompt、上游来源三个视角。
- 底部执行轨迹：阶段、执行者和状态观察。
- 两个核心专题：项目知识与 CodeGraph；测试、验证与真实验收。
- 中文内容、深色主题、移动端适配、本地学习进度。

## 六种工作流

1. 快速修改
2. 需求探索与设计
3. 常规功能开发
4. 大型架构与跨会话
5. 复杂 Bug 诊断
6. 架构优化与重构

每条工作流包含开发故事、适用条件、主流程、常见错误、阶段产物、交接规则和可复制指令。当前先保证课程结构与关键机制完整，后续逐步扩充更细的示例、图解、演练和来源注释。

## 本地预览

纯静态站点，无需后端或安装依赖。可直接打开 `index.html`，也可使用任意静态 HTTP 服务。

## 上游项目与设计参考

- Matt Pocock Skills: https://github.com/mattpocock/skills
- CodeGraph: https://github.com/colbymchenry/codegraph
- 交互教学形式参考: https://github.com/shuge-x/k8s-learning-lab

## 内容准确性原则

- Skill 名称、调用权限和工作流以 Matt 上游仓库当前版本为准。
- CodeGraph 是代码结构索引，不是业务知识库、通用 SQL 血缘工具或运行时正确性验证器。
- 自动化测试通过不等于需求满足，更不等于人工验收完成。
- 教学案例是实践建议，不应描述为上游工具保证自动执行的行为。

## 部署

GitHub Actions 校验脚本与课程数据后部署 GitHub Pages。仓库 Pages Source 使用 GitHub Actions。
