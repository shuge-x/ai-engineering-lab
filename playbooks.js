window.LAB_PRACTICE = {
  "version": "0.2.0",
  "pack": {
    "meta": {
      "id": "matt-skills-codegraph",
      "title": "Matt Pocock Skills + CodeGraph",
      "subtitle": "可组合工程 Skills · 开发者掌握工作流控制权",
      "status": "current",
      "versionChecked": "2026-11-08",
      "upstream": [
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills"
        },
        {
          "title": "CodeGraph",
          "url": "https://github.com/colbymchenry/codegraph"
        }
      ],
      "note": "本实验室设计的六条实战路线，不是 Matt 上游官方固定的六条工作流。"
    },
    "setup": {
      "title": "开始之前：一次性环境准备",
      "agents": [
        {
          "id": "codex",
          "title": "Codex",
          "commands": [
            "codex plugin marketplace add mattpocock/skills",
            "codex plugin add mattpocock-skills@mattpocock"
          ],
          "note": "按 Matt 上游 README 安装 Codex 插件。安装后重启 Codex；具体 Skill 入口以当前宿主界面为准。"
        },
        {
          "id": "claude",
          "title": "Claude Code",
          "commands": [
            "claude plugin install mattpocock-skills@claude-plugins-official"
          ],
          "note": "按 Matt 上游 README 安装 Claude 插件。安装后重启 Claude Code。"
        },
        {
          "id": "opencode",
          "title": "OpenCode",
          "commands": [
            "npx skills@latest add mattpocock/skills -a opencode"
          ],
          "note": "使用 skills.sh 通用安装器安装到 OpenCode。安装后重新打开项目会话。"
        }
      ],
      "tracker": {
        "command": "/setup-matt-pocock-skills",
        "recommendation": "第一次使用 Matt 工程 Skills 时运行一次。教学项目推荐选择 Local Markdown tracker，避免初学者先配置 GitHub CLI 和 Issue 权限。",
        "expected": "生成 issue tracker、领域文档和 Agent 读取约定。to-spec、to-tickets 和 wayfinder 后续会依照该配置保存工件。"
      },
      "codegraph": {
        "requiredFor": [
          "large-architecture",
          "complex-bug",
          "safe-refactor"
        ],
        "install": [
          "curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh",
          "codegraph install"
        ],
        "project": [
          "cd ai-coding-workflow-demo",
          "codegraph init"
        ],
        "query": [
          "codegraph explore \"Trace TaskService callers, callees, and the path from task status update to database persistence\""
        ],
        "note": "codegraph install 负责配置 Coding Agent 的 MCP；codegraph init 才会为当前项目建立索引。初始化后默认自动同步。"
      },
      "demoProject": {
        "repository": "https://github.com/shuge-x/ai-coding-workflow-demo",
        "status": "待仓库创建和授权",
        "stack": [
          "Next.js App Router",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Prisma + SQLite",
          "Vitest",
          "Playwright"
        ]
      }
    },
    "invocationRules": [
      {
        "type": "user",
        "title": "用户主动调用",
        "skills": [
          "grill-with-docs",
          "to-spec",
          "to-tickets",
          "implement",
          "wayfinder",
          "implement-spec",
          "improve-codebase-architecture",
          "retro"
        ],
        "rule": "这些 Skill 在上游标记为 disable-model-invocation: true。课程应明确告诉学习者何时主动启动它们。"
      },
      {
        "type": "agent",
        "title": "Agent 按需调用",
        "skills": [
          "grilling",
          "domain-modeling",
          "tdd",
          "code-review",
          "research",
          "prototype",
          "diagnosing-bugs",
          "codebase-design"
        ],
        "rule": "这些能力可由 Agent 根据任务调用。不要把它们全部写成用户必须逐个输入的命令。"
      },
      {
        "type": "tool",
        "title": "外部工具",
        "skills": [
          "CodeGraph MCP / codegraph CLI"
        ],
        "rule": "CodeGraph 是代码结构探索工具，不是业务知识库，也不替代源码、SQL、配置和测试核对。"
      }
    ]
  },
  "scenarios": [
    {
      "id": "empty-state",
      "title": "任务看板空状态",
      "product": "Team Task Board",
      "user": "第一次打开任务看板的项目成员",
      "current": "项目还没有任何任务，页面只有一段普通提示文字，用户不知道下一步该做什么。",
      "request": "把空状态做得更清楚：告诉用户为什么这里是空的，并提供一个明显的创建第一个任务入口。",
      "goal": "用户能理解空状态，并能从页面直接开始创建任务。",
      "constraints": [
        "不改变任务数据模型",
        "不修改创建任务 API",
        "不引入新权限规则",
        "已有任务时的看板布局不能受影响"
      ],
      "start": "story-01-start"
    },
    {
      "id": "due-reminder",
      "title": "任务逾期提醒",
      "product": "Team Task Board",
      "user": "负责多个任务的项目成员",
      "current": "任务已有截止日期，但系统没有提醒。用户只提出快到期时提醒我，提醒时机、对象和频率都不明确。",
      "request": "我希望任务快到期时系统能提醒相关人员。",
      "goal": "通过访谈明确提醒规则、用户偏好、时区、频率和关闭方式，形成可确认的需求基线。",
      "constraints": [
        "本故事只做需求探索和设计，不进入编码",
        "不允许 Agent 自行假设提醒频率或通知渠道"
      ],
      "start": "story-02-start"
    },
    {
      "id": "task-assignment",
      "title": "任务指派与成员协作",
      "product": "Team Task Board",
      "user": "项目 Owner、项目成员",
      "current": "项目已经有成员列表和任务看板，但任务不能指派负责人，成员也无法快速查看自己负责的任务。",
      "request": "希望项目负责人能把任务指派给项目成员，成员能看到自己的任务，负责人也能随时调整指派。",
      "goal": "完成任务指派、变更指派和我的任务筛选，形成完整可验收功能。",
      "constraints": [
        "只能指派给当前项目成员",
        "一个任务最多有一个负责人",
        "允许清空负责人",
        "非项目成员不能被指派",
        "不在本次范围内开发复杂通知系统"
      ],
      "start": "story-03-start"
    },
    {
      "id": "multi-team-saas",
      "title": "从单项目看板升级为多团队 SaaS",
      "product": "Team Task Board",
      "user": "管理多个团队的组织管理员",
      "current": "当前应用按单团队、单项目的假设设计，用户、项目和任务之间缺少明确的组织隔离。",
      "request": "希望多个团队都能使用同一个平台，每个团队管理自己的项目和成员，团队之间的数据不能互相看到。",
      "goal": "先解决租户边界、数据归属、成员角色、迁移策略和安全验证等关键决策，形成可实施架构路线。",
      "constraints": [
        "本故事重点是架构决策，不默认一次性完成整个平台",
        "租户隔离和数据迁移方案必须由人确认"
      ],
      "start": "story-04-start"
    },
    {
      "id": "drag-drop-bug",
      "title": "拖动任务后刷新，状态又恢复原样",
      "product": "Team Task Board",
      "user": "在看板上拖动任务卡片的项目成员",
      "current": "用户把任务从进行中拖到已完成，页面立即显示成功；刷新页面后任务又回到了进行中。",
      "request": "看板显示任务移动成功，但刷新后状态丢失。请找出真正原因，不要先猜着改。",
      "goal": "建立稳定失败反馈，定位持久化链路根因，修复后原始复现步骤和回归测试均通过。",
      "constraints": [
        "必须先复现再修改",
        "不能通过延长超时或只改前端显示掩盖问题",
        "需要重新执行原始浏览器操作验收"
      ],
      "start": "story-05-start"
    },
    {
      "id": "task-service-refactor",
      "title": "TaskService 越来越臃肿",
      "product": "Team Task Board",
      "user": "需要持续维护任务模块的开发者",
      "current": "TaskService 同时处理任务创建、状态变化、指派权限、评论和持久化，很多修改会互相影响。",
      "request": "请先分析 TaskService 的职责和依赖，找出最值得改善的一处，不要直接大规模重写。",
      "goal": "用 CodeGraph 理解调用关系，选择一个高价值重构点，在保持外部行为的前提下逐步改善模块结构。",
      "constraints": [
        "必须先展示架构问题证据和候选方案",
        "重构前建立行为保护测试",
        "每次只处理一个边界，不顺手加入新业务功能"
      ],
      "start": "story-06-start"
    }
  ],
  "playbooks": [
    {
      "id": "quick-change",
      "scenarioId": "empty-state",
      "title": "小需求快速修改",
      "workflow": "快速修改工作流",
      "level": "入门",
      "duration": "约 20–40 分钟",
      "summary": "需求清楚、范围很小、风险可控时，直接让 Agent 实施并做针对性验证，不为了形式创建 Spec 和 Tickets。",
      "routing": {
        "why": "目标、界面位置和预期结果都清楚；不涉及数据模型、API、权限或跨模块决策。",
        "when": [
          "文案、样式、局部交互等明确的小修改",
          "影响范围局限在一个页面或一个小模块",
          "改动容易验证、容易回滚"
        ],
        "notWhen": [
          "需求词语存在歧义",
          "涉及数据库、权限或跨模块接口",
          "失败影响大或不可逆"
        ],
        "alternatives": "如果访谈后发现要新增业务规则，升级到需求探索；如果需要跨多个模块和跨会话交付，升级到常规功能开发。"
      },
      "preparation": {
        "project": "story-01-start",
        "requirements": [
          "Node.js LTS",
          "已安装一个 Coding Agent",
          "已安装 Matt Pocock Skills",
          "已克隆 Team Task Board 教学项目"
        ],
        "codegraph": "不需要。小修改先用项目导航和普通源码阅读即可；不要为了展示工具而强行调用 CodeGraph。"
      },
      "steps": [
        {
          "id": "scope",
          "title": "明确修改范围",
          "actor": "用户 + Agent",
          "invocation": {
            "kind": "natural",
            "command": "先向 Agent 描述目标，不调用复杂工作流。"
          },
          "prompt": "请阅读项目根目录 AGENTS.md 和任务看板首页相关代码。我要优化没有任务时的空状态：说明这里还没有任务、突出创建第一个任务按钮，并让用户知道点击后会发生什么。请先复述你理解的目标、列出不在本次范围内的内容和可观察验收条件；不要创建 Spec、Tickets 或 ADR。",
          "agentBehavior": "Agent 读取项目规范和相关组件，复述目标、识别修改入口，并把视觉结果转成可观察验收条件。若发现需求歧义或涉及 API / 数据模型，应停下来询问。",
          "artifact": "简短修改计划 + 验收清单",
          "checklist": [
            "目标和非目标清楚",
            "确认不会改动创建任务业务逻辑",
            "已有任务状态下的页面行为列入回归检查"
          ],
          "handoff": "确认范围后调用 /implement。",
          "sources": []
        },
        {
          "id": "implement",
          "title": "实施最小改动",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/implement"
          },
          "prompt": "/implement\n\n按刚才确认的范围，完成空状态页面的最小修改。先检查现有组件和样式约定，不要重写页面。若涉及行为逻辑，在合适的测试 seam 先建立失败测试；如果只是纯视觉调整，不要为了形式添加无意义单测。完成后运行相关检查并调用 code-review。",
          "agentBehavior": "implement 是用户主动调用的入口；它按 Spec 或用户描述实施工作。上游 Skill 指示它在合适 seam 使用 tdd、定期运行类型检查和测试，并在完成后调用 code-review。",
          "artifact": "页面代码 Diff；如有行为变化则包含测试。",
          "checklist": [
            "Diff 只涉及空状态所需文件",
            "没有顺手重构其他组件",
            "没有改变 API 和数据结构"
          ],
          "handoff": "实现完成后查看测试、Diff 和 Review 结果。",
          "sources": [
            "implement",
            "tdd",
            "review"
          ]
        },
        {
          "id": "verify",
          "title": "验证真实页面",
          "actor": "用户 + Agent",
          "invocation": {
            "kind": "natural",
            "command": "请运行项目已有的相关测试；启动开发服务器并用浏览器检查空状态和已有任务两种情况。"
          },
          "prompt": "请提供实际执行过的命令和结果。浏览器验收至少检查桌面和窄屏：空状态说明清楚、主按钮突出、点击能进入创建流程；已有任务时原看板不受影响。不要把未执行的检查写成通过。",
          "agentBehavior": "Agent 运行相关测试，并对 UI 使用真实浏览器或视口验证；说明自动化检查和人工观察的区别。",
          "artifact": "测试输出、浏览器验收记录、未覆盖项。",
          "checklist": [
            "测试命令真实执行",
            "空状态和非空状态都检查",
            "窄屏没有溢出或遮挡"
          ],
          "handoff": "用户确认视觉和行为符合预期后才算完成。",
          "sources": []
        },
        {
          "id": "review",
          "title": "交付与复盘",
          "actor": "Agent + 用户",
          "invocation": {
            "kind": "natural",
            "command": "查看 Diff 和 code-review 结果；用户进行最终验收。"
          },
          "prompt": "请总结改动文件、行为变化、实际运行的测试命令、Review 发现和未验证事项。不要因为这是小修改就省略 Diff 检查，也不要因为测试通过就代替我的 UI 验收。",
          "agentBehavior": "Agent 汇总实际证据；用户确认真实页面效果。若实现过程中发现范围变大，应建议升级流程而不是继续顺手扩大。",
          "artifact": "变更摘要、验证证据、Review 记录。",
          "checklist": [
            "改动与原目标一致",
            "测试结果有证据",
            "人工验收状态单独记录"
          ],
          "handoff": "无未解决问题后结束；如果发现新需求，另开任务。",
          "sources": [
            "review"
          ]
        }
      ],
      "artifactSamples": [
        {
          "title": "本次任务的验收清单",
          "format": "markdown",
          "content": "- [ ] 空状态能解释为什么当前没有任务\n- [ ] 创建第一个任务是最明显的主操作\n- [ ] 点击主操作能进入现有创建流程\n- [ ] 有任务时看板布局和操作不变\n- [ ] 桌面与窄屏均无溢出\n- [ ] 相关测试和浏览器检查均有真实执行证据"
        }
      ],
      "decisions": [
        {
          "title": "不要把小改动做成完整 SDD",
          "detail": "如果目标和边界已经清楚，不需要 Grill、ADR、Spec、Tickets 全套流程。流程应该匹配风险，不是越多越专业。"
        }
      ],
      "acceptance": [
        "空状态符合用户目标",
        "已有任务状态不回归",
        "相关测试通过并记录命令",
        "浏览器检查通过",
        "Code Review 没有未解决的高优先级问题",
        "用户完成真实页面验收"
      ],
      "knowledgeRefs": [
        "task-routing",
        "tdd",
        "review",
        "acceptance"
      ],
      "sources": [
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md"
      ]
    },
    {
      "id": "requirements-discovery",
      "scenarioId": "due-reminder",
      "title": "从模糊想法到明确需求",
      "workflow": "需求探索工作流",
      "level": "入门 → 进阶",
      "duration": "约 30–60 分钟",
      "summary": "用户只提出方向，Agent 通过有纪律的访谈发现影响设计的未知；本故事以确认需求和设计边界结束，不自动开始编码。",
      "routing": {
        "why": "快到期时提醒我包含多个会改变产品行为的未知：提醒对象、时机、频率、时区、渠道、免打扰和重复提醒。直接实现必然需要 Agent 猜测。",
        "when": [
          "目标只有方向或一句话描述",
          "业务术语有多种解释",
          "权限、状态、默认值或异常路径不明确"
        ],
        "notWhen": [
          "用户已给出完整规则和验收条件",
          "只是清晰的小改动"
        ],
        "alternatives": "需求确认后，用户可以另开常规功能开发路线；不要把 Grill 自动延伸为编码授权。"
      },
      "preparation": {
        "project": "story-02-start",
        "requirements": [
          "完成通用 Skill 安装",
          "在教学项目运行过 /setup-matt-pocock-skills",
          "选择 Local Markdown tracker"
        ],
        "codegraph": "不需要。需求探索首先处理业务未知，代码结构索引不是替代访谈的工具。"
      },
      "steps": [
        {
          "id": "context",
          "title": "恢复已有项目语境",
          "actor": "Agent",
          "invocation": {
            "kind": "natural",
            "command": "先读取项目文档和当前 Reminder 相关概念。"
          },
          "prompt": "请先阅读 AGENTS.md、GLOSSARY.md（如存在）和任务截止日期相关代码。告诉我系统现在已有的事实、你从源码推断的内容，以及仍然未知的业务问题。不要把代码当前行为当成产品需求。",
          "agentBehavior": "Agent 将现状事实、代码推断和待确认业务问题分开；不应直接设计提醒规则。",
          "artifact": "现状摘要、事实 / 推断 / 未知列表",
          "checklist": [
            "没有把实现现状误当成业务要求",
            "未知问题按影响排序"
          ],
          "handoff": "准备好后启动 Grill 访谈。",
          "sources": []
        },
        {
          "id": "grill",
          "title": "启动需求访谈",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/grill-with-docs"
          },
          "prompt": "/grill-with-docs\n\n我想给 Team Task Board 增加任务逾期提醒。我现在只有一个模糊想法：任务快到期时，系统能提醒相关人员。请通过访谈找出会改变产品行为的关键未知。一次只问一个问题，先问最重要的，不要急着给方案或写代码。请区分已确认事实、我的决定、你的假设和待决策项。",
          "agentBehavior": "grill-with-docs 上游要求调用 grilling 与 domain-modeling。它应逐项追问，而不是一次抛出十几个问题；同时建立共享领域语言，必要时记录 ADR。用户应知道这是一个需求访谈，不是编码任务。",
          "artifact": "访谈记录、已确认业务规则、未决问题。",
          "checklist": [
            "一次聚焦一个关键问题",
            "提醒对象和触发时机没有被 Agent 擅自决定",
            "不把示例答案当成用户已确认的决定"
          ],
          "handoff": "关键业务规则足够清晰后，整理领域概念与文档。",
          "sources": [
            "grill",
            "domain"
          ]
        },
        {
          "id": "domain",
          "title": "整理领域语言与决策",
          "actor": "Agent + 用户",
          "invocation": {
            "kind": "agent",
            "command": "Agent 按需调用 domain-modeling；有真实权衡时创建 ADR。"
          },
          "prompt": "请基于我刚才确认的回答整理 Reminder 的领域模型。至少区分 Task Due Date、Reminder Schedule、Recipient、Delivery Channel 和 User Preference。标注每个概念的定义、关系、状态和不变量。不要把尚未确认的默认值写成已批准规则。",
          "agentBehavior": "domain-modeling 是 Agent 可调用的专业能力，不要求用户把它作为第二个 slash 命令。只有出现真实架构取舍时才创建 ADR；普通术语写入 GLOSSARY 即可。",
          "artifact": "GLOSSARY 候选条目、必要 ADR、领域关系摘要。",
          "checklist": [
            "术语没有互相混用",
            "时区、重复发送、取消和关闭提醒等规则有明确状态",
            "ADR 只记录真实取舍"
          ],
          "handoff": "把访谈结果整理成可确认的设计摘要。",
          "sources": [
            "domain",
            "adr"
          ]
        },
        {
          "id": "confirm",
          "title": "确认需求基线并停止",
          "actor": "用户",
          "invocation": {
            "kind": "natural",
            "command": "不要调用 /to-spec 或 /implement；当前故事到这里结束。"
          },
          "prompt": "请汇总任务逾期提醒的目标、用户、触发条件、提醒对象、时间规则、渠道、频率、免打扰、取消方式、失败处理、非目标和未决问题。每条规则标记为我已确认、仍是假设或待我决定。当前授权仅限需求探索与设计，请停止，不要生成实施 Spec 或修改业务代码。",
          "agentBehavior": "Agent 应输出可读的需求基线和开放问题，并明确停在设计边界。设计认可不等于编码授权。",
          "artifact": "需求基线、GLOSSARY 更新、必要 ADR、待决策清单。",
          "checklist": [
            "每条关键规则有来源或状态",
            "没有将假设写成确认",
            "明确写出未开始编码"
          ],
          "handoff": "用户确认后，本故事结束；后续另开常规功能开发。",
          "sources": []
        }
      ],
      "artifactSamples": [
        {
          "title": "需求基线示例（节选）",
          "format": "markdown",
          "content": "## 已确认\n- Reminder 关联一个 Task。\n- 提醒对象默认是任务负责人；未指派任务的提醒规则仍待确认。\n\n## 待确认\n- 到期前多久发送第一次提醒？\n- 是否重复提醒？重复间隔由谁设置？\n- 使用项目时区、用户时区，还是任务创建者时区？\n- 用户能否关闭某一任务的提醒？\n- 邮件失败后是否重试？\n\n## 非目标\n- 本轮不实现通知中心 UI。\n- 本轮不决定具体邮件服务商。"
        }
      ],
      "decisions": [
        {
          "title": "访谈不是问卷",
          "detail": "一次问一个会改变设计的问题；如果用户已经给出答案，不要反复确认已知内容。"
        },
        {
          "title": "领域建模不是提前设计数据库",
          "detail": "先明确业务概念、关系和不变量，再决定是否需要表、字段或接口。"
        },
        {
          "title": "需求探索必须有停止边界",
          "detail": "本故事不调用 to-spec、不创建 Tickets、不写业务代码。"
        }
      ],
      "acceptance": [
        "关键业务未知被逐项提出",
        "用户决定与 Agent 假设明确区分",
        "GLOSSARY 只记录稳定共享术语",
        "ADR 只记录真实架构取舍",
        "需求摘要明确范围、非目标和未决项",
        "没有擅自进入编码"
      ],
      "knowledgeRefs": [
        "grill",
        "domain",
        "adr",
        "change-control"
      ],
      "sources": [
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md"
      ]
    },
    {
      "id": "feature-development",
      "scenarioId": "task-assignment",
      "title": "从需求到完整功能",
      "workflow": "常规功能开发工作流",
      "level": "进阶",
      "duration": "约 1–3 小时",
      "summary": "需求范围已基本明确，功能跨越数据、服务和 UI，需要规格、纵向任务、测试和跨会话交接。",
      "routing": {
        "why": "任务指派同时涉及成员关系、权限、数据持久化、任务详情和我的任务筛选；不是单文件小修改。",
        "when": [
          "跨 UI、服务和数据层",
          "需要跨会话继续",
          "需要正式验收和追溯"
        ],
        "notWhen": [
          "只改一个明确文案",
          "关键业务规则仍有大量未知，应先走需求探索"
        ],
        "alternatives": "如果主要未知是架构方向，先用 Wayfinder；如果已经出现真实故障，进入 Bug 诊断。"
      },
      "preparation": {
        "project": "story-03-start",
        "requirements": [
          "Skill 安装和项目级 tracker setup 已完成",
          "Local Markdown tracker 可用",
          "确认任务指派业务规则已由场景说明给出"
        ],
        "codegraph": "可选。若需要理解现有 Task / Project / Member 调用链，可在项目初始化 CodeGraph 后用 codegraph_explore；不要为了形式强制使用。"
      },
      "steps": [
        {
          "id": "baseline",
          "title": "确认需求与项目现状",
          "actor": "Agent",
          "invocation": {
            "kind": "natural",
            "command": "读取场景说明、GLOSSARY、相关 ADR 和当前实现。"
          },
          "prompt": "请检查任务指派相关的项目现状。先列出当前 Task、Project、Member 的领域定义、已有 API 和测试入口。下面这些规则是本练习的已确认范围：一个任务最多一个负责人；只能指派给当前项目成员；允许清空负责人；只有项目 Owner / Manager 能修改指派；不在范围内的是通知系统。请指出现有实现与需求之间的差距。",
          "agentBehavior": "Agent 应先核对项目事实，不能重新发明业务规则。若源码与练习规则冲突，标出冲突并暂停，不要静默选择。",
          "artifact": "现状摘要、需求差距列表。",
          "checklist": [
            "业务规则完整",
            "不把 Out of Scope 混入本次任务",
            "关键实现入口有证据"
          ],
          "handoff": "确认需求没有歧义后生成 Spec。",
          "sources": [
            "domain",
            "codegraph"
          ]
        },
        {
          "id": "spec",
          "title": "生成 Feature Spec",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/to-spec"
          },
          "prompt": "/to-spec\n\n请根据当前会话中已经明确的任务指派需求和项目现状生成 Feature Spec。不要重新访谈。必须保留：单任务最多一个负责人、负责人必须是当前项目成员、只有 Owner / Manager 可以指派或变更、允许取消指派、我的任务筛选、无权限用户的错误行为，以及本次不开发通知系统。把业务需求和实现决策分开。为每条重要行为定义可观察的验收条件；不要编造尚未确认的技术细节。",
          "agentBehavior": "to-spec 不重新采访用户，而是综合当前对话和代码理解；它会提出测试 seam 供用户确认，然后按项目 tracker 配置发布 Spec。",
          "artifact": "Feature Spec，包含 Problem Statement、Solution、User Stories、Implementation Decisions、Testing Decisions、Out of Scope。",
          "checklist": [
            "原始规则逐条进入 Spec",
            "明确权限和负面要求",
            "测试 seam 经过用户确认",
            "Spec 发布位置可定位"
          ],
          "handoff": "审核 Spec；确认后再拆 Tickets。",
          "sources": [
            "spec"
          ]
        },
        {
          "id": "tickets",
          "title": "拆分纵向 Tickets",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/to-tickets"
          },
          "prompt": "/to-tickets\n\n请根据已批准的 Feature Spec 拆分 tracer-bullet tickets。每张 Ticket 必须交付一条可独立演示或验证的用户行为，纵向穿过必要的数据、服务、UI 和测试层。明确 Blocked by、验收条件和测试 seam。不要机械地按数据库 / API / 前端分层。先展示任务图，等待我确认粒度和依赖，再发布。",
          "agentBehavior": "to-tickets 会提出任务拆分并询问用户粒度和阻塞边是否正确，得到批准后才发布。宽重构是纵向切片的例外，需要 expand-migrate-contract。",
          "artifact": "Ticket 列表、依赖图、每张 Ticket 的验收标准。",
          "checklist": [
            "每张票可独立验证",
            "依赖边是真正阻塞条件",
            "没有遗漏权限和异常场景"
          ],
          "handoff": "用户批准任务图后，按依赖顺序逐票实施。",
          "sources": [
            "tickets"
          ]
        },
        {
          "id": "implement",
          "title": "实施一个 Ticket",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/implement"
          },
          "prompt": "/implement <Ticket 名称或引用>\n\n请实施这张 Ticket。开始前读取完整 Ticket、关联 Feature Spec、GLOSSARY 和相关 ADR。先定位最高合理测试 seam；在确认的 seam 上按 red-green-refactor 实施。保持 Diff 聚焦，不做相邻功能。完成后运行相关检查并给出证据。",
          "agentBehavior": "implement 根据 Spec 或 Ticket 实施工作；上游要求尽可能调用 tdd，并在完成后调用 code-review。每个 Ticket 应在新鲜上下文中实施，报告实际执行的测试。",
          "artifact": "一个可独立演示的纵向功能切片、测试、Ticket 状态。",
          "checklist": [
            "先读完整 Ticket 和 Spec",
            "测试先红再绿",
            "没有扩大范围",
            "实际命令和结果被记录"
          ],
          "handoff": "一张 Ticket 完成并集成后，再领取下一张。",
          "sources": [
            "implement",
            "tdd",
            "review"
          ]
        },
        {
          "id": "integrate",
          "title": "集成与双轴 Review",
          "actor": "Agent + 用户",
          "invocation": {
            "kind": "agent",
            "command": "Agent 按 implement Skill 的要求调用 code-review；用户检查结果。"
          },
          "prompt": "请独立检查当前集成分支相对于本次功能基线的 Diff。分别审查 Standards 和 Spec Compliance 两个轴。逐条映射已批准需求到实现位置和测试证据，列出未覆盖和需要人工验证的行为。",
          "agentBehavior": "code-review 是 Agent 可调用的 Skill，双轴审查分别关注工程标准与原始 Spec 符合性。子任务通过不代表集成通过。",
          "artifact": "Review 发现清单、修复记录、集成测试结果。",
          "checklist": [
            "Standards 和 Spec 两轴都完成",
            "问题有严重度和证据",
            "集成分支运行相关测试"
          ],
          "handoff": "所有阻断问题修复后，准备人工验收。",
          "sources": [
            "review"
          ]
        },
        {
          "id": "accept",
          "title": "人工验收与知识对账",
          "actor": "用户 + Agent",
          "invocation": {
            "kind": "natural",
            "command": "用户在浏览器执行真实操作；Agent 负责记录与同步知识。"
          },
          "prompt": "请准备人工验收步骤：Owner 指派成员、Manager 更换负责人、清空负责人、普通成员尝试越权、非项目成员不能被指派、我的任务筛选结果正确。请把 Automated Verified、Spec Reviewed、Human Accepted、Knowledge Reconciled 分开报告。未由我实际操作的场景标记为待人工验收。",
          "agentBehavior": "Agent 不能替用户宣布 Human Accepted。验收后更新受影响的模块知识、GLOSSARY 和 ADR。",
          "artifact": "验收记录、知识更新、未解决风险。",
          "checklist": [
            "每条规则有测试或人工证据",
            "人工验收由用户确认",
            "模块知识与当前实现对账"
          ],
          "handoff": "四种状态分别清楚后交付。",
          "sources": [
            "delivery",
            "acceptance"
          ]
        }
      ],
      "artifactSamples": [
        {
          "title": "Feature Spec 关键规则（节选）",
          "format": "markdown",
          "content": "## User Stories\n1. 作为项目 Owner，我希望将任务指派给项目成员，以便明确负责人。\n2. 作为项目 Manager，我希望更换或清空负责人，以便调整工作分配。\n3. 作为项目成员，我希望筛选自己负责的任务。\n\n## Acceptance\n- 只能指派给当前 Project 的有效成员。\n- 普通成员不能修改任务指派。\n- 一个 Task 最多有一个 assignee。\n- 取消指派后显示未指派。\n- 我的任务列表只包含当前用户有权访问且由其负责的任务。"
        },
        {
          "title": "Ticket 纵向切片示例",
          "format": "markdown",
          "content": "## Ticket 01：项目成员可以被指派到任务\nDelivers: Owner 可以在任务详情选择项目成员并保存；刷新后仍显示正确负责人。\nBlocked by: 无\nAcceptance: 仅当前项目成员可被选中；持久化后重新读取一致；覆盖权限失败路径。\n\n## Ticket 02：成员可以查看我的任务\nBlocked by: Ticket 01\nDelivers: 当前成员可以筛选并查看自己负责的任务。"
        }
      ],
      "decisions": [
        {
          "title": "Spec 不是代码设计清单",
          "detail": "Spec 保存用户行为、规则、边界和验收条件，不要把每个函数名和文件路径写死。"
        },
        {
          "title": "Ticket 必须是纵向可验证切片",
          "detail": "按用户可观察行为切穿必要层次，而不是数据库票、API 票、UI 票各自完成。"
        },
        {
          "title": "Implement 是按 Ticket 执行",
          "detail": "常规功能路线用 /implement 逐项完成；/implement-spec 是大型稳定任务图的整体集成路线，不要混用。"
        }
      ],
      "acceptance": [
        "Spec 已经用户确认",
        "Ticket 粒度和依赖经用户批准",
        "每张 Ticket 有独立验证证据",
        "集成分支测试通过",
        "Standards 和 Spec Review 完成",
        "用户完成真实浏览器验收",
        "知识文档与实际实现对账"
      ],
      "knowledgeRefs": [
        "spec",
        "tickets",
        "tdd",
        "review",
        "spec-compliance",
        "delivery",
        "cross-session"
      ],
      "sources": [
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md"
      ]
    },
    {
      "id": "large-architecture",
      "scenarioId": "multi-team-saas",
      "title": "先解决未知，再设计大型架构",
      "workflow": "大型架构工作流",
      "level": "高级",
      "duration": "多轮决策与实施",
      "summary": "当多个架构未知彼此依赖时，先用 Wayfinder 建立决策地图；路线清晰后才进入 Spec、Tickets 和实施。",
      "routing": {
        "why": "从单团队到多团队 SaaS 会影响租户边界、数据归属、身份、权限、迁移、隔离和审计。直接拆实施票会把未经确认的假设固化。",
        "when": [
          "目标跨多个模块或服务",
          "关键技术决策互相依赖",
          "存在数据迁移、安全或兼容风险",
          "一轮会话无法持有完整决策上下文"
        ],
        "notWhen": [
          "只增加一个明确的小功能",
          "关键架构方向已定、剩余任务可以直接规格化"
        ],
        "alternatives": "若主要问题只是需求含义不清，先 Grill；如果未知决策清晰且已解决，则进入常规功能开发。"
      },
      "preparation": {
        "project": "story-04-start",
        "requirements": [
          "先读取项目架构和领域文档",
          "准备可用的 Issue Tracker（推荐 Local Markdown）",
          "重要决策需用户参与确认"
        ],
        "codegraph": "建议。先安装 CodeGraph 并运行 codegraph init，探索当前 User / Project / Task 数据所有权和关键调用链。"
      },
      "steps": [
        {
          "id": "destination",
          "title": "定义 Wayfinder 目的地",
          "actor": "用户 + Agent",
          "invocation": {
            "kind": "natural",
            "command": "先描述最终要交付的决策或规格，而不是直接要求实施。"
          },
          "prompt": "我们要把当前单团队 Team Task Board 演进为多团队 SaaS。请先帮助我定义 Wayfinder 的 Destination：地图结束时应交付一份什么规格或决策基线，才能让后续实施团队不再需要猜测租户边界、身份关系、数据迁移和隔离策略？当前不要设计全部实现细节。",
          "agentBehavior": "Wayfinder 首先命名目的地；地图的终点可以是批准的架构决策和可实施 Spec，而不是所有代码都完成。",
          "artifact": "Destination、范围、Out of Scope。",
          "checklist": [
            "终点可判断是否到达",
            "没有把实施任务当作决策票"
          ],
          "handoff": "目的地清楚后调用 /wayfinder 建图。",
          "sources": [
            "wayfinder"
          ]
        },
        {
          "id": "map",
          "title": "建立决策地图",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/wayfinder"
          },
          "prompt": "/wayfinder\n\n为单团队任务看板升级为多团队 SaaS 建立决策地图。请识别会改变架构路线的未知问题，至少检查：Tenant / Team / Project 的关系、用户跨团队身份、角色权限、数据隔离方式、现有数据迁移、审计、失败回滚和部署约束。把每张票写成一个需要解决的决策问题，而不是实现任务。默认只规划，不开始编码。",
          "agentBehavior": "Wayfinder 创建一个 Map 作为索引，子票解决单个决策；地图记录 Decisions so far、Not yet specified 和 Out of scope。它是 Plan, don’t do。",
          "artifact": "Wayfinder Map、决策票、依赖关系。",
          "checklist": [
            "决策票问的是问题而不是开发任务",
            "Map 只做索引，不重复保存详细结论",
            "每个决策有证据和完成条件"
          ],
          "handoff": "从最前沿的未决策票开始逐个解决。",
          "sources": [
            "wayfinder"
          ]
        },
        {
          "id": "research",
          "title": "研究和原型验证",
          "actor": "Agent + 用户",
          "invocation": {
            "kind": "agent",
            "command": "按决策票需要调用 research 或 prototype；必要时使用 codegraph_explore。"
          },
          "prompt": "针对当前决策票，请先说明需要验证的事实、适用版本和什么结果会改变方案。优先读取官方文档、规范和源码；如果事实不足，提出最小原型。记录环境、命令、预期、实际结果、限制和反证。不要把一次原型成功当成生产可用保证。",
          "agentBehavior": "research 和 prototype 是 Agent 可调用的辅助能力。Research 负责一手资料，Prototype 负责可证伪实验；它们不替用户作架构选择。",
          "artifact": "研究记录、原型结论、证据链接、限制。",
          "checklist": [
            "来源可追溯",
            "实验可复现",
            "结论范围不超过证据"
          ],
          "handoff": "证据充分后由用户确认决策并关闭对应决策票。",
          "sources": [
            "research",
            "prototype",
            "codegraph"
          ]
        },
        {
          "id": "decide",
          "title": "逐项确认架构决策",
          "actor": "用户",
          "invocation": {
            "kind": "natural",
            "command": "对每张决策票给出选择，或要求补充证据。"
          },
          "prompt": "请将本轮决策整理成：候选方案、支持证据、代价、失败模式、迁移影响和建议。明确指出哪些选项不可逆或风险最高。不要替我做租户隔离、数据归属和权限模型等产品 / 架构决定。",
          "agentBehavior": "Agent 提供分析和建议；用户确认关键业务边界和风险取舍。重要决定记录 ADR。",
          "artifact": "已批准决策、ADR、Wayfinder Decisions so far。",
          "checklist": [
            "关键决策有明确批准者",
            "ADR 记录背景、候选、决定和后果",
            "未决项仍留在地图"
          ],
          "handoff": "阻塞目的地的决策全部解决后，结束 Wayfinder。",
          "sources": [
            "adr",
            "wayfinder"
          ]
        },
        {
          "id": "spec",
          "title": "路线清晰后生成架构 Spec",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/to-spec"
          },
          "prompt": "/to-spec\n\n根据已经关闭的 Wayfinder 决策票、批准的 ADR 和当前代码理解，综合生成多团队 SaaS 演进 Feature Spec。保留租户隔离、身份关系、权限、数据迁移、审计、回滚和兼容性要求。不要重新访谈；仍未批准的内容必须标为未决，不得写成已确认设计。",
          "agentBehavior": "to-spec 将已确认决策合成为 Spec，不负责重新解决 Wayfinder 中尚未关闭的决策。",
          "artifact": "架构 Feature Spec、Testing Decisions、Out of Scope。",
          "checklist": [
            "每个关键架构决策可追溯到 ADR / Decision Ticket",
            "安全和迁移验收可验证"
          ],
          "handoff": "Spec 经用户确认后再拆任务图。",
          "sources": [
            "spec"
          ]
        },
        {
          "id": "tickets",
          "title": "拆分实施任务图",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/to-tickets"
          },
          "prompt": "/to-tickets\n\n将已批准架构 Spec 拆成 tracer-bullet tickets。明确每张票的阻塞关系、数据迁移顺序、共享接口和回滚边界。标记哪些任务必须串行，哪些在接口稳定后可以并行。先让我审核任务图，不要自动启动多个 Agent。",
          "agentBehavior": "任务图稳定后才评估并行；多 Agent 是实施策略，不是大型项目的默认答案。",
          "artifact": "Ticket 任务图、接口契约、集成顺序。",
          "checklist": [
            "任务边界稳定",
            "共享接口有 owner",
            "迁移步骤可回滚"
          ],
          "handoff": "用户批准后用 /implement-spec 按任务图执行。",
          "sources": [
            "tickets"
          ]
        },
        {
          "id": "implement",
          "title": "按任务图实施和集成",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/implement-spec"
          },
          "prompt": "/implement-spec\n\n按照批准的 Feature Spec 和 Ticket 任务图实施。使用单一 integration branch；每张 Ticket 使用新鲜上下文和独立工作区；只并行真正独立的 Ready Tickets。每个实现任务先读取 Spec / Ticket，按 TDD 验证，完成后合并回 integration branch。最后做整体 Code Review、集成测试和迁移 / 回滚演练。",
          "agentBehavior": "implement-spec 将 tickets 视为带 blocking edges 的任务图，而不是顺序清单；它按 Ready Frontier 推进并负责集成。",
          "artifact": "集成分支、迁移脚本、测试证据、整体 Review。",
          "checklist": [
            "所有任务基于批准的 Spec",
            "每次合并后集成状态可验证",
            "没有未经批准的架构变化"
          ],
          "handoff": "集成测试通过后进入架构验收。",
          "sources": [
            "implement-spec",
            "tdd",
            "review"
          ]
        },
        {
          "id": "accept",
          "title": "架构验收与知识沉淀",
          "actor": "用户 + Agent",
          "invocation": {
            "kind": "natural",
            "command": "执行迁移演练、权限测试和故障恢复验证。"
          },
          "prompt": "请对照批准 ADR 和 Spec，列出租户隔离、跨团队访问拒绝、迁移完整性、失败回滚、审计记录和兼容性测试证据。区分本地测试已证明、原型已证明、生产环境仍需验证的事项。更新受影响模块知识和 ADR 状态。",
          "agentBehavior": "Agent 不能把本地测试通过等同于生产级隔离保证；需要用户批准的风险和生产验证事项必须显式列出。",
          "artifact": "架构验收报告、迁移演练记录、更新后的 ADR / 模块知识。",
          "checklist": [
            "安全负向用例通过",
            "迁移可重复和可回滚",
            "未验证的生产风险透明"
          ],
          "handoff": "用户接受架构路线和实施证据后结束。",
          "sources": [
            "delivery",
            "cross-session"
          ]
        }
      ],
      "artifactSamples": [
        {
          "title": "Wayfinder Map 示例",
          "format": "markdown",
          "content": "## Destination\n形成经批准的多团队 SaaS 架构决策和可实施 Spec。\n\n## Decisions so far\n- Tenant 与 Project 的所有权关系：待决策\n- 用户是否可以加入多个 Team：待决策\n- 数据隔离边界：待研究\n\n## Not yet specified\n- 旧数据如何迁移\n- 跨团队访问审计\n- 迁移失败如何回滚\n\n## Out of scope\n- 本阶段不实现计费和商业套餐。"
        },
        {
          "title": "决策票示例",
          "format": "markdown",
          "content": "## Question\n多团队 SaaS 的数据隔离应采用应用层租户过滤、数据库 Row-Level Security，还是两者组合？\n\n## Evidence needed\n- 当前数据库与部署形态\n- 连接池和事务上下文\n- 越权访问测试方式\n- 运维和迁移复杂度\n\n## Exit criteria\n形成有证据的方案比较，由用户批准最终选择。"
        }
      ],
      "decisions": [
        {
          "title": "Wayfinder 的票是决策票，不是实施票",
          "detail": "它解决我们应该选择什么、事实是什么、风险在哪里，而不是提前拆出数据库、API 和 UI 开发任务。"
        },
        {
          "title": "研究不等于决策",
          "detail": "Research 和 Prototype 提供证据，用户负责业务和架构取舍。"
        },
        {
          "title": "并行是后置选择",
          "detail": "先稳定任务图和接口契约，再判断并行收益是否超过协调和集成成本。"
        }
      ],
      "acceptance": [
        "Wayfinder Destination 明确",
        "所有阻塞架构方向的决策有结论或明确保留",
        "ADR 记录关键取舍",
        "Spec 与 ADR 一致",
        "Ticket 图依赖真实",
        "迁移、权限、回滚有验证证据",
        "生产级未验证事项明确披露"
      ],
      "knowledgeRefs": [
        "wayfinder",
        "research",
        "prototype",
        "adr",
        "architecture",
        "tickets",
        "multi-agent",
        "delivery"
      ],
      "sources": [
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/research/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md"
      ]
    },
    {
      "id": "complex-bug",
      "scenarioId": "drag-drop-bug",
      "title": "复杂 Bug 诊断与根因定位",
      "workflow": "复杂 Bug 诊断工作流",
      "level": "高级",
      "duration": "约 45–120 分钟",
      "summary": "测试通过但真实用户仍遇到问题时，先建立能稳定捕获症状的反馈循环，再定位根因和验证修复。",
      "routing": {
        "why": "界面先乐观更新，但刷新后状态恢复，问题可能发生在请求、服务端校验、数据库提交或缓存读取；仅看 UI 不能推断根因。",
        "when": [
          "问题难复现或间歇性发生",
          "自动化测试通过但真实环境失败",
          "涉及异步、状态同步或跨层调用"
        ],
        "notWhen": [
          "错误原因和修复方式已经明确",
          "只是清晰的小文案或样式问题"
        ],
        "alternatives": "如果复现发现根本是需求规则未定义，回到需求探索；如果根因明确且改动很小，可收敛为快速修改。"
      },
      "preparation": {
        "project": "story-05-start",
        "requirements": [
          "确认使用带有预置缺陷的 story-05-start 起始版本",
          "保留浏览器控制台和 Network 记录",
          "不要先更新依赖或改动代码"
        ],
        "codegraph": "建议。使用 codegraph_explore 定位拖拽事件、状态更新函数、API handler 和数据库写入链路；图谱结果仍需回到源码核实。"
      },
      "steps": [
        {
          "id": "symptom",
          "title": "记录真实症状",
          "actor": "用户 + Agent",
          "invocation": {
            "kind": "natural",
            "command": "不改代码，先收集复现条件。"
          },
          "prompt": "请按 diagnosing-bugs 流程排查。当前症状：拖动任务卡片从进行中到已完成，页面立即显示已完成；刷新后恢复为进行中。先收集浏览器、项目版本、用户操作、Network 请求和服务端日志。把事实与猜测分开，先不要修改代码。",
          "agentBehavior": "diagnosing-bugs 可由 Agent 根据用户报告的问题触发。第一阶段要记录精确症状并保护敏感信息；日志、HAR 和 token 必须脱敏。",
          "artifact": "Bug 报告、复现步骤、环境与版本、脱敏日志。",
          "checklist": [
            "有明确的操作步骤",
            "记录刷新前后状态",
            "日志不包含密钥或个人敏感信息"
          ],
          "handoff": "信息齐全后建立能稳定变红的反馈循环。",
          "sources": [
            "bugs"
          ]
        },
        {
          "id": "repro",
          "title": "建立红色反馈循环",
          "actor": "Agent",
          "invocation": {
            "kind": "agent",
            "command": "使用 Playwright / API 测试 / 集成测试构建最小复现。"
          },
          "prompt": "请先建立一个能稳定复现这个问题的自动化反馈循环。优先选择能覆盖真实拖拽到持久化的最高合理测试 seam。测试必须断言刷新后状态仍为已完成，并先在当前代码上失败。请实际运行并展示失败输出；如果测试只检查 DOM 临时状态，不算复现成功。",
          "agentBehavior": "diagnosing-bugs 把反馈循环作为最重要阶段。没有已经运行且能捕获原始症状的红色信号，不进入根因猜测。",
          "artifact": "失败的 Playwright / 集成测试、运行命令、失败输出。",
          "checklist": [
            "测试在旧代码上真实失败",
            "断言的是刷新后持久化状态",
            "测试可重复运行"
          ],
          "handoff": "反馈循环足够稳定后，才开始最小化和定位。",
          "sources": [
            "bugs",
            "tdd"
          ]
        },
        {
          "id": "trace",
          "title": "探索调用与持久化链路",
          "actor": "Agent",
          "invocation": {
            "kind": "tool",
            "command": "使用 CodeGraph MCP codegraph_explore，或 CLI：codegraph explore \"Trace the task drag-and-drop status update from UI event to database persistence and reload query\""
          },
          "prompt": "使用 CodeGraph 探索拖拽事件到服务端状态更新、数据库写入、页面重新读取的调用链。请列出每个关键符号和调用路径，并打开关键源码、API handler、Repository / Prisma 写入和测试核实。不要把图谱推断直接当成事实。",
          "agentBehavior": "CodeGraph 用来缩小导航范围；真正的 SQL / ORM 操作、事务边界和缓存行为必须读源码、配置和测试确认。",
          "artifact": "调用链图、关键代码位置、状态写入与读取路径。",
          "checklist": [
            "静态关系与推断关系区分",
            "关键写入代码已阅读",
            "数据库结果与 UI 读取路径都检查"
          ],
          "handoff": "形成一到两个可证伪根因假设。",
          "sources": [
            "codegraph"
          ]
        },
        {
          "id": "hypothesis",
          "title": "逐个验证根因假设",
          "actor": "Agent + 用户",
          "invocation": {
            "kind": "natural",
            "command": "每次只测试一个假设，不同时修改多处。"
          },
          "prompt": "请提出最多三个根因假设，并按证据强弱排序。每个假设说明：预测会观察到什么、如何用一个实验证伪、当前证据支持什么、还缺什么。一次只验证一个假设；不要先同时修改前端、API 和数据库逻辑。",
          "agentBehavior": "Agent 应使用日志、请求响应、数据库状态和最小实验逐一排除假设；没有证据的猜测必须标为猜测。",
          "artifact": "假设表、实验记录、根因结论。",
          "checklist": [
            "每个假设可证伪",
            "至少有一个反证尝试",
            "根因有证据支持"
          ],
          "handoff": "根因确认后，把原始故障保留为回归测试。",
          "sources": [
            "bugs"
          ]
        },
        {
          "id": "fix",
          "title": "TDD 修复",
          "actor": "Agent",
          "invocation": {
            "kind": "agent",
            "command": "调用 tdd Skill；先确认失败测试，再做最小修复。"
          },
          "prompt": "现在根因已经有证据。请以刚才的复现测试作为回归测试，按 red-green-refactor 做最小修复。不要放宽断言，不要只修 UI 乐观状态，也不要 Mock 掉本次需要验证的持久化边界。运行目标测试并说明它如何从红变绿。",
          "agentBehavior": "tdd 强调测试先红、最小实现转绿、重构后复测；测试应通过公共接口验证行为，而不是检查内部实现细节。",
          "artifact": "回归测试、最小修复 Diff、红绿执行证据。",
          "checklist": [
            "同一测试先红后绿",
            "测试覆盖真实持久化路径",
            "没有通过改弱断言让测试通过"
          ],
          "handoff": "修复后必须重新执行最初用户操作。",
          "sources": [
            "tdd"
          ]
        },
        {
          "id": "regression",
          "title": "重跑原始场景并交付",
          "actor": "用户 + Agent",
          "invocation": {
            "kind": "natural",
            "command": "重新执行浏览器拖拽、刷新和重新进入页面。"
          },
          "prompt": "请重新执行最初的用户复现路径：打开项目看板、拖动任务到已完成、等待保存、刷新页面、重新进入页面。确认状态仍为已完成。再运行相关测试和 Code Review。分别报告自动化验证、规格符合性和人工验收状态。",
          "agentBehavior": "Agent 不能用新单测通过代替原始场景复测；用户应检查真实页面和状态。",
          "artifact": "原始场景复测记录、测试结果、Review 和未覆盖风险。",
          "checklist": [
            "原始步骤复测成功",
            "相关回归测试通过",
            "未验证环境和风险如实披露"
          ],
          "handoff": "用户确认真实行为后结束。",
          "sources": [
            "bugs",
            "review",
            "acceptance"
          ]
        }
      ],
      "artifactSamples": [
        {
          "title": "根因假设表",
          "format": "markdown",
          "content": "| 假设 | 可观察预测 | 验证方式 | 结果 |\n|---|---|---|---|\n| 前端只做乐观更新，没有发送请求 | Network 中没有状态更新请求 | Playwright 观察请求 | 待验证 |\n| API 请求失败但 UI 未回滚 | Network 返回 4xx / 5xx，数据库未变化 | 记录响应和数据库状态 | 待验证 |\n| 服务端写入成功，但刷新读取旧缓存 | 数据库是新状态，GET 返回旧状态 | 对比 DB 和 GET | 待验证 |"
        },
        {
          "title": "回归测试必须断言的行为",
          "format": "text",
          "content": "Given：任务处于进行中。\nWhen：用户把任务拖动到已完成，保存成功后刷新页面。\nThen：任务仍显示已完成，并且重新读取的服务端状态也是已完成。"
        }
      ],
      "decisions": [
        {
          "title": "先复现，后假设",
          "detail": "diagnosing-bugs 的第一阶段不是看日志猜原因，而是建立能在当前代码上稳定变红的反馈循环。"
        },
        {
          "title": "CodeGraph 不是根因证明",
          "detail": "图谱帮助找调用链；根因仍需通过源码、请求、数据库状态和测试验证。"
        },
        {
          "title": "测试通过不等于人工验收",
          "detail": "必须重跑用户最初的操作路径，确认真实行为修复。"
        }
      ],
      "acceptance": [
        "原始症状有可重复步骤",
        "自动化反馈循环能在旧代码上失败",
        "根因由实验和源码证据支持",
        "修复测试从红转绿",
        "原始浏览器路径复测成功",
        "Review 和未验证风险已报告"
      ],
      "knowledgeRefs": [
        "bug",
        "codegraph",
        "tdd",
        "test-strategy",
        "acceptance"
      ],
      "sources": [
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/diagnosing-bugs/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
        "https://github.com/colbymchenry/codegraph"
      ]
    },
    {
      "id": "safe-refactor",
      "scenarioId": "task-service-refactor",
      "title": "用 CodeGraph 安全改进代码结构",
      "workflow": "架构重构工作流",
      "level": "高级",
      "duration": "约 1–2 小时",
      "summary": "先用代码结构证据找到最值得改善的模块，再由人选择重构目标；用行为保护测试和小步实施降低回归风险。",
      "routing": {
        "why": "TaskService 同时处理多个变化原因，修改一个规则可能影响任务状态、指派和评论。重构前必须理解真实依赖和行为边界。",
        "when": [
          "模块职责混杂或接口浅",
          "变化频繁导致连锁修改",
          "测试 seam 不清楚",
          "有证据表明结构正在增加修改成本"
        ],
        "notWhen": [
          "只是个人觉得代码不够漂亮",
          "当前没有行为保护测试且无法建立",
          "真正的问题是需求变化而不是结构问题"
        ],
        "alternatives": "如果重构同时改变用户行为，先把行为变化拆成独立 Feature Spec；如果只有一个小局部修复，走快速修改。"
      },
      "preparation": {
        "project": "story-06-start",
        "requirements": [
          "使用预置 TaskService 过载的起始版本",
          "先运行现有测试，记录行为基线",
          "不要先重写 Service"
        ],
        "codegraph": "必需。运行 codegraph init，使用 codegraph_explore 或 CLI 查看 TaskService callers / callees / 依赖和受影响测试。"
      },
      "steps": [
        {
          "id": "map",
          "title": "理解代码结构与影响范围",
          "actor": "Agent",
          "invocation": {
            "kind": "tool",
            "command": "codegraph init\ncodegraph explore \"Map TaskService responsibilities, callers, callees, and the paths for task create, status update, assignment, and comments\""
          },
          "prompt": "先使用 CodeGraph 探索 TaskService 的 callers、callees、关键业务路径和受影响测试。列出静态关系、推断关系和未知关系，再阅读关键源码与测试。不要直接提出拆成多少个 Service。",
          "agentBehavior": "CodeGraph 负责结构导航；Agent 需要核对源码和行为，识别哪些职责真的变化频繁、哪些只是代码看起来长。",
          "artifact": "调用关系图、职责清单、当前行为基线。",
          "checklist": [
            "索引已初始化且自动同步",
            "关键调用路径已核对源码",
            "现有测试基线已记录"
          ],
          "handoff": "形成有证据的架构问题清单。",
          "sources": [
            "codegraph"
          ]
        },
        {
          "id": "opportunities",
          "title": "扫描架构改进机会",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/improve-codebase-architecture"
          },
          "prompt": "/improve-codebase-architecture\n\n请基于当前代码结构和项目领域模型，扫描 TaskService 的架构摩擦点。重点寻找可以 deepening 的机会：让调用方通过更小、更稳定的接口使用更多行为。报告必须给出证据、受影响调用者、测试 seam、改进收益和代价。不要直接重构。",
          "agentBehavior": "上游 Skill 会生成可视化 HTML 报告，并逐项 grill 用户选择的机会。它的目标是发现架构摩擦，不是自动重写整个模块。",
          "artifact": "架构机会报告、候选改进列表、证据和影响范围。",
          "checklist": [
            "每个机会有真实代码证据",
            "描述调用方痛点而非只说代码太长",
            "没有默认创建一堆新抽象"
          ],
          "handoff": "选择一个最有价值、风险可控的机会。",
          "sources": [
            "architecture"
          ]
        },
        {
          "id": "choose",
          "title": "选择一个重构目标",
          "actor": "用户 + Agent",
          "invocation": {
            "kind": "natural",
            "command": "与 Agent 讨论机会报告，选择单一改进项。"
          },
          "prompt": "请逐项解释架构机会报告中的候选项：当前接口为何浅、复杂性散落在哪里、如果删除这个模块会发生什么、一个更深的接口可以隐藏哪些复杂性。给出收益、代价和迁移风险。一次只选一个目标，等待我确认。",
          "agentBehavior": "codebase-design 是共享设计词汇，帮助理解 module、interface、depth、seam、adapter、leverage 和 locality；它不是一个必须独立执行的流程命令。",
          "artifact": "批准的重构目标、非目标、行为不变量。",
          "checklist": [
            "有明确问题和收益",
            "本次只选择一个重构目标",
            "用户确认行为必须保持"
          ],
          "handoff": "目标确定后先建立行为保护测试。",
          "sources": [
            "codebase-design"
          ]
        },
        {
          "id": "baseline",
          "title": "建立行为保护",
          "actor": "Agent",
          "invocation": {
            "kind": "agent",
            "command": "调用 tdd Skill；从公共接口选择测试 seam。"
          },
          "prompt": "在修改结构前，请为选定的 TaskService 行为建立测试保护。优先从公共接口验证创建任务、状态变化、指派和评论中本次涉及的行为。明确每个 seam 捕获什么、遗漏什么；不要测试私有方法或内部调用顺序。先运行测试并记录基线。",
          "agentBehavior": "tdd 要求在约定的 seam 测试外部行为；如果测试需要深入模块内部，说明模块边界可能不合适。",
          "artifact": "行为测试、测试 seam 说明、基线输出。",
          "checklist": [
            "测试通过旧实现",
            "测试断言外部行为",
            "未过度 Mock 关键边界"
          ],
          "handoff": "行为基线稳定后才开始重构。",
          "sources": [
            "tdd"
          ]
        },
        {
          "id": "refactor",
          "title": "小步重构",
          "actor": "Agent",
          "invocation": {
            "kind": "slash",
            "command": "/implement"
          },
          "prompt": "/implement\n\n实施刚才批准的单一重构目标。保持外部 API、数据语义、权限和用户可见行为不变。每次只调整一个职责或依赖方向；每一步运行相关行为测试。不要同时重命名全仓库、改变 Schema 或增加新功能。",
          "agentBehavior": "implement 负责实施；tdd 提供红绿反馈；如果重构发现必须改变外部行为，应停止并提出单独的功能规格。",
          "artifact": "小步 Diff、行为测试结果、必要的迁移说明。",
          "checklist": [
            "每步变更范围可解释",
            "行为测试持续通过",
            "没有顺手加入新业务规则"
          ],
          "handoff": "结构调整完成后重新检查依赖方向和调用者。",
          "sources": [
            "implement",
            "tdd"
          ]
        },
        {
          "id": "review",
          "title": "验证结构改善并审查",
          "actor": "Agent",
          "invocation": {
            "kind": "agent",
            "command": "用 CodeGraph 重新探索调用关系，并调用 code-review。"
          },
          "prompt": "请重新检查 TaskService 的调用关系和模块接口。比较重构前后：调用方需要知道的细节是否减少？职责是否真正集中？是否只是把复杂度搬到新文件？同时做 Standards Review 和行为保持审查。",
          "agentBehavior": "架构改善要有结构证据和行为证据；代码行数减少或文件拆分不代表模块更深。",
          "artifact": "前后依赖对比、测试结果、双轴 Review。",
          "checklist": [
            "接口更小或更稳定有证据",
            "调用关系没有引入新的循环依赖",
            "行为保持测试通过"
          ],
          "handoff": "问题修复后进行 Retro。",
          "sources": [
            "codegraph",
            "review"
          ]
        },
        {
          "id": "retro",
          "title": "复盘与沉淀",
          "actor": "用户主动调用",
          "invocation": {
            "kind": "slash",
            "command": "/retro"
          },
          "prompt": "/retro\n\n请基于本次 TaskService 重构的实际 Diff、测试、Review 和遇到的问题做一次 retro。识别哪些问题是一次性的，哪些是项目导航、测试、架构规范或 Agent 环境的系统性问题。优先提出自动化检查或导航改进，不要把所有经验都追加到 AGENTS.md。",
          "agentBehavior": "retro 关注如何改善未来 Agent 工作环境；它应以真实会话证据为基础，提出有适用范围和验证方法的改进。",
          "artifact": "Retro 记录、可执行的工程环境改进建议。",
          "checklist": [
            "每条建议有事实依据",
            "优先自动化 guardrail",
            "没有无边界膨胀全局规范"
          ],
          "handoff": "复盘建议经用户确认后再落地。",
          "sources": [
            "retro"
          ]
        }
      ],
      "artifactSamples": [
        {
          "title": "架构机会报告摘要",
          "format": "markdown",
          "content": "## Opportunity：TaskService owns too many change reasons\n\nEvidence:\n- Task lifecycle, assignment authorization, and comment persistence change for different reasons.\n- Callers need to understand permission checks and persistence details that should be hidden behind a stable seam.\n- Existing tests reach into internal collaborators instead of the public behavior.\n\nCandidate improvement:\n- Choose one cohesive responsibility and deepen its interface.\n- Preserve public task behavior and data semantics.\n\nRisks:\n- Assignment permission behavior may drift.\n- Existing callers may rely on incidental service methods."
        },
        {
          "title": "行为保持清单",
          "format": "markdown",
          "content": "- [ ] 创建任务的外部行为不变\n- [ ] 任务状态变更规则不变\n- [ ] 指派权限和项目成员校验不变\n- [ ] 评论创建和读取行为不变\n- [ ] 错误语义和事务边界不变\n- [ ] 相关集成测试通过"
        }
      ],
      "decisions": [
        {
          "title": "不要把重构变成重写",
          "detail": "一次只选一个有证据的改进机会，先锁定行为，再改变结构。"
        },
        {
          "title": "CodeGraph 不是静态调用的全部真相",
          "detail": "反射、配置、事件订阅和外部入口可能不完整，删除代码前必须检查动态入口。"
        },
        {
          "title": "深模块比拆文件更重要",
          "detail": "目标是小而稳定的接口隐藏更多行为，不是把一个大文件机械拆成许多薄文件。"
        }
      ],
      "acceptance": [
        "CodeGraph 索引建立且查询结果已核对源码",
        "架构机会有证据",
        "用户批准单一重构目标",
        "重构前行为测试基线通过",
        "重构后行为测试通过",
        "Code Review 无未解决阻断项",
        "Retro 建议有证据和适用范围"
      ],
      "knowledgeRefs": [
        "codegraph",
        "architecture",
        "refactor",
        "tdd",
        "review",
        "retro"
      ],
      "sources": [
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/improve-codebase-architecture/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md",
        "https://github.com/colbymchenry/codegraph"
      ]
    }
  ]
};
