(() => {
"use strict";
const CUR = window.LAB_CURRICULUM;
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const groups = CUR.groups;
const lessons = CUR.lessons;
const stories = (window.LAB_DATA && window.LAB_DATA.workflows) || [];
const storyDomain = {quick:1,discovery:0,feature:1,architecture:0,bug:2,refactor:2};
const storyLessons = {
 quick:["task-routing","tdd","review"],
 discovery:["grill","domain","adr"],
 feature:["spec","tickets","tdd","review","delivery"],
 architecture:["wayfinder","research","architecture","adr","multi-agent"],
 bug:["bug","codegraph","test-strategy","spec-compliance"],
 refactor:["refactor","codegraph","tdd","architecture"]
};
const state = {page:"home", group:0, lesson:lessons[0].id, story:"quick", mode:"task", step:0, branch:"main", tab:"mechanism", playing:false, speed:1, search:""};
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
  state.lesson=id; state.group=lesson.group; state.page="course"; state.mode="mechanism"; state.step=0; state.branch="main"; state.tab="mechanism";
  render(); window.scrollTo(0,0);
}
function goStory(id) {
  stop();
  if(!stories.some((x)=>x.id===id)) return;
  state.story=id; state.page="story"; state.mode="task"; state.step=0; state.branch="main";
  render(); window.scrollTo(0,0);
}
function goPage(page) {
  stop(); state.page=page;
  if(page==="home"){state.mode="task";state.step=0;}
  render(); window.scrollTo(0,0);
}
function nav() {
  document.querySelectorAll("[data-category]").forEach((b)=>b.classList.toggle("active",state.page==="course"&&Number(b.dataset.category)===state.group));
  document.querySelectorAll("[data-page]").forEach((b)=>b.classList.toggle("active",b.dataset.page==="home"?(state.page==="home"||state.page==="story"):b.dataset.page===state.page));
  $("#app-layout").classList.toggle("home-mode",state.page==="home"||state.page==="story");
}
function home() {
 const storyCards=stories.map((w)=>{
   const group=groups[storyDomain[w.id]??1];
   return '<button class="task-card story-card" data-story="'+w.id+'"><div class="task-card-top"><span class="number">'+w.n+' / REAL CASE</span><span class="mini-tag">'+esc(w.level)+'</span></div><h3>'+esc(w.story)+'</h3><p>'+esc(w.bg)+'</p><div class="story-card-meta"><span>'+esc(group.title)+'</span><span>'+w.main.length+' 个阶段</span></div><div class="card-bottom"><span>进入完整开发故事</span><b>→</b></div></button>';
 }).join("");
 const tabs='<div class="home-modebar"><div class="mode-left"><button data-home-mode="task" class="'+(state.mode==="task"?"active":"")+'">⌂ 任务入口</button><button data-home-mode="mechanism" class="'+(state.mode==="mechanism"?"active":"")+'">⬡ 机制演示</button><button data-home-mode="graph" class="'+(state.mode==="graph"?"active":"")+'">♧ 知识图谱</button></div><span class="mode-hint">AI ENGINEERING LEARNING MODEL</span></div>';
 if(state.mode==="mechanism") return '<div class="home-shell">'+tabs+homeMechanism()+'</div>';
 if(state.mode==="graph") return '<div class="home-shell">'+tabs+homeGraph()+'</div>';
 const domainCards=groups.map((g,i)=>'<button class="domain-card" data-category="'+i+'"><span class="domain-number">0'+(i+1)+'</span><div><b>'+esc(g.title)+'</b><p>'+esc(g.intro)+'</p><small>'+lessons.filter((l)=>l.group===i).length+' 个知识主题 · 进入课程体系 →</small></div></button>').join("");
 return '<div class="home-shell">'+tabs+
 '<section class="home-hero"><div class="eyebrow">START WITH A REAL ENGINEERING TASK</div><h1>先从一个真实开发问题开始，<br><em>再掌握背后的工程方法。</em></h1><p>像真实项目一样学习：选择一个你正在面对的场景，沿着开发故事看清需求、决策、实施与验证。需要系统掌握方法时，再进入对应的知识课程。</p><div class="hero-meta"><span>● 6 个真实开发案例</span><span>● 完整主流程与常见错误</span><span>● 可关联到 22 个知识主题</span></div></section>'+
 '<div class="category-heading story-section-heading"><div><span class="eyebrow">CHOOSE A REAL-WORLD SCENARIO</span><h2>你现在想解决什么问题？</h2><p>从任务目标进入，不必先理解所有 Skill 名称。</p></div><span class="category-count">'+stories.length+' 个实践故事</span></div>'+
 '<div class="task-grid home-task-grid story-grid">'+storyCards+'</div>'+
 '<section class="learning-route"><div class="route-intro"><span class="eyebrow">A PRACTICAL ENGINEERING JOURNEY</span><h3>一次开发任务的典型旅程</h3><p>不同任务不一定走完所有步骤；根据不确定性和风险选择最小充分流程。</p></div><div class="route-cards"><div class="route-card"><span>01</span><b>理解问题</b><small>恢复项目上下文，澄清真实目标</small></div><div class="route-card"><span>02</span><b>形成规格</b><small>记录业务规则、边界与验收条件</small></div><div class="route-card"><span>03</span><b>实施验证</b><small>拆分任务，TDD 与独立审查</small></div><div class="route-card"><span>04</span><b>交付沉淀</b><small>人工验收，更新项目知识</small></div></div></section>'+
 '<section class="knowledge-entry"><div class="knowledge-entry-heading"><div><span class="eyebrow">SYSTEMATIC KNOWLEDGE CURRICULUM</span><h2>想系统学习某个工程方法？</h2><p>这里是独立的知识课程体系。每个领域包含可逐步深入的知识主题，与上面的真实开发故事相互关联。</p></div><span class="category-count">'+lessons.length+' 个知识主题</span></div><div class="domain-grid">'+domainCards+'</div></section>'+
 '</div>';
}
function storyPage() {
 const w=stories.find((x)=>x.id===state.story)||stories[0];
 const group=groups[storyDomain[w.id]??1];
 const related=(storyLessons[w.id]||[]).map((id)=>lessons.find((l)=>l.id===id)).filter(Boolean);
 const stages=w.main.map((x,i)=>'<article class="story-stage"><div class="story-stage-number">'+String(i+1).padStart(2,"0")+'</div><div class="story-stage-body"><div class="story-stage-head"><h3>'+esc(x[0])+'</h3><span>'+esc(x[1])+'</span></div><p>'+esc(x[2])+'</p><div class="story-stage-artifacts"><div><small>阶段产物</small><b>'+esc(x[3])+'</b></div><div><small>交接提示</small><b>'+esc(x[4])+'</b></div></div><details><summary>查看可复制操作指令</summary><pre>'+esc(x[5]||"")+'</pre></details></div></article>').join("");
 const faults=w.fault.map((x)=>'<article class="story-fault"><b>'+esc(x[0])+'</b><p>'+esc(x[1])+'</p><div>'+esc(x[2])+'</div></article>').join("");
 const linked=related.map((l)=>'<button class="related-lesson" data-lesson="'+l.id+'"><span>'+String(lessons.indexOf(l)+1).padStart(2,"0")+'</span><b>'+esc(l.title)+'</b><small>进入知识课程 →</small></button>').join("");
 return '<div class="story-page"><div class="story-backline"><button data-page="home">← 返回任务入口</button><span>真实开发故事 / '+esc(group.title)+'</span></div><section class="story-hero"><div><div class="eyebrow">REAL-WORLD ENGINEERING STORY · '+esc(w.level)+'</div><h1>'+esc(w.story)+'</h1><p>'+esc(w.bg)+'</p></div><div class="story-hero-side"><small>实践工作流</small><b>'+esc(w.title)+'</b><small>主要使用能力</small><b>'+esc(w.skills)+'</b></div></section><div class="story-summary-grid"><div><small>适用场景</small><p>'+esc(w.when)+'</p></div><div><small>预期产物</small><p>'+esc(w.out)+'</p></div><div><small>流程边界</small><p>'+esc(w.gate)+'</p></div></div><div class="story-content-grid"><section class="story-main"><div class="story-section-title"><div><span class="eyebrow">MAIN JOURNEY</span><h2>完整开发故事</h2></div><span>'+w.main.length+' 个阶段</span></div><div class="story-stages">'+stages+'</div><div class="story-section-title fault-title"><div><span class="eyebrow">WHAT CAN GO WRONG</span><h2>常见错误与纠正</h2></div><span>'+w.fault.length+' 个案例</span></div><div class="story-fault-grid">'+faults+'</div></section><aside class="story-related"><div class="story-section-title"><div><span class="eyebrow">KNOWLEDGE CONNECTIONS</span><h2>关联知识课程</h2></div></div><p>实践故事告诉你一次任务如何推进；以下课程帮助你单独掌握其中的方法。</p><div class="related-list">'+linked+'</div><button class="back-to-tasks" data-page="home">选择其他实践故事 →</button></aside></div></div>';
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
function mechanism(l,ss,s,nodes) {
 const labels=(nodes&&nodes.length?nodes:l.nodes).slice(0,4);
 const positions=[{x:105,y:28},{x:470,y:28},{x:470,y:170},{x:105,y:170}];
 const links=[[0,1],[1,2],[2,3]];
 const lines=links.map(([a,b],i)=>{
   const p=positions[a],q=positions[b];
   const x1=p.x+115,y1=p.y+37,x2=q.x+115,y2=q.y+37;
   return '<path class="mechanism-link '+(i<state.step?"passed":"")+'" d="M '+x1+' '+y1+' L '+x2+' '+y2+'" fill="none" marker-end="url(#flow-arrow)"/>';
 }).join("");
 const marks=labels.map((label,i)=>{
   const p=positions[i],active=i===state.step,passed=i<state.step;
   return '<g class="mechanism-node '+(active?"active":passed?"passed":"")+'" data-step="'+i+'" tabindex="0" role="button" aria-label="'+esc(label)+'"><rect x="'+p.x+'" y="'+p.y+'" width="230" height="74" rx="8"/><circle cx="'+(p.x+27)+'" cy="'+(p.y+25)+'" r="13"/><text class="mechanism-node-number" x="'+(p.x+27)+'" y="'+(p.y+29)+'" text-anchor="middle">'+String(i+1).padStart(2,"0")+'</text><text class="mechanism-node-label" x="'+(p.x+115)+'" y="'+(p.y+49)+'" text-anchor="middle">'+esc(label.length>15?label.slice(0,14)+"…":label)+'</text></g>';
 }).join("");
 return '<div class="mechanism-view"><div class="mechanism-meta"><span>机制关系 · 教学抽象</span><span>当前阶段：'+String(state.step+1).padStart(2,"0")+'</span></div><div class="mechanism-diagram-wrap"><svg class="mechanism-diagram" viewBox="0 0 700 275" role="img" aria-label="'+esc(l.title)+'机制关系图"><defs><marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--blue)"/></marker></defs>'+lines+marks+'</svg></div><div class="active-stage"><div class="active-stage-no">'+String(state.step+1).padStart(2,"0")+'</div><div><span class="task-kicker">'+esc(s.actor)+'</span><h2>'+esc(s.title)+'</h2><p>'+esc(s.detail)+'</p></div></div><div class="artifact-row"><div><small>阶段产物</small><b>'+esc(s.artifact)+'</b></div><div><small>交接要求</small><b>'+esc(s.handoff)+'</b></div></div><div class="mechanism-bottom"><span>节点表示当前知识主题中的关键环节；连线表达教学关系，不等同于真实代码调用。</span><button class="secondary" data-mode="graph">查看关联主题 →</button></div></div>';
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
 $("#main").innerHTML=state.page==="home"?home():state.page==="story"?storyPage():state.page==="course"?course():state.page==="knowledge"?topicPage("knowledge"):state.page==="verify"?topicPage("verify"):skillsPage();
 $("#page-status").textContent=state.page==="course"?current().title:state.page==="story"?(stories.find((x)=>x.id===state.story)?.story||"真实开发故事"):state.page==="home"?"任务入口 · 真实开发案例":state.page==="knowledge"?"项目知识与 CodeGraph":state.page==="verify"?"测试、验证与验收":"Matt Skills 索引";
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
 if(b.dataset.story){goStory(b.dataset.story);return;}
 if(b.dataset.branch){stop();state.branch=b.dataset.branch;state.step=0;render();return;}
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
