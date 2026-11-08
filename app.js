(() => {
"use strict";
const CUR = window.LAB_CURRICULUM;
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const groups = CUR.groups;
const lessons = CUR.lessons;
const state = {page:"home", group:0, lesson:lessons[0].id, mode:"task", step:0, branch:"main", tab:"mechanism", playing:false, speed:1, search:""};
const progress = JSON.parse(localStorage.getItem("ael-progress-v3") || "{}");
let timer = null;
const current = () => lessons.find((l) => l.id === state.lesson) || lessons[0];
const currentGroupLessons = () => lessons.filter((l) => l.group === state.group);
const stages = () => state.branch === "main" ? current().main : current().fault.steps;
const stop = () => { state.playing=false; if (timer) clearInterval(timer); timer=null; };
function goLesson(id) {
  stop();
  const lesson=lessons.find((l)=>l.id===id);
  if(!lesson) return;
  state.lesson=id; state.group=lesson.group; state.page="course"; state.mode="task"; state.step=0; state.branch="main"; state.tab="mechanism";
  render(); window.scrollTo(0,0);
}
function goPage(page) { stop(); state.page=page; render(); window.scrollTo(0,0); }
function nav() {
  document.querySelectorAll("[data-category]").forEach((b)=>b.classList.toggle("active",Number(b.dataset.category)===state.group));
  document.querySelectorAll("[data-page]").forEach((b)=>b.classList.toggle("active",b.dataset.page===state.page));
  $("#app-layout").classList.toggle("home-mode",state.page==="home");
  const list=currentGroupLessons();
  $("#course-nav").innerHTML=list.map((l)=>'<button class="course-nav '+(state.page==="course"&&l.id===state.lesson?"active":"")+'" data-lesson="'+l.id+'"><span class="nav-no">'+String(lessons.indexOf(l)+1).padStart(2,"0")+'</span><span>'+esc(l.title)+'</span><small>'+esc(l.en)+'</small></button>').join("");
}
function home() {
  const g=groups[state.group];
  const cards=currentGroupLessons().map((l)=>'<button class="task-card" data-lesson="'+l.id+'"><div class="task-card-top"><span class="number">'+String(lessons.indexOf(l)+1).padStart(2,"0")+' / TOPIC</span><span class="mini-tag">'+esc(l.en)+'</span></div><h3>'+esc(l.title)+'</h3><p>'+esc(l.summary)+'</p><div class="card-bottom"><span>进入知识主题</span><b>→</b></div></button>').join("");
  const tabs='<div class="home-modebar"><div class="mode-left"><button data-home-mode="task" class="'+(state.mode==="task"?"active":"")+'">⌂ 任务入口</button><button data-home-mode="mechanism" class="'+(state.mode==="mechanism"?"active":"")+'">⬡ 机制演示</button><button data-home-mode="graph" class="'+(state.mode==="graph"?"active":"")+'">♧ 知识图谱</button></div><span class="mode-hint">AI ENGINEERING LEARNING MODEL</span></div>';
  if(state.mode==="mechanism") return tabs+homeMechanism();
  if(state.mode==="graph") return tabs+homeGraph();
  return '<div class="home-shell">'+tabs+'<section class="home-hero"><div class="eyebrow">START WITH A REAL ENGINEERING TASK</div><h1>先解决一个工程问题，<br><em>再掌握背后的方法。</em></h1><p>从真实开发问题出发，选择合适的知识主题。理解需求如何澄清、决策如何沉淀、代码如何实现，以及结果如何验证。</p><div class="hero-meta"><span>● 三大学习领域</span><span>● '+lessons.length+' 个知识主题</span><span>● 任务、机制与知识图谱三种视角</span></div></section><div class="category-heading"><div><span class="eyebrow">0'+(state.group+1)+' / 03 · LEARNING DOMAIN</span><h2>'+esc(g.title)+'</h2><p>'+esc(g.intro)+'</p></div><span class="category-count">'+currentGroupLessons().length+' 个知识主题</span></div><div class="task-grid home-task-grid">'+cards+'</div><section class="learning-route"><div class="route-intro"><span class="eyebrow">SUGGESTED LEARNING ROUTE</span><h3>本领域的学习路径</h3><p>从基础概念到真实开发应用，逐步建立工程认知。</p></div><div class="route-cards">'+currentGroupLessons().slice(0,4).map((l,i)=>'<div class="route-card"><span>0'+(i+1)+'</span><b>'+esc(l.title)+'</b><small>'+esc(l.summary)+'</small></div>').join("")+'</div></section><section class="home-bottom"><div class="home-topic"><span class="topic-icon">◇</span><div><b>新会话如何快速理解项目？</b><p>业务意图由 Matt 的工程工件保存，代码结构由 CodeGraph 动态探索。</p><button data-page="knowledge">学习项目知识与 CodeGraph →</button></div></div><div class="home-topic"><span class="topic-icon">✓</span><div><b>为什么测试通过，实际使用仍有问题？</b><p>把自动化测试、规格审查和人工验收分开管理。</p><button data-page="verify">学习测试与验收闭环 →</button></div></div></section></div>';
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
 const l=current(), ss=stages(), s=ss[Math.min(state.step,ss.length-1)], related=l.related.map((id)=>lessons.find((x)=>x.id===id)).filter(Boolean);
 const trace=ss.map((x,i)=>'<button class="trace-row '+(i===state.step?"active":"")+'" data-step="'+i+'"><span class="trace-index">'+String(i+1).padStart(2,"0")+'</span><span class="trace-event">'+esc(x.title)+'</span><span class="trace-actor">'+esc(x.actor)+'</span><span class="trace-status">'+(i<state.step?"已回顾":i===state.step?"当前阶段":"待学习")+'</span></button>').join("");
 let center="";
 if(state.mode==="task") center='<div class="task-view"><div class="task-kicker">LEARNING SCENARIO</div><h2>'+esc(l.title)+'</h2><p class="task-description">'+esc(l.summary)+'</p><div class="task-facts"><div><small>核心原则</small><b>'+esc(l.principle)+'</b></div><div><small>实践重点</small><b>'+esc(l.tradeoff)+'</b></div><div><small>核心工件</small><b>'+esc(l.artifact)+'</b></div></div><div class="task-route"><div class="route-head"><b>推荐学习路径</b><span>点击阶段进入学习</span></div><div class="route-steps">'+l.main.map((x,i)=>'<button data-step="'+i+'" class="'+(i===state.step?"active":"")+'"><span>0'+(i+1)+'</span><b>'+esc(x.title)+'</b><small>'+esc(x.actor)+'</small></button>').join("")+'</div></div><div class="current-task"><span class="current-label">当前阶段</span><b>'+esc(s.title)+'</b><p>'+esc(s.detail)+'</p><button class="primary" data-mode="mechanism">进入机制演示 →</button></div></div>';
 else if(state.mode==="mechanism") center=mechanism(l,ss,s);
 else center=graph(l,related);
 return '<div class="course-shell"><div class="course-heading"><div><div class="eyebrow">0'+(l.group+1)+' / '+esc(groups[l.group].en)+'</div><h1>'+esc(l.title)+'</h1><p>'+esc(l.summary)+'</p></div><span class="level-chip">'+String(lessons.indexOf(l)+1).padStart(2,"0")+' / '+lessons.length+'</span></div><div class="story-strip"><div><span class="story-label">核心原则</span><b>'+esc(l.principle)+'</b><p>'+esc(l.tradeoff)+'</p></div><div class="story-side"><span>常见误区</span><p>'+esc(l.pitfall)+'</p></div></div><div class="mode-tabs"><div class="mode-left"><button data-mode="task" class="'+(state.mode==="task"?"active":"")+'">⌂ 任务入口</button><button data-mode="mechanism" class="'+(state.mode==="mechanism"?"active":"")+'">⬡ 机制演示</button><button data-mode="graph" class="'+(state.mode==="graph"?"active":"")+'">♧ 知识图谱</button></div><span class="mode-hint">'+(state.mode==="task"?"任务入口":state.mode==="mechanism"?"机制演示":"知识图谱")+' · '+currentGroupLessons().length+' 个主题</span></div><div class="workbench"><section class="left-panel panel"><div class="panel-heading"><b>学习目录 · '+esc(groups[l.group].title)+'</b><span>'+currentGroupLessons().length+'</span></div><div class="panel-content"><div class="step-list topic-course-list">'+currentGroupLessons().map((x)=>'<button class="step-item '+(x.id===l.id?"active":"")+'" data-lesson="'+x.id+'"><span>'+String(lessons.indexOf(x)+1).padStart(2,"0")+'</span><b>'+esc(x.title)+'</b></button>').join("")+'</div><div class="side-rule"><b>本主题目标</b><p>'+esc(l.summary)+'</p><b>相关主题</b><p>'+related.map((x)=>esc(x.title)).join(" · ")+'</p></div></div></section><section class="center-panel panel"><div class="panel-heading"><b>'+ (state.mode==="task"?"任务入口":state.mode==="mechanism"?"机制演示":"知识图谱")+'</b><span>LEARNING CANVAS</span></div><div class="center-content">'+center+'</div></section><section class="right-panel panel"><div class="panel-heading"><b>机制详解</b><span>'+String(state.step+1).padStart(2,"0")+' / '+ss.length+'</span></div><div class="right-tabs"><button data-tab="mechanism" class="'+(state.tab==="mechanism"?"active":"")+'">机制</button><button data-tab="command" class="'+(state.tab==="command"?"active":"")+'">命令 / Prompt</button><button data-tab="sources" class="'+(state.tab==="sources"?"active":"")+'">来源</button></div><div class="right-content">'+rightContent(l,s)+'</div></section></div><section class="trace-panel panel"><div class="trace-head"><div><b>执行轨迹</b><span>'+String(state.step+1).padStart(2,"0")+' / '+ss.length+'</span></div><div class="play-controls"><select id="speed"><option value="1">1×</option><option value=".7">0.7×</option><option value="1.5">1.5×</option></select><button data-prev '+(state.step===0?"disabled":"")+' >‹</button><button class="play-btn" data-play>'+(state.playing?"Ⅱ 暂停":"▶ 播放")+'</button><button data-next>下一步 ›</button><button data-reset>↺</button></div></div><div class="trace-columns"><span>步骤</span><span>事件</span><span>执行者</span><span>状态观察</span></div><div class="trace-rows">'+trace+'</div></section><div class="course-footer"><span>核心工件：'+esc(l.artifact)+'</span><button class="mark-btn" data-mark>'+(progress[l.id]?"✓ 已标记掌握":"标记当前主题已掌握")+'</button></div></div>';
}
function mechanism(l,ss,s) {
 const count=ss.length, nodes=ss.map((x,i)=>{const px=45+i*(710/Math.max(1,count-1));return '<g class="svg-node '+(i===state.step?"selected":i<state.step?"passed":"")+'" data-step="'+i+'" tabindex="0" role="button"><circle cx="'+px+'" cy="70" r="22"></circle><text x="'+px+'" y="75" text-anchor="middle">'+String(i+1).padStart(2,"0")+'</text><text class="node-label" x="'+px+'" y="112" text-anchor="middle">'+esc(x.title.length>9?x.title.slice(0,8)+"…":x.title)+'</text></g>';}).join("");
 const lines=ss.slice(0,-1).map((x,i)=>{const a=45+i*(710/Math.max(1,count-1)),b=45+(i+1)*(710/Math.max(1,count-1));return '<line class="svg-link '+(i<state.step?"passed":"")+'" x1="'+(a+22)+'" y1="70" x2="'+(b-22)+'" y2="70"/>';}).join("");
 return '<div class="mechanism-view"><div class="mechanism-meta"><span>知识机制 · '+count+' 个阶段</span><span>当前：'+String(state.step+1).padStart(2,"0")+'</span></div><div class="svg-scroll"><svg class="workflow-svg" viewBox="0 0 800 150" role="img" aria-label="'+esc(l.title)+'机制图">'+lines+nodes+'</svg></div><div class="active-stage"><div class="active-stage-no">'+String(state.step+1).padStart(2,"0")+'</div><div><span class="task-kicker">'+esc(s.actor)+'</span><h2>'+esc(s.title)+'</h2><p>'+esc(s.detail)+'</p></div></div><div class="artifact-row"><div><small>阶段产物</small><b>'+esc(s.artifact)+'</b></div><div><small>交接要求</small><b>'+esc(s.handoff)+'</b></div></div><div class="mechanism-bottom"><span>流程关系为教学抽象，不代表所有项目都必须机械执行。</span><button class="secondary" data-mode="graph">查看关联主题 →</button></div></div>';
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
 $("#main").innerHTML=state.page==="home"?home():state.page==="course"?course():state.page==="knowledge"?topicPage("knowledge"):state.page==="verify"?topicPage("verify"):skillsPage();
 $("#page-status").textContent=state.page==="course"?current().title:state.page==="home"?"选择一个要解决的问题":state.page==="knowledge"?"项目知识与 CodeGraph":state.page==="verify"?"测试、验证与验收":"Matt Skills 索引";
 $("#search").value=state.search;
 $("#progress-count").textContent=Object.keys(progress).length+" / "+lessons.length;
}
function changeStep(n) { state.step=Math.max(0,Math.min(stages().length-1,n)); render(); }
function play() {
 if(state.playing){stop();render();return;}
 if(state.step>=stages().length-1)state.step=0;
 state.playing=true;render();
 timer=setInterval(()=>{if(state.step>=stages().length-1){stop();render();return;}state.step++;render();},2400/state.speed);
}
document.addEventListener("click",(e)=>{
 const b=e.target.closest("button,a"); if(!b)return;
 if(b.dataset.category!==undefined){state.group=Number(b.dataset.category);goLesson(currentGroupLessons()[0].id);return;}
 if(b.dataset.lesson){goLesson(b.dataset.lesson);return;}
 if(b.dataset.homeMode){state.mode=b.dataset.homeMode;render();return;}
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
 if(b.hasAttribute("data-copy")){navigator.clipboard?.writeText(stages()[state.step].prompt).then(()=>{b.textContent="已复制 ✓";}).catch(()=>{b.textContent="复制失败";});return;}
});
document.addEventListener("change",(e)=>{if(e.target.id==="speed"){state.speed=Number(e.target.value);if(state.playing){stop();play();}}});
$("#theme").addEventListener("click",()=>{const t=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=t;localStorage.setItem("ael-theme",t);});
$("#search").addEventListener("input",(e)=>{state.search=e.target.value;const q=state.search.trim().toLowerCase();if(!q)return;const match=lessons.find((l)=>(l.title+" "+l.summary+" "+l.principle+" "+l.prompt+" "+l.en).toLowerCase().includes(q));if(match)goLesson(match.id);});
document.addEventListener("keydown",(e)=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("#search").focus();}if(e.key==="Escape"&&document.activeElement===$("#search"))$("#search").blur();});
const saved=localStorage.getItem("ael-theme");if(saved)document.documentElement.dataset.theme=saved;
render();
})();