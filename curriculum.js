window.LAB_CURRICULUM = {
  "meta": {
    "title": "AI Coding Workflow Lab",
    "audience": "希望系统使用 AI Coding Agent 的个人开发者与工程团队",
    "version": "0.2.0",
    "reviewed": "2026-11-08",
    "note": "课程为实践方法论整理；Skill 的名称、调用权限与内容以 Matt Pocock 上游当前版本为准。"
  },
  "groups": [
    {
      "id": 0,
      "title": "需求与架构",
      "en": "DISCOVERY & ARCHITECTURE",
      "question": "先弄清真实问题、领域语言和架构约束，再决定要构建什么。",
      "intro": "从需求访谈到架构决策，建立可讨论、可追溯的设计基线。",
      "color": "#164bc4"
    },
    {
      "id": 1,
      "title": "开发与交付",
      "en": "DEVELOPMENT & DELIVERY",
      "question": "把已确认的需求变成可实施、可验证、可跨会话接续的工程工作。",
      "intro": "从任务分级、Spec、Tickets 到实施、审查和知识同步。",
      "color": "#137f85"
    },
    {
      "id": 2,
      "title": "质量与演进",
      "en": "QUALITY & EVOLUTION",
      "question": "用可复现证据判断正确性，持续降低回归风险与架构复杂度。",
      "intro": "从故障诊断到验证、CodeGraph 影响分析、重构和复盘。",
      "color": "#7951ab"
    }
  ],
  "lessons": [
    {
      "id": "grill",
      "group": 0,
      "title": "需求访谈与 Grill",
      "en": "GRILL WITH DOCS",
      "summary": "把一句模糊目标转化为经过追问、边界明确的业务需求。",
      "principle": "Grill 的价值不是多问问题，而是暴露会改变方案的未知条件。",
      "tradeoff": "深入访谈会增加前期时间，但通常能减少错误实现和返工。",
      "pitfall": "用户说“差不多就是这样”不代表所有边界、异常和非目标都已确认。",
      "nodes": [
        "用户目标",
        "Grill 访谈",
        "已确认规则",
        "设计摘要"
      ],
      "main": [
        {
          "title": "建立问题上下文",
          "from": 0,
          "to": 1,
          "event": "LOAD CONTEXT",
          "detail": "先读项目规范、GLOSSARY、相关 ADR 与现有实现；把已知事实和未知需求分开。",
          "state": "现状与未知已区分",
          "relation": "check"
        },
        {
          "title": "逐项追问关键未知",
          "from": 1,
          "to": 2,
          "event": "ASK / ANSWER",
          "detail": "围绕用户、触发条件、成功结果、权限、失败路径和非目标逐项追问；一次聚焦一个会改变设计的问题。",
          "state": "关键业务规则逐步明确",
          "relation": "request"
        },
        {
          "title": "整理领域语言与决策",
          "from": 1,
          "to": 2,
          "event": "SHARPEN DOMAIN",
          "detail": "将重复出现的概念、术语和边界交给 domain-modeling 归纳；重要取舍形成 ADR。",
          "state": "共享语言与决策形成",
          "relation": "control"
        },
        {
          "title": "确认设计边界",
          "from": 2,
          "to": 3,
          "event": "CONFIRM SCOPE",
          "detail": "输出目标、范围、非目标、已确认规则、假设和待决策项；用户确认后停止，不把认可推断为编码授权。",
          "state": "需求基线待用户确认",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "访谈看似完成，关键规则仍然模糊",
        "nodes": [
          "用户目标",
          "未经验证的假设",
          "错误设计",
          "返工"
        ],
        "steps": [
          {
            "title": "把模糊词直接当需求",
            "from": 0,
            "to": 1,
            "event": "ASSUME MEANING",
            "detail": "“共享”“实时”“安全”“简单”等词存在多种解释，Agent 没有追问便自行选定一种。",
            "state": "假设混入需求",
            "relation": "reject"
          },
          {
            "title": "假设进入设计",
            "from": 1,
            "to": 2,
            "event": "DESIGN ON ASSUMPTION",
            "detail": "数据模型和权限边界围绕未经确认的解释展开，后续 Spec 看似完整却建立在错误前提上。",
            "state": "错误前提被固化",
            "relation": "control"
          },
          {
            "title": "实现偏离真实意图",
            "from": 2,
            "to": 3,
            "event": "WRONG OUTCOME",
            "detail": "用户验收时才发现共享范围或权限不符合预期，返工涉及数据与接口。",
            "state": "返工成本上升",
            "relation": "reject"
          },
          {
            "title": "回到关键问题",
            "from": 3,
            "to": 0,
            "event": "RE-GRILL",
            "detail": "撤回未经确认的假设，明确哪些问题会改变产品行为，再继续设计。",
            "state": "重新建立需求基线",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "什么时候应该 Grill",
          "body": "当目标只有方向、业务词语存在歧义、权限或生命周期尚未明确，或多个方案会产生不同用户行为时，先访谈。不要为了形式对明确的小修改重复 Grill。"
        },
        {
          "title": "如何判断问题问够了",
          "body": "关键用户、触发条件、成功结果、失败路径、权限、数据归属、兼容性和非目标都已有明确答案；剩余未知不会改变本次范围，或已被明确记录为假设。"
        },
        {
          "title": "设计确认与实施授权",
          "body": "Grill 结束意味着需求讨论阶段完成，不意味着允许改代码。明确报告产物与未决项；下一步是否调用 to-spec、to-tickets 或 implement，由用户决定。"
        }
      ],
      "related": [
        "domain",
        "spec",
        "wayfinder"
      ],
      "task": "你希望为一个 Workspace 增加团队共享能力，但还没有明确共享对象、权限角色和成员移除后的数据归属。",
      "prompt": "使用 grill-with-docs 访谈我。一次只问一个会改变业务行为的关键问题，优先澄清用户、触发条件、成功结果、权限、失败路径、数据归属和非目标。区分事实、假设与待决策项。当前只授权需求与设计，不得修改业务代码。",
      "artifact": "需求基线：目标 / 用户 / 触发条件 / 成功结果 / 业务规则 / 权限 / 异常路径 / 非目标 / 假设 / 未决问题。",
      "sources": [
        {
          "title": "grill-with-docs · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md",
          "note": "用户主动调用的需求访谈入口；会结合 grilling 与 domain-modeling。"
        },
        {
          "title": "domain-modeling · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md",
          "note": "可由模型或用户调用的领域建模能力。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "domain",
      "group": 0,
      "title": "领域建模与 GLOSSARY",
      "en": "DOMAIN MODELING",
      "summary": "建立团队和 Agent 共同使用的领域语言，避免同一概念在需求、文档和代码中含义漂移。",
      "principle": "先统一概念，再讨论数据结构和函数命名。",
      "tradeoff": "领域模型需要持续维护；只记录能减少歧义的核心术语和不变量。",
      "pitfall": "GLOSSARY 不是百科全书，也不能把未经确认的实现细节写成业务定义。",
      "nodes": [
        "业务表达",
        "领域概念",
        "关系与状态",
        "GLOSSARY"
      ],
      "main": [
        {
          "title": "收集领域词汇",
          "from": 0,
          "to": 1,
          "event": "EXTRACT TERMS",
          "detail": "从需求访谈、现有文档和代码中提取重复出现、容易混淆或具有业务含义的词。",
          "state": "候选术语形成",
          "relation": "data"
        },
        {
          "title": "识别实体与关系",
          "from": 1,
          "to": 2,
          "event": "MODEL RELATIONSHIPS",
          "detail": "区分实体、值对象、角色、事件和状态；明确所有权、生命周期及关系基数。",
          "state": "概念关系明确",
          "relation": "control"
        },
        {
          "title": "定义不变量与状态",
          "from": 2,
          "to": 3,
          "event": "DEFINE INVARIANTS",
          "detail": "写清不能被破坏的业务规则、状态转换条件和边界案例。",
          "state": "核心约束可验证",
          "relation": "check"
        },
        {
          "title": "形成共享语言",
          "from": 3,
          "to": 3,
          "event": "UPDATE GLOSSARY",
          "detail": "将确认过的定义写入 GLOSSARY；对未确认概念保留候选解释，不提前命名代码接口。",
          "state": "跨会话术语一致",
          "relation": "data"
        }
      ],
      "fault": {
        "name": "把实现名称误当成业务概念",
        "nodes": [
          "源码名称",
          "未经澄清的词",
          "混乱领域模型",
          "错误沟通"
        ],
        "steps": [
          {
            "title": "直接复制现有命名",
            "from": 0,
            "to": 1,
            "event": "COPY IMPLEMENTATION TERMS",
            "detail": "旧代码里的变量名、表名或类名可能只是历史妥协，不一定准确表达领域含义。",
            "state": "历史命名被继承",
            "relation": "check"
          },
          {
            "title": "混淆相似概念",
            "from": 1,
            "to": 2,
            "event": "MERGE DISTINCT CONCEPTS",
            "detail": "例如 Workspace Owner、组织管理员和系统管理员被当作同一角色。",
            "state": "边界与权限混淆",
            "relation": "reject"
          },
          {
            "title": "规则无法稳定表达",
            "from": 2,
            "to": 3,
            "event": "INCONSISTENT LANGUAGE",
            "detail": "不同会话对同一个词作出不同解释，规格与代码开始出现语义漂移。",
            "state": "语言不再统一",
            "relation": "reject"
          },
          {
            "title": "回到业务定义",
            "from": 3,
            "to": 0,
            "event": "RE-ESTABLISH UBIQUITOUS LANGUAGE",
            "detail": "以用户可观察行为和业务约束重新定义术语，再映射到代码模型。",
            "state": "术语定义重新确认",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "从语言开始，而不是从表开始",
          "body": "先弄清业务对象代表什么、由谁拥有、何时创建和终止，再决定它是否需要数据库表、类或 API。领域模型表达业务语义，不等同于 ORM Schema。"
        },
        {
          "title": "术语、状态与不变量",
          "body": "术语定义回答“这个词是什么意思”；状态机回答“对象可能处于什么状态、如何转换”；不变量回答“任何状态下都必须成立什么”。三者共同减少跨会话误解。"
        },
        {
          "title": "GLOSSARY 的维护边界",
          "body": "只保留项目内高频、容易混淆且影响设计的词。重要定义改变时同步更新；代码结构变化交给 CodeGraph 发现，不需要在 GLOSSARY 复制函数清单。"
        }
      ],
      "related": [
        "grill",
        "adr",
        "spec"
      ],
      "task": "Workspace、Workspace Member、Organization Member 和 Runtime Owner 在现有讨论中经常混用，需要建立统一定义。",
      "prompt": "请对本次领域概念进行 domain-modeling：识别实体、值对象、角色、关系、状态转换和不变量。对每个术语标记已确认、候选或待澄清；不要把现有类名直接视为业务定义。",
      "artifact": "GLOSSARY 条目：术语 / 定义 / 与相近术语的区别 / 所属边界 / 例子 / 相关 ADR。",
      "sources": [
        {
          "title": "domain-modeling · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md",
          "note": "可由模型或用户调用的领域建模能力。"
        },
        {
          "title": "grill-with-docs · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md",
          "note": "用户主动调用的需求访谈入口；会结合 grilling 与 domain-modeling。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "research",
      "group": 0,
      "title": "技术研究与原型验证",
      "en": "RESEARCH & PROTOTYPING",
      "summary": "当关键技术事实不确定时，通过可信来源和最小实验缩小未知，而不是凭模型记忆做架构决定。",
      "principle": "研究回答事实问题，原型回答可行性问题；两者都不能替代产品决策。",
      "tradeoff": "研究和原型有成本，应集中验证会改变架构或实施路径的未知。",
      "pitfall": "原型能跑通不代表生产可用；单一环境结果也不能推广到所有版本和部署形态。",
      "nodes": [
        "待验证问题",
        "可信资料",
        "最小原型",
        "证据结论"
      ],
      "main": [
        {
          "title": "定义可证伪问题",
          "from": 0,
          "to": 1,
          "event": "FORM QUESTION",
          "detail": "明确需要确认的技术事实、版本范围、环境条件，以及什么结果会改变方案。",
          "state": "研究问题可验证",
          "relation": "check"
        },
        {
          "title": "查找一手资料",
          "from": 1,
          "to": 2,
          "event": "READ PRIMARY SOURCES",
          "detail": "优先官方文档、源码、规范和可复现 issue；记录版本、日期、适用条件与反例。",
          "state": "证据来源可追溯",
          "relation": "data"
        },
        {
          "title": "构建最小实验",
          "from": 2,
          "to": 3,
          "event": "PROTOTYPE",
          "detail": "只实现验证假设所需的最小路径，避免把临时原型扩张成生产代码。",
          "state": "实验结果可复现",
          "relation": "control"
        },
        {
          "title": "形成结论与限制",
          "from": 3,
          "to": 3,
          "event": "REPORT EVIDENCE",
          "detail": "区分已证实、未证实、环境限制和建议；将重要架构选择交由人确认。",
          "state": "未知范围被收敛",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "把一次原型成功当成普遍保证",
        "nodes": [
          "实验环境",
          "局部成功",
          "生产假设",
          "架构风险"
        ],
        "steps": [
          {
            "title": "实验范围过窄",
            "from": 0,
            "to": 1,
            "event": "NARROW ENVIRONMENT",
            "detail": "原型只在单一版本、单租户或无故障条件下运行。",
            "state": "前提未记录",
            "relation": "check"
          },
          {
            "title": "结果被过度外推",
            "from": 1,
            "to": 2,
            "event": "GENERALIZE RESULT",
            "detail": "Agent 将局部成功解释为多租户、高并发、故障恢复和安全边界都已成立。",
            "state": "结论超出证据",
            "relation": "reject"
          },
          {
            "title": "方案建立在未验证假设上",
            "from": 2,
            "to": 3,
            "event": "DESIGN RISK",
            "detail": "实施时才暴露兼容性、权限、恢复或资源限制。",
            "state": "架构风险显现",
            "relation": "reject"
          },
          {
            "title": "补充边界实验",
            "from": 3,
            "to": 0,
            "event": "TEST BOUNDARIES",
            "detail": "增加最小的失败、并发、版本或权限实验，明确哪些结论仍不能推广。",
            "state": "结论范围收敛",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "Research 与 Prototype 的分工",
          "body": "Research 通过高可信来源回答“规范或工具实际上如何工作”；Prototype 通过可运行的小实验回答“这个设计在指定环境能否成立”。两者可互补，但不要用一个代替另一个。"
        },
        {
          "title": "证据质量",
          "body": "记录来源、版本、日期、环境、步骤、预期和实际结果。官方文档说明规范，源码说明当前实现，issue 提供问题线索；社区经验不能自动升级为保证。"
        },
        {
          "title": "原型退出条件",
          "body": "关键假设已经得到足够证据，或明确证明不可行；结论、限制和剩余未知已记录。原型代码应明确标记为一次性，不默认进入生产分支。"
        }
      ],
      "related": [
        "wayfinder",
        "adr",
        "architecture"
      ],
      "task": "需要决定工作组容器内是否可以同时运行两个不同 Agent Runtime，但资源隔离和并发行为尚未验证。",
      "prompt": "使用 research 与 prototype 解决这个技术未知。先写出可证伪问题、版本与环境前提，再查一手资料或构建最小实验。报告支持证据、反证、限制和仍未解决的问题；不要把原型直接并入生产实现。",
      "artifact": "研究记录：问题 / 范围与版本 / 一手来源 / 实验步骤 / 观察结果 / 结论 / 限制 / 待决策。",
      "sources": [
        {
          "title": "research · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/research/SKILL.md",
          "note": "基于可信来源研究并保存引用资料。"
        },
        {
          "title": "prototype · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md",
          "note": "用一次性原型回答设计问题，不把原型直接当生产实现。"
        },
        {
          "title": "wayfinder · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md",
          "note": "用户主动调用的决策地图工作流，默认规划而非直接实施。"
        }
      ]
    },
    {
      "id": "wayfinder",
      "group": 0,
      "title": "Wayfinder 决策地图",
      "en": "WAYFINDER",
      "summary": "为超出单个会话容量、未知决策彼此依赖的大型工作建立一张可持续推进的决策地图。",
      "principle": "Wayfinder 的目标是把路找清楚，不是把所有实现任务提前排满。",
      "tradeoff": "决策地图需要维护；但能避免在方向未明时拆出大量会返工的 Tickets。",
      "pitfall": "把决策票当成实施票，或在关键未知尚未解决时直接生成完整实施计划。",
      "nodes": [
        "大型目标",
        "决策地图",
        "逐项决策",
        "清晰目的地"
      ],
      "main": [
        {
          "title": "定义目的地",
          "from": 0,
          "to": 1,
          "event": "NAME DESTINATION",
          "detail": "说明地图完成时应交付什么：一个批准的 Spec、一项架构决策，或一条清晰的实施路线。",
          "state": "目标边界清楚",
          "relation": "check"
        },
        {
          "title": "拆出未知决策",
          "from": 1,
          "to": 2,
          "event": "MAP DECISIONS",
          "detail": "列出会改变方案的决策问题及依赖；每张决策票解决一个问题，而非写成实现任务。",
          "state": "决策依赖显式化",
          "relation": "control"
        },
        {
          "title": "逐项解决决策",
          "from": 2,
          "to": 3,
          "event": "RESOLVE FRONTIER",
          "detail": "按依赖推进研究、原型和用户选择；地图持续记录已经确定的决策及仍开放的问题。",
          "state": "未知逐步减少",
          "relation": "request"
        },
        {
          "title": "确认路线清晰",
          "from": 3,
          "to": 3,
          "event": "HAND OFF",
          "detail": "当没有阻塞目的地的未知决策时结束地图，交接给 Spec / Tickets / 实施流程。",
          "state": "到达可执行边界",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "把决策地图写成一堆实施任务",
        "nodes": [
          "模糊目标",
          "实施票堆",
          "未知仍存在",
          "返工"
        ],
        "steps": [
          {
            "title": "过早拆实施任务",
            "from": 0,
            "to": 1,
            "event": "CREATE BUILD TICKETS",
            "detail": "在 Runtime 兼容性、数据迁移策略等关键问题未解决前，就先创建 API、数据库和 UI 任务。",
            "state": "未知被隐藏",
            "relation": "reject"
          },
          {
            "title": "任务假设互相冲突",
            "from": 1,
            "to": 2,
            "event": "CONFLICTING ASSUMPTIONS",
            "detail": "不同任务基于不同架构假设推进，接口和数据模型无法集成。",
            "state": "任务图不稳定",
            "relation": "reject"
          },
          {
            "title": "实现中推翻方向",
            "from": 2,
            "to": 3,
            "event": "REPLAN MID-FLIGHT",
            "detail": "开发进行中才发现原方案不可行，已完成工作需要回滚或重写。",
            "state": "返工扩大",
            "relation": "reject"
          },
          {
            "title": "回到决策地图",
            "from": 3,
            "to": 0,
            "event": "SEPARATE DECISIONS FROM BUILD",
            "detail": "将影响路线的未知提取为决策票，解决后再创建实施任务。",
            "state": "规划与执行重新分离",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "决策票与实施票不同",
          "body": "决策票以一个可回答的问题为中心，产出决定和证据；实施票以一个可演示的行为切片为中心，产出代码与测试。不能把尚未解决的技术选择藏进实施任务。"
        },
        {
          "title": "地图是索引，不是大文档",
          "body": "Wayfinder 的地图记录目的地、已作决策摘要和未解决问题链接；详细证据保存在各决策票或研究记录中，避免重复维护。"
        },
        {
          "title": "何时结束 Wayfinder",
          "body": "阻塞目的地的关键未知已经解决，剩余工作可以被清晰规格化和拆分。默认结束时交付决策与路线，不自动继续编码，除非本次授权明确覆盖实施。"
        }
      ],
      "related": [
        "research",
        "architecture",
        "spec",
        "tickets"
      ],
      "task": "要为一个大型 Runtime 迁移项目确定是否停机迁移、Session 兼容策略、文件复制和失败回滚方案。",
      "prompt": "使用 wayfinder 为该目标建立决策地图。先定义地图目的地，再列出会改变架构的未知决策及依赖。将研究问题与实施任务分开；逐项给出证据和需要我决定的选项。默认只规划，不开始编码。",
      "artifact": "Wayfinder Map：Destination / Decisions so far / Open decision tickets / Dependencies / Exit criteria。",
      "sources": [
        {
          "title": "wayfinder · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md",
          "note": "用户主动调用的决策地图工作流，默认规划而非直接实施。"
        },
        {
          "title": "research · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/research/SKILL.md",
          "note": "基于可信来源研究并保存引用资料。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "adr",
      "group": 0,
      "title": "架构决策与 ADR",
      "en": "ARCHITECTURE DECISIONS",
      "summary": "把重要架构选择及其背景、替代方案和后果保存下来，让未来会话知道为什么这么做。",
      "principle": "ADR 保存决策理由，不只是记录最终选择。",
      "tradeoff": "ADR 能减少重复争论和误改，但过度记录琐碎实现会造成文档负担。",
      "pitfall": "只写“决定使用 X”，不写当时约束、考虑过的替代方案和未来后果。",
      "nodes": [
        "问题与约束",
        "候选方案",
        "已批准决策",
        "未来可追溯"
      ],
      "main": [
        {
          "title": "识别决策触发点",
          "from": 0,
          "to": 1,
          "event": "DECISION NEEDED",
          "detail": "判断选择是否影响模块边界、数据、兼容性、安全、成本或后续迁移。",
          "state": "重大取舍被识别",
          "relation": "check"
        },
        {
          "title": "比较候选方案",
          "from": 1,
          "to": 2,
          "event": "COMPARE OPTIONS",
          "detail": "记录候选方案、适用条件、优势、代价、风险和被否决原因。",
          "state": "权衡透明",
          "relation": "control"
        },
        {
          "title": "由人确认决定",
          "from": 2,
          "to": 3,
          "event": "HUMAN DECISION",
          "detail": "Agent 可以推荐，但涉及业务方向、重大架构和风险承受能力的决定由人批准。",
          "state": "决策获得授权",
          "relation": "request"
        },
        {
          "title": "记录理由与后果",
          "from": 3,
          "to": 3,
          "event": "WRITE ADR",
          "detail": "写入状态、上下文、决定、理由、后果和相关链接；未来变化时新增或替代 ADR，不静默改历史。",
          "state": "决策可追溯",
          "relation": "data"
        }
      ],
      "fault": {
        "name": "ADR 只记录技术名词，没有决策理由",
        "nodes": [
          "架构问题",
          "单一选择",
          "缺失背景",
          "未来误改"
        ],
        "steps": [
          {
            "title": "只记录最终技术",
            "from": 0,
            "to": 1,
            "event": "WRITE ONE-LINE DECISION",
            "detail": "ADR 只写“使用 PostgreSQL”，没有记录约束、候选方案和替代原因。",
            "state": "上下文缺失",
            "relation": "check"
          },
          {
            "title": "未来会话无法判断",
            "from": 1,
            "to": 2,
            "event": "CONTEXT LOST",
            "detail": "新 Agent 不知道当初为什么排除其他方案，重新提出已否决方案或误认为当前选择是偶然。",
            "state": "决策理由丢失",
            "relation": "reject"
          },
          {
            "title": "修改破坏隐含约束",
            "from": 2,
            "to": 3,
            "event": "BREAK TRADE-OFF",
            "detail": "未来变更破坏了当时重要的隔离、恢复或兼容性约束。",
            "state": "隐含约束被破坏",
            "relation": "reject"
          },
          {
            "title": "补齐决策记录",
            "from": 3,
            "to": 0,
            "event": "RECORD CONSEQUENCES",
            "detail": "补充可验证的历史背景和后果；无法确认的原因明确标记未知，不编造历史。",
            "state": "历史知识可审查",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "哪些事情值得写 ADR",
          "body": "影响架构边界、数据模型、协议、运行时、权限、安全、兼容性、可靠性或显著成本的决定通常值得记录。普通函数命名、局部实现细节不必写 ADR。"
        },
        {
          "title": "ADR 的基本结构",
          "body": "状态、背景与约束、候选方案、决定、理由、正负后果、迁移或回滚影响、相关 Spec 和模块。写清为什么，而不是堆砌技术术语。"
        },
        {
          "title": "决策是可演进的",
          "body": "新证据可能使旧决策失效。用新 ADR 标记 supersedes / superseded by，保留历史链路；不要直接改写旧记录，让未来会话误以为新决策从一开始就存在。"
        }
      ],
      "related": [
        "grill",
        "wayfinder",
        "architecture",
        "cross-session"
      ],
      "task": "为 QiShu 选择 Workspace 与 Runtime 的绑定层级，需要比较 Workspace 绑定、任务级选择和容器级固定等方案。",
      "prompt": "请为这项架构选择起草 ADR。先整理背景、约束和候选方案，比较收益、代价与失败模式。不要虚构尚未确认的历史原因；把需要我批准的决定单独列出。",
      "artifact": "ADR：状态 / 背景 / 约束 / 候选方案 / 决定 / 理由 / 正负后果 / 迁移与回滚 / 关联 Spec。",
      "sources": [
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        },
        {
          "title": "grill-with-docs · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md",
          "note": "用户主动调用的需求访谈入口；会结合 grilling 与 domain-modeling。"
        }
      ]
    },
    {
      "id": "architecture",
      "group": 0,
      "title": "架构设计与模块边界",
      "en": "ARCHITECTURE DESIGN",
      "summary": "把已确认的需求与约束组织成职责清楚、接口稳定、能够渐进实施的系统设计。",
      "principle": "优先设计深模块和清晰接口，让复杂性留在边界内部。",
      "tradeoff": "抽象和分层有成本；架构设计应针对真实变化点，不为未来想象建立过多框架。",
      "pitfall": "把每个名词都拆成服务或抽象层，导致接口数量增加、业务路径反而更难理解。",
      "nodes": [
        "业务能力",
        "模块边界",
        "接口契约",
        "系统行为"
      ],
      "main": [
        {
          "title": "梳理变化与不变量",
          "from": 0,
          "to": 1,
          "event": "FIND CHANGE AXES",
          "detail": "从已批准需求中区分稳定规则、变化点、外部依赖和必须保持的不变量。",
          "state": "设计约束明确",
          "relation": "check"
        },
        {
          "title": "划分模块职责",
          "from": 1,
          "to": 2,
          "event": "DEFINE OWNERSHIP",
          "detail": "按业务能力和变化原因划分模块，明确每个模块负责什么、不负责什么。",
          "state": "职责边界清楚",
          "relation": "control"
        },
        {
          "title": "定义接口与数据流",
          "from": 2,
          "to": 3,
          "event": "DESIGN SEAMS",
          "detail": "设计最少且足够的接口、事件和数据所有权；优先选择能被端到端测试的最高合理 seam。",
          "state": "接口可验证",
          "relation": "data"
        },
        {
          "title": "评审风险与演进路径",
          "from": 3,
          "to": 3,
          "event": "REVIEW DESIGN",
          "detail": "检查依赖方向、故障边界、权限、数据一致性、部署与回滚；把重大取舍写入 ADR。",
          "state": "设计可实施",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "先搭平台框架，再寻找实际职责",
        "nodes": [
          "业务能力",
          "过度抽象层",
          "复杂接口",
          "维护负担"
        ],
        "steps": [
          {
            "title": "抽象先于问题",
            "from": 0,
            "to": 1,
            "event": "PREMATURE ABSTRACTION",
            "detail": "根据想象中的未来扩展建立多个 Gateway、Registry 和 Provider 层。",
            "state": "抽象缺少需求依据",
            "relation": "reject"
          },
          {
            "title": "职责跨层分散",
            "from": 1,
            "to": 2,
            "event": "SCATTER RESPONSIBILITY",
            "detail": "一个业务行为需要穿过多个薄层，真正拥有数据和规则的模块不清楚。",
            "state": "责任边界模糊",
            "relation": "reject"
          },
          {
            "title": "修改需要同步多处",
            "from": 2,
            "to": 3,
            "event": "COORDINATION COST",
            "detail": "接口和配置变多，改一个业务规则要更新多层适配和文档。",
            "state": "变化成本上升",
            "relation": "reject"
          },
          {
            "title": "回归真实变化点",
            "from": 3,
            "to": 0,
            "event": "DEEPEN THE MODULE",
            "detail": "以已知需求和变化原因重新划分模块，删除没有独立价值的层。",
            "state": "设计回到业务",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "从职责和变化原因划边界",
          "body": "模块应拥有一组相关业务规则和稳定接口，而不是仅仅按技术层拆包。每个关键数据和不变量要有明确 owner。"
        },
        {
          "title": "接口要高于实现细节",
          "body": "接口描述调用方需要的能力和保证，不暴露内部数据库表、框架对象或运行时特定细节。跨模块 seam 应可通过外部行为测试。"
        },
        {
          "title": "架构必须包含演进路径",
          "body": "设计不仅要描述理想状态，还要说明从当前实现如何迁移、如何兼容旧接口、如何回滚，以及哪些决策必须先通过原型验证。"
        }
      ],
      "related": [
        "domain",
        "adr",
        "wayfinder",
        "codegraph"
      ],
      "task": "Workspace、Runtime Adapter、Container Manager 和 Session Store 的职责交叉，需要重新确定模块边界。",
      "prompt": "基于已确认需求和现有实现提出架构方案。明确模块职责、数据所有权、接口契约、依赖方向、故障边界和渐进迁移路径。避免为尚未出现的扩展建立空泛抽象。",
      "artifact": "架构设计摘要：目标 / 模块职责 / 数据 owner / 接口 / 依赖方向 / 故障边界 / 迁移路径 / 回滚策略。",
      "sources": [
        {
          "title": "improve-codebase-architecture · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/improve-codebase-architecture/SKILL.md",
          "note": "扫描代码库架构改进机会，再由人选择深入处理。"
        },
        {
          "title": "domain-modeling · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md",
          "note": "可由模型或用户调用的领域建模能力。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "change-control",
      "group": 0,
      "title": "需求边界与变更控制",
      "en": "SCOPE & CHANGE CONTROL",
      "summary": "在开发过程中识别新增需求、假设变化和实现偏差，避免范围悄悄扩大。",
      "principle": "变更可以发生，但必须显式记录影响并重新获得相应授权。",
      "tradeoff": "严格控制能减少失控，但不应把合理的小修正都变成审批仪式。",
      "pitfall": "Agent 把“顺手优化”混入当前任务，或者为了让实现通过测试而悄悄改变已批准需求。",
      "nodes": [
        "批准范围",
        "新发现",
        "影响分析",
        "变更批准"
      ],
      "main": [
        {
          "title": "建立批准基线",
          "from": 0,
          "to": 1,
          "event": "BASELINE SCOPE",
          "detail": "记录目标、非目标、验收条件、实施范围和明确不允许的行为。",
          "state": "范围基线明确",
          "relation": "data"
        },
        {
          "title": "识别偏差与新需求",
          "from": 1,
          "to": 2,
          "event": "DETECT CHANGE",
          "detail": "实施中发现缺失规则、接口限制或新需求时，区分实现缺陷、规格遗漏和真正的范围变化。",
          "state": "偏差被分类",
          "relation": "check"
        },
        {
          "title": "评估影响",
          "from": 2,
          "to": 3,
          "event": "ASSESS BLAST RADIUS",
          "detail": "分析对数据、接口、测试、工期、权限和兼容性的影响，提出最小变更方案。",
          "state": "影响可见",
          "relation": "control"
        },
        {
          "title": "重新确认授权",
          "from": 3,
          "to": 3,
          "event": "APPROVE OR DEFER",
          "detail": "用户决定纳入本次、拆成后续任务或拒绝；更新 Spec / ADR / Ticket 后再继续。",
          "state": "范围变化显式批准",
          "relation": "request"
        }
      ],
      "fault": {
        "name": "顺手扩大范围并改写验收条件",
        "nodes": [
          "批准 Spec",
          "额外发现",
          "未经批准修改",
          "验收争议"
        ],
        "steps": [
          {
            "title": "发现相邻问题",
            "from": 0,
            "to": 1,
            "event": "NOTICE ADJACENT ISSUE",
            "detail": "Agent 发现附近模块可以顺便重构或添加额外字段。",
            "state": "出现额外工作",
            "relation": "check"
          },
          {
            "title": "自动扩大本次范围",
            "from": 1,
            "to": 2,
            "event": "SCOPE CREEP",
            "detail": "Agent 未告知用户就修改相邻模块、接口和数据结构。",
            "state": "授权被越界",
            "relation": "reject"
          },
          {
            "title": "验收标准被改变",
            "from": 2,
            "to": 3,
            "event": "MOVE THE GOALPOST",
            "detail": "为让新实现通过，Agent 修改原验收条件或把未实现要求标记为非目标。",
            "state": "需求与实现脱节",
            "relation": "reject"
          },
          {
            "title": "恢复变更控制",
            "from": 3,
            "to": 0,
            "event": "PROPOSE CHANGE",
            "detail": "列出原始要求、发现、影响和建议；等待用户批准并更新基线。",
            "state": "重新建立授权边界",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "偏差的三种来源",
          "body": "实现缺陷是代码没有满足 Spec；规格遗漏是原始需求没有覆盖真实边界；范围变化是用户新增或改变了目标。三者处理方式不同，不能统一用“更新文档”掩盖。"
        },
        {
          "title": "变更影响分析",
          "body": "至少检查接口兼容、数据迁移、权限、安全、测试范围、其他模块调用者和交付时间。CodeGraph 可帮助定位代码影响，但不能判断业务影响是否可接受。"
        },
        {
          "title": "授权记录",
          "body": "记录谁批准了什么范围、哪些工件随之更新。设计认可、补充说明和编码授权不是同一种授权；Agent 不得把自然语言中的赞同自动扩大解释。"
        }
      ],
      "related": [
        "grill",
        "spec",
        "adr",
        "codegraph"
      ],
      "task": "实现邀请成员功能时，Agent 发现还可以顺手把组织权限体系重构。",
      "prompt": "对实施中发现的范围外问题，先分类为实现缺陷、规格遗漏或新增需求。评估影响并提出选择，不要擅自修改批准范围或验收条件。",
      "artifact": "Change Note：原批准范围 / 新发现 / 类型 / 影响 / 建议选项 / 用户决定 / 受影响工件。",
      "sources": [
        {
          "title": "to-spec · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md",
          "note": "用户主动调用，将当前已讨论内容综合为规格，不重新访谈。"
        },
        {
          "title": "code-review · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
          "note": "双轴审查：工程标准与原始 Spec 符合性。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "task-routing",
      "group": 1,
      "title": "任务分级与工作流选择",
      "en": "TASK ROUTING",
      "summary": "根据需求清晰度、影响范围和风险，选择轻量修改、规格驱动或先研究再实施。",
      "principle": "流程复杂度应由不确定性和风险决定，而不是由工具数量决定。",
      "tradeoff": "轻流程减少开销，重流程提供更多可追溯性；关键是识别升级条件。",
      "pitfall": "所有任务都强制 Grill、Spec 和 Tickets，或所有任务都直接写代码。",
      "nodes": [
        "用户任务",
        "复杂度判断",
        "工作流选择",
        "授权执行"
      ],
      "main": [
        {
          "title": "判断需求清晰度",
          "from": 0,
          "to": 1,
          "event": "CHECK CLARITY",
          "detail": "明确目标、输入、预期结果和边界是否已经足够清楚。",
          "state": "需求清晰度已评估",
          "relation": "check"
        },
        {
          "title": "评估影响与风险",
          "from": 1,
          "to": 2,
          "event": "ASSESS BLAST RADIUS",
          "detail": "检查模块数量、数据变化、权限、安全、兼容性、可回滚性和失败代价。",
          "state": "风险等级有依据",
          "relation": "check"
        },
        {
          "title": "选择最小充分流程",
          "from": 2,
          "to": 3,
          "event": "ROUTE WORK",
          "detail": "小任务直接 implement；复杂业务先 Grill / Spec；架构未知先 Wayfinder；真实故障先 diagnosing-bugs。",
          "state": "路径与风险匹配",
          "relation": "control"
        },
        {
          "title": "声明授权和退出条件",
          "from": 3,
          "to": 3,
          "event": "SET AUTHORITY",
          "detail": "说明本次授权包含哪些步骤、哪些节点必须停下，以及何时升级流程。",
          "state": "执行边界清晰",
          "relation": "request"
        }
      ],
      "fault": {
        "name": "仅按任务大小选择流程",
        "nodes": [
          "任务描述",
          "错误分类",
          "不匹配流程",
          "质量风险"
        ],
        "steps": [
          {
            "title": "只看改动行数",
            "from": 0,
            "to": 1,
            "event": "SIZE-ONLY HEURISTIC",
            "detail": "Agent 认为只有一行 SQL，因此认定风险低，却忽略它改变了权限或数据语义。",
            "state": "风险因素被忽略",
            "relation": "check"
          },
          {
            "title": "跳过必要澄清",
            "from": 1,
            "to": 2,
            "event": "SKIP DISCOVERY",
            "detail": "高不确定性任务直接进入实现，重要规则由 Agent 自行假设。",
            "state": "错误路径被选中",
            "relation": "reject"
          },
          {
            "title": "流程复杂度失衡",
            "from": 2,
            "to": 3,
            "event": "TOO HEAVY OR TOO LIGHT",
            "detail": "小修改被复杂流程拖慢，或高风险修改缺少规格和决策记录。",
            "state": "成本与风险不匹配",
            "relation": "reject"
          },
          {
            "title": "按不确定性和风险重选",
            "from": 3,
            "to": 0,
            "event": "RE-ROUTE",
            "detail": "结合需求清晰度、影响范围和可逆性重新选择最小充分流程。",
            "state": "工作流选择可解释",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "四个判断维度",
          "body": "需求清晰度决定是否需要 Grill；影响范围决定是否需要 Spec / Tickets；架构未知决定是否需要 Wayfinder / Research；失败代价和可逆性决定人工确认与验证强度。"
        },
        {
          "title": "六条常用路径",
          "body": "快速修改、需求探索、常规功能开发、大型架构、复杂 Bug、架构重构。它们是可组合的场景模板，不是每个任务都必须经过的固定流水线。"
        },
        {
          "title": "升级与降级",
          "body": "小任务发现跨模块数据变更时升级；大型任务的某个已明确子任务可以单独 implement；根因明确的 Bug 可从诊断流程收敛到小修复。Agent 可以建议路由，但用户掌握工作流入口和授权。"
        }
      ],
      "related": [
        "spec",
        "grill",
        "wayfinder",
        "bug"
      ],
      "task": "收到“帮我优化一下 Workspace”这种描述，先判断应直接改、需求访谈、规格驱动还是先研究。",
      "prompt": "先阅读项目规范并分析任务。根据需求清晰度、影响范围、架构未知和失败代价推荐最小充分工作流。给出判断依据、建议路径、授权边界和需要我决定的问题；不要仅凭改动行数判断风险。",
      "artifact": "路由记录：目标 / 清晰度 / 影响范围 / 风险 / 可逆性 / 推荐工作流 / 授权边界 / 升级条件。",
      "sources": [
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        },
        {
          "title": "grill-with-docs · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md",
          "note": "用户主动调用的需求访谈入口；会结合 grilling 与 domain-modeling。"
        },
        {
          "title": "wayfinder · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md",
          "note": "用户主动调用的决策地图工作流，默认规划而非直接实施。"
        }
      ]
    },
    {
      "id": "spec",
      "group": 1,
      "title": "Spec 规格设计",
      "en": "SPEC DESIGN",
      "summary": "把已确认的业务意图转成可跨会话阅读、可实施、可逐条验收的变更规格。",
      "principle": "Spec 是一次变更的决策快照，不是源代码注释或实现计划的替代品。",
      "tradeoff": "规格越完整越利于交接，但不应把每个内部函数和文件路径写死。",
      "pitfall": "只写 happy path，遗漏默认值、负面要求、异常状态和验收条件。",
      "nodes": [
        "已确认需求",
        "Feature Spec",
        "验收条件",
        "实施基线"
      ],
      "main": [
        {
          "title": "恢复已确认上下文",
          "from": 0,
          "to": 1,
          "event": "READ SOURCE CONTEXT",
          "detail": "读取 Grill 记录、GLOSSARY、ADR、模块知识和现有实现；区分确认内容与假设。",
          "state": "输入上下文齐全",
          "relation": "data"
        },
        {
          "title": "综合用户行为",
          "from": 1,
          "to": 2,
          "event": "SYNTHESIZE REQUIREMENTS",
          "detail": "使用 to-spec 综合问题陈述、用户故事、行为规则、边界、非目标和实现决策，不重新访谈。",
          "state": "需求形成结构",
          "relation": "control"
        },
        {
          "title": "定义测试决策",
          "from": 2,
          "to": 3,
          "event": "DEFINE ACCEPTANCE",
          "detail": "为关键行为写可观察验收条件，覆盖失败路径、权限、数据和兼容性；说明测试 seam。",
          "state": "需求可验证",
          "relation": "check"
        },
        {
          "title": "逐项核对并确认",
          "from": 3,
          "to": 3,
          "event": "REVIEW SPEC",
          "detail": "与原始访谈逐条比对默认值、约束、否定要求和边界；需要用户决定的接口 seam 先确认。",
          "state": "规格成为批准基线",
          "relation": "request"
        }
      ],
      "fault": {
        "name": "Spec 只剩概括，丢失关键约束",
        "nodes": [
          "Grill 回答",
          "压缩摘要",
          "遗漏约束",
          "错误实现"
        ],
        "steps": [
          {
            "title": "访谈中有具体规则",
            "from": 0,
            "to": 1,
            "event": "CAPTURE DETAIL",
            "detail": "用户明确邀请过期不可复用、同一邮箱不可重复邀请，但这些细节没有被标记为必须保留。",
            "state": "细节存在于会话",
            "relation": "data"
          },
          {
            "title": "Spec 过度压缩",
            "from": 1,
            "to": 2,
            "event": "OVER-SUMMARIZE",
            "detail": "规格只写“邀请有有效期”，没有默认时长、重复邀请和过期行为。",
            "state": "关键条件丢失",
            "relation": "reject"
          },
          {
            "title": "测试跟随不完整规格",
            "from": 2,
            "to": 3,
            "event": "TEST THE WRONG CONTRACT",
            "detail": "测试只验证邀请创建成功，遗漏过期、重复和撤销行为。",
            "state": "错误规格被验证",
            "relation": "reject"
          },
          {
            "title": "回看原始来源",
            "from": 3,
            "to": 0,
            "event": "TRACE BACK TO DECISIONS",
            "detail": "把每条关键回答映射到 Spec 章节和验收条件，缺失内容补回并请求确认。",
            "state": "需求可追溯",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "Spec 应包含什么",
          "body": "Problem Statement、用户故事、行为规则、默认值、权限、异常路径、边界、非目标、实现决策和 Testing Decisions。具体结构可随项目调整，但必须能回答用户要什么、什么不做、如何证明。"
        },
        {
          "title": "需求与实现决策分开",
          "body": "业务需求描述用户可观察行为；实现决策说明模块、接口、数据和技术方案。不要把临时实现细节伪装成用户需求，也不要让代码反过来定义原始需求。"
        },
        {
          "title": "可追溯性",
          "body": "关键需求应关联验收条件、Ticket 和测试证据。Spec 不必枚举所有函数，但要保留足以让新会话理解目标和约束的决策上下文。"
        }
      ],
      "related": [
        "grill",
        "tickets",
        "spec-compliance",
        "delivery"
      ],
      "task": "根据已经确认的 Workspace 邀请规则，生成正式 Feature Spec，供新会话接续实施。",
      "prompt": "调用 /to-spec。不要重新访谈；综合当前会话和项目知识，写清 Problem Statement、User Stories、Implementation Decisions、Testing Decisions、Out of Scope。逐条保留原始约束、默认值、负面要求和异常路径，并指出需要我确认的测试 seam。",
      "artifact": "Feature Spec：问题 / 用户故事 / 规则与默认值 / 权限与异常 / 实现决策 / 测试决策 / 非目标 / 未决项。",
      "sources": [
        {
          "title": "to-spec · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md",
          "note": "用户主动调用，将当前已讨论内容综合为规格，不重新访谈。"
        },
        {
          "title": "grill-with-docs · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md",
          "note": "用户主动调用的需求访谈入口；会结合 grilling 与 domain-modeling。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "tickets",
      "group": 1,
      "title": "Tickets 任务拆解",
      "en": "TICKET DECOMPOSITION",
      "summary": "把批准的 Spec 拆成小而完整、可独立演示和验证的纵向任务，并显式声明依赖。",
      "principle": "Ticket 是可交付行为切片，不是按前端、后端、数据库分层的工作清单。",
      "tradeoff": "更小的切片更容易并行和恢复，但切得过细会增加协调成本。",
      "pitfall": "任务只描述技术层工作，没有用户可观察结果或验收条件。",
      "nodes": [
        "批准 Spec",
        "纵向切片",
        "阻塞关系",
        "可执行任务图"
      ],
      "main": [
        {
          "title": "识别端到端行为",
          "from": 0,
          "to": 1,
          "event": "FIND TRACER BULLETS",
          "detail": "从用户故事中找出可以独立演示的最小完整路径，而非先按目录或技术层拆分。",
          "state": "交付切片已识别",
          "relation": "check"
        },
        {
          "title": "拆分任务与验收",
          "from": 1,
          "to": 2,
          "event": "WRITE TICKETS",
          "detail": "每张 Ticket 写清目标行为、范围、验收条件、测试和上下文指针。",
          "state": "任务可独立验证",
          "relation": "control"
        },
        {
          "title": "建立阻塞边",
          "from": 2,
          "to": 3,
          "event": "DECLARE DEPENDENCIES",
          "detail": "标记真正阻塞关系，区分前置接口、数据模型和可并行工作。",
          "state": "依赖图明确",
          "relation": "control"
        },
        {
          "title": "检查粒度与排序",
          "from": 3,
          "to": 3,
          "event": "QUIZ THE BREAKDOWN",
          "detail": "确认每个任务适合一个新鲜上下文完成，且完成后能独立验证；宽重构采用 expand-contract。",
          "state": "任务图可执行",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "按技术层拆票，无法形成可演示切片",
        "nodes": [
          "Feature Spec",
          "数据库票",
          "API 票",
          "UI 票"
        ],
        "steps": [
          {
            "title": "先按目录分工",
            "from": 0,
            "to": 1,
            "event": "HORIZONTAL SLICING",
            "detail": "把数据库、API、UI 各自拆票，彼此依赖但没有完整用户路径。",
            "state": "任务按层分割",
            "relation": "control"
          },
          {
            "title": "集成风险推迟",
            "from": 1,
            "to": 2,
            "event": "INTEGRATION DEBT",
            "detail": "每张票都可能单独“完成”，但没有可用的端到端功能。",
            "state": "无法独立验收",
            "relation": "reject"
          },
          {
            "title": "最后才发现接口不匹配",
            "from": 2,
            "to": 3,
            "event": "LATE CONTRACT MISMATCH",
            "detail": "数据契约、错误语义和 UI 状态在集成阶段冲突。",
            "state": "返工集中爆发",
            "relation": "reject"
          },
          {
            "title": "改为纵向切片",
            "from": 3,
            "to": 0,
            "event": "TRACER BULLETS",
            "detail": "按一个用户可观察行为切穿必要层次，并显式声明后续切片依赖。",
            "state": "每票可独立演示",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "Tracer-bullet 纵向切片",
          "body": "每个 Ticket 应完成一条窄而完整的行为路径，可能同时涉及 Schema、API、UI 和测试。不要为了“每票只改一个目录”而失去独立验收能力。"
        },
        {
          "title": "阻塞关系与并行前提",
          "body": "依赖边表示真正不能开始的前置条件。并行前要检查共享文件、接口契约、数据库变更和合并风险；任务数量多不代表适合并行。"
        },
        {
          "title": "宽重构例外",
          "body": "机械性全局改动无法切成独立绿灯的纵向功能时，采用 expand–migrate–contract：先扩展兼容形态，再分批迁移，最后删除旧形态。"
        }
      ],
      "related": [
        "spec",
        "multi-agent",
        "tdd",
        "delivery"
      ],
      "task": "把 Workspace 邀请 Spec 拆成可独立完成的任务，并明确哪些票能并行。",
      "prompt": "调用 /to-tickets。按 tracer-bullet 原则拆分纵向任务，每票必须可独立演示或验证；写明阻塞边、验收条件、测试 seam 和上下文链接。识别共享文件与宽重构，不要机械地按前后端分票。",
      "artifact": "Ticket：标题 / 用户可见交付 / 范围 / 验收 / 测试 / 阻塞于 / 上下文指针 / 风险。",
      "sources": [
        {
          "title": "to-tickets · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md",
          "note": "用户主动调用，将计划拆成带阻塞关系的 tracer-bullet tickets。"
        },
        {
          "title": "implement-spec · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md",
          "note": "用户主动调用，按任务图在集成分支上实施整个 Spec。"
        }
      ]
    },
    {
      "id": "tdd",
      "group": 1,
      "title": "TDD 与垂直切片实施",
      "en": "TDD & IMPLEMENTATION",
      "summary": "通过短反馈循环让 Agent 每次只实现一个可观察行为，并在小步中发现设计问题。",
      "principle": "先建立失败反馈，再写最小实现；测试应验证外部行为，而不是内部实现细节。",
      "tradeoff": "测试 seam 越高越接近真实行为，但运行成本和定位难度也会增加。",
      "pitfall": "先写实现再补一个总能通过的测试，或过度 Mock 把真正故障边界隔离掉。",
      "nodes": [
        "验收行为",
        "失败测试",
        "最小实现",
        "绿色回归"
      ],
      "main": [
        {
          "title": "选择最高合理测试 seam",
          "from": 0,
          "to": 1,
          "event": "PICK TEST SEAM",
          "detail": "从批准 Spec 中选择可观察行为，优先已有接口和真实边界，避免新增不必要抽象。",
          "state": "测试边界已确定",
          "relation": "check"
        },
        {
          "title": "先写失败测试",
          "from": 1,
          "to": 2,
          "event": "RED",
          "detail": "编写能在当前代码上稳定失败的测试，确认失败原因正是缺失行为。",
          "state": "真实失败已复现",
          "relation": "request"
        },
        {
          "title": "最小实现转绿",
          "from": 2,
          "to": 3,
          "event": "GREEN",
          "detail": "只实现让当前测试通过的最小代码；保持 Diff 小，避免顺手扩展范围。",
          "state": "行为通过测试",
          "relation": "control"
        },
        {
          "title": "重构并复测",
          "from": 3,
          "to": 3,
          "event": "REFACTOR",
          "detail": "在绿色保护下改善结构，运行相关测试并检查是否保留原始行为。",
          "state": "反馈循环闭合",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "测试先通过，无法证明需求缺失",
        "nodes": [
          "需求行为",
          "未失败测试",
          "实现代码",
          "虚假绿色"
        ],
        "steps": [
          {
            "title": "测试没有先变红",
            "from": 0,
            "to": 1,
            "event": "NO RED BASELINE",
            "detail": "测试写完就通过，无法证明它捕获了当前缺失行为。",
            "state": "测试有效性未知",
            "relation": "check"
          },
          {
            "title": "Mock 掉关键边界",
            "from": 1,
            "to": 2,
            "event": "MOCK AWAY FAILURE",
            "detail": "测试替换掉数据库、事件或权限层，真正的集成故障被隐藏。",
            "state": "反馈与真实系统脱节",
            "relation": "reject"
          },
          {
            "title": "实现与测试共享错误假设",
            "from": 2,
            "to": 3,
            "event": "SELF-CONFIRMING TEST",
            "detail": "测试断言复制实现逻辑，二者一起通过却不符合用户需求。",
            "state": "错误实现呈绿色",
            "relation": "reject"
          },
          {
            "title": "重新建立可信反馈",
            "from": 3,
            "to": 0,
            "event": "RESTORE RED-GREEN",
            "detail": "确认测试先红、再由实现转绿；重要跨层行为增加集成或 E2E 验证。",
            "state": "测试能捕获目标行为",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "测试应该验证什么",
          "body": "测试外部可观察行为、业务不变量和契约，不测试私有函数调用顺序或当前类结构。实现重构后，行为测试应继续有效。"
        },
        {
          "title": "测试 seam 的选择",
          "body": "优先使用已有最高合理 seam：公共接口、应用服务、真实数据库集成或浏览器用户路径。低层单测适合快速定位，但不能替代跨边界验证。"
        },
        {
          "title": "Red-Green-Refactor 的证据",
          "body": "记录测试先失败的原因、实现后通过的结果、重构后的回归结果。若无法构建真实失败循环，说明测试设计或可观测边界还需调整。"
        }
      ],
      "related": [
        "spec",
        "tickets",
        "test-strategy",
        "bug"
      ],
      "task": "实现一个邀请过期后不可接受的规则，并确保测试能在旧代码上失败。",
      "prompt": "按 TDD red-green-refactor 工作。先从已批准验收条件选择最高合理 seam，写出稳定失败的测试并说明失败原因；再做最小实现，最后重构并运行相关回归。不要把测试改成迎合当前实现。",
      "artifact": "测试证据：Given / When / Then / 初始失败输出 / 实现后通过 / 重构后回归。",
      "sources": [
        {
          "title": "tdd · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
          "note": "可由模型或用户调用，采用 red-green-refactor 反馈循环。"
        },
        {
          "title": "implement · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md",
          "note": "用户主动调用，实施 Spec 或 Ticket 中定义的工作。"
        }
      ]
    },
    {
      "id": "multi-agent",
      "group": 1,
      "title": "多 Agent 协作与 Implement-spec",
      "en": "MULTI-AGENT EXECUTION",
      "summary": "当任务图稳定且边界可隔离时，让多个新鲜上下文并行完成纵向任务，再有序集成。",
      "principle": "并行的前提是任务独立、接口清楚和文件所有权明确，而不是任务数量多。",
      "tradeoff": "并行能缩短等待，但会增加协调、合并、上下文和审查成本。",
      "pitfall": "多个 Agent 同时修改共享接口或文件，导致任务完成却无法集成。",
      "nodes": [
        "批准任务图",
        "Ready Frontier",
        "隔离实施",
        "集成与审查"
      ],
      "main": [
        {
          "title": "确认任务图稳定",
          "from": 0,
          "to": 1,
          "event": "READ TASK GRAPH",
          "detail": "读取 Spec、Tickets 和阻塞边，确认当前 Ready Frontier 以及接口契约。",
          "state": "可执行任务明确",
          "relation": "check"
        },
        {
          "title": "划分工作区与所有权",
          "from": 1,
          "to": 2,
          "event": "ISOLATE IMPLEMENTERS",
          "detail": "每个实现 Agent 使用新鲜上下文和独立工作区；明确文件所有权、分支基线和上下文指针。",
          "state": "并行边界清楚",
          "relation": "control"
        },
        {
          "title": "按依赖推进与合并",
          "from": 2,
          "to": 3,
          "event": "MERGE FRONTIER",
          "detail": "完成任务后先检查、合并到集成分支，再根据新 Frontier 启动后续任务。",
          "state": "集成分支持续可验证",
          "relation": "data"
        },
        {
          "title": "整体审查与回归",
          "from": 3,
          "to": 3,
          "event": "INTEGRATION REVIEW",
          "detail": "全部任务完成后做全局 Code Review、集成测试和 Spec Compliance，不能用子 Agent 局部通过替代整体验收。",
          "state": "集成交付通过",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "多个 Agent 共享同一修改边界",
        "nodes": [
          "任务图",
          "并行 Agent",
          "共享文件冲突",
          "集成失败"
        ],
        "steps": [
          {
            "title": "任务边界未稳定",
            "from": 0,
            "to": 1,
            "event": "UNCLEAR CONTRACT",
            "detail": "Ticket 仍依赖未确定接口和数据模型，却提前并行。",
            "state": "并行前提不足",
            "relation": "check"
          },
          {
            "title": "多个 Agent 修改同一接口",
            "from": 1,
            "to": 2,
            "event": "SHARED OWNERSHIP",
            "detail": "不同 Agent 基于不同假设修改共享 Service、Schema 或类型定义。",
            "state": "冲突与漂移产生",
            "relation": "reject"
          },
          {
            "title": "局部测试均通过",
            "from": 2,
            "to": 3,
            "event": "LOCAL GREEN",
            "detail": "每个工作区单独测试通过，但合并后接口和行为不一致。",
            "state": "局部绿灯不等于集成",
            "relation": "reject"
          },
          {
            "title": "先稳定契约再并行",
            "from": 3,
            "to": 0,
            "event": "SERIALIZE SHARED SEAMS",
            "detail": "先完成共享接口和前置票，再并行隔离任务；最终由集成分支统一验证。",
            "state": "并行边界重新清晰",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "何时值得并行",
          "body": "任务之间依赖少、接口契约稳定、文件冲突低、可独立测试，且节省的等待时间大于协调成本时再并行。"
        },
        {
          "title": "Implement-spec 的 task graph",
          "body": "它不是按列表顺序执行 Tickets，而是根据 blocking edges 持续推进 Ready Frontier。每个实现 Agent 从集成分支最新状态开始，完成后合并回集成分支。"
        },
        {
          "title": "集成质量责任",
          "body": "子 Agent 负责自己的切片，主 Agent 仍负责集成、整体 Code Review、全量测试和规格符合性。最终交付不能仅汇总各 Agent 的“完成”消息。"
        }
      ],
      "related": [
        "tickets",
        "tdd",
        "review",
        "delivery"
      ],
      "task": "Workspace 邀请功能有 6 张 Tickets，其中邮件模板和前端列表可并行，但共享 API 契约必须先确定。",
      "prompt": "先检查 Spec、Ticket 阻塞图和共享文件。评估 Ready Frontier，明确每个 Agent 的工作区、文件所有权、接口契约和验证方式。只有隔离条件满足才使用 implement-spec；最终必须在集成分支统一 Review 和回归。",
      "artifact": "并行计划：Ready Frontier / Agent 任务 / 工作区与分支 / 文件所有权 / 阻塞边 / 合并顺序 / 集成验收。",
      "sources": [
        {
          "title": "implement-spec · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md",
          "note": "用户主动调用，按任务图在集成分支上实施整个 Spec。"
        },
        {
          "title": "to-tickets · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md",
          "note": "用户主动调用，将计划拆成带阻塞关系的 tracer-bullet tickets。"
        },
        {
          "title": "code-review · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
          "note": "双轴审查：工程标准与原始 Spec 符合性。"
        }
      ]
    },
    {
      "id": "review",
      "group": 1,
      "title": "Code Review 与规格符合性",
      "en": "CODE REVIEW & SPEC COMPLIANCE",
      "summary": "独立检查代码是否符合工程标准，以及实现是否忠实满足原始 Spec。",
      "principle": "标准正确与需求正确是两条不同的审查轴。",
      "tradeoff": "独立审查需要额外成本，但能发现实现者自我验证盲区。",
      "pitfall": "只检查代码风格或测试是否通过，不逐条核对需求和非目标。",
      "nodes": [
        "变更 Diff",
        "Standards Review",
        "Spec Review",
        "问题修复"
      ],
      "main": [
        {
          "title": "固定审查范围",
          "from": 0,
          "to": 1,
          "event": "SET REVIEW BASELINE",
          "detail": "明确审查基线、变更 Diff、批准 Spec、项目标准和相关测试证据。",
          "state": "审查输入完整",
          "relation": "check"
        },
        {
          "title": "审查工程标准",
          "from": 1,
          "to": 2,
          "event": "STANDARDS AXIS",
          "detail": "检查复杂度、职责、错误处理、安全、性能、命名、重复和项目规范。",
          "state": "工程问题被识别",
          "relation": "check"
        },
        {
          "title": "审查 Spec 符合性",
          "from": 2,
          "to": 3,
          "event": "SPEC AXIS",
          "detail": "逐条映射需求、非目标、边界和验收条件到实现与测试；标出遗漏和偏差。",
          "state": "需求覆盖可追溯",
          "relation": "check"
        },
        {
          "title": "修复并复审",
          "from": 3,
          "to": 3,
          "event": "FIX / RE-REVIEW",
          "detail": "按严重度修复问题，重新运行受影响测试并复审关键 Diff。",
          "state": "审查闭环完成",
          "relation": "control"
        }
      ],
      "fault": {
        "name": "只看 Diff 和测试绿灯",
        "nodes": [
          "代码 Diff",
          "风格审查",
          "遗漏需求",
          "未发现偏差"
        ],
        "steps": [
          {
            "title": "审查只关注局部代码",
            "from": 0,
            "to": 1,
            "event": "LOCAL DIFF ONLY",
            "detail": "Review 只指出命名和格式问题，没有阅读原始 Spec。",
            "state": "需求上下文缺失",
            "relation": "check"
          },
          {
            "title": "遗漏非目标和边界",
            "from": 1,
            "to": 2,
            "event": "MISS SPEC EDGE",
            "detail": "代码满足 happy path，却违反权限边界、默认值或明确的 Out of Scope。",
            "state": "规格偏差漏检",
            "relation": "reject"
          },
          {
            "title": "测试绿灯造成错觉",
            "from": 2,
            "to": 3,
            "event": "GREEN TESTS MISLEAD",
            "detail": "现有测试没有覆盖遗漏条件，Review 因测试通过而放过变更。",
            "state": "质量风险残留",
            "relation": "reject"
          },
          {
            "title": "双轴独立复核",
            "from": 3,
            "to": 0,
            "event": "REVIEW BOTH AXES",
            "detail": "分别列出 Standards 与 Spec Compliance 发现，逐项关联实现和测试证据。",
            "state": "审查覆盖完整",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "Standards 轴",
          "body": "关注代码是否符合项目标准和良好设计：模块深度、接口、错误处理、可读性、重复、复杂度、安全和性能。不要把个人偏好伪装成阻断问题。"
        },
        {
          "title": "Spec 轴",
          "body": "回到原始问题、用户故事、约束、非目标和验收条件。每条要求都应能指向实现位置和验证证据；没有证据的要求标记为未验证。"
        },
        {
          "title": "Review 不替代测试与验收",
          "body": "审查是独立推理检查，不能证明代码真实运行；测试不能证明业务意图完整；最终用户验收也不能替代安全和工程审查。"
        }
      ],
      "related": [
        "spec",
        "tdd",
        "spec-compliance",
        "delivery"
      ],
      "task": "邀请功能实现完成，要求在提交前做一次独立双轴审查。",
      "prompt": "请以固定基线执行独立 Code Review。分别输出 Standards 和 Spec Compliance 两轴发现；每项标明严重度、文件位置、依据、影响和建议。逐条映射批准 Spec 与验收条件，不能仅以测试通过判定符合。",
      "artifact": "Standards Review / Spec Review / 问题修复记录",
      "sources": [
        {
          "title": "code-review · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
          "note": "双轴审查：工程标准与原始 Spec 符合性。"
        },
        {
          "title": "to-spec · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md",
          "note": "用户主动调用，将当前已讨论内容综合为规格，不重新访谈。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "cross-session",
      "group": 1,
      "title": "跨会话接续与项目知识",
      "en": "CROSS-SESSION HANDOFF",
      "summary": "让一个没有参与过之前开发的新会话，快速恢复业务意图、决策背景和当前实现。",
      "principle": "长期知识必须有明确来源；不要把完整会话历史或代码清单复制进提示词。",
      "tradeoff": "少量高价值知识文档与自动代码索引组合，比维护一套重复的代码百科成本更低。",
      "pitfall": "把 CodeGraph 当成业务知识库，或把 Spec 当成永远正确的当前实现说明。",
      "nodes": [
        "项目知识",
        "新会话读取",
        "CodeGraph 探索",
        "当前事实核对"
      ],
      "main": [
        {
          "title": "读取项目入口规范",
          "from": 0,
          "to": 1,
          "event": "LOAD AGENTS / INDEX",
          "detail": "先读 AGENTS.md、README 和项目约定，确认语言、测试、目录和工作流规则。",
          "state": "工程规则已加载",
          "relation": "data"
        },
        {
          "title": "恢复业务意图",
          "from": 1,
          "to": 2,
          "event": "LOAD DOMAIN KNOWLEDGE",
          "detail": "按当前任务读取 GLOSSARY、模块知识、ADR 和相关 Feature Spec。",
          "state": "为什么这样设计可理解",
          "relation": "data"
        },
        {
          "title": "探索当前代码事实",
          "from": 2,
          "to": 3,
          "event": "QUERY CODEGRAPH",
          "detail": "使用 CodeGraph 找符号、调用链、路由和影响范围，再阅读关键源码、SQL、Migration 与测试。",
          "state": "当前实现被核对",
          "relation": "check"
        },
        {
          "title": "形成差异与接续计划",
          "from": 3,
          "to": 3,
          "event": "RECONCILE STATE",
          "detail": "区分文档意图、当前代码事实和未知推断；记录差异、下一步和需确认事项。",
          "state": "会话可安全接续",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "新会话只读旧 Spec，不检查当前实现",
        "nodes": [
          "历史 Spec",
          "代码已变化",
          "过时理解",
          "错误修改"
        ],
        "steps": [
          {
            "title": "只读取旧文档",
            "from": 0,
            "to": 1,
            "event": "TRUST STALE SPEC",
            "detail": "新 Agent 直接依赖旧 Spec，没有检查后续变更和 ADR。",
            "state": "知识快照过时",
            "relation": "check"
          },
          {
            "title": "忽略当前调用关系",
            "from": 1,
            "to": 2,
            "event": "SKIP CODE EXPLORATION",
            "detail": "接口、Service 或数据库逻辑已经改变，但 Agent 沿用旧文件路径和结构。",
            "state": "实现理解错误",
            "relation": "reject"
          },
          {
            "title": "基于过时假设修改",
            "from": 2,
            "to": 3,
            "event": "MODIFY WRONG SEAM",
            "detail": "修改了已迁移或已废弃的模块，造成重复逻辑或回归。",
            "state": "接续失败",
            "relation": "reject"
          },
          {
            "title": "交叉核对意图与实现",
            "from": 3,
            "to": 0,
            "event": "RECONCILE DOCS AND CODE",
            "detail": "读取最新模块知识与 ADR，CodeGraph 定位当前链路，关键行为回到源码和测试核实。",
            "state": "接续依据可靠",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "业务知识和代码知识分工",
          "body": "GLOSSARY、ADR、Spec、Module Knowledge 保存经确认的意图与决策；CodeGraph 自动索引当前代码符号和关系。两者互补，不重复维护。"
        },
        {
          "title": "新会话的最小读取顺序",
          "body": "先 AGENTS.md 与项目入口，再读取相关模块知识和 ADR，再读相关 Spec / Ticket，最后用 CodeGraph 探索具体调用链并核对关键源码。不要一上来扫描全仓库。"
        },
        {
          "title": "知识同步闭环",
          "body": "重要功能验收后执行 Knowledge Reconciliation：对照批准 Spec、实际 Diff、Migration、测试和用户反馈，更新业务规则、ADR 与模块知识。CodeGraph 索引由工具维护，不手工复制调用图。"
        }
      ],
      "related": [
        "delivery",
        "codegraph",
        "adr",
        "spec"
      ],
      "task": "三个月后新开 Codex 会话，询问 Workspace 模块的目标、API、SQL 和 Runtime 绑定规则。",
      "prompt": "请按跨会话恢复顺序工作：先读 AGENTS.md，再读 Workspace 模块知识、GLOSSARY、ADR 和相关 Spec；使用 CodeGraph 探索 API 到 Service / Repository 的调用链；关键 SQL、Migration 和状态规则必须核对源码。分别标注文档意图、当前实现事实和未知项。",
      "artifact": "Module Knowledge：模块目标 / 职责 / 业务规则 / 状态转换 / API 入口 / 数据与 SQL 位置 / 关键 ADR / 测试入口 / 已知差异。",
      "sources": [
        {
          "title": "CodeGraph",
          "url": "https://github.com/colbymchenry/codegraph",
          "note": "本地代码知识图谱与 MCP 探索工具；结构线索需要回到源码核实。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "delivery",
      "group": 1,
      "title": "交付、验收与知识同步",
      "en": "DELIVERY & KNOWLEDGE RECONCILIATION",
      "summary": "把代码完成、自动化验证、规格审查、人工验收和长期知识更新作为不同状态管理。",
      "principle": "交付不是代码写完，而是用户可观察目标得到验证，知识也能被下一会话接续。",
      "tradeoff": "更完整的交付记录增加少量成本，但能减少“已完成”含义不清和后续排障成本。",
      "pitfall": "测试通过就宣布最终验收完成，或代码合并后不更新业务知识。",
      "nodes": [
        "批准规格",
        "验证证据",
        "人工验收",
        "知识更新"
      ],
      "main": [
        {
          "title": "核对交付范围",
          "from": 0,
          "to": 1,
          "event": "CHECK APPROVED SCOPE",
          "detail": "对照 Spec、Tickets 和变更 Diff，确认本次范围、未完成项和明确非目标。",
          "state": "交付范围清楚",
          "relation": "check"
        },
        {
          "title": "收集自动化证据",
          "from": 1,
          "to": 2,
          "event": "RUN VERIFICATION",
          "detail": "执行相关单元、集成、E2E、静态检查和构建；记录真实命令、环境和结果。",
          "state": "自动化验证有证据",
          "relation": "data"
        },
        {
          "title": "完成规格与人工验收",
          "from": 2,
          "to": 3,
          "event": "ACCEPT BEHAVIOUR",
          "detail": "独立核对需求覆盖；需要人工验证的真实使用场景交给用户确认。",
          "state": "验收状态分别记录",
          "relation": "request"
        },
        {
          "title": "同步长期知识",
          "from": 3,
          "to": 3,
          "event": "UPDATE KNOWLEDGE",
          "detail": "更新受影响模块知识、GLOSSARY 和 ADR；记录代码事实、未解决差异和后续任务。",
          "state": "下一会话可接续",
          "relation": "data"
        }
      ],
      "fault": {
        "name": "把自动化通过当成最终交付",
        "nodes": [
          "自动化测试",
          "规格审查",
          "真实用户场景",
          "错误完成状态"
        ],
        "steps": [
          {
            "title": "单元与集成测试通过",
            "from": 0,
            "to": 1,
            "event": "AUTOMATED GREEN",
            "detail": "现有测试全部通过，但只覆盖实现者已经想到的断言。",
            "state": "自动化验证通过",
            "relation": "data"
          },
          {
            "title": "规格审查未执行",
            "from": 1,
            "to": 2,
            "event": "NO REQUIREMENT TRACE",
            "detail": "没有逐条检查原始需求、非目标和验收条件。",
            "state": "规格符合性未知",
            "relation": "check"
          },
          {
            "title": "人工场景仍然失败",
            "from": 2,
            "to": 3,
            "event": "USER ACCEPTANCE FAILS",
            "detail": "真实操作中发现状态、权限、交互或错误提示与预期不一致。",
            "state": "业务验收失败",
            "relation": "reject"
          },
          {
            "title": "区分状态并回到问题",
            "from": 3,
            "to": 0,
            "event": "REOPEN THE RIGHT LOOP",
            "detail": "记录自动化通过但人工验收失败，复现问题并回到 Bug / Spec 修正流程。",
            "state": "完成状态诚实",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "交付状态不要合并",
          "body": "Automated Verified 表示约定范围的自动化检查通过；Spec Reviewed 表示需求和实现经过对照；Human Accepted 表示用户确认真实行为；Knowledge Reconciled 表示长期知识已同步。四者不能互相替代。"
        },
        {
          "title": "验收场景从需求产生",
          "body": "在 Spec 阶段定义 Given / When / Then 和失败路径。测试应从用户可观察结果推导，不要在代码完成后反向设计容易通过的测试。"
        },
        {
          "title": "交付报告要可核查",
          "body": "列出变更摘要、执行命令、测试结果、审查结果、人工验收状态、知识更新和未解决风险。没有执行的测试必须明确写未执行。"
        }
      ],
      "related": [
        "spec",
        "review",
        "cross-session",
        "test-strategy"
      ],
      "task": "Workspace 邀请功能的自动化测试通过，准备向用户交付并保证新会话能接续。",
      "prompt": "请按交付协议对照批准 Spec、Tickets 和实际 Diff。执行适用测试并记录真实输出；分别报告 Automated Verified、Spec Reviewed、Human Accepted、Knowledge Reconciled。人工验收未完成时不得标记最终业务验收通过。",
      "artifact": "交付报告：变更 / Spec 覆盖 / 测试命令与结果 / Review / 人工验收 / 知识更新 / 未解决风险。",
      "sources": [
        {
          "title": "implement · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md",
          "note": "用户主动调用，实施 Spec 或 Ticket 中定义的工作。"
        },
        {
          "title": "code-review · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
          "note": "双轴审查：工程标准与原始 Spec 符合性。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "bug",
      "group": 2,
      "title": "Bug 诊断与真实复现",
      "en": "BUG DIAGNOSIS",
      "summary": "遇到复杂或间歇性故障时，先建立稳定反馈循环，再通过可证伪假设定位根因。",
      "principle": "先让这个 Bug 稳定变红，再讨论原因；没有复现就没有可靠修复依据。",
      "tradeoff": "诊断前置会增加短期时间，但能避免猜测式修改掩盖真实问题。",
      "pitfall": "看到异常日志就直接改超时、重试或吞掉错误，没有验证根因。",
      "nodes": [
        "用户症状",
        "最小复现",
        "根因假设",
        "回归修复"
      ],
      "main": [
        {
          "title": "收集真实症状",
          "from": 0,
          "to": 1,
          "event": "CAPTURE SYMPTOM",
          "detail": "记录操作、环境、版本、时间、日志和预期 / 实际差异，区分观察与推测。",
          "state": "症状可描述",
          "relation": "data"
        },
        {
          "title": "建立稳定反馈循环",
          "from": 1,
          "to": 2,
          "event": "REPRODUCE RED",
          "detail": "构建最小测试、脚本或监控断言，让原始 Bug 在当前系统中稳定失败。",
          "state": "故障可重复",
          "relation": "check"
        },
        {
          "title": "最小化并验证假设",
          "from": 2,
          "to": 3,
          "event": "MINIMIZE / HYPOTHESIZE",
          "detail": "逐步缩小输入和路径，每次验证一个根因假设，使用日志、指标和调用链提供证据。",
          "state": "根因得到证实",
          "relation": "control"
        },
        {
          "title": "修复并回归原场景",
          "from": 3,
          "to": 3,
          "event": "FIX / REGRESSION",
          "detail": "先写回归测试，再最小修复；重新执行原始复现路径并检查副作用。",
          "state": "原始故障消失",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "根据第一条日志猜原因并直接修改",
        "nodes": [
          "错误现象",
          "未经验证猜测",
          "表面修复",
          "故障复发"
        ],
        "steps": [
          {
            "title": "看到一个异常信号",
            "from": 0,
            "to": 1,
            "event": "NOTICE FIRST ERROR",
            "detail": "日志中出现 Timeout，但它可能是下游症状，而非最早故障。",
            "state": "证据尚不完整",
            "relation": "check"
          },
          {
            "title": "直接放大超时",
            "from": 1,
            "to": 2,
            "event": "PATCH SYMPTOM",
            "detail": "Agent 把超时时间调大或增加重试，没有验证请求为何没有完成。",
            "state": "症状被掩盖",
            "relation": "reject"
          },
          {
            "title": "真实根因仍存在",
            "from": 2,
            "to": 3,
            "event": "ROOT CAUSE PERSISTS",
            "detail": "负载升高或故障重现时问题再次发生，甚至资源占用更高。",
            "state": "故障未修复",
            "relation": "reject"
          },
          {
            "title": "建立反馈循环",
            "from": 3,
            "to": 0,
            "event": "REPRODUCE FIRST",
            "detail": "还原最小输入和时序，验证假设，再将原始症状固化为回归测试。",
            "state": "根因路径可验证",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "Diagnosing Bugs 的阶段纪律",
          "body": "build feedback loop → minimise → hypothesise → instrument → fix → regression-test。每一阶段产出证据，避免一次修改多个猜测。"
        },
        {
          "title": "复现可以有不同形式",
          "body": "根据故障选择单元 / 集成测试、HTTP 脚本、Playwright、事件重放、日志断言或最小人工步骤。关键是能区分修复前后的行为。"
        },
        {
          "title": "修复验证原始症状",
          "body": "新写的单元测试通过不够；必须重新执行用户最初的复现路径，并检查相关状态、日志和下游影响。若业务行为本身未定义，先回到需求澄清。"
        }
      ],
      "related": [
        "test-strategy",
        "codegraph",
        "acceptance"
      ],
      "task": "容器启动成功，但 Workspace 状态一直 Starting；自动化测试通过，真实环境偶尔显示 Failed。",
      "prompt": "使用 diagnosing-bugs。先收集真实症状和环境，建立稳定复现循环，再用 CodeGraph 定位调用链。每次只验证一个可证伪假设；确认根因后先写回归测试，再做最小修复并重跑原始用户场景。",
      "artifact": "Bug Report：症状 / 复现步骤 / 环境 / 预期与实际 / 最小失败测试 / 假设与证据 / 根因 / 修复 / 原始场景复测。",
      "sources": [
        {
          "title": "diagnosing-bugs · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/diagnosing-bugs/SKILL.md",
          "note": "困难 Bug 的复现、最小化、假设、埋点、修复和回归流程。"
        },
        {
          "title": "tdd · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
          "note": "可由模型或用户调用，采用 red-green-refactor 反馈循环。"
        },
        {
          "title": "CodeGraph",
          "url": "https://github.com/colbymchenry/codegraph",
          "note": "本地代码知识图谱与 MCP 探索工具；结构线索需要回到源码核实。"
        }
      ]
    },
    {
      "id": "test-strategy",
      "group": 2,
      "title": "测试分层与测试设计",
      "en": "TEST STRATEGY",
      "summary": "根据风险和行为边界组合单元、集成、端到端与故障测试，形成可信反馈而不是追求测试数量。",
      "principle": "测试层级应覆盖真实风险边界，Mock 不能抹掉本次要验证的关键行为。",
      "tradeoff": "高层测试更贴近用户但较慢；低层测试快且定位好，但不能单独证明系统行为。",
      "pitfall": "只看覆盖率或测试数量，不检查测试是否捕获用户真实失败。",
      "nodes": [
        "验收场景",
        "测试边界",
        "多层反馈",
        "回归证据"
      ],
      "main": [
        {
          "title": "从风险和验收推导",
          "from": 0,
          "to": 1,
          "event": "START FROM BEHAVIOUR",
          "detail": "识别关键用户路径、权限边界、数据一致性、异步时序和失败模式。",
          "state": "风险矩阵形成",
          "relation": "check"
        },
        {
          "title": "选择测试层级",
          "from": 1,
          "to": 2,
          "event": "PICK TEST LEVEL",
          "detail": "为纯逻辑选单测，为模块协作选集成，为完整用户旅程选 E2E；必要时故障注入。",
          "state": "测试边界匹配",
          "relation": "control"
        },
        {
          "title": "设计独立断言",
          "from": 2,
          "to": 3,
          "event": "ASSERT EXTERNAL EFFECT",
          "detail": "断言用户可见结果、持久化状态和外部契约，避免测试内部实现细节。",
          "state": "测试捕获目标行为",
          "relation": "check"
        },
        {
          "title": "验证测试自身可信度",
          "from": 3,
          "to": 3,
          "event": "CHALLENGE TESTS",
          "detail": "确认失败时确实能红、关键依赖未被过度 Mock、测试数据与真实约束相符。",
          "state": "反馈质量可解释",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "测试数量很多，关键用户路径仍未覆盖",
        "nodes": [
          "功能代码",
          "大量单测",
          "缺失集成边界",
          "用户故障"
        ],
        "steps": [
          {
            "title": "覆盖率看起来很高",
            "from": 0,
            "to": 1,
            "event": "HIGH UNIT COVERAGE",
            "detail": "大量测试覆盖 helper 和内部函数，但没有覆盖 API 到数据库的完整事务。",
            "state": "覆盖指标偏向局部",
            "relation": "check"
          },
          {
            "title": "关键依赖被 Mock",
            "from": 1,
            "to": 2,
            "event": "MOCKED INTEGRATION",
            "detail": "数据库、队列和权限服务都被替换，测试无法发现真实契约错误。",
            "state": "集成风险被隐藏",
            "relation": "reject"
          },
          {
            "title": "真实操作仍失败",
            "from": 2,
            "to": 3,
            "event": "END-TO-END GAP",
            "detail": "用户路径中发生事务、事件顺序或权限问题，单测无法捕获。",
            "state": "核心路径缺少证据",
            "relation": "reject"
          },
          {
            "title": "按风险补测试层",
            "from": 3,
            "to": 0,
            "event": "ADD THE RIGHT SEAM",
            "detail": "保留快速单测，同时为关键跨模块行为增加集成 / E2E 或故障验证。",
            "state": "测试组合更可信",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "测试金字塔不是配额",
          "body": "不要机械规定每层比例。根据风险选择测试：纯算法逻辑适合单测；数据库事务和 API 契约需要集成测试；用户流程、权限和页面状态需要 E2E 或人工验收。"
        },
        {
          "title": "Mock 的边界",
          "body": "Mock 外部不可控系统可以提高稳定性，但不能 Mock 掉本次要验证的核心边界。若 Bug 与真实数据库、事件顺序或 Runtime 交互有关，应保留相应真实组件。"
        },
        {
          "title": "测试质量问题",
          "body": "问三个问题：如果目标行为缺失，测试会失败吗？如果实现内部重构，测试仍然有效吗？测试失败能否说明哪个用户行为被破坏？"
        }
      ],
      "related": [
        "tdd",
        "bug",
        "spec-compliance",
        "acceptance"
      ],
      "task": "设计 Workspace 容器生命周期测试，避免只测 Service helper 而漏掉真实状态链路。",
      "prompt": "从用户验收场景和风险出发设计测试矩阵。为每条关键行为选择最高合理 seam，说明哪些依赖真实运行、哪些可以 Mock，以及测试失败能证明什么。不要以覆盖率数字替代行为覆盖。",
      "artifact": "测试矩阵：需求 / 风险 / Given-When-Then / 测试层级 / 真实依赖 / Mock 边界 / 失败含义。",
      "sources": [
        {
          "title": "tdd · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
          "note": "可由模型或用户调用，采用 red-green-refactor 反馈循环。"
        },
        {
          "title": "diagnosing-bugs · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/diagnosing-bugs/SKILL.md",
          "note": "困难 Bug 的复现、最小化、假设、埋点、修复和回归流程。"
        },
        {
          "title": "code-review · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
          "note": "双轴审查：工程标准与原始 Spec 符合性。"
        }
      ]
    },
    {
      "id": "spec-compliance",
      "group": 2,
      "title": "需求符合性与验收追踪",
      "en": "SPEC COMPLIANCE",
      "summary": "把原始需求、Spec、实现位置、测试证据和人工验收结果关联起来，识别遗漏和偏差。",
      "principle": "每条重要需求都应该能找到实现与验证证据；找不到就标记未覆盖，而不是猜测通过。",
      "tradeoff": "追踪矩阵有维护成本，但对跨会话、多人和高风险功能尤其有价值。",
      "pitfall": "开发完成后根据现有代码反向编写一份看似全部满足的验收清单。",
      "nodes": [
        "原始需求",
        "实现映射",
        "测试证据",
        "验收状态"
      ],
      "main": [
        {
          "title": "提取可验收要求",
          "from": 0,
          "to": 1,
          "event": "ATOMIZE REQUIREMENTS",
          "detail": "从 Spec 提取用户故事、规则、边界、非目标和失败条件，形成独立可核对条目。",
          "state": "要求可逐条检查",
          "relation": "data"
        },
        {
          "title": "映射实现位置",
          "from": 1,
          "to": 2,
          "event": "MAP TO IMPLEMENTATION",
          "detail": "为每条要求找到 API、模块、状态或代码入口；无法定位的要求标记未知。",
          "state": "实现映射明确",
          "relation": "check"
        },
        {
          "title": "关联验证证据",
          "from": 2,
          "to": 3,
          "event": "MAP TO TESTS",
          "detail": "关联单测、集成、E2E、日志或人工步骤，区分自动化与人工证据。",
          "state": "验证证据完整度可见",
          "relation": "data"
        },
        {
          "title": "记录偏差与验收",
          "from": 3,
          "to": 3,
          "event": "REPORT GAPS",
          "detail": "逐条标记通过、失败、未覆盖、需人工确认；偏差回到 Spec 变更流程。",
          "state": "验收状态诚实",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "验收清单由代码反向生成",
        "nodes": [
          "现有实现",
          "事后编写标准",
          "全部勾选",
          "遗漏被掩盖"
        ],
        "steps": [
          {
            "title": "先完成代码",
            "from": 0,
            "to": 1,
            "event": "IMPLEMENT FIRST",
            "detail": "实现者先按自己的理解编码，需求边界没有在开发前固定。",
            "state": "标准缺失",
            "relation": "check"
          },
          {
            "title": "根据代码写验收",
            "from": 1,
            "to": 2,
            "event": "RETROFIT ACCEPTANCE",
            "detail": "测试和验收标准只覆盖已经实现的行为，遗漏原始要求和负面约束。",
            "state": "标准迎合实现",
            "relation": "reject"
          },
          {
            "title": "报告全部通过",
            "from": 2,
            "to": 3,
            "event": "FALSE COMPLIANCE",
            "detail": "表格显示全部勾选，但用户发现关键场景没有实现。",
            "state": "虚假符合性",
            "relation": "reject"
          },
          {
            "title": "回到原始 Spec",
            "from": 3,
            "to": 0,
            "event": "TRACE TO SOURCE REQUIREMENT",
            "detail": "从原始需求和批准 Spec 重新提取条目，独立映射实现与测试，暴露缺口。",
            "state": "追踪回到需求来源",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "需求追踪矩阵",
          "body": "每条要求至少关联来源、实现位置、验证方式和状态。对于非功能要求（权限、安全、性能、恢复）也要明确验证证据，不要只追踪 UI 功能点。"
        },
        {
          "title": "状态语义",
          "body": "通过表示有证据；失败表示有反证；未覆盖表示没有合适测试；需人工确认表示自动化无法判断用户体验。未覆盖不能默认算通过。"
        },
        {
          "title": "独立性",
          "body": "尽量让审查者回到原始 Spec 和验收条件，而不是只阅读实现者的摘要。发现需求本身错误时应提出变更，不应静默修改基线。"
        }
      ],
      "related": [
        "spec",
        "review",
        "test-strategy",
        "delivery"
      ],
      "task": "邀请成员功能开发完成，逐条确认所有用户故事、权限规则、过期行为都有实现和测试。",
      "prompt": "请从批准的 Spec 提取原子化需求，建立需求—实现—测试—验收追踪矩阵。每项标记通过、失败、未覆盖或需人工确认，并附代码位置和真实验证证据。不要根据现有代码反向缩小需求。",
      "artifact": "Trace Matrix：Requirement ID / 来源 / 规则 / 实现位置 / 测试证据 / 人工验收 / 状态 / 差异。",
      "sources": [
        {
          "title": "code-review · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
          "note": "双轴审查：工程标准与原始 Spec 符合性。"
        },
        {
          "title": "to-spec · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md",
          "note": "用户主动调用，将当前已讨论内容综合为规格，不重新访谈。"
        },
        {
          "title": "tdd · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
          "note": "可由模型或用户调用，采用 red-green-refactor 反馈循环。"
        }
      ]
    },
    {
      "id": "codegraph",
      "group": 2,
      "title": "CodeGraph 代码理解与影响分析",
      "en": "CODEGRAPH EXPLORATION",
      "summary": "利用本地代码知识图谱快速发现符号、调用链、框架路由和潜在影响范围，再回到源码核实关键事实。",
      "principle": "CodeGraph 提供导航与结构线索；源码、运行结果和业务文档才是具体结论的证据。",
      "tradeoff": "索引能减少反复搜索，但动态调用、配置、反射和独立 SQL 可能不完整。",
      "pitfall": "把图谱没有显示的调用关系理解成代码不可达，或把推断关系当成确定事实。",
      "nodes": [
        "问题范围",
        "CodeGraph 索引",
        "调用链与影响",
        "源码核实"
      ],
      "main": [
        {
          "title": "定义具体探索问题",
          "from": 0,
          "to": 1,
          "event": "ASK A NARROW QUESTION",
          "detail": "围绕一个 API、函数、模块或故障路径提问，避免无边界地“总结整个仓库”。",
          "state": "探索目标具体",
          "relation": "check"
        },
        {
          "title": "检查索引与查询图谱",
          "from": 1,
          "to": 2,
          "event": "EXPLORE GRAPH",
          "detail": "确认索引新鲜度，使用 codegraph_explore 查询符号、调用者、被调用者和框架关系。",
          "state": "候选链路被发现",
          "relation": "data"
        },
        {
          "title": "回到源码核实",
          "from": 2,
          "to": 3,
          "event": "VERIFY SOURCE",
          "detail": "阅读关键函数、配置、SQL、Migration 和测试；对动态路由、事件和反射路径额外检查。",
          "state": "关键事实得到核实",
          "relation": "check"
        },
        {
          "title": "形成影响分析",
          "from": 3,
          "to": 3,
          "event": "REPORT BLAST RADIUS",
          "detail": "列出直接调用、间接依赖、潜在测试和不确定关系，区分静态事实与推断。",
          "state": "影响范围可审查",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "图谱没有显示调用者就删除代码",
        "nodes": [
          "目标符号",
          "静态图谱",
          "动态入口",
          "错误删除"
        ],
        "steps": [
          {
            "title": "查询未发现引用",
            "from": 0,
            "to": 1,
            "event": "NO STATIC CALLER",
            "detail": "CodeGraph 没有发现普通静态调用关系。",
            "state": "图谱结果有限",
            "relation": "check"
          },
          {
            "title": "忽略动态入口",
            "from": 1,
            "to": 2,
            "event": "MISS REFLECTION / CONFIG",
            "detail": "函数可能由反射、依赖注入、配置字符串、事件订阅或外部系统触发。",
            "state": "运行时入口未核实",
            "relation": "reject"
          },
          {
            "title": "删除后出现回归",
            "from": 2,
            "to": 3,
            "event": "UNEXPECTED BREAKAGE",
            "detail": "部署后插件、定时任务或外部回调失效。",
            "state": "静态结果被误用",
            "relation": "reject"
          },
          {
            "title": "补充入口核查",
            "from": 3,
            "to": 0,
            "event": "VERIFY ALL ENTRY POINTS",
            "detail": "检查路由注册、配置、反射、事件、CLI、任务调度和外部 API，再决定是否可删除。",
            "state": "可达性判断有证据",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "适合交给 CodeGraph 的问题",
          "body": "某函数的 callers / callees 是什么？某 API 对应哪个 handler？修改一个符号可能影响哪些模块和测试？它适合帮助导航和缩小阅读范围。"
        },
        {
          "title": "不应过度相信的关系",
          "body": "动态调用、反射、配置驱动、外部入口、运行时生成代码和独立 SQL 可能无法完整建图。查询结果可能包含启发式推断；需要查看源码和索引新鲜度。"
        },
        {
          "title": "CodeGraph 与业务知识",
          "body": "CodeGraph 不知道“为什么要这样做”，也不等同于数据库血缘分析。SQL 在 Repository 里时可帮助定位；独立 SQL / Migration 和数据库 Schema 仍需单独检查。"
        }
      ],
      "related": [
        "cross-session",
        "refactor",
        "bug",
        "architecture"
      ],
      "task": "新会话需要解释 Workspace 创建 API 到 Repository 的调用链，以及修改 Runtime 绑定会影响哪些代码。",
      "prompt": "使用 CodeGraph 针对 Workspace 创建和 Runtime 绑定提出窄问题，查询调用链与影响范围。检查索引新鲜度；把静态关系、推断关系和未知关系分开，并阅读关键源码、Migration、SQL 和测试核实结论。",
      "artifact": "影响分析：查询问题 / 图谱结果 / 静态关系 / 推断关系 / 源码核实 / 受影响模块 / 测试入口 / 未知项。",
      "sources": [
        {
          "title": "CodeGraph",
          "url": "https://github.com/colbymchenry/codegraph",
          "note": "本地代码知识图谱与 MCP 探索工具；结构线索需要回到源码核实。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    },
    {
      "id": "acceptance",
      "group": 2,
      "title": "真实用户验收",
      "en": "HUMAN ACCEPTANCE",
      "summary": "确认实现是否在真实使用环境中满足用户目标，而不仅是通过测试断言或代码审查。",
      "principle": "自动化可以验证明确规则；用户决定体验和业务结果是否可接受。",
      "tradeoff": "人工验收成本高，应聚焦高价值真实路径和风险，而不是每个像素都审批。",
      "pitfall": "把测试通过或 Agent 自己的截图描述当成用户已经接受。",
      "nodes": [
        "用户场景",
        "真实环境",
        "验收观察",
        "用户结论"
      ],
      "main": [
        {
          "title": "准备验收场景",
          "from": 0,
          "to": 1,
          "event": "DEFINE REAL TASK",
          "detail": "从用户目标提取真实操作、前置条件、角色和成功结果，使用接近实际的环境与数据。",
          "state": "场景可执行",
          "relation": "check"
        },
        {
          "title": "执行真实操作",
          "from": 1,
          "to": 2,
          "event": "RUN USER JOURNEY",
          "detail": "按真实用户路径操作系统，观察界面、状态、权限、错误提示和持久化结果。",
          "state": "实际行为被观察",
          "relation": "request"
        },
        {
          "title": "对照预期与证据",
          "from": 2,
          "to": 3,
          "event": "COMPARE OUTCOME",
          "detail": "记录预期、实际、截图 / 日志 / 数据和差异；不能把偶然成功当作稳定保证。",
          "state": "差异清晰",
          "relation": "check"
        },
        {
          "title": "由用户决定接受",
          "from": 3,
          "to": 3,
          "event": "HUMAN ACCEPT / REJECT",
          "detail": "用户确认通过、拒绝或要求调整；失败回到 Bug 诊断或 Spec 变更。",
          "state": "验收结果明确",
          "relation": "request"
        }
      ],
      "fault": {
        "name": "Agent 自己宣布人工验收通过",
        "nodes": [
          "自动化结果",
          "Agent 总结",
          "用户未操作",
          "错误验收"
        ],
        "steps": [
          {
            "title": "自动化检查通过",
            "from": 0,
            "to": 1,
            "event": "AUTOMATION GREEN",
            "detail": "所有已写测试通过，但测试环境和真实用户环境仍可能不同。",
            "state": "自动化状态明确",
            "relation": "data"
          },
          {
            "title": "Agent 自我判断体验",
            "from": 1,
            "to": 2,
            "event": "SELF-ACCEPT",
            "detail": "Agent 根据代码或模拟数据判断“用户体验没问题”，没有真实用户执行。",
            "state": "人工证据不存在",
            "relation": "reject"
          },
          {
            "title": "验收被错误关闭",
            "from": 2,
            "to": 3,
            "event": "FALSE ACCEPTANCE",
            "detail": "交付报告写 Human Accepted，但用户尚未体验或仍有阻塞问题。",
            "state": "状态不真实",
            "relation": "reject"
          },
          {
            "title": "请求真实用户确认",
            "from": 3,
            "to": 0,
            "event": "HAND OVER ACCEPTANCE",
            "detail": "清楚列出需要用户执行的步骤、观察点和已知限制，等待用户给出验收结论。",
            "state": "验收权回到用户",
            "relation": "request"
          }
        ]
      },
      "sections": [
        {
          "title": "人工验收验证什么",
          "body": "验证用户是否能完成真实任务、系统反馈是否清楚、权限与错误状态是否符合预期、数据是否持久化，以及自动化测试难以覆盖的体验和业务取舍。"
        },
        {
          "title": "验收输入要准备好",
          "body": "提供可重复的测试账号、环境、数据、操作步骤、预期结果和已知限制。不要要求用户凭感觉“随便试试”，也不要让验收场景依赖只有开发者知道的隐含前提。"
        },
        {
          "title": "验收状态由谁决定",
          "body": "Agent 可以准备验收、收集证据并提出风险，但最终业务接受或拒绝由用户决定。用户未操作时只能标记“待人工验收”，不能标记 Human Accepted。"
        }
      ],
      "related": [
        "test-strategy",
        "spec-compliance",
        "delivery",
        "bug"
      ],
      "task": "Workspace 共享功能已经通过自动化测试，需要由用户在真实浏览器中验证成员邀请、接受和移除流程。",
      "prompt": "准备人工验收包：列出测试环境、账号角色、前置数据、逐步操作、预期结果和观察证据。明确自动化已覆盖与未覆盖部分，等待用户实际执行并给出接受或拒绝结论。",
      "artifact": "Acceptance Record：环境 / 角色 / 前置条件 / 操作步骤 / 预期 / 实际 / 证据 / 用户结论 / 后续问题。",
      "sources": [
        {
          "title": "code-review · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
          "note": "双轴审查：工程标准与原始 Spec 符合性。"
        },
        {
          "title": "tdd · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
          "note": "可由模型或用户调用，采用 red-green-refactor 反馈循环。"
        }
      ]
    },
    {
      "id": "refactor",
      "group": 2,
      "title": "安全重构与行为保持",
      "en": "SAFE REFACTORING",
      "summary": "在不改变外部行为的前提下改善模块职责、依赖方向和可测试性。",
      "principle": "重构必须有行为保护和小步反馈，不能把架构偏好当成业务需求。",
      "tradeoff": "小步重构更容易回滚，但需要先补足关键行为测试。",
      "pitfall": "大规模重写同时改变 API、Schema 和业务行为，导致回归无法定位。",
      "nodes": [
        "当前依赖",
        "行为基线",
        "小步重构",
        "回归证据"
      ],
      "main": [
        {
          "title": "理解调用与职责",
          "from": 0,
          "to": 1,
          "event": "MAP CURRENT STRUCTURE",
          "detail": "使用 CodeGraph 定位 callers、callees、依赖和测试，再读源码确认动态入口。",
          "state": "影响范围明确",
          "relation": "data"
        },
        {
          "title": "定义行为不变量",
          "from": 1,
          "to": 2,
          "event": "LOCK EXTERNAL BEHAVIOUR",
          "detail": "明确 API、权限、状态、数据和错误行为必须保持什么，补齐关键回归测试。",
          "state": "行为基线建立",
          "relation": "check"
        },
        {
          "title": "小步调整结构",
          "from": 2,
          "to": 3,
          "event": "REFACTOR IN SMALL STEPS",
          "detail": "每次只改变一个职责或依赖方向，保持测试绿色，不顺手引入新业务行为。",
          "state": "结构逐步改善",
          "relation": "control"
        },
        {
          "title": "检查改进是否真实",
          "from": 3,
          "to": 3,
          "event": "VERIFY IMPROVEMENT",
          "detail": "比较依赖方向、复杂度、接口和测试；确认不是把耦合搬到新模块。",
          "state": "重构价值有证据",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "把重构变成无边界重写",
        "nodes": [
          "现有模块",
          "大规模替换",
          "行为变化",
          "回归失控"
        ],
        "steps": [
          {
            "title": "同时改多个维度",
            "from": 0,
            "to": 1,
            "event": "CHANGE EVERYTHING",
            "detail": "重构同时修改 API、数据库 Schema、权限模型和运行时边界。",
            "state": "变化范围过大",
            "relation": "reject"
          },
          {
            "title": "缺少行为保护",
            "from": 1,
            "to": 2,
            "event": "NO REGRESSION BASELINE",
            "detail": "没有测试固定旧行为，无法判断哪些变化是预期、哪些是意外。",
            "state": "回归难以定位",
            "relation": "reject"
          },
          {
            "title": "集成后出现大量差异",
            "from": 2,
            "to": 3,
            "event": "BLAST RADIUS EXPLODES",
            "detail": "失败涉及多个层次，回滚和根因分析都变困难。",
            "state": "风险集中暴露",
            "relation": "reject"
          },
          {
            "title": "拆成可回滚小步",
            "from": 3,
            "to": 0,
            "event": "RESTORE SAFE REFACTORING",
            "detail": "先定义不变量和测试，再按职责边界分步重构；业务行为变化另走 Spec。",
            "state": "重构重新可控",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "先证明为什么需要重构",
          "body": "用具体证据描述变化成本：循环依赖、职责混杂、重复规则、测试 seam 不合理或频繁回归。代码行数、个人审美和“看起来不优雅”不足以单独成为重构理由。"
        },
        {
          "title": "行为保持",
          "body": "在改变结构前锁定公共 API、数据语义、权限、状态转换和错误行为。缺失测试时先补充最重要的外部行为保护，再移动内部实现。"
        },
        {
          "title": "渐进式迁移",
          "body": "优先采用小步、兼容接口、expand-contract 和可独立回滚的变更。若重构需要改变用户可见行为，应拆出独立 Feature Spec 和验收。"
        }
      ],
      "related": [
        "codegraph",
        "architecture",
        "tdd",
        "bug"
      ],
      "task": "WorkspaceService 职责过载，准备拆分成员管理、Runtime 绑定和容器生命周期逻辑。",
      "prompt": "先用 CodeGraph 了解 WorkspaceService 的调用关系和影响范围，再定义必须保持的外部行为。提出最小重构边界和回滚步骤；不要同时改变业务规则、API 和数据模型。按小步 TDD 实施并复查依赖是否真正改善。",
      "artifact": "Refactor Plan：现状证据 / 结构问题 / 行为不变量 / 拆分边界 / 迁移步骤 / 回滚 / 测试基线 / 预期改善。",
      "sources": [
        {
          "title": "CodeGraph",
          "url": "https://github.com/colbymchenry/codegraph",
          "note": "本地代码知识图谱与 MCP 探索工具；结构线索需要回到源码核实。"
        },
        {
          "title": "improve-codebase-architecture · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/improve-codebase-architecture/SKILL.md",
          "note": "扫描代码库架构改进机会，再由人选择深入处理。"
        },
        {
          "title": "tdd · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
          "note": "可由模型或用户调用，采用 red-green-refactor 反馈循环。"
        }
      ]
    },
    {
      "id": "retro",
      "group": 2,
      "title": "工程复盘与体系演进",
      "en": "RETROSPECTIVE",
      "summary": "从一次真实开发中识别重复性失败，并把有效改进沉淀到 Agent 环境、测试和项目规范。",
      "principle": "只把重复出现且可验证的问题升级为长期规则，不要让 AGENTS.md 变成经验堆积场。",
      "tradeoff": "复盘能持续改善工程环境，但每次都写长报告会增加噪音。",
      "pitfall": "把一次偶发失误变成全项目强制规则，或只记录问题不落实改进。",
      "nodes": [
        "开发过程",
        "重复问题",
        "改进建议",
        "验证效果"
      ],
      "main": [
        {
          "title": "回顾事实与结果",
          "from": 0,
          "to": 1,
          "event": "REVIEW EVIDENCE",
          "detail": "读取实际 Diff、测试、Review、返工和用户反馈，区分事实与主观感受。",
          "state": "复盘有事实基础",
          "relation": "data"
        },
        {
          "title": "识别系统性问题",
          "from": 1,
          "to": 2,
          "event": "FIND REPEATED FAILURE",
          "detail": "判断问题是否重复出现、是否由导航、上下文、工具、测试或规范缺失导致。",
          "state": "根因层级明确",
          "relation": "check"
        },
        {
          "title": "提出最小环境改进",
          "from": 2,
          "to": 3,
          "event": "PROPOSE CHANGE",
          "detail": "优先改自动化检查、导航、模板或工具配置；避免只增加长篇提示词。",
          "state": "改进方案可执行",
          "relation": "control"
        },
        {
          "title": "验证并记录效果",
          "from": 3,
          "to": 3,
          "event": "MEASURE IMPROVEMENT",
          "detail": "定义下次如何判断改进有效，记录负责人和复查时机。",
          "state": "工程环境持续演进",
          "relation": "check"
        }
      ],
      "fault": {
        "name": "复盘变成泛泛总结，没有改变工程系统",
        "nodes": [
          "一次失败",
          "经验感想",
          "新增长规则",
          "问题复发"
        ],
        "steps": [
          {
            "title": "只写感受",
            "from": 0,
            "to": 1,
            "event": "VAGUE RETRO",
            "detail": "复盘写“以后要更仔细”“加强测试”，没有具体触发条件和证据。",
            "state": "结论不可执行",
            "relation": "check"
          },
          {
            "title": "堆积全局规则",
            "from": 1,
            "to": 2,
            "event": "ADD MORE INSTRUCTIONS",
            "detail": "把一次偶发错误加入根 AGENTS.md，所有会话都要加载无关约束。",
            "state": "上下文噪音增加",
            "relation": "reject"
          },
          {
            "title": "没有验证机制",
            "from": 2,
            "to": 3,
            "event": "NO FEEDBACK",
            "detail": "规则没有自动检查或复查方式，同类问题仍然发生。",
            "state": "改进未闭环",
            "relation": "reject"
          },
          {
            "title": "把经验转成可验证措施",
            "from": 3,
            "to": 0,
            "event": "MAKE IT SYSTEMIC",
            "detail": "优先建立测试、lint、模板或定向规则，并定义复查指标。",
            "state": "改进可以验证",
            "relation": "check"
          }
        ]
      },
      "sections": [
        {
          "title": "复盘的输入",
          "body": "以真实工作为依据：需求遗漏、测试失败、Review 发现、上下文恢复时间、返工次数、工具使用和人工介入。没有证据的猜测应标记为假设。"
        },
        {
          "title": "优先改环境而非加口号",
          "body": "如果问题能通过测试、静态检查、脚本、项目导航或模板自动防止，优先采用机制。只有确实需要模型判断的规则才写入 AGENTS.md 或 Skill。"
        },
        {
          "title": "控制规范膨胀",
          "body": "规则应有适用范围、触发条件和验证方法。一次性问题不必变成全局规范；改进后在后续任务中观察效果，失效规则应删除或调整。"
        }
      ],
      "related": [
        "delivery",
        "review",
        "test-strategy",
        "cross-session"
      ],
      "task": "最近三个功能都出现了新会话找不到业务背景、测试覆盖不完整的问题。",
      "prompt": "调用 retro。基于真实开发证据识别重复失败模式，区分偶发问题和系统性问题。优先提出可自动验证的测试、导航或模板改进；每项建议说明适用范围、成本和如何验证有效。不要只增加泛化口号。",
      "artifact": "Retro：观察到的事实 / 重复模式 / 根因假设 / 最小改进 / 验证指标 / 复查时间。",
      "sources": [
        {
          "title": "retro · Skill",
          "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md",
          "note": "用户主动调用，复盘并提出 Agent 环境改进建议。"
        },
        {
          "title": "Matt Pocock Skills",
          "url": "https://github.com/mattpocock/skills",
          "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
        }
      ]
    }
  ],
  "sources": {
    "grill": {
      "title": "grill-with-docs · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md",
      "note": "用户主动调用的需求访谈入口；会结合 grilling 与 domain-modeling。"
    },
    "domain": {
      "title": "domain-modeling · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md",
      "note": "可由模型或用户调用的领域建模能力。"
    },
    "wayfinder": {
      "title": "wayfinder · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md",
      "note": "用户主动调用的决策地图工作流，默认规划而非直接实施。"
    },
    "research": {
      "title": "research · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/research/SKILL.md",
      "note": "基于可信来源研究并保存引用资料。"
    },
    "prototype": {
      "title": "prototype · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md",
      "note": "用一次性原型回答设计问题，不把原型直接当生产实现。"
    },
    "spec": {
      "title": "to-spec · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md",
      "note": "用户主动调用，将当前已讨论内容综合为规格，不重新访谈。"
    },
    "tickets": {
      "title": "to-tickets · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md",
      "note": "用户主动调用，将计划拆成带阻塞关系的 tracer-bullet tickets。"
    },
    "implement": {
      "title": "implement · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md",
      "note": "用户主动调用，实施 Spec 或 Ticket 中定义的工作。"
    },
    "implementSpec": {
      "title": "implement-spec · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md",
      "note": "用户主动调用，按任务图在集成分支上实施整个 Spec。"
    },
    "tdd": {
      "title": "tdd · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md",
      "note": "可由模型或用户调用，采用 red-green-refactor 反馈循环。"
    },
    "review": {
      "title": "code-review · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md",
      "note": "双轴审查：工程标准与原始 Spec 符合性。"
    },
    "bugs": {
      "title": "diagnosing-bugs · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/diagnosing-bugs/SKILL.md",
      "note": "困难 Bug 的复现、最小化、假设、埋点、修复和回归流程。"
    },
    "architecture": {
      "title": "improve-codebase-architecture · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/improve-codebase-architecture/SKILL.md",
      "note": "扫描代码库架构改进机会，再由人选择深入处理。"
    },
    "retro": {
      "title": "retro · Skill",
      "url": "https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md",
      "note": "用户主动调用，复盘并提出 Agent 环境改进建议。"
    },
    "codegraph": {
      "title": "CodeGraph",
      "url": "https://github.com/colbymchenry/codegraph",
      "note": "本地代码知识图谱与 MCP 探索工具；结构线索需要回到源码核实。"
    },
    "repo": {
      "title": "Matt Pocock Skills",
      "url": "https://github.com/mattpocock/skills",
      "note": "上游工程 Skills 仓库；User-invoked 与 Model-invoked 清单以当前版本为准。"
    }
  }
};
