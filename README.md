# AI Engineering Lab

基于 Matt Pocock Skills + CodeGraph 的中文 AI 编程工程实践实验室。

## 在线学习站

GitHub Pages 部署完成后访问：

https://shuge-x.github.io/ai-engineering-lab/

## 当前 MVP

- 六种工作流：快速修改、需求探索与设计、常规功能开发、大型架构与跨会话、复杂 Bug 诊断、架构优化与重构。
- 每种工作流包含完整开发故事、适用条件、主流程、错误分支、阶段交接和可复制提示词。
- 项目知识与 CodeGraph 专题。
- 测试、验证与真实验收专题。
- Matt Skills 索引与工程授权原则。
- 中文界面、搜索、深色模式、移动端适配和本地学习进度。

## 本地预览

这是纯静态站点，直接打开 `index.html` 即可；也可以用任意静态 HTTP 服务预览。

## 上游项目与设计参考

- Matt Pocock Skills: https://github.com/mattpocock/skills
- CodeGraph: https://github.com/colbymchenry/codegraph
- 教学交互形式参考: https://github.com/shuge-x/k8s-learning-lab

## 工程原则

- 人掌握决策权，Agent 在明确授权范围内执行。
- 业务意图与代码事实分开维护。
- 测试通过不等于需求满足，更不等于人工验收完成。
- 小任务保持轻量；高风险任务按风险增加控制。

## 发布

仓库包含 GitHub Pages Actions 工作流。请在仓库 Settings → Pages 中将 Build and deployment 的 Source 设置为 GitHub Actions。推送 main 后自动构建并部署。
