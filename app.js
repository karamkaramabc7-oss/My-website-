// ── CONSTANTS ──
const PRIORITIES = {
  high:   { label: 'عالية',   color: '#FF4757', bg: '#FF475715' },
  medium: { label: 'متوسطة',  color: '#FFA502', bg: '#FFA50215' },
  low:    { label: 'منخفضة',  color: '#2ED573', bg: '#2ED57315' },
};
const CATS = {
  work:     { label: 'العمل',   icon: '💼' },
  personal: { label: 'شخصي',   icon: '🌿' },
  health:   { label: 'صحة',    icon: '❤️' },
  learning: { label: 'تعلم',   icon: '📚' },
  home:     { label: 'المنزل', icon: '🏠' },
};

const PRAISE = [
  'برافو قلبي 🌚💜',
  'برافو حبيبتي 🌚💜',
  'برافو أميرتي 🌚💜',
  'شاطرة حبيبتي 🌚💜',
  'محلاكي بطلة 🌚💜',
  'قلبي مبسوط فيك 🌚💜',
  'إنجاز حلو 🌚💜',
  'شغل مرتب 🌚💜',
  'بطلة والله 🌚💜',
  'يا ويلي مشطرك 🌚💜',
  'شطارتك واضحة 🌚💜',
  'تقدم حلوو 🌚💜',
  'برافو حياتي 🌚💜',
  'برافو روحي 🌚💜',
  'إنجازك بجنن 🌚💜',
  'شاطرة كثير 🌚💜',
  'قلبي يبتسملك 🌚💜',
  'انجاز رائع 🌚💜',
  'شغل يفتح النفس 🌚💜',
  'بطلة حبيبتي 🌚💜',
  'برافو بسبوستي 🌚💜',
  'فخور بانجازك 🌚💜',
  'قلبي فخور فيك 🌚💜',
  'شغل جميل 🌚💜',
  'برافو ملاكي 🌚💜',
  'تقدم رائع 🌚💜',
  'إنجاز يجنن 🌚💜',
  'شغل حلو كثير 🌚💜',
  'بطلة قلبي 🌚💜',
  'برافو حلوتي 🌚💜',
  'شاطرة قمري 🌚💜',
  'إنجاز خرافيي 🌚💜',
  'شغل نظيف 🌚💜',
  'تقدم حلو 🌚💜',
  'شطارة كبيرة 🌚💜',
  'إنجاز مرتب 🌚💜',
  'بطلة اليوم 🌚💜',
  'تقدم واضح 🌚💜',
  'إنجاز يفتح القلب 🌚💜',
  'شغل يفرح 🌚💜',
  'شطارة مميزة 🌚💜',
  'شطورتي ماماا 🌚💜',
  'تقدم ثابت 🌚💜',
  'شغل متقن 🌚💜',
  'وااو يطلتيي 🌚💜',
  'تقدم مبهر 🌚💜',
  'شطارة حقيقية 🌚💜',
  'إنجاز يشرح القلب 🌚💜',
  'شغل متعوب عليه 🌚💜',
  'تقدم يجنن 🌚💜',
];

function showPraise() {
  const msg = PRAISE[Math.floor(Math.random() * PRAISE.length)];
  document.getElementById('praiseMsg').textContent = msg;
  document.getElementById('praiseOverlay').classList.add('open');
}
function closePraise() {
  document.getElementById('praiseOverlay').classList.remove('open');
}

// ── DATA ──
const DEFAULT_TASKS = [
  { id:1, title:'مراجعة تقرير المشروع', category:'work',     priority:'high',   done:false, dueDate:'2026-03-15', notes:'يشمل الأرقام الربعية', subtasks:[{id:1,text:'قراءة الملخص',done:true},{id:2,text:'تدقيق الأرقام',done:false}], createdAt: Date.now()-86400000 },
  { id:2, title:'ممارسة الرياضة',        category:'health',   priority:'medium', done:false, dueDate:'2026-03-13', notes:'',                      subtasks:[],                                                                          createdAt: Date.now()-43200000  },
  { id:3, title:'إكمال دورة React',       category:'learning', priority:'low',    done:true,  dueDate:'2026-03-20', notes:'الوحدة الخامسة',        subtasks:[{id:1,text:'مشاهدة الفيديوهات',done:true}],                               createdAt: Date.now()-172800000 },
];

function loadTasks() { try { const s = localStorage.getItem('mahami_tasks'); return s ? JSON.parse(s) : DEFAULT_TASKS; } catch(e) { return DEFAULT_TASKS; } }
function saveTasks() { try { localStorage.setItem('mahami_tasks', JSON.stringify(tasks)); } catch(e) {} }

let tasks      = loadTasks();
let filterVal  = 'all';
let catVal     = 'all';
let sortBy     = 'date';
let editId     = null;
let modalSubs  = [];
let currentView= 'list';

// ── INIT ──
window.onload = () => {
  const d = new Date().toLocaleDateString('ar-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  document.getElementById('dateBadge').textContent = '📅 ' + d;
  renderTasks();
};

// ── VIEW TOGGLE ──
function toggleView() {
  currentView = currentView === 'list' ? 'stats' : 'list';
  document.getElementById('listView').style.display  = currentView === 'list'  ? '' : 'none';
  document.getElementById('statsView').style.display = currentView === 'stats' ? '' : 'none';
  document.querySelector('.btn-stats').textContent   = currentView === 'list'  ? '📊 إحصائيات' : '📋 القائمة';
  if (currentView === 'stats') renderStats();
}

// ── FILTER / SORT ──
function setFilter(val, btn) {
  filterVal = val;
  document.querySelectorAll('#filterPills .pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}
function setCat(val, btn) {
  catVal = val;
  document.querySelectorAll('#catPills .pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}

function getFiltered() {
  const today  = new Date().toISOString().split('T')[0];
  const search = document.getElementById('searchInput').value.toLowerCase();
  return tasks
    .filter(t => {
      if (filterVal === 'done')    return t.done;
      if (filterVal === 'active')  return !t.done;
      if (filterVal === 'overdue') return t.dueDate && t.dueDate < today && !t.done;
      return true;
    })
    .filter(t => catVal === 'all' || t.category === catVal)
    .filter(t => !search || t.title.includes(search) || (t.notes||'').includes(search))
    .sort((a,b) => {
      if (sortBy === 'priority') { const o={high:0,medium:1,low:2}; return o[a.priority]-o[b.priority]; }
      if (sortBy === 'due')      return (a.dueDate||'z').localeCompare(b.dueDate||'z');
      return b.createdAt - a.createdAt;
    });
}

// ── RENDER TASKS ──
function renderTasks() {
  const today   = new Date().toISOString().split('T')[0];
  const done    = tasks.filter(t=>t.done).length;
  const overdue = tasks.filter(t=>t.dueDate && t.dueDate < today && !t.done).length;

  document.getElementById('headerSub').textContent = done + ' من ' + tasks.length + ' مكتملة';
  document.getElementById('overdueBtn').textContent = overdue ? '⚠️ متأخرة (' + overdue + ')' : '⚠️ متأخرة';

  const list = getFiltered();
  document.getElementById('taskCount').textContent = list.length + ' مهمة';

  const container = document.getElementById('taskList');
  if (!list.length) {
    container.innerHTML = '<div class="empty"><div class="emoji">✨</div><p>لا توجد مهام هنا</p></div>';
    return;
  }
  container.innerHTML = list.map(t => buildCard(t, today)).join('');
}

function buildCard(t, today) {
  const p = PRIORITIES[t.priority];
  const cat = CATS[t.category];
  const isOverdue = t.dueDate && t.dueDate < today && !t.done;
  const subDone = t.subtasks.filter(s=>s.done).length;
  const progress = t.subtasks.length ? Math.round(subDone/t.subtasks.length*100) : (t.done?100:0);

  const tags = `
    <span class="tag" style="background:${p.bg};color:${p.color}">${p.label}</span>
    <span class="tag">${cat.icon} ${cat.label}</span>
    ${t.dueDate ? `<span class="tag ${isOverdue?'overdue':''}">📅 ${t.dueDate}</span>` : ''}
  `;

  const progressBar = t.subtasks.length ? `
    <div class="progress-wrap">
      <div class="progress-label"><span>التقدم</span><span>${progress}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%;background:linear-gradient(90deg,${p.color},${p.color}aa)"></div></div>
    </div>` : '';

  const subsHtml = t.subtasks.length ? `
    <button class="subtasks-toggle" onclick="toggleSubs(${t.id})">
      <span id="arr${t.id}">▼</span> ${t.subtasks.length} مهام فرعية
    </button>
    <div id="subs${t.id}" style="display:none" class="subtasks-list">
      ${t.subtasks.map(s=>`
        <div class="subtask-item">
          <button class="sub-check" style="border-color:${s.done?'#2ED573':'#333'};background:${s.done?'#2ED573':'transparent'}"
            onclick="toggleSub(${t.id},${s.id})">${s.done?'✓':''}</button>
          <span class="sub-text ${s.done?'done-text':''}">${s.text}</span>
        </div>`).join('')}
    </div>` : '';

  const notes = t.notes ? `<p class="task-notes">📝 ${t.notes}</p>` : '';

  return `
    <div class="task-card ${t.done?'done':''}">
      <div class="priority-bar" style="background:${t.done?'#333':p.color}"></div>
      <div class="task-body">
        <button class="checkbox" style="border-color:${t.done?p.color:'#333'};background:${t.done?p.color:'transparent'}"
          onclick="toggleTask(${t.id})">${t.done?'✓':''}</button>
        <div class="task-content">
          <span class="task-title ${t.done?'done-text':''}">${t.title}</span>
          <div class="tags">${tags}</div>
          ${progressBar}${subsHtml}${notes}
        </div>
        <div class="card-actions">
          <button class="btn-icon" onclick="openEdit(${t.id})">✏️</button>
          <button class="btn-icon danger" onclick="deleteTask(${t.id})">🗑</button>
        </div>
      </div>
    </div>`;
}

function toggleSubs(id) {
  const el  = document.getElementById('subs'+id);
  const arr = document.getElementById('arr'+id);
  if (el.style.display === 'none') { el.style.display=''; arr.textContent='▲'; }
  else { el.style.display='none'; arr.textContent='▼'; }
}

// ── TASK ACTIONS ──
function toggleTask(id) {
  const wasNotDone = !tasks.find(t => t.id === id).done;
  tasks = tasks.map(t => t.id===id ? {...t, done:!t.done} : t);
  saveTasks();
  renderTasks();
  if (wasNotDone) showPraise(); // 🎉 رسالة عند الإنجاز فقط
}
function toggleSub(tid, sid) {
  tasks = tasks.map(t => t.id===tid
    ? {...t, subtasks: t.subtasks.map(s => s.id===sid ? {...s,done:!s.done} : s)}
    : t);
  saveTasks();
  renderTasks();
}
function deleteTask(id) {
  tasks = tasks.filter(t => t.id!==id);
  saveTasks();
  renderTasks();
}

// ── STATS ──
function renderStats() {
  const today    = new Date().toISOString().split('T')[0];
  const done     = tasks.filter(t=>t.done).length;
  const total    = tasks.length;
  const overdue  = tasks.filter(t=>t.dueDate && t.dueDate<today && !t.done).length;
  const dueToday = tasks.filter(t=>t.dueDate===today && !t.done).length;
  const pct      = total ? Math.round(done/total*100) : 0;
  const circ     = 2*Math.PI*56;

  document.getElementById('statsGrid').innerHTML = [
    { label:'إجمالي المهام', val:total,    icon:'📋', color:'#818CF8' },
    { label:'مكتملة',        val:done,     icon:'✅', color:'#2ED573' },
    { label:'متأخرة',        val:overdue,  icon:'⚠️', color:'#FF4757' },
    { label:'اليوم',         val:dueToday, icon:'📅', color:'#FFA502' },
  ].map(c=>`
    <div class="stat-card">
      <div class="stat-icon">${c.icon}</div>
      <div class="stat-val" style="color:${c.color}">${c.val}</div>
      <div class="stat-label">${c.label}</div>
    </div>`).join('');

  document.getElementById('ringCircle').setAttribute('stroke-dasharray', `${circ*(done/total||0)} ${circ}`);
  document.getElementById('ringPct').textContent = pct + '%';

  const catRows = Object.entries(CATS).map(([id,c])=>{
    const count = tasks.filter(t=>t.category===id).length;
    const doneC = tasks.filter(t=>t.category===id&&t.done).length;
    if (!count) return '';
    return `<div class="cat-row">
      <div class="cat-row-label"><span>${c.icon} ${c.label}</span><span class="cat-row-count">${doneC}/${count}</span></div>
      <div class="cat-track"><div class="cat-fill" style="width:${Math.round(doneC/count*100)}%"></div></div>
    </div>`;
  }).join('');
  document.getElementById('catStats').innerHTML = catRows || '<p style="color:#555;font-size:13px">لا توجد مهام بعد</p>';
}

// ── MODAL ──
function openModal() {
  editId = null; modalSubs = [];
  document.getElementById('modalTitle').textContent = '✨ مهمة جديدة';
  document.getElementById('btnSave').textContent    = 'إضافة المهمة ✨';
  document.getElementById('fTitle').value    = '';
  document.getElementById('fPriority').value = 'medium';
  document.getElementById('fCategory').value = 'work';
  document.getElementById('fDueDate').value  = '';
  document.getElementById('fNotes').value    = '';
  renderSubList();
  document.getElementById('modalOverlay').classList.add('open');
}
function openEdit(id) {
  const t = tasks.find(x=>x.id===id);
  editId = id; modalSubs = t.subtasks.map(s=>({...s}));
  document.getElementById('modalTitle').textContent = '✏️ تعديل المهمة';
  document.getElementById('btnSave').textContent    = 'حفظ التعديلات';
  document.getElementById('fTitle').value    = t.title;
  document.getElementById('fPriority').value = t.priority;
  document.getElementById('fCategory').value = t.category;
  document.getElementById('fDueDate').value  = t.dueDate||'';
  document.getElementById('fNotes').value    = t.notes||'';
  renderSubList();
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

function renderSubList() {
  document.getElementById('subList').innerHTML = modalSubs.map((s,i)=>`
    <div class="subtask-row">
      <span>${s.text}</span>
      <button class="btn-remove" onclick="removeSub(${i})">×</button>
    </div>`).join('');
}
function addSubtask() {
  const inp = document.getElementById('subInput');
  if (!inp.value.trim()) return;
  modalSubs.push({ id: Date.now(), text: inp.value.trim(), done: false });
  inp.value = '';
  renderSubList();
}
function removeSub(i) { modalSubs.splice(i,1); renderSubList(); }

function saveTask() {
  const title = document.getElementById('fTitle').value.trim();
  if (!title) return;
  const form = {
    title,
    priority: document.getElementById('fPriority').value,
    category: document.getElementById('fCategory').value,
    dueDate:  document.getElementById('fDueDate').value,
    notes:    document.getElementById('fNotes').value,
    subtasks: modalSubs,
  };
  if (editId) {
    tasks = tasks.map(t => t.id===editId ? {...t,...form} : t);
  } else {
    tasks.push({ ...form, id: Date.now(), done: false, createdAt: Date.now() });
  }
  saveTasks();
  closeModal();
  renderTasks();
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
