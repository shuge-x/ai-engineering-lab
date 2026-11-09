(() => {
"use strict";
const CUR = window.LAB_CURRICULUM;
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const groups = CUR.groups;
const lessons = CUR.lessons;
const PRACTICE = window.LAB_PRACTICE;
const scenarios = PRACTICE.scenarios;
const playbooks = PRACTICE.playbooks;
const state = {page:"home", group:0, lesson:lessons[0].id, playbook:"quick-change", practiceSection:"scenario", practiceTab:"command", mode:"task", step:0, branch:"main", tab:"mechanism", playing:false, speed:1, flowPulse:false, search:""};
const progress = JSON.parse(localStorage.getItem("ael-progress-v3") || "{}");
const current = () => lessons.find((l) => l.id === state.lesson) || lessons[0];
const currentGroupLessons = () => lessons.filter((l) => l.group === state.group);
const stages = () => state.branch === "main" ? current().main : current().fault.steps;
const stop = () => {
  state.playing=false;
  state.flowPulse=false;
};
function goLesson(id) {
  stop();
  const lesson=lessons.find((l)=>l.id===id);
  if(!lesson) return;
  state.lesson=id; state.group=lesson.group; state.page="course"; state.mode="mechanism"; state.step=0; state.branch="main"; state.tab="mechanism";
  render(); window.scrollTo(0,0);
}
function goPlaybook(id) {
  stop();
  const item=playbooks.find((x)=>x.id===id);
  if(!item) return;
  state.playbook=id; state.page="playbook"; state.practiceSection="scenario"; state.practiceTab="command"; state.step=0; state.mode="mechanism"; state.branch="main";
  render(); window.scrollTo(0,0);
}
function goScenario(id) {
  const item=playbooks.find((x)=>x.scenarioId===id);
  if(item)goPlaybook(item.id);
}
function goPage(page) {
  stop(); state.page=page;
  if(page==="home"){state.mode="task";state.step=0;}
  render(); window.scrollTo(0,0);
}
function nav() {
  document.querySelectorAll("[data-category]").forEach((b)=>b.classList.toggle("active",state.page==="course"&&Number(b.dataset.category)===state.group));
  document.querySelectorAll("[data-page]").forEach((b)=>{
    const page=b.dataset.page;
    b.classList.toggle("active",page==="home"?(state.page==="home"):page==="playbooks"?(state.page==="playbooks"||state.page==="playbook"):page===state.page);
  });
  $("#app-layout").classList.toggle("home-mode",state.page==="home"||state.page==="playbooks");
}
const practiceSections=[
 {id:"scenario",title:"01 真实场景",hint:"我遇到了什么问题？"},
 {id:"routing",title:"02 工作流选择",hint:"为什么选这条路线？"},
 {id:"preparation",title:"03 开发准备",hint:"开始前需要准备什么？"},
 {id:"execution",title:"04 逐步执行",hint:"输入什么命令和 Prompt？"},
 {id:"agent",title:"05 Agent 行为",hint:"AI 应该如何响应？"},
 {id:"artifacts",title:"06 工件与交接",hint:"每一步产出什么？"},
 {id:"decisions",title:"07 异常与决策",hint:"什么时候必须停下来？"},
 {id:"acceptance",title:"08 验收与复盘",hint:"怎么证明真的完成？"}
];
function currentPlaybook(){return playbooks.find((x)=>x.id===state.playbook)||playbooks[0]}
function practiceSteps(){return currentPlaybook().steps}
function home(){
 const cards=scenarios.map((sc,i)=>{
  const p=playbooks.find((x)=>x.scenarioId===sc.id);
  return '<button class="task-card story-card" data-playbook="'+p.id+'"><div class="task-card-top"><span class="number">0'+(i+1)+' / REAL CASE</span><span class="mini-tag">'+esc(p.level)+'</span></div><h3>'+esc(sc.title)+'</h3><p>'+esc(sc.current)+'</p><div class="story-card-meta"><span>'+esc(p.workflow)+'</span><span>'+p.steps.length+' 个执行阶段</span></div><div class="card-bottom"><span>进入完整实战课程</span><b>→</b></div></button>';
 }).join("");
 const domainCards=groups.map((g,i)=>'<button class="domain-card" data-category="'+i+'"><span class="domain-number">0'+(i+1)+'</span><div><b>'+esc(g.title)+'</b><p>'+esc(g.intro)+'</p><small>'+lessons.filter((l)=>l.group===i).length+' 个知识主题 · 进入课程体系 →</small></div></button>').join("");
 return '<div class="home-shell"><section class="home-hero"><div class="eyebrow">AI CODING WORKFLOW LAB</div><h1>从真实开发问题出发，<br><em>学会使用 AI 完成工程任务。</em></h1><p>先选择一个你正在面对的开发场景，跟随完整工作流学习命令、Prompt、Agent 行为、工程工件和验收方法。需要系统理解某个概念时，再进入知识课程。</p><div class="hero-meta"><span>● 6 条实战训练路线</span><span>● 22 个工程知识主题</span><span>● Matt Pocock Skills + CodeGraph</span></div></section><div class="category-heading story-section-heading"><div><span class="eyebrow">TASK ENTRY / REAL-WORLD SCENARIOS</span><h2>你现在想解决什么问题？</h2><p>六个案例共享 Team Task Board 教学项目，从简单修改逐步走向复杂工程。</p></div><span class="category-count">'+scenarios.length+' 个实践故事</span></div><div class="task-grid home-task-grid story-grid">'+cards+'</div><section class="learning-route"><div class="route-intro"><span class="eyebrow">ONE PRACTICE PROJECT</span><h3>统一教学项目：Team Task Board</h3><p>从简单任务看板逐步演进到团队协作和多租户系统。每条路线都有独立起始版本，不要求先完成上一条。</p></div><div class="route-cards"><div class="route-card"><span>01</span><b>真实业务</b><small>项目、任务、成员和提醒</small></div><div class="route-card"><span>02</span><b>独立起点</b><small>每个故事有固定起始版本</small></div><div class="route-card"><span>03</span><b>可复现操作</b><small>命令、Prompt 和预期工件</small></div><div class="route-card"><span>04</span><b>证据验收</b><small>测试、Review 和人工验收</small></div></div></section><section class="knowledge-entry"><div class="knowledge-entry-heading"><div><span class="eyebrow">SYSTEMATIC KNOWLEDGE CURRICULUM</span><h2>想先系统学习工程方法？</h2><p>01～03 保留工具中立的工程知识课程；04 则把知识组合成完整工作流实践。</p></div><span class="category-count">'+lessons.length+' 个知识主题</span></div><div class="domain-grid">'+domainCards+'</div></section></div>';
}
function playbookHub(){
 const p=PRACTICE.pack;
 const cards=playbooks.map((item,i)=>{
  const sc=scenarios.find((x)=>x.id===item.scenarioId);
  return '<button class="task-card story-card" data-playbook="'+item.id+'"><div class="task-card-top"><span class="number">0'+(i+1)+' / PLAYBOOK</span><span class="mini-tag">'+esc(item.level)+'</span></div><h3>'+esc(item.title)+'</h3><p>'+esc(sc.current)+'</p><div class="story-card-meta"><span>'+esc(item.workflow)+'</span><span>'+item.steps.length+' 个执行阶段</span></div><div class="card-bottom"><span>开始这条实战路线</span><b>→</b></div></button>';
 }).join("");
 return '<div class="home-shell"><section class="home-hero"><div class="eyebrow">04 / WORKFLOW PRACTICE</div><h1>把工程知识，<br><em>变成可以跟着做的工作流。</em></h1><p>每条实战课程都围绕一个真实开发问题，展示为什么选这条流程、要调用什么能力、输入什么 Prompt、Agent 应该做什么，以及如何验收。</p><div class="hero-meta"><span>● 1 套方法论实践包</span><span>● 6 条完整工作流</span><span>● 同一场景与知识课程互相关联</span></div></section><section class="methodology-pack"><div class="pack-mark">MP</div><div class="pack-copy"><span class="eyebrow">CURRENT METHODOLOGY PACK</span><h2>'+esc(p.meta.title)+'</h2><p>'+esc(p.meta.subtitle)+'</p><small>'+esc(p.meta.note)+'</small></div><div class="pack-links"><a href="'+esc(p.meta.upstream[0].url)+'" target="_blank" rel="noreferrer">上游 Skills ↗</a><a href="'+esc(p.meta.upstream[1].url)+'" target="_blank" rel="noreferrer">CodeGraph ↗</a></div></section><div class="category-heading story-section-heading"><div><span class="eyebrow">SIX PRACTICE PLAYBOOKS</span><h2>选择一条工作流实战</h2><p>从入门的小修改到高级的架构重构，逐步掌握 AI 编程工程方法。</p></div><span class="category-count">'+playbooks.length+' 条路线</span></div><div class="task-grid home-task-grid story-grid">'+cards+'</div></div>';
}
function practiceFlow(p){
 const steps=p.steps, width=Math.max(900,steps.length*190+60), y=112;
 const lines=steps.slice(0,-1).map((st,i)=>{
  const x1=105+i*190+65,x2=105+(i+1)*190-65;
  const cls=i<state.step?"completed":i===state.step?"active":"future";
  const packet=i===state.step&&state.flowPulse?'<circle class="practice-packet" r="5"><animateMotion dur="2.2s" repeatCount="1" fill="freeze" path="M '+x1+' '+y+' L '+x2+' '+y+'"/></circle>':"";
  return '<g class="practice-edge-group '+cls+'"><path class="practice-link '+cls+'" d="M '+x1+' '+y+' L '+x2+' '+y+'" marker-end="url(#practice-arrow)"/>'+packet+'</g>';
 }).join("");
 const nodes=steps.map((st,i)=>{
  const x=105+i*190,kind=nodeKind(st.title),cls=i===state.step?"active":i<state.step?"passed":"";
  const color=kind==="verify"||kind==="bug"?"var(--amber)":kind==="document"||kind==="ticket"||kind==="knowledge"?"var(--purple)":kind==="agent"||kind==="code"?"var(--teal)":"var(--blue)";
  return '<g class="practice-object '+cls+'" data-practice-step="'+i+'" tabindex="0" role="button"><rect x="'+(x-65)+'" y="'+(y-42)+'" width="130" height="84" rx="8"/><circle cx="'+(x-43)+'" cy="'+(y-21)+'" r="12" class="practice-object-index"/><text x="'+(x-43)+'" y="'+(y-17)+'" class="practice-object-index-text" text-anchor="middle">'+String(i+1).padStart(2,"0")+'</text><g transform="translate('+x+' '+(y+1)+')" class="practice-object-icon" style="color:'+color+'">'+objectGlyph(kind)+'</g><text x="'+x+'" y="'+(y+30)+'" text-anchor="middle" class="practice-object-label">'+esc(st.title.length>12?st.title.slice(0,11)+'…':st.title)+'</text></g>';
 }).join("");
 return '<div class="practice-flow-wrap"><div class="practice-flow-caption"><span>工作流机制图 · 点击节点查看阶段</span><span>'+String(state.step+1).padStart(2,"0")+' / '+String(steps.length).padStart(2,"0")+'</span></div><div class="practice-flow-scroll"><svg class="practice-flow-svg" style="width:'+width+'px" viewBox="0 0 '+width+' 225" role="img" aria-label="'+esc(p.title)+' 工作流机制图"><defs><marker id="practice-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--blue)"/></marker></defs>'+lines+nodes+'</svg></div></div>';
}
function practiceChapterContent(p,sc,section,step){
 if(section==="scenario")return '<div class="practice-chapter"><div class="eyebrow">01 / REAL SCENARIO</div><h2>'+esc(sc.title)+'</h2><p class="practice-lead">'+esc(sc.current)+'</p><div class="practice-request"><small>用户提出的原始需求</small><p>'+esc(sc.request)+'</p></div><div class="practice-info-grid"><div><small>目标结果</small><p>'+esc(sc.goal)+'</p></div><div><small>起始项目版本</small><p><code>'+esc(sc.start)+'</code></p></div></div><h3>本次范围与约束</h3><ul class="practice-check-list">'+sc.constraints.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>';
 if(section==="routing")return '<div class="practice-chapter"><div class="eyebrow">02 / WORKFLOW ROUTING</div><h2>为什么选择 '+esc(p.workflow)+'？</h2><p class="practice-lead">'+esc(p.routing.why)+'</p><div class="practice-info-grid"><div><h3>适用条件</h3><ul>'+p.routing.when.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div><div><h3>不适用条件</h3><ul>'+p.routing.notWhen.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div></div><div class="practice-note"><b>如果条件变化</b><p>'+esc(p.routing.alternatives)+'</p></div></div>';
 if(section==="preparation")return '<div class="practice-chapter"><div class="eyebrow">03 / PREPARATION</div><h2>开始前先准备好环境</h2><p class="practice-lead">本故事从固定的教学项目起始版本开始。先确认工具、项目和上下文，再执行工作流。</p><h3>项目与环境</h3><ul>'+p.preparation.requirements.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><div class="practice-note"><b>起始版本</b><p><code>'+esc(p.preparation.project)+'</code></p></div><div class="practice-note"><b>从起始版本启动</b><pre class="practice-prep-code">'+(p.preparation.commands||[]).map(esc).join("\n")+'</pre></div>'+(p.preparation.verificationCommands&&p.preparation.verificationCommands.length?'<div class="practice-note"><b>起始状态验证</b><pre class="practice-prep-code">'+p.preparation.verificationCommands.map(esc).join("\n")+'</pre></div>':"")+'<div class="practice-note"><b>CodeGraph 使用说明</b><p>'+esc(p.preparation.codegraph)+'</p></div><div class="practice-note"><b>一次性 Skill 初始化</b><p>'+esc(PRACTICE.pack.setup.tracker.recommendation)+'</p><code>'+esc(PRACTICE.pack.setup.tracker.command)+'</code></div></div>';
 if(section==="execution")return '<div class="practice-chapter"><div class="eyebrow">04 / STEP-BY-STEP EXECUTION</div><h2>跟着步骤完成这条工作流</h2><p class="practice-lead">先看整体机制，再逐步操作。每一步都包含命令、Prompt、Agent 预期行为、工件和交接条件。</p>'+practiceFlow(p)+'<div class="practice-active-step"><div class="practice-active-number">'+String(state.step+1).padStart(2,"0")+'</div><div><span class="eyebrow">'+esc(step.actor)+'</span><h3>'+esc(step.title)+'</h3><p>'+esc(step.agentBehavior)+'</p><small>预期产物：'+esc(step.artifact)+'</small></div></div><div class="practice-step-nav">'+p.steps.map((x,i)=>'<button class="'+(i===state.step?"active":"")+'" data-practice-step="'+i+'">'+String(i+1).padStart(2,"0")+' '+esc(x.title)+'</button>').join("")+'</div></div>';
 if(section==="agent")return '<div class="practice-chapter"><div class="eyebrow">05 / EXPECTED AGENT BEHAVIOR</div><h2>Agent 应该怎样工作？</h2><p class="practice-lead">不要只看最终代码。学习者需要知道 Agent 每个阶段应该做什么、不能做什么。</p><div class="practice-behavior-list">'+p.steps.map((x,i)=>'<article><span>'+String(i+1).padStart(2,"0")+'</span><div><b>'+esc(x.title)+'</b><p>'+esc(x.agentBehavior)+'</p></div></article>').join("")+'</div></div>';
 if(section==="artifacts")return '<div class="practice-chapter"><div class="eyebrow">06 / ARTIFACTS & HANDOFF</div><h2>看懂每一步留下的工程工件</h2><p class="practice-lead">工件不是为了多写文档，而是让下一阶段和新会话能够理解目标、约束与验证结果。</p><div class="practice-artifact-list">'+p.artifactSamples.map(x=>'<article><h3>'+esc(x.title)+'</h3><pre>'+esc(x.content)+'</pre></article>').join("")+'</div><div class="practice-note"><b>阶段交接</b><p>'+esc(step.handoff)+'</p></div></div>';
 if(section==="decisions")return '<div class="practice-chapter"><div class="eyebrow">07 / EXCEPTIONS & HUMAN DECISIONS</div><h2>哪些地方必须由人决定？</h2><p class="practice-lead">保留开发者对目标、业务决策、工作流入口和最终验收的控制权。</p><div class="practice-decision-list">'+p.decisions.map(x=>'<article><h3>'+esc(x.title)+'</h3><p>'+esc(x.detail)+'</p></article>').join("")+'</div><h3>当前阶段的停止条件</h3><ul>'+step.checklist.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>';
 return '<div class="practice-chapter"><div class="eyebrow">08 / ACCEPTANCE & RETROSPECTIVE</div><h2>如何判断这次实战真的完成？</h2><p class="practice-lead">完成状态必须由真实证据支撑。Agent 的 Done 不是验收证据。</p><ul class="practice-check-list">'+p.acceptance.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><div class="practice-note"><b>最终交付原则</b><p>分别记录自动化验证、规格符合性、人工验收和知识同步。未执行的检查必须明确标记为未执行。</p></div><div class="practice-related"><h3>继续学习相关知识</h3>'+p.knowledgeRefs.map(id=>{const l=lessons.find(x=>x.id===id);return l?'<button data-lesson="'+l.id+'">'+esc(l.title)+' →</button>':''}).join("")+'</div></div>';
}
function practiceRight(p,step){
 if(state.practiceTab==="agent")return '<div class="detail-block"><span class="detail-kicker">EXPECTED AGENT BEHAVIOR</span><h3>'+esc(step.title)+'</h3><p>'+esc(step.agentBehavior)+'</p><div class="callout">如果 Agent 跳过必要问题、擅自扩大范围或没有提供证据，应暂停并纠正。</div></div>';
 if(state.practiceTab==="artifact")return '<div class="detail-block"><span class="detail-kicker">EXPECTED ARTIFACT</span><h3>'+esc(step.title)+'</h3><p>'+esc(step.artifact)+'</p><div class="detail-section"><b>检查清单</b><ul>'+step.checklist.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div><div class="detail-section"><b>交接条件</b><p>'+esc(step.handoff)+'</p></div></div>';
 if(state.practiceTab==="sources")return '<div class="detail-block"><span class="detail-kicker">UPSTREAM SOURCES</span><h3>上游依据与适用边界</h3><ul>'+p.sources.map(url=>'<li><a href="'+esc(url)+'" target="_blank" rel="noreferrer">'+esc(url.split('/').slice(-2).join('/'))+' ↗</a></li>').join("")+'</ul><p>教学建议和上游 Skill 的强制行为会分开标注；具体调用权限以当前上游版本为准。</p></div>';
 const inv=step.invocation||{};
 const userCommand=inv.kind==="slash"||inv.kind==="shell"||inv.kind==="tool";
 const invokeLabel=inv.kind==="slash"?"用户主动调用":inv.kind==="agent"?"Agent 按需调用":inv.kind==="tool"?"外部工具 / MCP":inv.kind==="shell"?"终端命令":"直接对话";
 const invokeValue=inv.command||"直接向 Agent 描述当前任务";
 const invokeButton=userCommand?'<button class="copy-prompt" data-copy-command>复制调用指令</button>':'<p class="invocation-hint">这一步不需要额外输入命令；按上面的方式与 Agent 协作即可。</p>';
 return '<div class="detail-block"><span class="detail-kicker">COMMAND / PROMPT</span><h3>'+esc(step.title)+'</h3><div class="practice-command"><small>调用方式 · '+esc(invokeLabel)+'</small><code>'+esc(invokeValue)+'</code>'+invokeButton+'</div><div class="detail-section"><b>给 Agent 的完整提示词</b><pre class="prompt">'+esc(step.prompt)+'</pre><button class="copy-prompt" data-copy-practice-prompt>复制完整 Prompt</button></div><div class="callout">复制后请先确认当前项目和起始版本正确，再发送给 Coding Agent。</div></div>';
}

function playbookPage(){
 const p=currentPlaybook(),sc=scenarios.find(x=>x.id===p.scenarioId),step=p.steps[Math.min(state.step,p.steps.length-1)];
 const sec=practiceSections.find(x=>x.id===state.practiceSection)||practiceSections[0];
 const sectionNav=practiceSections.map(x=>'<button class="practice-section-button '+(x.id===state.practiceSection?'active':'')+'" data-practice-section="'+x.id+'"><b>'+esc(x.title)+'</b><small>'+esc(x.hint)+'</small></button>'+(x.id==='execution'&&state.practiceSection==='execution'?'<div class="practice-substeps">'+p.steps.map((st,i)=>'<button class="'+(i===state.step?'active':'')+'" data-practice-step="'+i+'"><span>'+String(i+1).padStart(2,"0")+'</span>'+esc(st.title)+'</button>').join("")+'</div>':'')).join("");
 const trace=p.steps.map((x,i)=>'<button class="trace-row '+(i===state.step?'active':'')+'" data-practice-step="'+i+'"><span class="trace-index">'+String(i+1).padStart(2,"0")+'</span><span class="trace-event">'+esc(x.title)+'</span><span class="trace-actor">'+esc(x.actor)+'</span><span class="trace-status">'+(i<state.step?'已回顾':i===state.step?'当前阶段':'待学习')+'</span></button>').join("");
 const related=p.knowledgeRefs.map(id=>lessons.find(x=>x.id===id)).filter(Boolean);
 return '<div class="course-shell practice-shell"><div class="practice-topline"><button data-page="playbooks">← 返回 04 工作流实战</button><span>'+esc(PRACTICE.pack.meta.title)+'</span><span>'+esc(p.level)+' · '+esc(p.duration)+'</span></div><div class="workbench"><aside class="left-panel panel practice-left"><div class="panel-heading"><b>实战课程目录</b><span>08</span></div><div class="practice-course-title"><small>'+esc(p.workflow)+'</small><b>'+esc(p.title)+'</b></div><div class="practice-section-list">'+sectionNav+'</div><div class="directory-foot"><span>● '+p.steps.length+' 个执行阶段</span><span>'+esc(p.level)+'</span></div></aside><section class="center-panel panel practice-center"><div class="mode-tabs"><div class="mode-left"><button class="active">实战学习</button><button data-page="playbooks">其他工作流</button></div><span class="mode-hint">04 / WORKFLOW PRACTICE</span></div><div class="lesson-canvas-head"><div><div class="eyebrow">'+esc(p.workflow)+'</div><h1>'+esc(p.title)+'</h1><p>'+esc(p.summary)+'</p></div><span class="lesson-index">'+String(playbooks.indexOf(p)+1).padStart(2,"0")+'</span></div><div class="practice-section-heading"><div><span class="eyebrow">'+esc(sec.title)+'</span><h2>'+esc(sec.hint)+'</h2></div><span>'+String(practiceSections.indexOf(sec)+1).padStart(2,"0")+' / 08</span></div><div class="center-content practice-center-content">'+practiceChapterContent(p,sc,state.practiceSection,step)+'</div></section><aside class="right-panel panel practice-right"><div class="panel-heading"><b>实战操作指南</b><span>'+String(state.step+1).padStart(2,"0")+' / '+String(p.steps.length).padStart(2,"0")+'</span></div><div class="right-tabs practice-right-tabs"><button data-practice-tab="command" class="'+(state.practiceTab==='command'?'active':'')+'">命令 / Prompt</button><button data-practice-tab="agent" class="'+(state.practiceTab==='agent'?'active':'')+'">Agent 行为</button><button data-practice-tab="artifact" class="'+(state.practiceTab==='artifact'?'active':'')+'">产物检查</button><button data-practice-tab="sources" class="'+(state.practiceTab==='sources'?'active':'')+'">来源</button></div><div class="right-content">'+practiceRight(p,step)+'</div></aside><section class="trace-panel panel practice-trace"><div class="trace-head"><div><b>工作流执行轨迹</b><span>'+String(state.step+1).padStart(2,"0")+' / '+String(p.steps.length).padStart(2,"0")+'</span></div><div class="play-controls"><button data-prev '+(state.step===0?'disabled':'')+'>‹</button><button class="play-btn" data-play>'+(state.playing?'Ⅱ 暂停':'▶ 播放')+'</button><button data-next>下一步 ›</button><button data-reset>↺</button></div></div><div class="trace-columns"><span>步骤</span><span>执行事件</span><span>执行者</span><span>学习状态</span></div><div class="trace-rows">'+trace+'</div><div class="trace-foot"><span>每一步都要核对 Prompt、Agent 行为、工件和交接条件。</span><button class="mark-btn" data-practice-mark>'+(progress['playbook:'+p.id]?'✓ 已完成':'标记本条实战已完成')+'</button></div></section></div><div class="practice-related-footer"><span>相关知识：</span>'+related.map(x=>'<button data-lesson="'+x.id+'">'+esc(x.title)+' →</button>').join("")+'</div></div>';
}
function homeMechanism() {
 const names=["用户目标","工作流选择","专业能力","证据验证","知识沉淀"];
 const desc=["人提出目标、业务意图和约束。","根据需求清晰度、影响范围和风险选择轻重合适的路径。","遵守 User-invoked 与 Model-invoked 调用边界。","没有真实执行证据，不得报告验证通过。","重要变更验收后，对账并更新 GLOSSARY、ADR 和模块知识。"];
 return '<section class="home-hero compact"><div class="eyebrow">HOW THE ENGINEERING SYSTEM WORKS</div><h1>人掌握决策，<br><em>Agent 在授权范围内执行。</em></h1><p>工作流入口由人选择，专业能力按需组合，完成状态由证据决定。</p></section><div class="mechanism-overview"><div class="overview-steps">'+names.map((n,i)=>'<button class="overview-step '+(state.step===i?"active":"")+'" data-home-step="'+i+'"><span>0'+(i+1)+'</span><b>'+n+'</b></button>').join("")+'</div><div class="overview-detail"><div class="overview-number">0'+(state.step+1)+'</div><div><span class="eyebrow">SYSTEM MECHANISM</span><h2>'+names[state.step]+'</h2><p>'+desc[state.step]+'</p></div></div><div class="overview-footer"><span>工程协作机制</span><button data-home-step="'+Math.min(4,state.step+1)+'" '+(state.step===4?"disabled":"")+' >下一机制 →</button></div></div>';
}
function homeGraph() {
 return '<section class="home-hero compact"><div class="eyebrow">ENGINEERING KNOWLEDGE MAP</div><h1>让需求、实现与知识，<br><em>形成可以追踪的闭环。</em></h1><p>选择一个领域或主题，进入对应课程。</p></section><div class="home-graph-panel"><div class="graph-caption"><b>AI Engineering 课程地图</b><span>选择主题进入课程</span></div><div class="graph-groups">'+groups.map((g,i)=>'<section><h3>0'+(i+1)+' '+esc(g.title)+'</h3>'+lessons.filter((l)=>l.group===i).map((l)=>'<button data-lesson="'+l.id+'">'+esc(l.title)+' →</button>').join("")+'</section>').join("")+'</div></div>';
}
function course() {
 const l=current(), ss=stages(), s=ss[Math.min(state.step,ss.length-1)];
 const related=l.related.map((id)=>lessons.find((x)=>x.id===id)).filter(Boolean);
 const groupLessons=currentGroupLessons();
 const sceneNodes=state.branch==="main"?l.nodes:l.fault.nodes;
 const lessonItems=groupLessons.map((x)=>{
   const active=x.id===l.id;
   const sub=active?'<div class="lesson-substeps">'+ss.map((st,i)=>'<button class="lesson-substep '+(i===state.step?"active":"")+'" data-step="'+i+'"><span>'+(i+1)+'</span>'+esc(st.title)+'</button>').join("")+'</div>':"";
   return '<div class="directory-topic"><button class="directory-topic-button '+(active?"active":"")+'" data-lesson="'+x.id+'"><span class="directory-topic-number">'+String(lessons.indexOf(x)+1).padStart(2,"0")+'</span><span class="directory-topic-title">'+esc(x.title)+'</span><span class="directory-topic-chevron">'+(active?"⌄":"›")+'</span></button>'+sub+'</div>';
 }).join("");
 const trace=ss.map((x,i)=>'<button class="trace-row '+(i===state.step?"active":"")+'" data-step="'+i+'"><span class="trace-index">'+String(i+1).padStart(2,"0")+'</span><span class="trace-event">'+esc(x.event||x.title)+'</span><span class="trace-actor">'+esc(x.actor)+'</span><span class="trace-status">'+esc(x.state|| (i<state.step?"已回顾":i===state.step?"当前阶段":"待学习"))+'</span></button>').join("");
 let center="";
 if(state.mode==="task") center=taskCanvas(l,s,ss);
 else if(state.mode==="mechanism") center=mechanism(l,ss,s,sceneNodes);
 else center=graph(l,related);
 const modeTabs='<div class="mode-tabs"><div class="mode-left"><button data-mode="task" class="'+(state.mode==="task"?"active":"")+'">⌂ 任务入口</button><button data-mode="mechanism" class="'+(state.mode==="mechanism"?"active":"")+'">⬡ 机制演示</button><button data-mode="graph" class="'+(state.mode==="graph"?"active":"")+'">♧ 知识图谱</button></div><span class="mode-hint">LEARNING VIEW</span></div>';
 const scenario='<div class="scene-switch"><span class="scene-label">场景</span><button data-branch="main" class="'+(state.branch==="main"?"active":"")+'">主流程</button><button data-branch="fault" class="'+(state.branch==="fault"?"active":"")+'">⚡ '+esc(l.fault.name)+'</button><span class="scene-count">路径 '+(state.step+1)+' / '+ss.length+'</span></div>';
 const stagePath='<div class="stage-path">'+ss.map((x,i)=>'<button class="stage-path-item '+(i===state.step?"active":i<state.step?"passed":"")+'" data-step="'+i+'"><span>'+String(i+1).padStart(2,"0")+'</span><b>'+esc(x.title)+'</b></button>').join('<span class="stage-path-arrow">→</span>')+'</div>';
 const canvasHead='<div class="lesson-canvas-head"><div><div class="eyebrow">'+String(l.group+1).padStart(2,"0")+' / '+esc(groups[l.group].en)+'</div><h1>'+esc(l.title)+'</h1><p>'+esc(l.summary)+'</p></div><span class="lesson-index">'+String(lessons.indexOf(l)+1).padStart(2,"0")+'</span></div>';
 return '<div class="course-shell"><div class="workbench"><aside class="left-panel panel"><div class="panel-heading"><b>学习目录</b><span>'+groupLessons.length+'</span></div><div class="directory-domain"><span>0'+(l.group+1)+' / '+esc(groups[l.group].title)+'</span><small>'+groupLessons.length+' 个知识主题</small></div><div class="directory-list">'+lessonItems+'</div><div class="directory-foot"><span>● '+lessons.length+' 个主题</span><span>'+Object.keys(progress).length+' 已掌握</span></div></aside><section class="center-panel panel">'+modeTabs+canvasHead+scenario+stagePath+'<div class="center-content">'+center+'</div></section><aside class="right-panel panel"><div class="panel-heading"><b>机制详解</b><span>0'+(state.step+1)+' / 0'+ss.length+'</span></div><div class="right-tabs"><button data-tab="mechanism" class="'+(state.tab==="mechanism"?"active":"")+'">机制</button><button data-tab="command" class="'+(state.tab==="command"?"active":"")+'">命令 / Prompt</button><button data-tab="sources" class="'+(state.tab==="sources"?"active":"")+'">来源</button></div><div class="right-content">'+rightContent(l,s)+'</div></aside><section class="trace-panel panel"><div class="trace-head"><div><b>执行轨迹</b><span>0'+(state.step+1)+' / 0'+ss.length+'</span></div><div class="play-controls"><select id="speed" aria-label="播放速度"><option value="1" '+(state.speed===1?"selected":"")+' >1×</option><option value=".7" '+(state.speed===.7?"selected":"")+' >0.7×</option><option value="1.5" '+(state.speed===1.5?"selected":"")+' >1.5×</option></select><button data-prev '+(state.step===0?"disabled":"")+' >‹</button><button class="play-btn" data-play>'+(state.playing?"Ⅱ 暂停":"▶ 播放")+'</button><button data-next>下一步 ›</button><button data-reset title="重置">↺</button></div></div><div class="trace-columns"><span>步骤</span><span>事件</span><span>执行者</span><span>状态观察</span></div><div class="trace-rows">'+trace+'</div><div class="trace-foot"><span>点击步骤查看状态；Space 播放，← → 逐步探索</span><button class="mark-btn" data-mark>'+(progress[l.id]?"✓ 已标记已学":"标记已学 ✓")+'</button></div></section></div></div>';
}
function taskCanvas(l,s,ss) {
 return '<div class="task-view"><div class="task-kicker">LEARNING SCENARIO</div><h2>'+esc(l.title)+'</h2><p class="task-description">'+esc(l.summary)+'</p><div class="task-facts"><div><small>核心原则</small><b>'+esc(l.principle)+'</b></div><div><small>实践重点</small><b>'+esc(l.tradeoff)+'</b></div><div><small>核心工件</small><b>'+esc(l.artifact)+'</b></div></div><div class="task-route"><div class="route-head"><b>学习步骤</b><span>选择阶段进入学习</span></div><div class="route-steps">'+ss.map((x,i)=>'<button data-step="'+i+'" class="'+(i===state.step?"active":"")+'"><span>0'+(i+1)+'</span><b>'+esc(x.title)+'</b><small>'+esc(x.actor)+'</small></button>').join("")+'</div></div><div class="current-task"><span class="current-label">当前阶段</span><b>'+esc(s.title)+'</b><p>'+esc(s.detail)+'</p><button class="primary" data-mode="mechanism">进入机制演示 →</button></div></div>';
}
function nodeKind(label) {
 const v=String(label||"").toLowerCase();
 if(/用户|user|客户端|client|pod|human|目标|用户结论/.test(v))return "user";
 if(/grill|访谈|澄清|问题|业务表达/.test(v))return "conversation";
 if(/spec|文档|规则|adr|glossary|声明|记录|资料|摘要|批准范围|批准规格|原始需求|已确认需求/.test(v))return "document";
 if(/ticket|任务拆解|工单|任务图|frontier|切片/.test(v))return "ticket";
 if(/agent|implement|执行|runtime|工作流/.test(v))return "agent";
 if(/测试|验证|验收|review|审查|检查|证据|回归/.test(v))return "verify";
 if(/code|代码|graph|调用|依赖|源码|原型/.test(v))return "code";
 if(/bug|故障|错误|诊断|风险/.test(v))return "bug";
 if(/数据库|sql|migration|data|存储|repository/.test(v))return "database";
 if(/知识|knowledge|上下文|会话|handoff|索引|项目知识/.test(v))return "knowledge";
 if(/架构|模块|architecture|接口|边界/.test(v))return "architecture";
 if(/发布|部署|交付|delivery|package/.test(v))return "delivery";
 if(/决策|选择|判断|复杂度|方案|目的地|批准决策|变更批准|改进建议/.test(v))return "decision";
 return "system";
}
function objectGlyph(kind) {
 const common='fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
 const shapes={
  user:'<circle cx="0" cy="-7" r="5" '+common+'/><path d="M-11 12 C-10 3 10 3 11 12" '+common+'/>',
  conversation:'<path d="M-13 -11 H13 V6 H2 L-6 13 V6 H-13 Z" '+common+'/><path d="M-7 -3 H7 M-7 2 H3" '+common+'/>',
  document:'<path d="M-10 -14 H4 L11 -7 V14 H-10 Z M4 -14 V-7 H11 M-5 -1 H6 M-5 5 H6" '+common+'/>',
  ticket:'<path d="M-13 -10 H13 V-3 C7 0 7 4 13 7 V11 H-13 V7 C-7 4 -7 0 -13 -3 Z" '+common+'/><path d="M0 -8 V8" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3"/>',
  agent:'<rect x="-11" y="-10" width="22" height="19" rx="5" '+common+'/><path d="M0 -15 V-10 M-4 -15 H4 M-6 -2 H-4 M4 -2 H6 M-4 4 H4" '+common+'/><circle cx="-4" cy="-2" r="1" fill="currentColor"/><circle cx="4" cy="-2" r="1" fill="currentColor"/>',
  verify:'<path d="M0 -15 L12 -10 V0 C12 8 5 13 0 16 C-5 13 -12 8 -12 0 V-10 Z" '+common+'/><path d="M-6 0 L-1 5 L7 -5" '+common+'/>',
  code:'<path d="M-5 -10 L-13 0 L-5 10 M5 -10 L13 0 L5 10 M2 -13 L-2 13" '+common+'/>',
  bug:'<ellipse cx="0" cy="1" rx="7" ry="10" '+common+'/><circle cx="0" cy="-11" r="4" '+common+'/><path d="M-7 -5 L-13 -10 M7 -5 L13 -10 M-8 1 L-15 1 M8 1 L15 1 M-7 8 L-13 13 M7 8 L13 13 M-4 -15 L-7 -19 M4 -15 L7 -19" '+common+'/>',
  database:'<ellipse cx="0" cy="-9" rx="12" ry="5" '+common+'/><path d="M-12 -9 V9 C-12 16 12 16 12 9 V-9 M-12 0 C-12 7 12 7 12 0" '+common+'/>',
  knowledge:'<circle cx="-10" cy="-8" r="4" '+common+'/><circle cx="10" cy="-8" r="4" '+common+'/><circle cx="0" cy="11" r="4" '+common+'/><path d="M-6 -6 L-2 7 M6 -6 L2 7 M-6 -8 H6" '+common+'/>',
  decision:'<path d="M0 -15 L14 0 L0 15 L-14 0 Z" '+common+'/><path d="M-6 0 H6 M2 -4 L6 0 L2 4" '+common+'/>',
  architecture:'<path d="M0 -15 L14 -7 L0 1 L-14 -7 Z M-14 -7 V8 L0 16 L14 8 V-7 M0 1 V16 M-14 0 L0 8 L14 0" '+common+'/>',
  delivery:'<path d="M0 -15 L13 -8 V8 L0 15 L-13 8 V-8 Z M-13 -8 L0 0 L13 -8 M0 0 V15 M-5 -5 H6 M2 -9 L6 -5 L2 -1" '+common+'/>',
  system:'<rect x="-12" y="-12" width="24" height="24" rx="4" '+common+'/><path d="M-6 -5 H6 M-6 0 H6 M-6 5 H2" '+common+'/>'
 };
 return '<g class="object-glyph object-'+kind+'" transform="translate(0 0)">'+(shapes[kind]||shapes.system)+'</g>';
}
function mechanism(l,ss,s,nodes) {
 const labels=(nodes&&nodes.length?nodes:l.nodes||[]).slice(0,4);
 const positions=[{x:205,y:93},{x:595,y:93},{x:595,y:282},{x:205,y:282}];
 const edgePaths=[
  "M 280 93 L 520 93",
  "M 595 151 L 595 224",
  "M 520 282 L 280 282"
 ];
 const lines=edgePaths.map((d,i)=>{
   const completed=i<state.step,active=i===state.step;
   const cls=completed?"completed":active?"active":"future";
   const label=ss[i]?.event||ss[i]?.title||"";
   const edgeLabel=i===0?'<text class="mechanism-edge-label" x="400" y="77" text-anchor="middle">'+esc(label)+'</text>':i===1?'<text class="mechanism-edge-label" x="616" y="190" text-anchor="start">'+esc(label.length>13?label.slice(0,12)+"…":label)+'</text>':'<text class="mechanism-edge-label" x="400" y="266" text-anchor="middle">'+esc(label)+'</text>';
   const packets=active&&state.flowPulse?'<circle class="mechanism-packet" r="5"><animateMotion dur="2.15s" repeatCount="1" fill="freeze" path="'+d+'"/></circle><circle class="mechanism-packet secondary" r="3.2"><animateMotion begin="0.22s" dur="1.65s" repeatCount="indefinite" path="'+d+'"/></circle>':"";
   return '<g class="mechanism-edge-group '+cls+'"><path class="mechanism-link '+cls+'" d="'+d+'" marker-end="url(#mechanism-arrow)"/>'+edgeLabel+packets+'</g>';
 }).join("");
 const marks=labels.map((label,i)=>{
   const p=positions[i],kind=nodeKind(label),active=i===state.step,passed=i<state.step,receiving=i===state.step+1;
   const cls=active?"active":passed?"passed":receiving?"receiving":"";
   const glyphColor=kind==="verify"||kind==="bug"?"var(--amber)":kind==="knowledge"||kind==="document"||kind==="ticket"?"var(--purple)":kind==="agent"||kind==="code"?"var(--teal)":"var(--blue)";
   return '<g class="mechanism-object '+cls+' kind-'+kind+'" data-step="'+i+'" tabindex="0" role="button" aria-label="'+esc(label)+'"><ellipse class="object-shadow" cx="'+p.x+'" cy="'+(p.y+47)+'" rx="57" ry="10"/><polygon class="object-side-left" points="'+(p.x-52)+','+(p.y-2)+' '+p.x+','+(p.y+24)+' '+p.x+','+(p.y+53)+' '+(p.x-52)+','+(p.y+26)+'"/><polygon class="object-side-right" points="'+(p.x+52)+','+(p.y-2)+' '+p.x+','+(p.y+24)+' '+p.x+','+(p.y+53)+' '+(p.x+52)+','+(p.y+26)+'"/><polygon class="object-top" points="'+p.x+','+(p.y-30)+' '+(p.x+52)+','+(p.y-2)+' '+p.x+','+(p.y+24)+' '+(p.x-52)+','+(p.y-2)+'"/><g class="object-icon" style="color:'+glyphColor+'" transform="translate('+p.x+' '+(p.y-3)+')">'+objectGlyph(kind)+'</g><text class="object-index" x="'+(p.x-58)+'" y="'+(p.y-37)+'">'+String(i+1).padStart(2,"0")+'</text><text class="object-label" x="'+p.x+'" y="'+(p.y+76)+'" text-anchor="middle">'+esc(label)+'</text><text class="object-type" x="'+p.x+'" y="'+(p.y+91)+'" text-anchor="middle">'+kind.toUpperCase()+'</text></g>';
 }).join("");
 const progress=state.step===ss.length-1?"当前主题的最后一个阶段":"当前节点正在处理，信息将沿连线流向下一节点";
 return '<div class="mechanism-view '+(state.flowPulse?"flow-pulse":"")+'" style="--flow-duration:'+(2.25/state.speed)+'s"><div class="mechanism-meta"><span>机制对象 · 信息 / 控制流</span><span>当前阶段：'+String(state.step+1).padStart(2,"0")+' / '+String(ss.length).padStart(2,"0")+'</span></div><div class="mechanism-diagram-wrap"><svg class="mechanism-diagram" viewBox="0 0 800 390" role="img" aria-label="'+esc(l.title)+'机制流转图"><defs><marker id="mechanism-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--blue)"/></marker></defs>'+lines+marks+'</svg></div><div class="active-stage"><div class="active-stage-no">'+String(state.step+1).padStart(2,"0")+'</div><div><span class="task-kicker">'+esc(s.actor)+'</span><h2>'+esc(s.title)+'</h2><p>'+esc(s.detail)+'</p></div></div><div class="artifact-row"><div><small>阶段产物</small><b>'+esc(s.artifact)+'</b></div><div><small>交接要求</small><b>'+esc(s.handoff)+'</b></div></div><div class="mechanism-bottom"><span>'+progress+'；节点图表达本主题的教学机制，不等同于真实代码调用图。</span><button class="secondary" data-mode="graph">查看关联主题 →</button></div></div>';
}
function graph(l,related) {
 const nodes=[{title:l.title,x:340,y:118,id:null},...related.slice(0,6).map((x,i)=>({title:x.title,id:x.id,x:[55,340,625,55,340,625][i],y:[25,25,25,220,220,220][i]}))];
 const edges=nodes.slice(1).map((n)=>'<line class="graph-edge" x1="415" y1="144" x2="'+(n.x+75)+'" y2="'+(n.y+26)+'"/>').join("");
 const marks=nodes.map((n,i)=>'<g class="graph-node '+(i===0?"current":"related")+'" '+(n.id?'data-related="'+n.id+'"':"")+'><rect x="'+n.x+'" y="'+n.y+'" width="150" height="52" rx="7"/><text x="'+(n.x+75)+'" y="'+(n.y+30)+'" text-anchor="middle">'+esc(n.title.length>13?n.title.slice(0,12)+"…":n.title)+'</text></g>').join("");
 return '<div class="graph-view"><div class="mechanism-meta"><span>当前知识主题的直接关联</span><span>概念关系 · 非严格前置依赖</span></div><svg class="knowledge-svg" viewBox="0 0 830 300" role="img" aria-label="'+esc(l.title)+' 关联主题图">'+edges+marks+'</svg><div class="graph-selected"><b>'+esc(l.title)+'</b><p>'+esc(l.summary)+' 相关主题用于提示延伸学习，不代表严格执行顺序。</p></div><div class="graph-legend"><span>当前主题</span><span>直接关联主题</span></div></div>';
}
function rightContent(l,s) {
 if(state.tab==="command") return '<div class="detail-block"><span class="detail-kicker">可复制操作指令</span><h3>'+esc(s.title)+'</h3><p>以下提示词是课程提供的实践模板，请结合项目上下文使用。</p><pre class="prompt">'+esc(s.prompt)+'</pre><button class="copy-prompt" data-copy>复制 Prompt</button></div>';
 if(state.tab==="sources") return '<div class="detail-block"><span class="detail-kicker">UPSTREAM SOURCES</span><h3>上游依据与适用边界</h3><p>课程内容是实践整理；Skill 名称与调用权限以当前安装版本为准。</p><ul>'+l.sources.map((x)=>'<li><a href="'+esc(x.url)+'" target="_blank" rel="noreferrer">'+esc(x.title)+' ↗</a><p>'+esc(x.note)+'</p></li>').join("")+'</ul></div>';
 return '<div class="detail-block"><span class="detail-kicker">MECHANISM / WHY IT MATTERS</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.detail)+'</p><div class="detail-section"><b>阶段产物</b><p>'+esc(s.artifact)+'</p></div><div class="detail-section"><b>交接规则</b><p>'+esc(s.handoff)+'</p></div><div class="detail-section"><b>主题原则</b><p>'+esc(l.principle)+'</p></div><div class="callout">核对实际工件和证据；不要把 Agent 的完成陈述当作验证结果。</div></div>';
}
function topicPage(kind) {
 const isKnowledge=kind==="knowledge";
 return '<div class="topic-page"><div class="eyebrow">ENGINEERING TOPIC</div><h1>'+(isKnowledge?"项目知识与 CodeGraph":"测试、验证与真实验收")+'</h1><p class="topic-lead">'+(isKnowledge?"让新会话同时理解当初为什么这样设计，以及当前代码实际上如何运行。":"测试通过只证明已有断言通过。必须把需求覆盖、实现符合性和真实用户验收分开。")+'</p><div class="topic-workspace"><section class="panel topic-main"><div class="panel-heading"><b>'+(isKnowledge?"业务意图与代码事实":"五层验证闭环")+'</b></div><div class="topic-diagram">'+(isKnowledge?'<div class="knowledge-pair"><div class="knowledge-box human"><b>Matt · Intent Knowledge</b><span>GLOSSARY</span><span>ADR</span><span>Feature Spec</span><span>Module Knowledge</span></div><div class="merge">↔</div><div class="knowledge-box code"><b>CodeGraph · Code Knowledge</b><span>Symbols / Routes</span><span>Calls / Imports</span><span>Dependencies</span><span>Impact / Tests</span></div></div>':'<div class="verify-layers"><div><b>01 Unit</b><span>函数 / 组件行为</span></div><div><b>02 Integration</b><span>数据库 / API / 服务协同</span></div><div><b>03 E2E</b><span>完整用户操作链路</span></div><div><b>04 Spec Review</b><span>需求与实现一致性</span></div><div><b>05 Human Acceptance</b><span>真实使用是否符合预期</span></div></div>')+'</div></section><section class="panel topic-side"><div class="panel-heading"><b>核心边界</b></div><div class="panel-content"><p>'+(isKnowledge?"CodeGraph 提供代码结构线索，不替代业务文档、SQL 核对或运行时验证。":"自动化测试通过不等于需求满足，更不等于人工验收完成。")+'</p></div></section></div></div>';
}
function skillsPage(){return '<div class="topic-page"><div class="eyebrow">REFERENCE / SKILL CATALOG</div><h1>Matt Pocock Skills 索引</h1><p class="topic-lead">Skill 的名称、调用权限和内容以当前安装的上游版本为准。</p><div class="skill-grid">'+CUR.lessons.filter((l)=>l.sources.length).slice(0,12).map((l)=>'<article class="skill-card"><h3>'+esc(l.title)+'</h3><p>'+esc(l.summary)+'</p></article>').join("")+'</div></div>';}
function render() {
 nav();
 $("#main").innerHTML=state.page==="home"?home():state.page==="playbooks"?playbookHub():state.page==="playbook"?playbookPage():state.page==="course"?course():state.page==="knowledge"?topicPage("knowledge"):state.page==="verify"?topicPage("verify"):skillsPage();
 const pageStatus=$("#page-status");
 if(pageStatus)pageStatus.textContent=state.page==="course"?current().title:state.page==="playbook"?currentPlaybook().title:state.page==="playbooks"?"04 工作流实战":state.page==="home"?"任务入口 · 真实开发案例":state.page==="knowledge"?"项目知识与 CodeGraph":state.page==="verify"?"测试、验证与验收":"Matt Skills 索引";
 $("#search").value=state.search;
 $("#progress-count").textContent=Object.keys(progress).length+" / "+(lessons.length+playbooks.length);
}
function activeStages(){return state.page==="playbook"?practiceSteps():stages();}
function changeStep(n) {
 state.step=Math.max(0,Math.min(activeStages().length-1,n));
 state.flowPulse=true;
 render();
}
function play() {
 if(state.playing){stop();render();return;}
 if(state.step>=activeStages().length-1)state.step=0;
 state.playing=true;
 state.flowPulse=true;
 render();
}
document.addEventListener("animationend",(e)=>{
 if(e.animationName!=="mechanism-flow")return;
 const edge=e.target.closest?.(".mechanism-edge-group.active, .practice-edge-group.active");
 if(!edge || !state.flowPulse)return;
 state.flowPulse=false;
 if(state.playing){
   if(state.step<activeStages().length-1)state.step+=1;
   if(state.step>=activeStages().length-1){
     state.playing=false;
   }else{
     state.flowPulse=true;
   }
   render();
 }
});

document.addEventListener("click",(e)=>{
 const b=e.target.closest("button,a"); if(!b)return;
 if(b.dataset.category!==undefined){state.group=Number(b.dataset.category);goLesson(currentGroupLessons()[0].id);return;}
 if(b.dataset.lesson){goLesson(b.dataset.lesson);return;}
 if(b.dataset.playbook){goPlaybook(b.dataset.playbook);return;}
 if(b.dataset.branch){stop();state.branch=b.dataset.branch;state.step=0;render();return;}
 if(b.dataset.homeMode){state.mode=b.dataset.homeMode;render();return;}
 if(b.dataset.practiceSection){stop();state.practiceSection=b.dataset.practiceSection;render();return;}
 if(b.dataset.practiceStep!==undefined){stop();state.practiceSection="execution";changeStep(Number(b.dataset.practiceStep));return;}
 if(b.dataset.practiceTab){state.practiceTab=b.dataset.practiceTab;render();return;}
 if(b.dataset.homeStep!==undefined){state.step=Number(b.dataset.homeStep);render();return;}
 if(b.dataset.page){e.preventDefault();goPage(b.dataset.page);return;}
 if(b.dataset.mode){state.mode=b.dataset.mode;render();return;}
 if(b.dataset.step!==undefined){stop();changeStep(Number(b.dataset.step));return;}
 if(b.dataset.tab){state.tab=b.dataset.tab;render();return;}
 if(b.hasAttribute("data-next")){stop();changeStep(state.step+1);return;}
 if(b.hasAttribute("data-prev")){stop();changeStep(state.step-1);return;}
 if(b.hasAttribute("data-play")){play();return;}
 if(b.hasAttribute("data-reset")){stop();state.step=0;render();return;}
 if(b.hasAttribute("data-mark")){progress[state.lesson]=true;localStorage.setItem("ael-progress-v3",JSON.stringify(progress));render();return;}
 if(b.hasAttribute("data-practice-mark")){progress["playbook:"+state.playbook]=true;localStorage.setItem("ael-progress-v3",JSON.stringify(progress));render();return;}
 if(b.hasAttribute("data-copy")){navigator.clipboard?.writeText(stages()[state.step].prompt).then(()=>{b.textContent="已复制 ✓";}).catch(()=>{b.textContent="复制失败";});return;}
 if(b.hasAttribute("data-copy-command")){navigator.clipboard?.writeText(practiceSteps()[state.step].invocation.command||"").then(()=>{b.textContent="已复制 ✓";}).catch(()=>{b.textContent="复制失败";});return;}
 if(b.hasAttribute("data-copy-practice-prompt")){navigator.clipboard?.writeText(practiceSteps()[state.step].prompt).then(()=>{b.textContent="已复制 ✓";}).catch(()=>{b.textContent="复制失败";});return;}
});
document.addEventListener("change",(e)=>{if(e.target.id==="speed"){state.speed=Number(e.target.value);if(state.playing){state.flowPulse=true;render();}}});
$("#theme").addEventListener("click",()=>{const t=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=t;localStorage.setItem("ael-theme",t);});
$("#search").addEventListener("input",(e)=>{state.search=e.target.value;const q=state.search.trim().toLowerCase();if(!q)return;const match=lessons.find((l)=>(l.title+" "+l.summary+" "+l.principle+" "+l.prompt+" "+l.en).toLowerCase().includes(q));if(match){goLesson(match.id);return;}const practiceMatch=playbooks.find((p)=>{const sc=scenarios.find((x)=>x.id===p.scenarioId);return (p.title+" "+p.workflow+" "+p.summary+" "+sc.title+" "+sc.request).toLowerCase().includes(q)});if(practiceMatch)goPlaybook(practiceMatch.id);});
document.addEventListener("keydown",(e)=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("#search").focus();}if(e.key==="Escape"&&document.activeElement===$("#search"))$("#search").blur();});
const saved=localStorage.getItem("ael-theme");if(saved)document.documentElement.dataset.theme=saved;
render();
})();
