# AI Engineering Lab

面向中文开发者的 AI 编程工程实践实验室。以 Matt Pocock Skills 为核心工程工作流，以 CodeGraph 补充代码结构知识，采用任务入口、机制演示、知识图谱三种学习视角。

## 在线站点

https://shuge-x.github.io/ai-engineering-lab/

## 课程体系

三个学习领域、22 个知识主题：

- **01 需求与架构（6 课）**：需求访谈与 Grill、领域建模与 GLOSSARY、技术研究与原型验证、Wayfinder 决策地图、架构决策与 ADR、架构设计与模块边界、需求边界与变更控制。
- **02 开发与交付（8 课）**：任务分级与工作流选择、Spec 规格设计、Tickets 任务拆解、TDD 与垂直切片实施、多 Agent 协作、Code Review、跨会话接续与项目知识、交付与知识同步。
- **03 质量与演进（8 课）**：Bug 诊断、测试分层、需求符合性、CodeGraph 影响分析、真实用户验收、安全重构、工程复盘等。

每个知识主题包含核心原则、主流程、典型错误路径、机制解释、Prompt 模板、工程产物、相关主题和上游来源。当前优先建立完整课程骨架，后续逐课补充更细的实操案例、工件样例和验证材料。

## 三种学习视角

- **任务入口**：从真实开发场景和知识主题进入。
- **机制演示**：分阶段查看流程、执行者、产物和交接。
- **知识图谱**：查看当前主题与相关主题的概念关联。

课程页采用左侧领域目录、中间学习画布、右侧机制解释和底部执行轨迹。顶部三个学习领域与课程目录同步。

## 设计原则

- 人掌握业务决策、工作流入口、实施授权和最终验收。
- Agent 在授权范围内组织执行，不把设计认可推断为编码授权。
- 证据决定完成状态。
- 业务意图由 GLOSSARY、ADR、Spec 和模块知识保存；代码结构由 CodeGraph 探索。
- CodeGraph 不是业务知识库、通用 SQL 血缘工具或运行时正确性验证器。
- 自动化测试通过不等于需求满足，更不等于人工验收完成。

## 上游项目

- Matt Pocock Skills: https://github.com/mattpocock/skills
- CodeGraph: https://github.com/colbymchenry/codegraph
- 交互教学形式参考: https://github.com/shuge-x/k8s-learning-lab

## 本地预览与部署

纯静态站点，无需后端。直接打开 `index.html` 或使用任意静态 HTTP 服务。GitHub Actions 校验脚本和课程数据后部署 GitHub Pages。
