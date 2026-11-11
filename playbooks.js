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
        "status": "已发布六个起始 Tag；基线矩阵通过",
        "tags": [
          "story-01-start-r1",
          "story-02-start-r1",
          "story-03-start-r1",
          "story-04-start-r1",
          "story-05-start-r1",
          "story-06-start-r1"
        ],
        "verification": "六条基线已通过 GitHub Actions 矩阵：Story 05 预期红故障可复现，Story 06 指派行为保持通过。",
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
      "current": "看板已有基础提示和“新建任务”按钮，但缺少明确的首次任务引导与操作说明。",
      "request": "把空状态做得更清楚：告诉用户为什么这里是空的，并提供一个明显的创建第一个任务入口。",
      "goal": "用户能理解空状态，并能从页面直接开始创建任务。",
      "constraints": [
        "不改变任务数据模型",
        "不修改创建任务 API",
        "不引入新权限规则",
        "已有任务时的看板布局不能受影响"
      ],
      "start": "story-01-start-r1"
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
      "start": "story-02-start-r1"
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
      "start": "story-03-start-r1"
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
      "start": "story-04-start-r1"
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
      "start": "story-05-start-r1"
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
      "start": "story-06-start-r1"
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
        "project": "story-01-start-r1",
        "commands": [
          "git clone https://github.com/shuge-x/ai-coding-workflow-demo.git",
          "cd ai-coding-workflow-demo",
          "git fetch --tags",
          "git checkout story-01-start-r1",
          "git switch -c codex/story-01-empty-state",
          "npm install",
          "cp .env.example .env",
          "node -e \"require('fs').closeSync(require('fs').openSync('prisma/dev.db','a'))\"",
          "npm run db:push",
          "PRACTICE_BASELINE=01 npm run db:seed",
          "npm run dev"
        ],
        "requirements": [
          "Git、Node.js 22、npm 10；本节终端命令使用 macOS / Linux shell 或 Windows Git Bash / WSL",
          "已安装一个 Coding Agent，并在其中打开刚克隆的 ai-coding-workflow-demo 项目目录",
          "已安装 Matt Pocock Skills；首次在本项目运行 /setup-matt-pocock-skills 时可选择 Local Markdown tracker"
        ],
        "codegraph": "不需要。小修改先用项目导航和普通源码阅读即可；不要为了展示工具而强行调用 CodeGraph。",
        "verificationCommands": [
          "npm run typecheck",
          "npm run lint",
          "npm run test:e2e"
        ],
        "walkthrough": [
          {
            "title": "先核对起始页面",
            "body": "保持 npm run dev 所在终端运行，打开 http://localhost:3000。应看到“暂无任务”、基础说明和“新建任务”按钮。当前已经可以创建任务，本次练习改善的是首次任务引导。"
          },
          {
            "title": "在 Agent 对话中发送 Prompt",
            "body": "在 Coding Agent 中打开这个项目目录，先让它读取 AGENTS.md。进入课程“04 逐步执行”，逐条复制右侧完整 Prompt 到 Agent 对话框；这些 Prompt 不在终端执行。"
          },
          {
            "title": "由你启动实施",
            "body": "第 01 步只确认范围。认可 Agent 的修改计划后，再在同一对话主动选择 implement Skill 并发送第 02 步 Prompt。若技能入口找不到，先完成安装并重启 Agent；普通聊天响应不能证明 Skill 已加载。"
          },
          {
            "title": "在第二个终端验证",
            "body": "第二个终端也进入同一个项目目录。首次浏览器检查先运行 npx playwright install chromium，再按“验证真实页面”的 Prompt 执行检查。构建前先停止开发服务器，避免两个进程同时写入构建目录。"
          },
          {
            "title": "重复测试前确认练习数据",
            "body": "浏览器测试会真实创建任务。重复运行前，确认当前 SQLite 练习库中的任务可以丢弃，再运行 PRACTICE_BASELINE=01 npm run db:seed 恢复空看板；该命令会清空本练习项目的任务。"
          }
        ]
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
          "prompt": "请阅读项目根目录 AGENTS.md、任务看板首页相关代码和 e2e/board.spec.ts。先说明起始页面已经有什么创建入口、点击后会发生什么。我要改善没有任务时的引导：解释当前为空、突出“创建第一个任务”按钮，并说明填写任务后会出现在待处理列。请先复述目标、非目标、最小修改计划和可观察验收条件；当前只确认范围，不编码，不创建 Spec、Tickets 或 ADR。",
          "agentBehavior": "Agent 读取项目规范和相关组件，复述目标、识别修改入口，并把视觉结果转成可观察验收条件。若发现需求歧义或涉及 API / 数据模型，应停下来询问。",
          "artifact": "简短修改计划 + 验收清单",
          "checklist": [
            "目标和非目标清楚",
            "确认不会改动创建任务业务逻辑",
            "已有任务状态下的页面行为列入回归检查"
          ],
          "handoff": "用户认可范围后，在 Agent 中主动选择 implement Skill，再发送下一步 Prompt；设计认可不自动授权实施。",
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
          "prompt": "/implement\n\n按刚才确认的范围完成空状态的最小改动。复用现有组件、样式和 openCreate 创建流程，保留已有任务时的看板。标题可采用“从第一个任务开始”，主按钮写“创建第一个任务”，并说明填写名称和说明、保存后出现在待处理列。检查 e2e/board.spec.ts：文案变化后更新对应可访问名称断言，保留真实创建任务验证，并覆盖创建后刷新仍可见。纯视觉修改不必另写无意义单测。若检查被框架生成文件阻塞，先定位原因并单独报告必要的工程配置变更，不要关闭源码检查规则。完成后运行相关检查并做 code-review。",
          "agentBehavior": "implement 是用户主动调用的入口；它按 Spec 或用户描述实施工作。上游 Skill 指示它在合适 seam 使用 tdd、定期运行类型检查和测试，并在完成后调用 code-review。",
          "artifact": "页面代码 Diff；如有行为变化则包含测试。",
          "checklist": [
            "页面改动限于空状态，复用已有创建流程",
            "API、数据模型及非空看板没有变化",
            "测试继续验证真实创建行为；工程配置修正单独说明"
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
            "command": "在第二个终端运行 typecheck、lint、test 和 test:e2e；停止开发服务器后再运行 build。"
          },
          "prompt": "请给出实际执行过的命令、输出和未覆盖项。先运行 npm run typecheck、npm run lint、npm run test；首次运行浏览器测试先执行 npx playwright install chromium。确认当前练习库的任务可丢弃后，用 PRACTICE_BASELINE=01 npm run db:seed 恢复空看板，再运行 npm run test:e2e（测试会创建真实任务）。浏览器检查桌面和窄屏：引导清楚、主按钮突出、鼠标和键盘均能打开现有创建弹窗、取消后仍为空、创建后空状态消失、刷新后任务仍在待处理列。再检查已有任务时三列看板。停止开发服务器后运行 npm run build。不要把未执行的检查写成通过。",
          "agentBehavior": "Agent 运行相关测试，并对 UI 使用真实浏览器或视口验证；说明自动化检查和人工观察的区别。",
          "artifact": "测试输出、浏览器验收记录、未覆盖项。",
          "checklist": [
            "命令和结果真实记录，生成文件的检查问题单独说明",
            "桌面与窄屏检查了空状态、取消和键盘操作",
            "真实创建后刷新仍可见，已有任务的三列看板正常"
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
        },
        {
          "title": "一次实际改造的前后页面",
          "format": "images",
          "content": "以下截图来自 story-01-start-r1 的独立演练。参考方案复用原创建弹窗；视觉风格可以不同，验收仍以清晰引导、真实创建和既有行为为准。",
          "images": [
            {
              "src": "assets/story-01/before-desktop.png",
              "alt": "改造前：暂无任务、基础说明和新建任务按钮",
              "caption": "起始版本 · 桌面"
            },
            {
              "src": "assets/story-01/after-desktop.png",
              "alt": "改造后：从第一个任务开始、创建第一个任务按钮及操作说明",
              "caption": "参考实现 · 桌面"
            },
            {
              "src": "assets/story-01/after-mobile.png",
              "alt": "390 像素窄屏下的空状态引导和创建入口",
              "caption": "参考实现 · 390px 窄屏"
            }
          ]
        },
        {
          "title": "实测交付记录（2026-11-11）",
          "format": "markdown",
          "content": "## 起点与参考实现\n起点：story-01-start-r1。\n参考实现：story-01-example-r1（在配套教学仓库中，供完成练习后对照）。\n\n## 修改范围\n- task-board.tsx：空状态展示，继续调用 openCreate。\n- globals.css：复用已有样式，调整提示文字和窄屏布局。\n- e2e/board.spec.ts：文案断言、取消、键盘创建、刷新持久化与三列看板。\n- eslint.config.mjs / .gitignore：排除 Next.js 自动生成的 next-env.d.ts；未关闭源码检查规则。\n\n## 实际验证\nNode 22.14.0 / npm 10.9.2；Next.js 15.5.29；Playwright 1.65.0。\n- npm run typecheck：通过。\n- npm run lint：通过。\n- npm run test：3 个用例通过。\n- npm run test:e2e：1 个浏览器旅程通过，覆盖 1440px 和 390px。\n- npm run build：通过；构建后 lint 仍通过。\n- 更新后的浏览器测试在原页面上先失败，修改后通过。\n\n## 调用与验收边界\n本次由当前 Codex 会话按课程 Prompt 直接实施；没有把它记录为宿主 /implement 菜单的实测，也未验证其他宿主的安装流程。\nAutomated Verified：通过；Standards Review：0 项问题；Spec Review：0 项问题；用户本人最终页面验收：待确认。\n\n## 对照 Diff\ngit fetch --tags\ngit diff story-01-start-r1...story-01-example-r1 -- app/components/task-board.tsx app/globals.css e2e/board.spec.ts eslint.config.mjs .gitignore"
        }
      ],
      "decisions": [
        {
          "title": "不要把小改动做成完整 SDD",
          "detail": "如果目标和边界已经清楚，不需要 Grill、ADR、Spec、Tickets 全套流程。流程应该匹配风险，不是越多越专业。"
        },
        {
          "title": "发现范围扩大时停止并升级",
          "detail": "如果阅读代码后发现需要改创建 API、数据模型、权限或多个模块，说明当前路由判断已经失效。停止继续 implement，向用户报告新增未知，改走需求探索或常规功能路线。"
        },
        {
          "title": "测试创建了任务，第二次运行却失败",
          "detail": "先检查是否仍处于空看板。E2E 会写入练习数据库；确认数据可丢弃后，用本路线的 db:seed 恢复空状态再测。不要删除创建和刷新断言来制造通过。"
        },
        {
          "title": "检查失败来自框架生成文件",
          "detail": "本次实际遇到 next-env.d.ts 的 Lint 报错。确认文件由 Next.js 生成后，在 ESLint 和 Git 中排除它，保留原有源码规则；把环境修正和页面变更分别记录。"
        }
      ],
      "acceptance": [
        "空状态符合用户目标",
        "已有任务状态不回归",
        "取消创建后仍为空；成功创建后空状态消失，刷新后任务仍可见",
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
        "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
        "https://github.com/mattpocock/skills/blob/main/README.md",
        "https://nextjs.org/docs/app/api-reference/config/eslint"
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
        "project": "story-02-start-r1",
        "commands": [
          "git clone https://github.com/shuge-x/ai-coding-workflow-demo.git",
          "cd ai-coding-workflow-demo",
          "git fetch --tags",
          "git checkout story-02-start-r1",
          "git switch -c codex/story-02-reminder-discovery",
          "npm install",
          "cp .env.example .env",
          "node -e \"require('fs').closeSync(require('fs').openSync('prisma/dev.db','a'))\"",
          "npm run db:push",
          "PRACTICE_BASELINE=02 npm run db:seed",
          "npm run dev"
        ],
        "requirements": [
          "Git、Node.js 22、npm 10；终端命令使用 macOS / Linux shell 或 Windows Git Bash / WSL",
          "已安装 Matt Pocock Skills，并在本项目运行过 /setup-matt-pocock-skills；可选择 Local Markdown tracker",
          "准备作为需求方逐条回答；参考答案只是作者示例，不能替代你的真实决定"
        ],
        "codegraph": "不需要。需求探索首先处理业务未知，代码结构索引不是替代访谈的工具。",
        "walkthrough": [
          {
            "title": "从独立起点开始",
            "body": "在新建的练习目录切换 story-02-start-r1 后建立分支。seed 会清空该项目已有任务，再写入 4 个带截止日期的示例任务；无需先完成 Story 01。"
          },
          {
            "title": "先读源码，再问业务",
            "body": "先按第 01 步读取任务日期输入、创建服务和模型。当前起点没有用户、负责人或通知收件人关系；页面图标不代表这些业务能力已实现。"
          },
          {
            "title": "一次回答一个问题",
            "body": "在 Agent 中主动启动 grill-with-docs 并发送第 02 步 Prompt。由你作为需求方回答；Agent 应根据回答提出下一个问题。若找不到 Skill 入口，先完成安装并重启。"
          },
          {
            "title": "对照示例，不照搬决定",
            "body": "“工件与交接”里有作者编写的 8 轮访谈示例。先尝试回答，再展开示例；保留和示例不同的选择，并标明来源。"
          },
          {
            "title": "检查文档与结束状态",
            "body": "保存访谈记录、术语与未决项。检查 app、lib、prisma 没有因需求讨论而被修改；本轮完成状态是需求探索记录，不是提醒功能已经实现或获准实施。"
          }
        ],
        "verificationCommands": [
          "git grep -n -E 'model |dueDate' -- prisma/schema.prisma app/actions.ts lib/task-service.ts",
          "git diff story-02-start-r1 -- app lib prisma",
          "git status --short"
        ]
      },
      "steps": [
        {
          "id": "context",
          "title": "恢复已有项目语境",
          "actor": "Agent",
          "invocation": {
            "kind": "natural",
            "command": "读取项目规范、任务截止日期输入和保存链路，列出事实 / 推断 / 未知。"
          },
          "prompt": "请先阅读 AGENTS.md、GLOSSARY.md（如存在）、prisma/schema.prisma、prisma/seed.ts、任务日期输入与保存链路。分别列出代码事实、推断和待确认的业务问题，并为事实给出文件位置。特别核对当前是否存在用户、任务负责人、订阅者或收件人关系；不要把页面头像或通知图标当成真实身份功能，也不要把创建时附加的时间当成已批准提醒时刻。当前只恢复语境，不设计提醒规则、不写业务代码。",
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
          "prompt": "/grill-with-docs\n\n我想给 Team Task Board 增加任务到期提醒，目前只有一个模糊想法：任务快到期时，系统能提醒相关人员。请通过访谈找出会改变产品行为的关键未知。一次只问当前最重要的一个问题，收到我的回答再继续。先明确“相关人员”与“到期前提醒 / 逾期后催办”的含义，再讨论日期、时区、渠道、关闭和失败处理。区分代码事实、我真实确认的决定、你的假设、教学示例和未决项；没有回答的地方保留未知。当前授权仅限需求探索和设计。",
          "agentBehavior": "grill-with-docs 上游要求调用 grilling 与 domain-modeling。它应逐项追问，而不是一次抛出十几个问题；同时建立共享领域语言，必要时记录 ADR。用户应知道这是一个需求访谈，不是编码任务。",
          "artifact": "访谈记录、已确认业务规则、未决问题。",
          "checklist": [
            "一次聚焦一个关键问题",
            "提醒对象和触发时机没有被 Agent 擅自决定",
            "不把示例答案当成用户已确认的决定",
            "未把作者示例或缺失的负责人关系写成真实用户决定"
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
          "prompt": "请根据刚才真实获得的回答整理领域用语，区分 Task Due Date、Due Reminder、Overdue Follow-up、Reminder Subscription、Recipient、Reminder Schedule、Delivery Channel、Delivery Attempt 和 User Preference。术语表只写概念定义；触发时间、频率、失败策略及确认状态写入需求记录。若只有教学示例回答，明确标注为示例，不能写成我的决定。只有出现真实且重要的架构取舍时才记录 ADR。",
          "agentBehavior": "domain-modeling 是 Agent 可调用的专业能力，不要求用户把它作为第二个 slash 命令。只有出现真实架构取舍时才创建 ADR；普通术语写入 GLOSSARY 即可。",
          "artifact": "GLOSSARY 候选条目、必要 ADR、领域关系摘要。",
          "checklist": [
            "术语定义与规则状态分开保存",
            "提醒对象、时区、重复发送、关闭和失败等规则均有来源或未决标记",
            "ADR 只记录真实取舍，没有为流程完整而创建"
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
          "prompt": "请汇总提醒的目标、收件人、到期语义、时间与时区、渠道、频率、关闭方式、任务变更与完成后的行为、失败处理、非目标和未决问题。每条规则必须标记为代码事实、我真实确认、你的假设、作者教学示例或待决定，并附来源。真实用户尚未确认的部分不要写成批准需求，也不要宣布已经可实施。当前授权仅限需求探索与设计；交付记录和下一轮问题后结束本故事。",
          "agentBehavior": "Agent 应输出可读的需求基线和开放问题，并明确停在设计边界。设计认可不等于编码授权。",
          "artifact": "需求基线、GLOSSARY 更新、必要 ADR、待决策清单。",
          "checklist": [
            "每条关键规则有来源或状态",
            "没有将假设写成确认",
            "明确写出未开始编码"
          ],
          "handoff": "交付需求探索记录；真实用户确认与后续实施授权分别记录，后续路线另行选择。",
          "sources": []
        }
      ],
      "artifactSamples": [
        {
          "title": "起始事实与未知对照",
          "format": "markdown",
          "content": "核对起点：story-02-start-r1\nCommit：46d98d66aa90c0a65b85f14ccb0c26a3841583d8\n\n代码事实：\n- schema.prisma 只定义 Project / Task，dueDate 可为空。\n- 日期输入在 actions.ts 中附加 T12:00:00 后保存。\n- seed 的 02 profile 创建 4 个有截止日期的任务，其中一个已完成且日期在过去。\n- 没有可直接复用的负责人、账户或通知收件人关系。\n\n不能推出：\n- 中午就是业务提醒时刻。\n- 默认收件人就是任务负责人。\n\n未知：提醒对象、提前或逾期语义、时区、频率、渠道、关闭和失败策略。\n本次为源码核对，没有把它记作提醒功能的运行测试。"
        },
        {
          "title": "作者编写的访谈示例",
          "format": "interview",
          "content": "以下对话和候选规则由课程作者编写，用于演示访谈方法；不是本次会话用户的回答，也不是项目已批准需求。实际跟做时，请记录你自己的回答和来源。",
          "turns": [
            {
              "question": "你说的“相关人员”具体是谁？",
              "answer": "本例先考虑主动订阅任务提醒的个人，不把任务负责人作为默认收件人。",
              "reason": "当前起点没有负责人或收件人关系。先明确“谁需要提醒”，才能讨论身份和订阅如何建立。",
              "record": "教学示例 D01：收件人来自提醒订阅。真实用户是否采用、订阅者身份如何确认，待决定。"
            },
            {
              "question": "“快到期”是到期前提醒，还是已经逾期后的催办？",
              "answer": "本例先讨论截止日前一天的一次提醒；逾期后持续催办另行讨论。",
              "reason": "提前提醒与逾期催办的触发条件、次数和用户预期不同，需要先确定本轮语义。",
              "record": "教学示例 D02：到期前一次提醒。逾期催办不纳入本例候选范围。"
            },
            {
              "question": "任务的日历截止日期和提醒时刻，应按哪个时区解释？",
              "answer": "本例按收件人选择的时区，在任务截止日的前一天 09:00 提醒；没有选择时区时先要求补充。",
              "reason": "代码把日期输入转成了带时间的值，但这不是业务已经选择的提醒时间或时区。",
              "record": "教学示例 D03：按收件人时区解释日历日期与 09:00。真实用户确认、夏令时异常和修改时区后的行为仍待决定。"
            },
            {
              "question": "任务完成、删除、取消订阅或修改截止日期后怎么办？",
              "answer": "本例中，完成、删除或取消订阅会取消尚未发送的提醒；修改截止日期后重新计算未发送的计划。已发过一次后能否再发，我还没有决定。",
              "reason": "状态变化可能让旧计划失效；“重新计算计划”和“允许再发送”是两个问题。",
              "record": "教学示例 D04：失效计划取消，未发送计划重算。已发送任务再次提醒的条件列入未决项。"
            },
            {
              "question": "如果任务没有截止日期，或计划提醒时刻已经过去呢？",
              "answer": "本例中，没有截止日期就不安排提醒；新建或改期后计划时刻已经过去，先跳过，不补发历史提醒。",
              "reason": "可选截止日期与迟到安排都需要明确边界，否则 Agent 会自行选择补发策略。",
              "record": "教学示例 D05：无截止日期不排程；已过提醒时刻的安排跳过。真实采用前仍需确认。"
            },
            {
              "question": "希望通过什么渠道收到提醒？收件地址从哪里来？",
              "answer": "本例先比较邮件渠道。收件地址如何取得、验证和关联订阅者，还没有决定。",
              "reason": "当前代码没有账户或邮箱关系。渠道偏好不等于已经具备投递条件。",
              "record": "教学示例 D06：邮件为候选渠道；身份、收件地址验证与发送服务选择保持未决。"
            },
            {
              "question": "用户能关闭提醒吗？需要全局免打扰窗口吗？",
              "answer": "本例允许取消某个任务的提醒订阅；全局免打扰时段以及和 09:00 冲突时如何处理，先列为待讨论。",
              "reason": "任务级订阅与个人全局偏好不能混成一个开关；尚未讨论的规则应保持可见。",
              "record": "教学示例 D07：任务级关闭。免打扰与全局偏好的覆盖关系保持未决。"
            },
            {
              "question": "投递失败后要重试吗？怎样算这次提醒成功？",
              "answer": "本例不接受无限重试；次数和间隔仍待决定。发送服务接受了请求，也不代表用户已经收到或阅读。",
              "reason": "提醒意图、单次投递尝试和用户实际看到消息，是不同的概念与完成状态。",
              "record": "教学示例 D08：失败与重试需显式规则。重试上限、成功判定和失败反馈均待决定。"
            }
          ]
        },
        {
          "title": "候选需求基线与停止边界",
          "format": "markdown",
          "content": "# Story 02 到期提醒候选需求基线\n\n状态：教学示例，尚未获得真实用户确认。以下对话和候选规则由课程作者编写，用于演示访谈方法；不是本次会话用户的回答，也不是项目已批准需求。实际跟做时，请记录你自己的回答和来源。\n\n## 问题与目标\n\n原始表达是“任务快到期时，系统能提醒相关人员”。本轮要明确提醒对象、时间语义、渠道、生命周期与失败处理，留下可审核的规则与未决项。\n\n## 代码事实\n\n事实与出处见 [起始代码核对](reminder-code-facts.md)。当前起点的任务具有可选截止日期；没有可直接复用的负责人、用户身份或收件人关系。\n\n## 作者设定的候选规则\n\n| 编号 | 候选规则 | 来源与状态 |\n|---|---|---|\n| D01 | 提醒面向主动订阅某任务的个人 | 教学示例第 1 轮；真实用户待确认 |\n| D02 | 截止日前一次提醒，逾期催办另议 | 教学示例第 2 轮；真实用户待确认 |\n| D03 | 按收件人时区，在任务日历截止日前一天 09:00 提醒；缺失时区需补充 | 教学示例第 3 轮；真实用户待确认 |\n| D04 | 完成、删除、取消订阅会取消未发送提醒；改期重算未发送计划 | 教学示例第 4 轮；真实用户待确认 |\n| D05 | 无截止日期不排程；新建或改期后提醒时刻已过则跳过 | 教学示例第 5 轮；真实用户待确认 |\n| D06 | 邮件仅为候选渠道 | 教学示例第 6 轮；真实用户待确认 |\n| D07 | 可以取消某任务的提醒订阅 | 教学示例第 7 轮；真实用户待确认 |\n| D08 | 不无限重试；投递与阅读分别描述 | 教学示例第 8 轮；真实用户待确认 |\n\n## 真实用户确认\n\n尚未收集真实用户的逐条确认。D01–D08 均不得标为项目已批准规则。\n\n## 待决策与后续访谈\n\n1. 谁能建立订阅，收件人身份和邮箱如何验证？\n2. 时区变更、夏令时异常，以及实际截止日期的业务解释如何处理？\n3. 已发送后再改截止日期，是否允许另一次提醒？\n4. 全局免打扰如何覆盖任务级安排？\n5. 重试上限、间隔、成功判定和最终失败反馈是什么？\n\n这些问题仍可能改变设计；后续不能把本记录直接当成可实施 Spec。\n\n## 情景检查 也是候选规则的推演\n\n- 若截止日为某月 20 日，且采用 D03，则候选提醒时刻为收件人所选时区 19 日 09:00；这不是从数据库里的中午时间推得的要求。\n- 若任务在发送前完成，按 D04 取消待发送计划；当前 seed 中“已完成且日期在过去”的任务可用来追问这条规则。\n- 若新任务的候选提醒时刻已经过去，按 D05 跳过；不能默默切换成补发策略。\n- 若发送服务接受请求，也不能据此声称用户已阅读；成功条件仍需确认。\n\n## 本轮范围与停止边界\n\n产物为访谈记录、术语表、候选规则和未决项。当前没有新增提醒界面、Schema、服务代码、邮件发送或部署配置。\n\n未创建 ADR：尚无需要记录的、真实批准且代价显著的架构取舍。术语定义保存在 [GLOSSARY](../../GLOSSARY.md)，不把状态表或实现方案塞进术语表。\n\n## 交接清单\n\n- 每条规则能追溯到回答，且标清是教学示例还是真实用户确认。\n- 未决问题保留优先级与下一步提问。\n- 需求探索结束不等于允许生成实施 Spec、Tickets 或写代码。\n- 实际项目只有在用户完成需求确认并另行授权后，才选择下一条实施路线。\n"
        },
        {
          "title": "术语表节选",
          "format": "markdown",
          "content": "本例 GLOSSARY 只定义用语；确认状态与业务规则保存在需求基线中。\n\nTask Due Date：任务预期完成的日历日期，不等于提醒时间。\nDue Reminder：临近截止日期的提醒意图，不等于逾期催办。\nReminder Subscription：个人选择接收某任务提醒的关系，不等于任务指派。\nRecipient：某次提醒面向的人，不预设为负责人。\nReminder Schedule：任务、收件人和预期提醒时刻的安排。\nDelivery Attempt：一次发送尝试，不等于新增一次提醒。"
        },
        {
          "title": "交接记录与参考工件",
          "format": "markdown",
          "content": "参考工件：story-02-example-r1，位于配套教学仓库。\n新增：GLOSSARY.md、docs/requirements/reminder-code-facts.md、reminder-interview.md、reminder-baseline.md。\n业务代码：相对 story-02-start-r1 无改动。\nADR / 实施 Spec / Tickets：未创建。\n\n状态：\n- 起始代码事实已核对。\n- 访谈内容为作者编写的教学示例，不是用户真实回答。\n- 真实用户需求确认与实施授权：待决定。\n- 宿主 grill-with-docs 菜单与完整安装流程：未实测。\n\n完成练习后再对照：\ngit fetch --tags\ngit diff story-02-start-r1...story-02-example-r1 -- GLOSSARY.md docs/requirements\ngit show story-02-example-r1:docs/requirements/reminder-baseline.md"
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
        },
        {
          "title": "样例答案不是默认业务规则",
          "detail": "“提前一天 09:00”“订阅者”“邮件”都只是本例作者设定。真实访谈没有确认这些选择时，应保留未知，不能自动写入已批准需求。"
        },
        {
          "title": "当前没有负责人，先澄清提醒谁",
          "detail": "story-02-start-r1 的模型只包含 Project 和 Task。若需求方想提醒负责人，先讨论负责人身份与关系如何产生；不能从后续 Story 03 借来现成功能假装已经存在。"
        },
        {
          "title": "日期值不能替用户决定提醒时刻",
          "detail": "T12:00:00 是当前创建代码的表示方式。业务上的日历截止日、提醒时刻、收件人时区与夏令时处理都需要独立澄清。"
        }
      ],
      "acceptance": [
        "事实能定位到起始版本源码，推断与未知分开",
        "真实用户决定与作者教学示例明确区分",
        "GLOSSARY 只定义用语，规则与确认状态放在需求记录",
        "未决项保留后续问题；缺少确认时不宣称可实施",
        "ADR 只记录真实架构取舍",
        "交付需求探索记录，并单独记录后续实施授权状态"
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
        "project": "story-03-start-r1",
        "commands": [
          "git clone https://github.com/shuge-x/ai-coding-workflow-demo.git",
          "cd ai-coding-workflow-demo",
          "git fetch --tags",
          "git checkout story-03-start-r1",
          "git switch -c codex/story-03-assignment",
          "npm install",
          "cp .env.example .env",
          "node -e \"require('fs').closeSync(require('fs').openSync('prisma/dev.db','a'))\"",
          "npm run db:push",
          "PRACTICE_BASELINE=03 npm run db:seed",
          "npm run dev"
        ],
        "requirements": [
          "Git、Node.js 22、npm 10；使用独立 clone 或 worktree",
          "已安装 Matt Pocock Skills，并完成项目级 setup；本参考不伪造宿主菜单执行",
          "准备审核 Spec、Ticket 粒度和测试 seam；教学身份切换器只用于本地练习，不是生产认证"
        ],
        "codegraph": "可选。若需要理解现有 Task / Project / Member 调用链，可在项目初始化 CodeGraph 后用 codegraph_explore；不要为了形式强制使用。",
        "walkthrough": [
          {
            "title": "从独立起点开始",
            "body": "切换 story-03-start-r1 并建立分支。seed 会创建项目成员和角色，但起点没有任务负责人；不依赖 Story 01/02。"
          },
          {
            "title": "先核对规则与事实",
            "body": "确认一个任务最多一个负责人、只能指派给项目成员、Owner/Manager 才能修改、允许清空；通知系统不在范围。"
          },
          {
            "title": "先 Spec 再 Tickets",
            "body": "主动调用 /to-spec，不重新访谈；检查用户故事、负面行为和测试 seam。随后用 /to-tickets 先审依赖，再逐票实施。"
          },
          {
            "title": "按纵向切片实施",
            "body": "第一张票贯穿数据、服务、界面和刷新；第二张票增加我的任务筛选。不要把数据库票、API 票和 UI 票拆成互相等待的水平层。"
          },
          {
            "title": "区分自动化和人工验收",
            "body": "用教学身份切换器观察角色差异，跑完测试后仍需用户本人确认浏览器行为；教学身份不代表真实认证。"
          }
        ],
        "verificationCommands": [
          "git grep -n -E 'model (User|Membership|Task)|role|assignee' -- prisma/schema.prisma app lib",
          "git diff story-03-start-r1 -- app lib prisma e2e tests"
        ]
      },
      "steps": [
        {
          "id": "baseline",
          "title": "确认需求与项目现状",
          "actor": "Agent",
          "invocation": {
            "kind": "natural",
            "command": "读取场景说明、已有的 GLOSSARY / ADR（如存在）和当前实现。"
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
          "handoff": "交付自动化证据与人工验收状态；未获得用户确认的部分保持待验收。",
          "sources": [
            "delivery",
            "acceptance"
          ]
        }
      ],
      "artifactSamples": [
        {
          "title": "起始事实与需求边界",
          "format": "markdown",
          "content": "以下参考工件由课程作者编写，用于展示交接格式；不是本次会话用户的回答，也不是项目已经批准的生产设计。实际跟做时，请记录自己的决定、来源和人工验收。\n\n起点 story-03-start-r1 已有 User / Membership / role 与项目成员；Task 没有 assignee。候选范围：单负责人、当前项目成员、Owner/Manager 修改、允许清空、我的任务筛选。非目标：通知与生产认证。"
        },
        {
          "title": "Feature Spec 参考工件",
          "format": "markdown",
          "content": "来源：参考仓库的 .scratch/task-assignment/spec.md。\n\nProblem：成员无法明确负责人。\nAcceptance：负责人必须是项目成员；Owner/Manager 可修改；Member 越权被拒绝；刷新保持一致；我的任务只显示当前身份负责的任务。\n\n状态：作者参考，实际练习需要自己的批准记录。"
        },
        {
          "title": "Tracer-bullet Ticket 图",
          "format": "markdown",
          "content": "01 管理者可指派项目成员（Blocked by：无）\n  → 贯穿关系、权限、控件、保存和刷新\n02 成员查看我的任务（Blocked by：01）\n  → 只增加当前身份筛选与组合搜索\n\n每张票独立可演示；先展示任务图，再由用户确认粒度。"
        },
        {
          "title": "实施与验收证据",
          "format": "markdown",
          "content": "参考 tag：story-03-example-r1（提交 007a962a8e59a2c77073521956ef21db3564ec8d）。\n旧版本 Ticket 01 浏览器断言因没有负责人控件失败；实现后 Owner 指派和刷新通过。服务层集成检查覆盖 Manager 更换/清空、Member/非成员拒绝。\n\nHuman Accepted：待用户本人操作；原生 /to-spec、/to-tickets、/implement 菜单未实测。"
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
        },
        {
          "title": "教学身份不是认证系统",
          "detail": "为了让初学者观察 Owner、Manager、Member 的行为，本参考提供本地身份切换器。服务端仍按角色判断，但生产接入必须替换为可信会话；不能把客户端选择当成安全边界。"
        }
      ],
      "acceptance": [
        "Spec 与原始规则逐条对应",
        "Ticket 粒度和阻塞关系有交接记录",
        "Owner/Manager 指派、更换、清空与 Member/非成员拒绝有服务证据",
        "刷新后负责人和我的任务筛选有浏览器证据",
        "测试、Review、人工验收和知识对账分开报告"
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
        "project": "story-04-start-r1",
        "commands": [
          "git clone https://github.com/shuge-x/ai-coding-workflow-demo.git",
          "cd ai-coding-workflow-demo",
          "git fetch --tags",
          "git checkout story-04-start-r1",
          "git switch -c codex/story-04-wayfinder",
          "npm install",
          "cp .env.example .env",
          "node -e \"require('fs').closeSync(require('fs').openSync('prisma/dev.db','a'))\"",
          "npm run db:push",
          "PRACTICE_BASELINE=04 npm run db:seed",
          "npm run dev"
        ],
        "requirements": [
          "Git、Node.js 22、npm 10；使用独立 clone 或 worktree",
          "已安装 Matt Pocock Skills；CodeGraph CLI 1.6.2 可选用于结构探索",
          "准备参与租户语义、可信身份、隔离和迁移回滚的 HITL 决策；作者示例不关闭决策票"
        ],
        "codegraph": "建议。先安装 CodeGraph 并运行 codegraph init，探索当前 User / Project / Task 数据所有权和关键调用链。",
        "walkthrough": [
          {
            "title": "从单团队起点开始",
            "body": "切换 story-04-start-r1 并建立分支。起点有 Team → Project → Task 关系，但没有请求租户上下文；不依赖前面故事。"
          },
          {
            "title": "先命名 Destination",
            "body": "地图终点是经真实决策者确认的架构基线与可实施 Spec，不是一次性写完整个平台。"
          },
          {
            "title": "建立决策地图",
            "body": "主动调用 /wayfinder；票解决决策问题，不按数据库/API/UI 拆实施任务。先处理无阻塞前沿。"
          },
          {
            "title": "用研究和反例缩小未知",
            "body": "阅读官方资料，运行 tenant-scope.py 对比有无租户过滤与复合外键；实验只支持其条件下的结论。"
          },
          {
            "title": "保持 HITL 停止边界",
            "body": "真实需求方没有确认时，保持票开放；不要生成批准 ADR、Spec 或实施代码。"
          }
        ],
        "verificationCommands": [
          "git grep -n -E 'teamId|Project|Task|Membership' -- prisma/schema.prisma app/page.tsx app/actions.ts",
          "python3 experiments/tenant-scope.py",
          "git diff story-04-start-r1 -- app lib prisma"
        ]
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
          "handoff": "交付自动化证据与人工验收状态；未获得用户确认的部分保持待验收。",
          "sources": [
            "delivery",
            "cross-session"
          ]
        }
      ],
      "artifactSamples": [
        {
          "title": "Wayfinder Map 与前沿",
          "format": "markdown",
          "content": "以下参考工件由课程作者编写，用于展示交接格式；不是本次会话用户的回答，也不是项目已经批准的生产设计。实际跟做时，请记录自己的决定、来源和人工验收。\n\n参考工件：.scratch/multi-team/map.md。Destination：形成租户语义、可信身份、隔离和迁移回滚均有确认的架构 Spec。当前 Decisions so far 只有资料调查；HITL 决策保持开放。"
        },
        {
          "title": "隔离研究记录",
          "format": "markdown",
          "content": "docs/story-04/isolation-research.md 比较应用过滤、复合外键和 PostgreSQL RLS 的保护边界，引用 SQLite、Prisma 6 和 PostgreSQL 18 官方资料。\n\n未验证：生产认证、连接池上下文、RLS 管理员例外、迁移与恢复。"
        },
        {
          "title": "可证伪隔离实验",
          "format": "markdown",
          "content": "python3 experiments/tenant-scope.py\n\n结果：无租户过滤可读到对方任务；带租户条件拒绝；同租户可读；复合外键拒绝伪造归属。\n\n限制：内存 SQLite fixture，不是应用或生产安全证明。"
        },
        {
          "title": "决策交接",
          "format": "markdown",
          "content": "参考 tag：story-04-example-r1（提交 08cb54af75e82daa91e2a0444d6f4fdced08da3a）。新增地图、5 张决策票、研究和实验；app/lib/prisma 未修改。当前不创建批准 ADR / Spec / Tickets。"
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
        },
        {
          "title": "Wayfinder 只规划，不替人关闭决策",
          "detail": "租户等价于 Team、跨团队身份、请求上下文和隔离策略都可能改变架构。没有真实决策者确认时，地图停在开放票；实验成功不等于方案获批。"
        }
      ],
      "acceptance": [
        "Destination 可判断且与地图一致",
        "决策票是问题而不是实施任务，前沿依赖真实",
        "研究来源与实验限制完整",
        "租户、身份、隔离、迁移和回滚未确认项保持开放",
        "没有把研究或原型结果写成生产安全保证"
      ],
      "knowledgeRefs": [
        "wayfinder",
        "research",
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
        "project": "story-05-start-r1",
        "commands": [
          "git clone https://github.com/shuge-x/ai-coding-workflow-demo.git",
          "cd ai-coding-workflow-demo",
          "git fetch --tags",
          "git checkout story-05-start-r1",
          "git switch -c codex/story-05-bug-fix",
          "npm install",
          "cp .env.example .env",
          "node -e \"require('fs').closeSync(require('fs').openSync('prisma/dev.db','a'))\"",
          "npm run db:push",
          "PRACTICE_BASELINE=05 npm run db:seed",
          "npm run dev"
        ],
        "verificationCommands": [
          "PRACTICE_BUG_REPRO=1 npm run test:bug-repro",
          "git grep -n -E \"updateTaskStatus|status\" -- app lib",
          "git diff story-05-start-r1 -- app lib e2e tests"
        ],
        "requirements": [
          "Git、Node.js 22、npm 10；使用独立 clone 或 worktree",
          "已安装 diagnosing-bugs、tdd 与 CodeGraph（或使用课程给出的 CLI 参考）",
          "准备观察 Network、服务端写入和刷新结果；不能只接受页面乐观状态"
        ],
        "codegraph": "建议。使用 codegraph_explore 定位拖拽事件、状态更新函数、API handler 和数据库写入链路；图谱结果仍需回到源码核实。",
        "walkthrough": [
          {
            "title": "从可复现起点开始",
            "body": "切换 story-05-start-r1 并建立分支。seed 生成可拖动任务；先跑故障复现，不先改代码。"
          },
          {
            "title": "先建立红色反馈循环",
            "body": "运行 PRACTICE_BUG_REPRO=1 npm run test:bug-repro，确认旧代码刷新后回到进行中。"
          },
          {
            "title": "分开假设并验证",
            "body": "比较“没有请求”“请求失败”“缓存旧读”“服务没写 status”，一次验证一个；CodeGraph 结果必须核对源码。"
          },
          {
            "title": "最小修复并回归",
            "body": "服务端 update 只补写 status，不放宽断言、不延长等待、不只改 UI。用同一测试证明红到绿。"
          },
          {
            "title": "重走原始用户路径",
            "body": "重新拖动、等待保存、刷新并检查；自动化通过后仍把人工验收和未验证环境分开。"
          }
        ]
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
          "handoff": "交付自动化证据与人工验收状态；未获得用户确认的部分保持待验收。",
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
          "content": "| 假设 | 预测 | 结果 |\n|---|---|---|\n| 无保存请求 | Network 没有请求 | 不支持：HTTP 200 |\n| API 失败 | 4xx/5xx | 不支持：响应成功 |\n| 旧缓存 | 数据库已有新状态 | 不支持：先发现写入遗漏 |\n| 服务没有写 status | 刷新读旧状态 | 支持：只写 updatedAt |"
        },
        {
          "title": "红到绿回归证据",
          "format": "markdown",
          "content": "旧代码：刷新后“已完成”断言失败。\n修复：updateTaskStatus 写入 data: { status }。\n新代码：npm run test:bug-repro 通过，真实跨拖拽、Server Action、Prisma 和刷新读取。"
        },
        {
          "title": "诊断交接",
          "format": "markdown",
          "content": "参考 tag：story-05-example-r1（提交 964f060153ec11b388e941fabaae937432ac4458）。CodeGraph 1.6.2 只提供静态关系；源码核对是根因证据。宿主 Skill 菜单未实测；用户人工验收待执行。"
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
        },
        {
          "title": "不能把 HTTP 200 当持久化成功",
          "detail": "请求成功只说明 Server Action 返回；必须检查数据库写入和刷新读取。回归测试断言用户真实症状，避免只测试乐观 UI。"
        }
      ],
      "acceptance": [
        "原始症状在起点可重复",
        "红色反馈循环已实际运行",
        "根因有请求与源码证据",
        "最小修复使回归从红转绿",
        "原始浏览器路径复测并单列人工验收"
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
        "project": "story-06-start-r1",
        "commands": [
          "git clone https://github.com/shuge-x/ai-coding-workflow-demo.git",
          "cd ai-coding-workflow-demo",
          "git fetch --tags",
          "git checkout story-06-start-r1",
          "git switch -c codex/story-06-refactor",
          "npm install",
          "cp .env.example .env",
          "node -e \"require('fs').closeSync(require('fs').openSync('prisma/dev.db','a'))\"",
          "npm run db:push",
          "PRACTICE_BASELINE=06 npm run db:seed",
          "npm run dev"
        ],
        "verificationCommands": [
          "CODEGRAPH_TELEMETRY=0 codegraph explore \"Map TaskService responsibilities callers assignment and comments\"",
          "npm run test:behavior",
          "git diff story-06-start-r1 -- app lib tests"
        ],
        "requirements": [
          "Git、Node.js 22、npm 10；使用独立 clone 或 worktree",
          "已安装 CodeGraph、tdd、code-review 和 retro；本参考记录实际 CLI 证据",
          "准备先批准单一重构边界；行为不变优先于文件数量变化"
        ],
        "codegraph": "必需。运行 codegraph init，使用 codegraph_explore 或 CLI 查看 TaskService callers / callees / 依赖和受影响测试。",
        "walkthrough": [
          {
            "title": "建立结构基线",
            "body": "切换 story-06-start-r1 并建立分支。先运行 CodeGraph explore 和现有行为测试，不先拆文件。"
          },
          {
            "title": "寻找深模块机会",
            "body": "主动调用 /improve-codebase-architecture；比较复杂度是否能隐藏在更小接口后，不追求机械分层。"
          },
          {
            "title": "选择一个边界",
            "body": "本参考只选 assignTask：把指派权限与持久化从 TaskService 移到独立模块；评论、Schema 和新功能留到以后。"
          },
          {
            "title": "先保护行为",
            "body": "用独立 behavior-test.db 从公共接口验证创建、状态、评论和指派权限；测试基线通过后才改结构。"
          },
          {
            "title": "复核并复盘",
            "body": "重跑同一行为测试、typecheck、lint、build 和 CodeGraph；记录动态入口限制，不把经验全塞进全局规范。"
          }
        ]
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
          "handoff": "交付自动化证据与人工验收状态；未获得用户确认的部分保持待验收。",
          "sources": [
            "retro"
          ]
        }
      ],
      "artifactSamples": [
        {
          "title": "架构机会报告",
          "format": "markdown",
          "content": "TaskService 同时承担生命周期、指派权限和评论。assignTask 有独立变化原因和调用入口。\n\n选择：移到 lib/task-assignment.ts，由 Server Action 直接使用；保持参数、错误、数据和行为。"
        },
        {
          "title": "行为保护结果",
          "format": "markdown",
          "content": "npm run test:behavior\n\n覆盖标题规范化、状态更新、评论创建/读取/拒绝、Owner 指派、Manager 更换/清空、Member/非成员错误。使用独立数据库，不 mock 内部模块。"
        },
        {
          "title": "重构交接",
          "format": "markdown",
          "content": "参考 tag：story-06-example-r1（提交 0fb60ea04fcdf4be62eb0d1c6fca4d5683e920ac）。重构前后同一公共 seam；npm test、typecheck、lint、build 通过后再 Review。Human Accepted 与生产动态入口仍待人工确认。"
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
        },
        {
          "title": "重构不是重写",
          "detail": "只处理一个有证据的职责边界。移动 assignTask 不等于完成所有架构改善；其他机会保持在未来任务，避免扩大 Diff。"
        }
      ],
      "acceptance": [
        "CodeGraph 结果已核对源码并披露静态限制",
        "单一重构目标有用户授权边界和行为基线",
        "重构前后同一公共行为测试通过",
        "typecheck、lint、build 和 Review 证据完整",
        "没有混入 Schema、新功能或全仓库重命名"
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
