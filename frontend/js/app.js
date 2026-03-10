// ===== STATE =====
let currentPage = 'dashboard';
let currentChat = 1;
let calYear = 2026, calMonth = 2; // 0-indexed March
let ttsUtterance = null;
let toothStates = {};
let filteredPatients = [...DATA.patients];

const pageInfo = {
  dashboard:  {title:'Dashboard', sub:'Visão geral da clínica'},
  leads:      {title:'Leads / Pipeline', sub:'Gerencie seus leads por estágio'},
  patients:   {title:'Pacientes', sub:'Cadastro e histórico'},
  schedule:   {title:'Agendamento', sub:'Calendário de consultas'},
  prontuario: {title:'Prontuário Digital', sub:'Registro clínico com TTS'},
  whatsapp:   {title:'WhatsApp', sub:'Conversas e campanhas'},
  hr:         {title:'Recursos Humanos', sub:'Equipe e folha de pagamento'},
  stock:      {title:'Estoque', sub:'Inventário e movimentações'},
  financial:  {title:'Financeiro', sub:'Receitas, despesas e notas fiscais'},
  reports:    {title:'Relatórios', sub:'Análises e exportações'},
  plans:      {title:'Planos', sub:'Escolha o plano ideal'},
  settings:   {title:'Configurações', sub:'Configurações da clínica'},
};

// ===== NAVIGATION =====
function navigate(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if (el) el.classList.add('active');
  else {
    const ni = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (ni) ni.classList.add('active');
  }
  document.getElementById('pageTitle').textContent = pageInfo[page].title;
  document.getElementById('pageSub').textContent = pageInfo[page].sub;
  currentPage = page;
  renderPage(page);
}

function renderPage(page) {
  const r = {
    dashboard:  renderDashboard,
    leads:      renderLeads,
    patients:   renderPatients,
    schedule:   renderCalendar,
    prontuario: renderProntuario,
    whatsapp:   renderWhatsApp,
    hr:         renderHR,
    stock:      renderStock,
    financial:  renderFinancial,
    reports:    renderReports,
    plans:      renderPlans,
    settings:   renderSettings,
  };
  if (r[page]) r[page]();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.getElementById('mainContent').classList.toggle('sidebar-collapsed');
}

// ===== MODAL =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
});

// ===== TABS =====
function switchTab(scope, panelId, btn) {
  const parent = btn.closest('.page') || btn.closest('.page-inner') || document;
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

// ===== TOAST =====
function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = {success:'✅', error:'❌', info:'ℹ️'};
  t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ===== CHARTS =====
function renderBarChart(containerId, labelId, data, colors) {
  const el = document.getElementById(containerId);
  const lbl = document.getElementById(labelId);
  if (!el) return;
  const max = Math.max(...data.flatMap(d => Object.values(d).filter(v => typeof v === 'number')));
  el.innerHTML = data.map(d => {
    const keys = Object.keys(d).filter(k => typeof d[k] === 'number');
    return `<div style="flex:1;display:flex;gap:3px;align-items:flex-end">
      ${keys.map((k,i) => `<div style="flex:1;height:${Math.round((d[k]/max)*160)}px;background:${colors[i]};border-radius:4px 4px 0 0"></div>`).join('')}
    </div>`;
  }).join('');
  if (lbl) lbl.innerHTML = data.map(d => `<div style="flex:1;text-align:center;font-size:11px;color:var(--text-muted)">${d.month||d.label||''}</div>`).join('');
}

// ===== DASHBOARD =====
function renderDashboard() {
  // Revenue chart
  renderBarChart('revenueChart','revenueLabels', DATA.revData.map(d=>({month:d.month,rev:d.rev,exp:d.exp})), ['#3b82f6','#ef4444']);

  // Upcoming appointments
  const ua = document.getElementById('upcomingAppts');
  const upcoming = DATA.appointments.slice(0,4);
  ua.innerHTML = upcoming.map(a => `
    <div class="stat-row">
      <div class="user-avatar avatar-sm" style="background:${a.color}">${a.patient.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div class="stat-info"><div class="stat-name">${a.patient}</div><div class="stat-detail">${a.proc} · ${a.doctor}</div></div>
      <div><div class="stat-value">${a.time}</div><div class="text-sm text-muted">${a.date.split('-').reverse().slice(0,2).join('/')}</div></div>
    </div>`).join('');

  // Leads table
  const lt = document.getElementById('dashLeadsTable');
  lt.innerHTML = `<thead><tr><th>Nome</th><th>Interesse</th><th>Origem</th><th>Estágio</th></tr></thead>
    <tbody>${DATA.leads.slice(0,5).map(l=>`<tr>
      <td><strong>${l.name}</strong></td><td>${l.interest}</td><td>${l.source}</td>
      <td>${stageBadge(l.stage)}</td>
    </tr>`).join('')}</tbody>`;

  // Tasks
  const tl = document.getElementById('taskList');
  const pending = DATA.tasks.filter(t=>!t.done).length;
  document.getElementById('taskCount').textContent = `${pending} pendentes`;
  tl.innerHTML = DATA.tasks.map(t=>`
    <div class="stat-row" style="cursor:pointer" onclick="toggleTask(${t.id})">
      <div style="font-size:18px">${t.done?'✅':'⬜'}</div>
      <div style="flex:1;font-size:13px;${t.done?'text-decoration:line-through;color:var(--text-muted)':''}">${t.text}</div>
    </div>`).join('');
}
function toggleTask(id) {
  const t = DATA.tasks.find(t=>t.id===id);
  if(t){ t.done=!t.done; renderDashboard(); }
}

// ===== LEADS =====
const kanbanCols = [
  {key:'novo',label:'Novo',color:'#3b82f6'},
  {key:'contato',label:'Contactado',color:'#f59e0b'},
  {key:'consulta',label:'Consulta Agendada',color:'#8b5cf6'},
  {key:'ganho',label:'Ganho ✓',color:'#10b981'},
  {key:'perdido',label:'Perdido ✗',color:'#ef4444'},
];
function stageBadge(s) {
  const map = {novo:'badge-blue',contato:'badge-yellow',consulta:'badge-purple',ganho:'badge-green',perdido:'badge-red'};
  const labels = {novo:'Novo',contato:'Contactado',consulta:'Consulta',ganho:'Ganho',perdido:'Perdido'};
  return `<span class="badge ${map[s]||'badge-blue'}">${labels[s]||s}</span>`;
}
function renderLeads() {
  const board = document.getElementById('kanbanBoard');
  board.innerHTML = kanbanCols.map(col => {
    const cards = DATA.leads.filter(l=>l.stage===col.key);
    return `<div class="kanban-col">
      <div class="kanban-col-header">
        <div class="kanban-col-title"><span style="color:${col.color}">●</span> ${col.label}</div>
        <span class="kanban-col-count">${cards.length}</span>
      </div>
      <div class="kanban-cards">
        ${cards.map(l=>`<div class="kanban-card" onclick="openLeadDetail(${l.id})">
          <div class="kanban-card-name">${l.name}</div>
          <div class="kanban-card-meta"><span>📱 ${l.phone}</span><span style="margin-left:auto;color:var(--accent-4);font-weight:700">${l.value}</span></div>
          <div class="kanban-card-source"><span class="tag">${l.interest}</span> <span class="tag">${l.source}</span></div>
        </div>`).join('')}
        <button class="kanban-add-btn" onclick="document.getElementById('leadStage').value='${col.key}';openModal('addLeadModal')">+ Adicionar</button>
      </div>
    </div>`;
  }).join('');
}
function openLeadDetail(id) {
  const l = DATA.leads.find(x=>x.id===id);
  document.getElementById('leadDetailName').textContent = l.name;
  document.getElementById('leadDetailContent').innerHTML = `
    <div class="grid grid-2 mb-16">
      <div class="input-group"><label class="input-label">Telefone</label><div class="input">${l.phone}</div></div>
      <div class="input-group"><label class="input-label">Origem</label><div class="input">${l.source}</div></div>
    </div>
    <div class="grid grid-2 mb-16">
      <div class="input-group"><label class="input-label">Interesse</label><div class="input">${l.interest}</div></div>
      <div class="input-group"><label class="input-label">Valor Estimado</label><div class="input">${l.value}</div></div>
    </div>
    <div class="input-group"><label class="input-label">Estágio</label>
      <select class="input" onchange="DATA.leads.find(x=>x.id===${l.id}).stage=this.value;renderLeads()">
        ${kanbanCols.map(c=>`<option value="${c.key}"${l.stage===c.key?' selected':''}>${c.label}</option>`).join('')}
      </select>
    </div>`;
  openModal('leadDetailModal');
}
function addLead() {
  const name = document.getElementById('leadName').value.trim();
  if(!name){ showToast('Informe o nome do lead','error'); return; }
  DATA.leads.push({id:Date.now(),name,phone:document.getElementById('leadPhone').value,interest:document.getElementById('leadInterest').value,source:document.getElementById('leadSource').value,stage:document.getElementById('leadStage').value,value:'—',date:new Date().toLocaleDateString('pt-BR')});
  closeModal('addLeadModal');
  renderLeads();
  showToast('Lead adicionado!','success');
}
function convertLead() {
  closeModal('leadDetailModal');
  navigate('patients', document.querySelector('.nav-item[data-page="patients"]'));
  showToast('Lead convertido em paciente!','success');
}

// ===== PATIENTS =====
let patientsData = [];

async function fetchPatients(query = '') {
  try {
    const res = await apiFetch(`/patients${query}`);
    patientsData = await res.json();
    return patientsData;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function renderPatients() {
  const p = await fetchPatients();
  renderPatientsTable(p);
  populateApptPatients(p);
}

function renderPatientsTable(list) {
  const t = document.getElementById('patientsTable');
  t.innerHTML = `<thead><tr><th>Paciente</th><th>CPF</th><th>Telefone</th><th>Convênio</th><th>Status</th><th>Ações</th></tr></thead>
  <tbody>${list.map(p=>`<tr>
    <td><div class="flex items-center gap-8"><div class="avatar avatar-sm" style="background:${p.color}">${p.avatar}</div><strong>${p.name}</strong></div></td>
    <td>${p.cpf||'-'}</td><td>${p.phone||'-'}</td><td>${p.insurance||'-'}</td>
    <td>${statusBadge(p.status)}</td>
    <td><button class="btn btn-ghost btn-sm" title="Prontuário" onclick="navigate('prontuario',document.querySelector('.nav-item[data-page=prontuario]'))">📋</button>
        <button class="btn btn-ghost btn-sm" title="Agendar" onclick="openModal('addApptModal')">📅</button>
        <button class="btn btn-ghost btn-sm" title="Excluir" style="color:var(--accent-6)" onclick="deletePatient(${p.id})">🗑️</button></td>
  </tr>`).join('')}</tbody>`;
}

async function filterPatients(q) {
  const p = await fetchPatients(q ? `?search=${encodeURIComponent(q)}` : '');
  renderPatientsTable(p);
}

async function filterPatientsByStatus(s) {
  const p = await fetchPatients(s ? `?status=${encodeURIComponent(s)}` : '');
  renderPatientsTable(p);
}

function statusBadge(s) {
  const map = {'Ativo':'badge-green','Inativo':'badge-red','Em tratamento':'badge-blue'};
  return `<span class="badge ${map[s]||'badge-blue'}">${s}</span>`;
}

async function addPatient() {
  const name = document.getElementById('patName').value.trim();
  if(!name){ showToast('Informe o nome','error'); return; }
  
  const payload = {
    name,
    cpf: document.getElementById('patCpf').value,
    dob: document.getElementById('patDob').value,
    phone: document.getElementById('patPhone').value,
    email: document.getElementById('patEmail').value,
    insurance: document.getElementById('patInsurance').value,
    status: 'Ativo'
  };

  try {
    await apiFetch('/patients', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    closeModal('addPatientModal');
    renderPatients();
    showToast('Paciente cadastrado!', 'success');
  } catch (err) {
    showToast('Erro ao cadastrar', 'error');
  }
}

async function deletePatient(id) {
  if(!confirm('Tem certeza que deseja excluir o paciente?')) return;
  try {
    await apiFetch(`/patients/${id}`, { method: 'DELETE' });
    renderPatients();
    showToast('Paciente removido!', 'success');
  } catch (err) {
    showToast('Erro ao remover', 'error');
  }
}

function populateApptPatients(list = patientsData) {
  const sel = document.getElementById('apptPatient');
  if(sel) sel.innerHTML = list.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
}

// ===== SCHEDULE =====
const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
function renderCalendar() {
  document.getElementById('calMonthLabel').textContent = `${months[calMonth]} ${calYear}`;
  const grid = document.getElementById('calendarGrid');
  const first = new Date(calYear, calMonth, 1).getDay();
  const total = new Date(calYear, calMonth+1, 0).getDate();
  let html = days.map(d=>`<div class="cal-day-header">${d}</div>`).join('');
  for(let i=0;i<first;i++) html+=`<div class="cal-day empty"></div>`;
  const today = new Date();
  for(let d=1;d<=total;d++){
    const isToday = d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear();
    const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const evts = DATA.appointments.filter(a=>a.date===dateStr);
    html+=`<div class="cal-day${isToday?' today':''}" onclick="openModal('addApptModal')">
      <div class="cal-day-num">${d}</div>
      ${evts.map(e=>`<div class="cal-event" style="background:${e.color}20;color:${e.color}">${e.time} ${e.proc}</div>`).join('')}
    </div>`;
  }
  grid.innerHTML = html;
}
function changeMonth(dir) { calMonth+=dir; if(calMonth<0){calMonth=11;calYear--;}if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); }
function setCalView(v,btn) { document.querySelectorAll('.cal-view-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
function addAppointment() {
  const patId = parseInt(document.getElementById('apptPatient').value);
  const pat = DATA.patients.find(p=>p.id===patId);
  DATA.appointments.push({id:Date.now(),patientId:patId,patient:pat?.name||'Paciente',doctor:document.getElementById('apptDoctor').value,proc:document.getElementById('apptProc').value,date:document.getElementById('apptDate').value,time:document.getElementById('apptTime').value,color:'#3b82f6'});
  closeModal('addApptModal');
  renderCalendar();
  showToast('Consulta agendada!','success');
}

// ===== PRONTUÁRIO + TTS =====
function renderProntuario() { renderOdontogram(); renderTreatmentHistory(); }
function renderOdontogram() {
  const upper = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
  const lower = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
  const presets = {46:'cavity',11:'crown',21:'crown',38:'missing'};
  Object.keys(presets).forEach(k=>{ if(!toothStates[k]) toothStates[k]=presets[k]; });
  const row = nums => `<div class="odont-row">${nums.map(n=>{
    const s = toothStates[n]||'healthy';
    const icons = {healthy:'🦷',cavity:'🔴',crown:'👑',missing:'✖',selected:'🔵'};
    return `<div class="tooth ${s}" onclick="cycleTooth(${n})" title="Dente ${n}"><div class="tooth-icon">${icons[s]||'🦷'}</div><div class="tooth-num">${n}</div></div>`;
  }).join('')}</div>`;
  document.getElementById('odontogram').innerHTML = row(upper)+row(lower);
}
function cycleTooth(n) {
  const cycle = ['healthy','cavity','crown','missing'];
  const cur = toothStates[n]||'healthy';
  toothStates[n] = cycle[(cycle.indexOf(cur)+1)%cycle.length];
  renderOdontogram();
}
function renderTreatmentHistory() {
  const history = [
    {icon:'🔬',color:'rgba(59,130,246,0.15)',title:'Abertura Coronária – Dente 46',meta:'09/03/2026 · Dr. Roberto Silva'},
    {icon:'💊',color:'rgba(139,92,246,0.15)',title:'Prescrição: Amoxicilina + Ibuprofeno',meta:'09/03/2026'},
    {icon:'🦷',color:'rgba(16,185,129,0.15)',title:'Restauração – Dente 15',meta:'20/01/2026 · Dr. Roberto Silva'},
    {icon:'📋',color:'rgba(245,158,11,0.15)',title:'Consulta de Avaliação Inicial',meta:'05/11/2025 · Dr. Roberto Silva'},
  ];
  document.getElementById('treatmentHistory').innerHTML = history.map(h=>`
    <div class="timeline-item">
      <div class="timeline-icon" style="background:${h.color}">${h.icon}</div>
      <div class="timeline-content"><div class="timeline-title">${h.title}</div><div class="timeline-meta">${h.meta}</div></div>
    </div>`).join('');
}
function getProntuarioText() {
  const g = id => document.getElementById(id)?.value||'';
  return `Prontuário da paciente Maria José Santos. Queixa principal: ${g('chiefComplaint')}. Diagnóstico: ${g('diagnosis')}. Tratamento realizado: ${g('treatment')}. Prescrições: ${g('prescription')}. Observações: ${g('observations')}.`;
}
function toggleTTS() {
  const btn = document.getElementById('ttsBtn');
  if(window.speechSynthesis.speaking){ window.speechSynthesis.cancel(); btn.textContent='🔊 Ler Prontuário'; btn.classList.remove('playing'); return; }
  const u = new SpeechSynthesisUtterance(getProntuarioText());
  u.lang='pt-BR'; u.rate=0.95;
  u.onend = ()=>{ btn.textContent='🔊 Ler Prontuário'; btn.classList.remove('playing'); };
  window.speechSynthesis.speak(u);
  btn.textContent='⏹ Parar'; btn.classList.add('playing');
}
function saveProntuario() { showToast('Prontuário salvo com sucesso!','success'); }

// ===== WHATSAPP =====
const chatNames = {1:'Maria José Santos',2:'João Carlos Oliveira',3:'Ana Paula Lima'};
const chatColors = {1:'#10b981',2:'#3b82f6',3:'#8b5cf6'};
const chatAvatars = {1:'MJ',2:'JO',3:'AL'};
function renderWhatsApp() {
  const cl = document.getElementById('chatList');
  cl.innerHTML = Object.keys(chatNames).map(id=>{
    const msgs = DATA.messages[id]||[];
    const last = msgs[msgs.length-1];
    const unread = msgs.filter(m=>m.from==='in').length;
    return `<div class="chat-item${parseInt(id)===currentChat?' active':''}" onclick="selectChat(${id})">
      <div class="avatar" style="background:${chatColors[id]}">${chatAvatars[id]}</div>
      <div class="chat-item-info">
        <div class="chat-item-name">${chatNames[id]}</div>
        <div class="chat-item-preview">${last?.text||'...'}</div>
      </div>
      <div class="chat-item-meta">
        <div class="chat-item-time">${last?.time||''}</div>
        ${unread?`<div class="chat-item-unread">${unread}</div>`:''}
      </div>
    </div>`;
  }).join('');
  selectChat(currentChat);
  renderTemplates();
  renderCampaigns();
}
function selectChat(id) {
  currentChat = id;
  document.getElementById('chatTopbar').innerHTML = `
    <div class="avatar" style="background:${chatColors[id]}">${chatAvatars[id]}</div>
    <div><div style="font-weight:700">${chatNames[id]}</div><div class="text-sm text-muted" style="color:var(--accent-4)">● Online</div></div>
    <div style="margin-left:auto;display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm">📅 Agendar</button>
      <button class="btn btn-ghost btn-sm">📋 Prontuário</button>
    </div>`;
  renderMessages();
}
function renderMessages() {
  const msgs = DATA.messages[currentChat]||[];
  document.getElementById('chatMessages').innerHTML = msgs.map(m=>`
    <div class="msg msg-${m.from}">
      <div class="msg-bubble">${m.text}</div>
      <div class="msg-time">${m.time}</div>
    </div>`).join('');
}
function sendMsg() {
  const inp = document.getElementById('chatInput');
  const txt = inp.value.trim();
  if(!txt) return;
  if(!DATA.messages[currentChat]) DATA.messages[currentChat]=[];
  const now = new Date();
  DATA.messages[currentChat].push({from:'out',text:txt,time:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`});
  inp.value='';
  renderMessages();
  document.getElementById('chatMessages').scrollTop = 9999;
}
function renderTemplates() {
  document.getElementById('templateList').innerHTML = DATA.templates.map(t=>`
    <div class="template-card" onclick="document.getElementById('chatInput').value='${t.text.replace(/'/g,"\\'")}';switchTab('whatsapp','waChatTab',document.querySelector('#page-whatsapp .tabs .tab-btn'))">
      <div class="template-name">${t.name}</div>
      <div class="template-text">${t.text.substring(0,80)}...</div>
    </div>`).join('');
}
function addTemplate() {
  const name = document.getElementById('tplName').value.trim();
  if(!name) return;
  DATA.templates.push({id:Date.now(),name,text:document.getElementById('tplText').value});
  closeModal('addTemplateModal');
  renderTemplates();
  showToast('Template salvo!','success');
}
function renderCampaigns() {
  document.getElementById('campaignList').innerHTML = DATA.campaigns.map(c=>`
    <div class="card">
      <div class="flex justify-between items-center mb-8">
        <div class="card-title">${c.name}</div>
        <span class="badge ${c.status==='Enviada'?'badge-green':'badge-yellow'}">${c.status}</span>
      </div>
      <div class="text-sm text-muted mb-16">${c.target}</div>
      <div class="flex gap-16">
        <div><div style="font-size:20px;font-weight:800">${c.sent}</div><div class="text-sm text-muted">Enviadas</div></div>
        <div><div style="font-size:20px;font-weight:800">${c.opens}</div><div class="text-sm text-muted">Abertas</div></div>
        <div><div style="font-size:20px;font-weight:800">${c.sent?Math.round((c.opens/c.sent)*100):0}%</div><div class="text-sm text-muted">Taxa</div></div>
      </div>
    </div>`).join('');
}

// ===== HR =====
function renderHR() { renderStaff(); renderHRSchedule(); renderPayroll(); }
function renderStaff() {
  document.getElementById('staffGrid').innerHTML = DATA.staff.map(s=>`
    <div class="staff-card">
      <div class="staff-avatar" style="background:${s.color}20;color:${s.color}">${s.avatar}</div>
      <div class="staff-name">${s.name}</div>
      <div class="staff-role">${s.role}</div>
      <div class="mt-8"><span class="badge ${s.status==='Ativo'?'badge-green':s.status==='Férias'?'badge-yellow':'badge-red'}">${s.status}</span></div>
      <div class="staff-actions">
        <button class="btn btn-secondary btn-sm">✏️ Editar</button>
        <button class="btn btn-ghost btn-sm">📅</button>
      </div>
    </div>`).join('');
}
function renderHRSchedule() {
  const t = document.getElementById('hrScheduleTable');
  const cols = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  t.innerHTML = `<thead><tr><th>Colaborador</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
  <tbody>${DATA.staff.map(s=>`<tr>
    <td><div class="flex items-center gap-8"><div class="avatar avatar-sm" style="background:${s.color}">${s.avatar}</div>${s.name}</div></td>
    ${cols.map((_,i)=>`<td>${i<5||(s.schedule.includes('Sáb')&&i===5)?`<span class="badge badge-green">08h–18h</span>`:'<span class="text-muted">—</span>'}</td>`).join('')}
  </tr>`).join('')}</tbody>`;
}
function renderPayroll() {
  const t = document.getElementById('payrollTable');
  t.innerHTML = `<thead><tr><th>Colaborador</th><th>Cargo</th><th>Salário Base</th><th>Bônus</th><th>Descontos</th><th>Líquido</th></tr></thead>
  <tbody>${DATA.staff.map(s=>{const b=s.role==='Dentista'||s.role.includes('Impl')?800:200;const d=Math.round(s.salary*0.11);const l=s.salary+b-d;return`<tr>
    <td>${s.name}</td><td>${s.role}</td>
    <td>R$ ${s.salary.toLocaleString('pt-BR')}</td>
    <td style="color:var(--accent-4)">R$ ${b}</td>
    <td style="color:var(--accent-6)">R$ ${d}</td>
    <td><strong>R$ ${l.toLocaleString('pt-BR')}</strong></td>
  </tr>`}).join('')}</tbody>`;
}
function addStaff() {
  const name = document.getElementById('staffName').value.trim();
  if(!name){ showToast('Informe o nome','error'); return; }
  const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ec4899'];
  DATA.staff.push({id:Date.now(),name,role:document.getElementById('staffRole').value,email:document.getElementById('staffEmail').value,salary:parseFloat(document.getElementById('staffSalary').value)||0,schedule:'Seg–Sex',status:'Ativo',avatar:name.split(' ').map(w=>w[0]).slice(0,2).join(''),color:colors[DATA.staff.length%colors.length]});
  closeModal('addStaffModal');
  renderStaff();
  showToast('Colaborador adicionado!','success');
}

// ===== STOCK =====
function renderStock() { renderStockTable(); renderMovements(); renderSuppliers(); renderStockAlerts(); populateMvtItems(); }
function renderStockAlerts() {
  const low = DATA.stock.filter(i=>i.qty<=i.min);
  const el = document.getElementById('stockAlerts');
  if(!low.length){ el.innerHTML=''; return; }
  el.innerHTML = `<div class="card" style="border-color:var(--accent-5);background:rgba(245,158,11,0.05)">
    <div class="flex items-center gap-8 mb-8"><span style="font-size:18px">⚠️</span><strong>Estoque Baixo – ${low.length} Item(s)</strong></div>
    <div class="flex gap-8">${low.map(i=>`<span class="badge badge-yellow">${i.name}</span>`).join('')}</div>
  </div>`;
}
function renderStockTable() {
  const t = document.getElementById('stockTable');
  t.innerHTML = `<thead><tr><th>Produto</th><th>Categoria</th><th>Quantidade</th><th>Nível</th><th>Custo Unit.</th><th>Fornecedor</th><th>Status</th></tr></thead>
  <tbody>${DATA.stock.map(i=>{
    const pct = Math.min(100,Math.round((i.qty/Math.max(i.min*2,1))*100));
    const cls = i.qty===0?'stock-out':i.qty<=i.min?'stock-low':'stock-ok';
    const badge = i.qty===0?'badge-red':i.qty<=i.min?'badge-yellow':'badge-green';
    const label = i.qty===0?'Sem Estoque':i.qty<=i.min?'Estoque Baixo':'OK';
    return`<tr>
      <td><strong>${i.name}</strong></td><td>${i.category}</td>
      <td>${i.qty}</td>
      <td><div class="stock-level"><div class="stock-bar"><div class="stock-fill ${cls}" style="width:${pct}%"></div></div><span class="text-sm">${pct}%</span></div></td>
      <td>R$ ${i.cost.toFixed(2)}</td><td>${i.supplier}</td>
      <td><span class="badge ${badge}">${label}</span></td>
    </tr>`;
  }).join('')}</tbody>`;
}
function renderMovements() {
  const t = document.getElementById('movementsTable');
  t.innerHTML = `<thead><tr><th>Produto</th><th>Tipo</th><th>Qtd</th><th>Data</th><th>Usuário</th></tr></thead>
  <tbody>${DATA.stockMovements.map(m=>`<tr>
    <td>${m.item}</td>
    <td><span class="badge ${m.type==='Entrada'?'badge-green':'badge-red'}">${m.type}</span></td>
    <td>${m.qty}</td><td>${m.date}</td><td>${m.user}</td>
  </tr>`).join('')}</tbody>`;
}
function renderSuppliers() {
  document.getElementById('suppliersList').innerHTML = DATA.suppliers.map(s=>`
    <div class="card">
      <div class="card-title" style="font-size:15px">${s.name}</div>
      <div class="text-sm text-muted mt-4">${s.category}</div>
      <div class="divider"></div>
      <div class="text-sm">📧 ${s.contact}</div>
      <div class="text-sm mt-4">📱 ${s.phone}</div>
      <div class="flex gap-8 mt-12">
        <button class="btn btn-secondary btn-sm w-full">✏️ Editar</button>
        <button class="btn btn-primary btn-sm" onclick="showToast('E-mail enviado!','success')">📧 Pedir</button>
      </div>
    </div>`).join('');
}
function populateMvtItems() {
  const sel = document.getElementById('mvtItem');
  if(sel) sel.innerHTML = DATA.stock.map(i=>`<option value="${i.id}">${i.name}</option>`).join('');
}
function addStockItem() {
  const name = document.getElementById('itemName').value.trim();
  if(!name){ showToast('Informe o nome','error'); return; }
  DATA.stock.push({id:Date.now(),name,category:document.getElementById('itemCategory').value,qty:parseInt(document.getElementById('itemQty').value)||0,min:parseInt(document.getElementById('itemMin').value)||5,cost:parseFloat(document.getElementById('itemCost').value)||0,supplier:document.getElementById('itemSupplier').value});
  closeModal('addItemModal');
  renderStock();
  showToast('Item adicionado!','success');
}
function addMovement() {
  const itemId = parseInt(document.getElementById('mvtItem').value);
  const qty = parseInt(document.getElementById('mvtQty').value)||0;
  const type = document.getElementById('mvtType').value;
  const item = DATA.stock.find(i=>i.id===itemId);
  if(item){ item.qty = type==='Entrada'?item.qty+qty:Math.max(0,item.qty-qty); }
  DATA.stockMovements.unshift({id:Date.now(),item:item?.name||'Item',type,qty,date:new Date().toLocaleDateString('pt-BR'),user:'Dr. Roberto Silva'});
  closeModal('addMovementModal');
  renderStock();
  showToast(`${type} registrada!`,'success');
}

// ===== FINANCIAL =====
function renderFinancial() {
  renderBarChart('finChart','finChartLabels', DATA.revData.map(d=>({month:d.month,rec:d.rev,exp:d.exp})), ['#10b981','#ef4444']);
  const pt = document.getElementById('paymentsTable');
  pt.innerHTML = `<thead><tr><th>Paciente</th><th>Procedimento</th><th>Valor</th><th>Data</th><th>Método</th><th>Status</th></tr></thead>
  <tbody>${DATA.payments.map(p=>`<tr>
    <td>${p.patient}</td><td>${p.proc}</td><td><strong>${p.value}</strong></td><td>${p.date}</td>
    <td>${p.method}</td>
    <td><span class="badge ${p.status==='Pago'?'badge-green':p.status==='Atrasado'?'badge-red':'badge-yellow'}">${p.status}</span></td>
  </tr>`).join('')}</tbody>`;
  const it = document.getElementById('invoicesTable');
  it.innerHTML = `<thead><tr><th>Número</th><th>Paciente</th><th>Valor</th><th>Data</th><th>Status</th><th>Ações</th></tr></thead>
  <tbody>${DATA.invoices.map(i=>`<tr>
    <td><strong>${i.id}</strong></td><td>${i.patient}</td><td>${i.value}</td><td>${i.date}</td>
    <td><span class="badge ${i.status==='Emitida'?'badge-green':'badge-red'}">${i.status}</span></td>
    <td><button class="btn btn-ghost btn-sm" onclick="showToast('NF baixada!','success')">📥</button></td>
  </tr>`).join('')}</tbody>`;
}

// ===== REPORTS =====
function renderReports() {
  const cards = [
    {icon:'💰',title:'Produção do Mês',value:'R$ 42.800',sub:'▲ 8% vs Fevereiro',color:'var(--accent-4)'},
    {icon:'👥',title:'Novos Pacientes',value:'23',sub:'▲ 15% vs Fevereiro',color:'var(--accent)'},
    {icon:'🎯',title:'Taxa de Conversão',value:'68%',sub:'Leads → Pacientes',color:'var(--accent-2)'},
    {icon:'📅',title:'Ocupação da Agenda',value:'87%',sub:'Das consultas confirmadas',color:'var(--accent-5)'},
  ];
  document.getElementById('reportCards').innerHTML = cards.map(c=>`
    <div class="kpi-card" style="border-color:${c.color}40">
      <div class="kpi-icon" style="color:${c.color}">${c.icon}</div>
      <div class="kpi-label">${c.title}</div>
      <div class="kpi-value" style="color:${c.color}">${c.value}</div>
      <div class="kpi-change up">${c.sub}</div>
    </div>`).join('');
  const prod = [
    {name:'Dr. Roberto Silva',role:'Clínico Geral',val:'R$ 18.400',pct:87},
    {name:'Dr. Carlos Mendes',role:'Implantodontista',val:'R$ 14.200',pct:72},
    {name:'Dra. Ana Pereira',role:'Ortodontista',val:'R$ 10.200',pct:61},
  ];
  document.getElementById('prodStats').innerHTML = prod.map((p,i)=>`
    <div class="stat-row">
      <div class="stat-rank">${i+1}</div>
      <div class="user-avatar avatar-sm" style="background:${['#3b82f6','#10b981','#8b5cf6'][i]}">${p.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div class="stat-info"><div class="stat-name">${p.name}</div><div class="stat-detail">${p.role}</div></div>
      <div style="flex:2;padding:0 16px"><div class="progress-bar"><div class="progress-fill" style="width:${p.pct}%;background:${['#3b82f6','#10b981','#8b5cf6'][i]}"></div></div></div>
      <div class="stat-value">${p.val}</div>
    </div>`).join('');
}

// ===== PLANS =====
function renderPlans() {
  const plans = [
    {name:'Starter',price:'R$ 149',period:'/mês',color:'var(--accent-3)',features:['Até 100 pacientes','Agendamento online','Prontuário digital','WhatsApp básico','Suporte por e-mail'],missing:['Pipeline CRM','RH / Folha de pagamento','Relatórios avançados']},
    {name:'Pro',price:'R$ 349',period:'/mês',color:'var(--accent)',badge:'Mais Popular',current:true,features:['Pacientes ilimitados','Pipeline de leads CRM','Agendamento online','Prontuário com TTS','WhatsApp + Campanhas','RH básico','Relatórios completos'],missing:['Múltiplas clínicas','API personalizada']},
    {name:'Enterprise',price:'R$ 749',period:'/mês',color:'var(--accent-2)',features:['Tudo do Pro','Múltiplas clínicas','Usuários ilimitados','API personalizada','Gerente de conta dedicado','SLA 99.9% garantido','Onboarding presencial'],missing:[]},
  ];
  document.getElementById('planCards').innerHTML = plans.map(p=>`
    <div class="plan-card${p.current?' highlighted':''}">
      ${p.badge?`<div class="plan-badge">${p.badge}</div>`:''}
      <div class="plan-name" style="color:${p.color}">${p.name}</div>
      <div class="plan-price" style="color:${p.color}">${p.price}<span>${p.period}</span></div>
      <div class="plan-period">Faturado mensalmente</div>
      <ul class="plan-features">
        ${p.features.map(f=>`<li>${f}</li>`).join('')}
        ${p.missing.map(f=>`<li class="no">${f}</li>`).join('')}
      </ul>
      <button class="btn w-full ${p.current?'btn-primary':'btn-secondary'}" onclick="showToast('${p.current?'Você já está neste plano!':'Plano '+p.name+' selecionado!'}','${p.current?'info':'success'}')">${p.current?'Plano Atual':'Assinar '+p.name}</button>
    </div>`).join('');

  const features = ['Pacientes ilimitados','Pipeline CRM','Agendamento','Prontuário TTS','WhatsApp','Campanhas','RH / Folha','Relatórios avançados','Múltiplas clínicas','API personalizada'];
  const rows = [['Limitado','✓','✓'],['✗','✓','✓'],['✓','✓','✓'],['✓','✓','✓'],['Básico','Completo','Completo'],['✗','✓','✓'],['✗','Básico','Completo'],['✗','✓','✓'],['✗','✗','✓'],['✗','✗','✓']];
  const t = document.getElementById('planCompareTable');
  t.innerHTML = `<thead><tr><th>Recurso</th><th>Starter</th><th>Pro</th><th>Enterprise</th></tr></thead>
  <tbody>${features.map((f,i)=>`<tr><td>${f}</td>${rows[i].map((v,j)=>`<td style="text-align:center;color:${v==='✓'||v==='Completo'?'var(--accent-4)':v==='✗'?'var(--text-muted)':'inherit'}">${v}</td>`).join('')}</tr>`).join('')}</tbody>`;
}

// ===== SETTINGS =====
function renderSettings() {
  const ut = document.getElementById('usersTable');
  ut.innerHTML = `<thead><tr><th>Usuário</th><th>E-mail</th><th>Perfil</th><th>Status</th><th>Ações</th></tr></thead>
  <tbody>${DATA.users.map(u=>`<tr>
    <td>${u.name}</td><td>${u.email}</td><td><span class="badge badge-blue">${u.role}</span></td>
    <td><span class="badge badge-green">${u.status}</span></td>
    <td><button class="btn btn-ghost btn-sm" onclick="showToast('Permissões alteradas','info')">✏️</button></td>
  </tr>`).join('')}</tbody>`;

  const notifs = [
    {label:'Lembrete de consulta por WhatsApp',on:true},
    {label:'Novo lead recebido',on:true},
    {label:'Estoque abaixo do mínimo',on:true},
    {label:'Aniversário de paciente',on:false},
    {label:'Pagamento recebido',on:true},
  ];
  document.getElementById('notifSettings').innerHTML = notifs.map((n,i)=>`
    <div class="stat-row">
      <div style="flex:1;font-size:14px">${n.label}</div>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" ${n.on?'checked':''} onchange="showToast('Preferência salva','success')" />
        <span style="font-size:13px;color:var(--text-muted)">${n.on?'Ativado':'Desativado'}</span>
      </label>
    </div>`).join('');

  const integ = [
    {icon:'💬',name:'WhatsApp Business API',desc:'Integração com Evolution API',status:'Conectado',color:'var(--accent-4)'},
    {icon:'💳',name:'Gateway de Pagamento',desc:'Stripe / Pagarme / Pix',status:'Configurar',color:'var(--accent)'},
    {icon:'📧',name:'E-mail Marketing',desc:'MailChimp / RD Station',status:'Configurar',color:'var(--accent-2)'},
    {icon:'🏥',name:'Convênios',desc:'TUSS / CBHPM',status:'Conectado',color:'var(--accent-5)'},
  ];
  document.getElementById('integrations').innerHTML = integ.map(i=>`
    <div class="card">
      <div class="flex items-center gap-12 mb-12">
        <div style="font-size:28px">${i.icon}</div>
        <div><div class="card-title">${i.name}</div><div class="text-sm text-muted">${i.desc}</div></div>
      </div>
      <div class="flex justify-between items-center">
        <span class="badge ${i.status==='Conectado'?'badge-green':'badge-blue'}">${i.status}</span>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Abrindo configuração de integração...','info')">⚙️ Config</button>
      </div>
    </div>`).join('');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  const today = new Date();
  calYear = today.getFullYear();
  calMonth = today.getMonth();
  document.getElementById('apptDate').value = today.toISOString().split('T')[0];
  renderDashboard();
  // Fetch patients on load so the dropdowns (like schedule) have data
  const p = await fetchPatients();
  populateApptPatients(p);
});
