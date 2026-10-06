import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import {
  ArrowLeftRight, Bell, Building2, Camera, CalendarDays, Check, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, ClipboardCheck, Clock3, FileText, Filter, FolderOpen,
  HardHat, Home, Image, LayoutDashboard, LockKeyhole, LogOut, Mail, Menu,
  MessageCircle, Mic, MoreHorizontal, Package, Pause, Play, Plus, Search, Send, Settings,
  ShieldCheck, Smartphone, Sparkles, Trash2, TrendingUp, Upload, UserRound, Users, X,
} from './icons'
import { initialUpdates, projects, type Project, type Update } from './data'
import { CrmBoard, initialLeads, isOpenLead, type Lead } from './crm'
import { CashFlow, FinanceOverview } from './finance'
import { ProfilesPage } from './profiles'

type ViewMode = 'company' | 'client'
type Page = 'dashboard' | 'projects' | 'finance' | 'cashflow' | 'crm' | 'inventory' | 'invoices' | 'administration' | 'documents' | 'updates' | 'approvals' | 'people' | 'settings'
type Role = 'admin' | 'engineer' | 'field' | 'client'

const navGroups = [
  { label: 'VISÃO GERAL', items: [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  ] },
  { label: 'ADMINISTRATIVO', items: [
    { id: 'administration' as Page, label: 'Painel administrativo', icon: Settings },
    { id: 'people' as Page, label: 'Perfis e acessos', icon: Users },
    { id: 'documents' as Page, label: 'Documentos', icon: FolderOpen },
  ] },
  { label: 'COMERCIAL', items: [
    { id: 'crm' as Page, label: 'CRM', icon: Filter, count: '9' },
  ] },
  { label: 'FINANCEIRO', items: [
    { id: 'finance' as Page, label: 'Painel financeiro', icon: TrendingUp },
    { id: 'cashflow' as Page, label: 'Fluxo de caixa', icon: ArrowLeftRight },
    { id: 'invoices' as Page, label: 'Notas fiscais', icon: FileText, count: '3' },
  ] },
  { label: 'OPERACIONAL', items: [
    { id: 'projects' as Page, label: 'Obras', icon: Building2, count: '4' },
    { id: 'inventory' as Page, label: 'Estoque', icon: Package },
  ] },
]

const moduleCards = [
  { label: 'Diário de obra', detail: '12 registros', icon: FileText, color: 'blue' },
  { label: 'Fotos', detail: '86 arquivos', icon: Image, color: 'violet' },
  { label: 'Documentos', detail: '24 arquivos', icon: FolderOpen, color: 'cyan' },
  { label: 'Aprovações', detail: '2 pendentes', icon: ClipboardCheck, color: 'orange' },
  { label: 'Chat com cliente', detail: '1 não lida', icon: MessageCircle, color: 'pink' },
  { label: 'Equipe', detail: '9 participantes', icon: Users, color: 'green' },
]

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'logo compact' : 'logo'}>
      <img
        src={compact ? './brand/vertia-logo.svg?v=spacing-1' : './brand/vertia-logo-inverse.svg?v=spacing-1'}
        alt="Vértia"
        width="1565"
        height="411"
      />
    </div>
  )
}

function StatusBadge({ status }: { status: Project['status'] }) {
  return <span className={`status status-${status.toLowerCase().replace(' ', '-')}`}><span />{status}</span>
}

function Sidebar({ page, setPage, view, setView, open, onClose, role, onLogout, crmCount }: {
  page: Page
  setPage: (page: Page) => void
  view: ViewMode
  setView: (view: ViewMode) => void
  open: boolean
  onClose: () => void
  role: Role
  onLogout: () => void
  crmCount: number
}) {
  const profile = role === 'engineer'
    ? { initials: 'RC', name: 'Rafael Costa', label: 'Engenheiro' }
    : { initials: 'FS', name: 'Felipe Sales', label: 'Administrador' }
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-top">
        <Logo />
        <button className="mobile-close icon-button" onClick={onClose} aria-label="Fechar menu"><X size={20} /></button>
      </div>
      <div className="workspace-switch">
        <div className="workspace-avatar"><HardHat size={18} /></div>
        <div><small>Empresa</small><strong>Horizonte Engenharia</strong></div>
        <ChevronDown size={16} />
      </div>
      <nav className="main-nav">
        {navGroups.map((group, index) => <div className="nav-group" key={group.label}><p className={`nav-label ${index ? 'nav-label-spaced' : ''}`}>{group.label}</p>{group.items.map(({ id, label, icon: Icon, count }) => <button key={id} className={page === id && view === 'company' ? 'active' : ''} onClick={() => { setPage(id); setView('company'); onClose() }}><Icon size={19} /><span>{label}</span>{count && <em>{id === 'crm' ? crmCount : count}</em>}</button>)}</div>)}
        <p className="nav-label nav-label-spaced">CONTA</p>
        <button className={page === 'settings' ? 'active' : ''} onClick={() => { setPage('settings'); setView('company'); onClose() }}>
          <Settings size={19} /><span>Configurações</span>
        </button>
      </nav>
      <div className="sidebar-bottom">
        <button className="portal-preview" onClick={() => { setView('client'); onClose() }}>
          <span className="portal-icon"><UserRound size={17} /></span>
          <span><small>Alternar experiência</small><strong>Portal do cliente</strong></span>
          <ChevronRight size={17} />
        </button>
        <div className="user-block">
          <div className="avatar">{profile.initials}</div>
          <div><strong>{profile.name}</strong><small>{profile.label}</small></div>
          <button className="logout-button" onClick={onLogout} title="Sair"><LogOut size={17} /></button>
        </div>
      </div>
    </aside>
  )
}

function Header({ title, subtitle, onMenu, onNewUpdate }: { title: string; subtitle?: string; onMenu: () => void; onNewUpdate?: () => void }) {
  return (
    <header className="topbar">
      <button className="menu-button icon-button" onClick={onMenu} aria-label="Abrir menu"><Menu size={21} /></button>
      <div className="page-heading"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      <div className="topbar-actions">
        <div className="search"><Search size={18} /><input placeholder="Buscar na Vértia" /><kbd>⌘ K</kbd></div>
        <button className="icon-button notification"><Bell size={20} /><span /></button>
        {onNewUpdate && <button className="primary-button" onClick={onNewUpdate}><Plus size={18} />Nova atualização</button>}
      </div>
    </header>
  )
}

function MetricCard({ label, value, helper, icon: Icon, tone }: { label: string; value: string; helper: string; icon: typeof Building2; tone: string }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={20} /></div>
      <div className="metric-copy"><p>{label}</p><strong>{value}</strong><small>{helper}</small></div>
      <button className="icon-button subtle"><MoreHorizontal size={18} /></button>
    </article>
  )
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button className="project-card" onClick={onClick}>
      <div className={`project-cover ${project.tone}`}>
        <div className="building-lines"><span /><span /><span /><span /></div>
        <StatusBadge status={project.status} />
      </div>
      <div className="project-card-content">
        <div className="project-title-row"><div><h3>{project.name}</h3><p>{project.location}</p></div><ChevronRight size={19} /></div>
        <div className="progress-row"><span>Progresso</span><strong>{project.progress}%</strong></div>
        <div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div>
        <div className="project-meta"><span><CalendarDays size={15} />{project.deadline}</span><span><UserRound size={15} />{project.manager}</span></div>
      </div>
    </button>
  )
}

function ActivityItem({ item }: { item: Update }) {
  const icons = { foto: Image, diario: FileText, documento: FolderOpen, aprovacao: ClipboardCheck }
  const Icon = icons[item.type]
  return (
    <div className="activity-item">
      <div className={`activity-icon ${item.type}`}><Icon size={17} /></div>
      <div className="activity-content">
        <div className="activity-title"><strong>{item.title}</strong><span className={item.visible ? 'visibility client' : 'visibility internal'}>{item.visible ? 'Cliente' : 'Interno'}</span></div>
        <p>{item.description}</p>
        <small>{item.author} · {item.time}</small>
      </div>
    </div>
  )
}

function Dashboard({ updates, onOpenProject, onNewUpdate, onMenu, onNavigate }: { updates: Update[]; onOpenProject: (project: Project) => void; onNewUpdate: () => void; onMenu: () => void; onNavigate: (page: Page) => void }) {
  return (
    <>
      <Header title="Bom dia, Felipe" subtitle="Veja o que está acontecendo nas suas obras hoje." onMenu={onMenu} onNewUpdate={onNewUpdate} />
      <main className="content dashboard-content">
        <section className="metrics-grid">
          <MetricCard label="Obras ativas" value="4" helper="1 exige atenção" icon={Building2} tone="blue" />
          <MetricCard label="Receita contratada" value="R$ 948 mil" helper="4 obras em carteira" icon={Sparkles} tone="violet" />
          <MetricCard label="Resultado projetado" value="R$ 335 mil" helper="Margem prevista de 35,4%" icon={ClipboardCheck} tone="orange" />
          <MetricCard label="Pipeline comercial" value="R$ 1,48 mi" helper="18 oportunidades abertas" icon={Users} tone="cyan" />
        </section>

        <section className="admin-dashboard-shortcuts"><button onClick={() => onNavigate('finance')}><span className="admin-shortcut-icon finance"><ClipboardCheck size={20} /></span><div><strong>Financeiro</strong><small>R$ 184 mil a receber</small></div><ChevronRight size={17} /></button><button onClick={() => onNavigate('crm')}><span className="admin-shortcut-icon crm"><Users size={20} /></span><div><strong>CRM</strong><small>9 leads ativos no funil</small></div><ChevronRight size={17} /></button><button onClick={() => onNavigate('inventory')}><span className="admin-shortcut-icon stock"><FolderOpen size={20} /></span><div><strong>Estoque</strong><small>7 itens com saldo baixo</small></div><ChevronRight size={17} /></button><button onClick={() => onNavigate('invoices')}><span className="admin-shortcut-icon invoice"><FileText size={20} /></span><div><strong>Notas fiscais</strong><small>3 aguardando vínculo</small></div><ChevronRight size={17} /></button></section>

        <section className="section-block">
          <div className="section-heading"><div><h2>Obras em andamento</h2><p>Acompanhe o progresso e as próximas entregas.</p></div><button className="text-button">Ver todas <ChevronRight size={16} /></button></div>
          <div className="projects-grid">{projects.slice(0, 3).map(project => <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project)} />)}</div>
        </section>

        <section className="dashboard-lower">
          <div className="panel activity-panel">
            <div className="panel-heading"><div><h2>Atualizações recentes</h2><p>Registros de todas as obras</p></div><button className="filter-button">Todas as obras <ChevronDown size={15} /></button></div>
            <div className="activity-list">{updates.slice(0, 4).map(item => <ActivityItem key={item.id} item={item} />)}</div>
          </div>
          <div className="side-stack">
            <div className="panel pending-panel">
              <div className="panel-heading"><div><h2>Pendências</h2><p>Precisam da sua atenção</p></div><span className="number-badge">5</span></div>
              <div className="pending-list">
                <div><span className="pending-dot urgent" /><p><strong>Aprovar projeto luminotécnico</strong><small>Alto de Pinheiros · há 2 dias</small></p></div>
                <div><span className="pending-dot warning" /><p><strong>Revisar relatório semanal</strong><small>Edifício Aurora · ontem</small></p></div>
                <div><span className="pending-dot info" /><p><strong>Responder mensagem do cliente</strong><small>Clínica Vila Madalena · 3h</small></p></div>
              </div>
              <button className="full-text-button">Ver todas as pendências</button>
            </div>
            <div className="insight-card"><div className="insight-icon"><Sparkles size={19} /></div><div><span>Resumo da semana</span><strong>3 obras avançaram dentro do planejado.</strong><button>Ver detalhes <ChevronRight size={15} /></button></div></div>
          </div>
        </section>
      </main>
    </>
  )
}

function ProjectsPage({ onOpenProject, onMenu }: { onOpenProject: (project: Project) => void; onMenu: () => void }) {
  const [filter, setFilter] = useState('Todas')
  const filtered = filter === 'Todas' ? projects : projects.filter(p => p.status === filter)
  return (
    <>
      <Header title="Obras" subtitle="Gerencie todas as obras em um único lugar." onMenu={onMenu} />
      <main className="content">
        <div className="page-actions"><div className="segmented">{['Todas', 'Em andamento', 'Atenção', 'Planejada'].map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="primary-button"><Plus size={18} />Criar obra</button></div>
        <div className="projects-page-grid">{filtered.map(project => <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project)} />)}</div>
      </main>
    </>
  )
}

function AdminModulePage({ page, onMenu, onNavigate, leads, setLeads }: { page: Page; onMenu: () => void; onNavigate: (page: Page) => void; leads: Lead[]; setLeads: Dispatch<SetStateAction<Lead[]>> }) {
  const [invoiceSaved, setInvoiceSaved] = useState(false)
  const [invoiceForm, setInvoiceForm] = useState({ number: '', supplier: '', project: projects[0].name, value: '' })
  const titles: Partial<Record<Page, { title: string; subtitle: string }>> = {
    finance: { title: 'Painel financeiro', subtitle: 'Receitas, despesas e resultado da empresa, com comparativo entre anos.' },
    cashflow: { title: 'Fluxo de caixa', subtitle: 'Entradas, saídas e saldo de caixa mês a mês.' },
    crm: { title: 'CRM', subtitle: 'Acompanhe cada lead do primeiro contato ao fechamento.' },
    inventory: { title: 'Estoque', subtitle: 'Controle entradas, saídas, saldos e materiais vinculados às obras.' },
    invoices: { title: 'Notas fiscais', subtitle: 'Cadastre documentos fiscais e vincule os custos às obras.' },
    administration: { title: 'Painel administrativo', subtitle: 'Estrutura da empresa, contratos, acessos e rotinas internas.' },
    people: { title: 'Perfis e acessos', subtitle: 'Gerencie administradores, engenheiros, equipe de campo e clientes.' },
  }
  const title = titles[page] ?? { title: 'Gestão', subtitle: '' }
  const saveInvoice = (event: FormEvent) => {
    event.preventDefault()
    if (!invoiceForm.number || !invoiceForm.supplier || !invoiceForm.value) return
    setInvoiceSaved(true)
    setInvoiceForm(current => ({ ...current, number: '', supplier: '', value: '' }))
  }
  return (
    <>
      <Header title={title.title} subtitle={title.subtitle} onMenu={onMenu} />
      <main className="content admin-module-content">
        {page === 'finance' && <>
          <FinanceOverview />
          <div className="viz-section-heading"><h2>Posição atual</h2><p>Obras em andamento e compromissos de outubro de 2026.</p></div>
          <section className="admin-two-columns finance-current"><section className="admin-table-panel"><div className="admin-panel-heading"><div><h2>Resultado por obra</h2><p>Receita, custo e margem projetada.</p></div><button>Exportar relatório</button></div><div className="finance-project-table"><div className="admin-table-head"><span>OBRA</span><span>CONTRATO</span><span>REALIZADO</span><span>MARGEM</span><span>STATUS</span></div>{projects.map(project => <article key={project.id}><div><strong>{project.name}</strong><small>{project.client}</small></div><span>R$ {project.id === 1 ? '320.000' : project.id === 2 ? '278.000' : project.id === 3 ? '210.000' : '140.000'}</span><span>R$ {project.id === 1 ? '188.400' : project.id === 2 ? '195.700' : project.id === 3 ? '156.200' : '72.150'}</span><strong>{project.id === 2 ? '29,6%' : '35,8%'}</strong><StatusBadge status={project.status} /></article>)}</div></section><aside className="admin-panel"><div className="admin-panel-heading"><div><h2>Contas a vencer</h2><p>Próximos compromissos.</p></div><span className="number-badge">4</span></div><div className="due-list"><div><span>02 OUT</span><p><strong>Concreto Usinado Brasil</strong><small>Residência Alto de Pinheiros</small></p><b>R$ 18.450</b></div><div><span>05 OUT</span><p><strong>Folha de prestadores</strong><small>3 obras vinculadas</small></p><b>R$ 42.800</b></div><div><span>08 OUT</span><p><strong>Elétrica Nova Luz</strong><small>Clínica Vila Madalena</small></p><b>R$ 9.720</b></div></div></aside></section>
        </>}

        {page === 'cashflow' && <CashFlow />}

        {page === 'crm' && <CrmBoard leads={leads} setLeads={setLeads} />}

        {page === 'people' && <ProfilesPage />}

        {page === 'inventory' && <>
          <section className="admin-summary-grid inventory-summary"><article><span className="admin-summary-icon revenue"><FolderOpen size={20} /></span><div><small>VALOR EM ESTOQUE</small><strong>R$ 86.420</strong><p>Distribuído em 4 obras</p></div></article><article><span className="admin-summary-icon receive"><ClipboardCheck size={20} /></span><div><small>ITENS CADASTRADOS</small><strong>184</strong><p>32 categorias</p></div></article><article><span className="admin-summary-icon expense"><Bell size={20} /></span><div><small>ESTOQUE BAIXO</small><strong>7</strong><p>Precisam de reposição</p></div></article><article><span className="admin-summary-icon result"><CheckCircle2 size={20} /></span><div><small>MOVIMENTAÇÕES</small><strong>46</strong><p>Nos últimos 7 dias</p></div></article></section>
          <div className="inventory-toolbar"><div className="search inventory-search"><Search size={17} /><input placeholder="Buscar material ou equipamento" /></div><select><option>Todas as obras</option>{projects.map(project => <option key={project.id}>{project.name}</option>)}</select><button className="secondary-button"><Upload size={17} />Registrar entrada</button><button className="primary-button"><Plus size={17} />Novo item</button></div>
          <section className="admin-table-panel"><div className="admin-panel-heading"><div><h2>Posição do estoque</h2><p>Saldos disponíveis por item e obra.</p></div></div><div className="inventory-table"><div className="admin-table-head"><span>ITEM</span><span>OBRA</span><span>SALDO</span><span>MÍNIMO</span><span>VALOR</span><span>STATUS</span></div>{[{ item: 'Argamassa AC-II', category: 'Revestimentos', project: 'Alto de Pinheiros', stock: '18 sacos', min: '12 sacos', value: 'R$ 684', status: 'Normal' }, { item: 'Cabo flexível 2,5 mm', category: 'Elétrica', project: 'Clínica Vila Madalena', stock: '85 m', min: '100 m', value: 'R$ 412', status: 'Estoque baixo' }, { item: 'Bloco cerâmico 14 cm', category: 'Alvenaria', project: 'Edifício Aurora', stock: '620 un.', min: '400 un.', value: 'R$ 2.480', status: 'Normal' }, { item: 'Cimento CP-II', category: 'Estrutura', project: 'Alto de Pinheiros', stock: '8 sacos', min: '15 sacos', value: 'R$ 304', status: 'Estoque baixo' }, { item: 'Tubo PVC 50 mm', category: 'Hidráulica', project: 'Clínica Vila Madalena', stock: '42 m', min: '20 m', value: 'R$ 756', status: 'Normal' }].map(row => <article key={row.item}><div><strong>{row.item}</strong><small>{row.category}</small></div><span>{row.project}</span><strong>{row.stock}</strong><span>{row.min}</span><span>{row.value}</span><em className={row.status === 'Normal' ? 'normal' : 'low'}>{row.status}</em></article>)}</div></section>
        </>}

        {page === 'invoices' && <section className="invoice-layout"><div><section className="admin-summary-grid invoice-summary"><article><span className="admin-summary-icon revenue"><FileText size={20} /></span><div><small>NOTAS NO MÊS</small><strong>38</strong><p>R$ 142.680 lançados</p></div></article><article><span className="admin-summary-icon expense"><Clock3 size={20} /></span><div><small>AGUARDANDO VÍNCULO</small><strong>3</strong><p>Precisam de uma obra</p></div></article><article><span className="admin-summary-icon result"><CheckCircle2 size={20} /></span><div><small>PROCESSADAS</small><strong>35</strong><p>92% do período</p></div></article></section><section className="admin-table-panel"><div className="admin-panel-heading"><div><h2>Notas fiscais recentes</h2><p>Documentos lançados e vinculados às obras.</p></div><button>Exportar</button></div><div className="invoice-table"><div className="admin-table-head"><span>NOTA / FORNECEDOR</span><span>OBRA</span><span>EMISSÃO</span><span>VALOR</span><span>STATUS</span></div>{[{ n: 'NF 008742', supplier: 'Concreto Usinado Brasil', project: 'Alto de Pinheiros', date: '29 set 2026', value: 'R$ 18.450', status: 'Vinculada' }, { n: 'NF 001285', supplier: 'Elétrica Nova Luz', project: 'Clínica Vila Madalena', date: '28 set 2026', value: 'R$ 9.720', status: 'Vinculada' }, { n: 'NF 004921', supplier: 'Depósito Central', project: 'Sem vínculo', date: '28 set 2026', value: 'R$ 4.380', status: 'Pendente' }, { n: 'NF 000938', supplier: 'Vidraçaria Cristal', project: 'Edifício Aurora', date: '27 set 2026', value: 'R$ 12.640', status: 'Vinculada' }].map(note => <article key={note.n}><div><strong>{note.n}</strong><small>{note.supplier}</small></div><span>{note.project}</span><span>{note.date}</span><strong>{note.value}</strong><em className={note.status === 'Vinculada' ? 'linked' : 'pending'}>{note.status}</em></article>)}</div></section></div><form className="invoice-form" onSubmit={saveInvoice}><div className="diary-form-heading"><span><FileText size={20} /></span><div><strong>Anexar nota fiscal</strong><small>Vincule o custo diretamente à obra</small></div></div><button type="button" className="invoice-upload"><Upload size={22} /><span><strong>Selecionar XML ou PDF</strong><small>Arraste o arquivo ou clique para procurar</small></span></button><label>Número da nota<input required value={invoiceForm.number} onChange={event => { setInvoiceForm(current => ({ ...current, number: event.target.value })); setInvoiceSaved(false) }} placeholder="Ex.: 008743" /></label><label>Fornecedor<input required value={invoiceForm.supplier} onChange={event => setInvoiceForm(current => ({ ...current, supplier: event.target.value }))} placeholder="Razão social ou nome fantasia" /></label><label>Vincular à obra<select value={invoiceForm.project} onChange={event => setInvoiceForm(current => ({ ...current, project: event.target.value }))}>{projects.map(project => <option key={project.id}>{project.name}</option>)}</select></label><label>Valor total<input required value={invoiceForm.value} onChange={event => setInvoiceForm(current => ({ ...current, value: event.target.value }))} placeholder="R$ 0,00" /></label>{invoiceSaved && <div className="request-success"><CheckCircle2 size={18} />Nota fiscal anexada e vinculada à obra.</div>}<button className="primary-button invoice-submit" type="submit"><Check size={17} />Salvar nota fiscal</button></form></section>}

        {page === 'administration' && <>
          <section className="administration-cards"><button onClick={() => onNavigate('people')}><span><Users size={21} /></span><div><strong>Pessoas</strong><small>12 pessoas com acesso</small></div><ChevronRight size={17} /></button><button onClick={() => onNavigate('people')}><span><ShieldCheck size={21} /></span><div><strong>Perfis e permissões</strong><small>5 perfis de acesso</small></div><ChevronRight size={17} /></button><button><span><FileText size={21} /></span><div><strong>Contratos da empresa</strong><small>12 documentos vigentes</small></div><ChevronRight size={17} /></button><button><span><Building2 size={21} /></span><div><strong>Fornecedores</strong><small>36 empresas cadastradas</small></div><ChevronRight size={17} /></button></section><section className="admin-two-columns administration-columns"><div className="admin-panel"><div className="admin-panel-heading"><div><h2>Equipe administrativa</h2><p>Usuários e responsabilidades.</p></div><button onClick={() => onNavigate('people')}>Gerenciar acessos</button></div><div className="admin-people-list">{[['FS', 'Felipe Sales', 'Administrador', 'Acesso completo'], ['AP', 'Ana Prado', 'Financeiro', 'Financeiro e notas fiscais'], ['RC', 'Rafael Costa', 'Engenheiro', '3 obras'], ['CN', 'Camila Nunes', 'Engenheira', '2 obras']].map(person => <div key={person[1]}><span className="avatar">{person[0]}</span><div><strong>{person[1]}</strong><small>{person[2]} · {person[3]}</small></div><em>Ativo</em><button className="icon-button"><MoreHorizontal size={17} /></button></div>)}</div></div><aside className="admin-panel"><div className="admin-panel-heading"><div><h2>Rotinas administrativas</h2><p>Pendências da empresa.</p></div></div><div className="admin-routine-list"><div><span className="pending-dot urgent" /><p><strong>Renovar seguro empresarial</strong><small>Vence em 5 dias</small></p></div><div><span className="pending-dot warning" /><p><strong>Revisar contrato de fornecedor</strong><small>Depósito Central</small></p></div><div><span className="pending-dot info" /><p><strong>Conferir documentação trabalhista</strong><small>3 prestadores pendentes</small></p></div></div></aside></section>
        </>}
      </main>
    </>
  )
}

function GenericPage({ page, updates, onMenu }: { page: Page; updates: Update[]; onMenu: () => void }) {
  const map: Record<Page, { title: string; subtitle: string; icon: typeof FileText }> = {
    dashboard: { title: 'Visão geral', subtitle: '', icon: LayoutDashboard },
    projects: { title: 'Obras', subtitle: '', icon: Building2 },
    finance: { title: 'Painel financeiro', subtitle: 'Gestão financeira consolidada.', icon: TrendingUp },
    cashflow: { title: 'Fluxo de caixa', subtitle: 'Entradas, saídas e saldo de caixa.', icon: ArrowLeftRight },
    crm: { title: 'CRM', subtitle: 'Leads e propostas comerciais.', icon: Filter },
    inventory: { title: 'Estoque', subtitle: 'Materiais e equipamentos.', icon: FolderOpen },
    invoices: { title: 'Notas fiscais', subtitle: 'Documentos fiscais vinculados às obras.', icon: FileText },
    administration: { title: 'Administrativo', subtitle: 'Rotinas e estrutura da empresa.', icon: Settings },
    updates: { title: 'Atualizações', subtitle: 'Histórico completo de registros e publicações.', icon: Sparkles },
    documents: { title: 'Documentos', subtitle: 'Arquivos organizados por empresa e obra.', icon: FolderOpen },
    approvals: { title: 'Aprovações', subtitle: 'Decisões do cliente com histórico e contexto.', icon: ClipboardCheck },
    people: { title: 'Pessoas', subtitle: 'Equipe, clientes e acessos às obras.', icon: Users },
    settings: { title: 'Configurações', subtitle: 'Preferências da empresa e permissões.', icon: Settings },
  }
  const item = map[page]
  const Icon = item.icon
  return (
    <>
      <Header title={item.title} subtitle={item.subtitle} onMenu={onMenu} />
      <main className="content">
        {page === 'updates' ? <div className="panel standalone-list">{updates.map(update => <ActivityItem key={update.id} item={update} />)}</div> :
          <div className="empty-state"><div className="empty-icon"><Icon size={28} /></div><h2>{item.title}</h2><p>Esta área já faz parte da navegação do protótipo e será detalhada na próxima rodada de validação.</p><button className="secondary-button">Registrar observação</button></div>}
      </main>
    </>
  )
}

function ProjectDetail({ project, updates, onBack, onClient, onNewUpdate }: { project: Project; updates: Update[]; onBack: () => void; onClient: () => void; onNewUpdate: () => void }) {
  const [tab, setTab] = useState('Visão geral')
  return (
    <>
      <header className="project-topbar">
        <button className="back-button" onClick={onBack}><ChevronLeft size={18} />Obras</button>
        <div className="project-top-actions"><button className="secondary-button" onClick={onClient}><UserRound size={17} />Ver como cliente</button><button className="primary-button" onClick={onNewUpdate}><Plus size={18} />Nova atualização</button></div>
      </header>
      <main className="content project-detail">
        <section className="project-hero">
          <div className={`project-mark ${project.tone}`}><Building2 size={26} /></div>
          <div className="project-hero-copy"><div><h1>{project.name}</h1><StatusBadge status={project.status} /></div><p>{project.location} · Cliente: {project.client}</p></div>
          <div className="project-hero-progress"><div><span>Progresso geral</span><strong>{project.progress}%</strong></div><div className="progress-track large"><span style={{ width: `${project.progress}%` }} /></div><small>Previsão de entrega: {project.deadline}</small></div>
        </section>
        <div className="tabs">{['Visão geral', 'Timeline', 'Arquivos', 'Equipe'].map(item => <button key={item} onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>{item}</button>)}</div>
        {tab === 'Visão geral' ? <>
          <section className="module-grid">{moduleCards.map(({ label, detail, icon: Icon, color }) => <button className="module-card" key={label}><span className={`module-icon ${color}`}><Icon size={20} /></span><span><strong>{label}</strong><small>{detail}</small></span><ChevronRight size={18} /></button>)}</section>
          <section className="project-columns">
            <div className="panel activity-panel"><div className="panel-heading"><div><h2>Linha do tempo</h2><p>Últimas movimentações da obra</p></div><button className="text-button">Ver tudo</button></div>{updates.slice(0, 3).map(update => <ActivityItem key={update.id} item={update} />)}</div>
            <div className="panel project-info"><div className="panel-heading"><div><h2>Informações da obra</h2><p>Dados principais</p></div><button className="icon-button subtle"><MoreHorizontal size={18} /></button></div><dl><div><dt>Responsável</dt><dd>{project.manager}</dd></div><div><dt>Cliente</dt><dd>{project.client}</dd></div><div><dt>Início</dt><dd>12 mai 2026</dd></div><div><dt>Previsão</dt><dd>{project.deadline}</dd></div><div><dt>Participantes</dt><dd>9 pessoas</dd></div></dl></div>
          </section>
        </> : <div className="panel tab-content"><div className="empty-icon"><Clock3 size={28} /></div><h2>{tab}</h2><p>A estrutura desta seção será refinada junto com os documentos correspondentes.</p></div>}
      </main>
    </>
  )
}

function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Informe seu e-mail e sua senha para continuar.')
      return
    }
    const normalized = email.toLowerCase()
    if (normalized.includes('cliente')) onLogin('client')
    else if (normalized.includes('campo')) onLogin('field')
    else if (normalized.includes('engenheiro')) onLogin('engineer')
    else onLogin('admin')
  }

  const demoProfiles: Array<{ role: Role; label: string; detail: string; icon: typeof UserRound }> = [
    { role: 'admin', label: 'Administrador', detail: 'Gestão completa', icon: LayoutDashboard },
    { role: 'engineer', label: 'Engenheiro', detail: 'Gestão das obras', icon: HardHat },
    { role: 'field', label: 'Equipe de campo', detail: 'Registro rápido', icon: Smartphone },
    { role: 'client', label: 'Cliente', detail: 'Acompanhamento', icon: UserRound },
  ]

  return (
    <div className="login-page">
      <section className="login-brand-panel">
        <Logo />
        <div className="login-brand-copy">
          <span className="login-kicker">ENGENHARIA · TECNOLOGIA · CONEXÃO</span>
          <h1>Tudo da obra em um só lugar.</h1>
          <p>A Vértia une empresa, engenharia, equipe de campo e cliente na mesma plataforma, do primeiro registro à entrega da obra.</p>
        </div>
        <div className="login-principles">
          <div><Building2 size={19} /><span><strong>Uma obra, uma única verdade</strong><small>Registros, documentos e decisões sempre conectados</small></span></div>
          <div><Users size={19} /><span><strong>Empresa e cliente lado a lado</strong><small>Mais transparência para acompanhar e confiança para decidir</small></span></div>
          <div><ShieldCheck size={19} /><span><strong>Tecnologia que acompanha a execução</strong><small>Simples no escritório, prática no campo e clara para o cliente</small></span></div>
        </div>
        <small className="login-brand-footer">Engenharia conectada. Gestão inteligente.</small>
      </section>
      <section className="login-form-panel">
        <div className="login-mobile-logo"><Logo compact /></div>
        <div className="login-box">
          <div className="login-heading"><span className="eyebrow">BEM-VINDO À VÉRTIA</span><h2>Acesse sua conta</h2><p>Use os dados cadastrados ou o convite enviado pela empresa.</p></div>
          <form onSubmit={submit}>
            <label>E-mail<div className="input-with-icon"><Mail size={17} /><input type="email" value={email} onChange={event => { setEmail(event.target.value); setError('') }} placeholder="nome@empresa.com.br" /></div></label>
            <label>Senha<div className="input-with-icon"><LockKeyhole size={17} /><input type="password" value={password} onChange={event => { setPassword(event.target.value); setError('') }} placeholder="Digite sua senha" /></div></label>
            <div className="login-options"><label className="remember"><input type="checkbox" />Manter conectado</label><button type="button">Esqueci minha senha</button></div>
            {error && <p className="login-error">{error}</p>}
            <button className="primary-button login-submit" type="submit">Entrar na Vértia <ChevronRight size={17} /></button>
          </form>
          <div className="first-access"><span><Mail size={17} /></span><div><strong>Recebeu um convite?</strong><p>Ative seu primeiro acesso e defina uma senha.</p></div><button>Ativar convite</button></div>
          <div className="demo-access"><div className="demo-divider"><span>ACESSOS PARA DEMONSTRAÇÃO</span></div><div className="demo-grid">{demoProfiles.map(({ role, label, detail, icon: Icon }) => <button key={role} onClick={() => onLogin(role)}><span><Icon size={18} /></span><div><strong>{label}</strong><small>{detail}</small></div><ChevronRight size={15} /></button>)}</div></div>
        </div>
      </section>
    </div>
  )
}

type ChatMessage = { id: number; author: string; time: string; mine: boolean; text?: string; audio?: { seconds: number; url?: string }; photo?: string }

const audioBars = [35, 60, 45, 80, 55, 30, 70, 95, 50, 40, 75, 60, 35, 85, 65, 45, 30, 55, 90, 70, 40, 60, 50, 35, 75, 45, 30, 55]
const formatSeconds = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`

function AudioMessage({ seconds, url }: { seconds: number; url?: string }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!playing) return
    if (!url) {
      const timer = window.setInterval(() => setElapsed(current => current + 0.1), 100)
      return () => window.clearInterval(timer)
    }
    const audio = audioRef.current ?? new Audio(url)
    audioRef.current = audio
    const onTime = () => setElapsed(audio.currentTime)
    const onEnded = () => { setPlaying(false); setElapsed(0) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    audio.play().catch(() => setPlaying(false))
    return () => { audio.pause(); audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnded) }
  }, [playing, url])

  useEffect(() => {
    if (!url && playing && elapsed >= seconds) { setPlaying(false); setElapsed(0) }
  }, [url, playing, elapsed, seconds])

  const progress = Math.min(elapsed / seconds, 1)
  return (
    <div className="fm-audio">
      <button type="button" onClick={() => setPlaying(current => !current)} aria-label={playing ? 'Pausar áudio' : 'Ouvir áudio'}>{playing ? <Pause size={22} strokeWidth={3} /> : <Play size={22} fill="currentColor" />}</button>
      <div><div className="fm-audio-wave">{audioBars.map((height, index) => <i key={index} className={index < progress * audioBars.length ? 'played' : ''} style={{ height: `${height}%` }} />)}</div><span className="fm-audio-time">{formatSeconds(elapsed > 0 ? elapsed : seconds)}</span></div>
    </div>
  )
}

function FieldPortal({ assignedProjects, onLogout }: { assignedProjects: Project[]; onLogout: () => void }) {
  type FieldView = 'messages' | 'materials' | 'measurement' | 'profile'
  type ChatRoom = 'engineer' | 'site'
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [view, setView] = useState<FieldView>('messages')
  const [chatRoom, setChatRoom] = useState<ChatRoom>('engineer')
  const [message, setMessage] = useState('')
  const [material, setMaterial] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('unidades')
  const [details, setDetails] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [unreadSite, setUnreadSite] = useState(3)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const recordTimerRef = useRef<number | undefined>(undefined)
  const startingRef = useRef(false)
  const aliveRef = useRef(true)
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const photoInputRef = useRef<HTMLInputElement | null>(null)
  const materialPhotoInputRef = useRef<HTMLInputElement | null>(null)
  const [materialPhoto, setMaterialPhoto] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<ChatRoom, ChatMessage[]>>({
    engineer: [
      { id: 1, author: 'Rafael Costa', text: 'Bom dia, João. Consegue conferir a chegada dos blocos?', time: '08:12', mine: false },
      { id: 2, author: 'Você', text: 'Bom dia! Vou conferir e envio uma foto assim que descarregarem.', time: '08:16', mine: true },
      { id: 3, author: 'Rafael Costa', audio: { seconds: 14 }, time: '08:20', mine: false },
    ],
    site: [
      { id: 1, author: 'Carlos · Mestre de obras', text: 'Equipe, hoje começamos pela alvenaria do pavimento térreo.', time: '07:05', mine: false },
      { id: 2, author: 'Marcos · Eletricista', text: 'Material elétrico já está no almoxarifado.', time: '07:18', mine: false },
      { id: 3, author: 'Você', text: 'Certo, estou chegando no setor A.', time: '07:22', mine: true },
      { id: 4, author: 'Carlos · Mestre de obras', audio: { seconds: 9 }, time: '07:30', mine: false },
    ],
  })
  const [requests, setRequests] = useState<{ id: number; item: string; quantity: string; status: string; date: string; photo?: string }[]>([
    { id: 1, item: 'Argamassa AC-II', quantity: '12 sacos', status: 'A caminho', date: 'Hoje, 09:10' },
    { id: 2, item: 'Disco de corte 110 mm', quantity: '3 unidades', status: 'Comprado', date: 'Ontem, 15:42' },
    { id: 3, item: 'Cimento CP-II', quantity: '20 sacos', status: 'Em cotação', date: 'Ontem, 11:03' },
  ])
  const project = assignedProjects.find(item => item.id === selectedProjectId) ?? assignedProjects[0]
  const managerInitials = project.manager.split(' ').slice(0, 2).map(name => name[0]).join('')

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      window.clearInterval(recordTimerRef.current)
      recorderRef.current?.stream.getTracks().forEach(track => track.stop())
    }
  }, [])
  useEffect(() => {
    const list = messagesRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, chatRoom, view, selectedProjectId])

  const startRecording = async () => {
    if (recording || startingRef.current) return
    startingRef.current = true
    let recorder: MediaRecorder | null = null
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!aliveRef.current) { stream.getTracks().forEach(track => track.stop()); return }
      recorder = new MediaRecorder(stream)
      recorder.start()
    } catch {
      // Sem microfone ou sem permissão, o protótipo simula a gravação.
      recorder = null
    }
    startingRef.current = false
    if (!aliveRef.current) return
    recorderRef.current = recorder
    setRecordSeconds(0)
    setRecording(true)
    recordTimerRef.current = window.setInterval(() => setRecordSeconds(current => current + 1), 1000)
  }
  const stopRecording = (send: boolean) => {
    if (!recording) return
    window.clearInterval(recordTimerRef.current)
    const recorder = recorderRef.current
    recorderRef.current = null
    const seconds = Math.max(recordSeconds, 1)
    const room = chatRoom
    const addAudio = (url?: string) => setMessages(current => ({
      ...current,
      [room]: [...current[room], { id: Date.now(), author: 'Você', time: 'Agora', mine: true, audio: { seconds, url } }],
    }))
    if (recorder) {
      recorder.ondataavailable = event => { if (send) addAudio(event.data.size > 0 ? URL.createObjectURL(event.data) : undefined) }
      recorder.onstop = () => recorder.stream.getTracks().forEach(track => track.stop())
      recorder.stop()
    } else if (send) addAudio()
    setRecording(false)
    setRecordSeconds(0)
  }

  const goTo = (next: FieldView) => { stopRecording(false); setView(next) }
  const selectRoom = (room: ChatRoom) => { stopRecording(false); setChatRoom(room); if (room === 'site') setUnreadSite(0) }
  const openChat = (room: ChatRoom) => { selectRoom(room); setView('messages') }
  const sendMessage = (event: FormEvent) => {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    setMessages(current => ({
      ...current,
      [chatRoom]: [...current[chatRoom], { id: Date.now(), author: 'Você', text, time: 'Agora', mine: true }],
    }))
    setMessage('')
  }
  const requestMaterial = (event: FormEvent) => {
    event.preventDefault()
    if (!material.trim() || !quantity.trim()) return
    setRequests(current => [{
      id: Date.now(),
      item: material.trim(),
      quantity: `${quantity.trim()} ${unit}`,
      status: urgent ? 'Urgente' : 'Enviado',
      date: 'Agora',
      photo: materialPhoto ?? undefined,
    }, ...current])
    setMaterial(''); setQuantity(''); setDetails(''); setUrgent(false); setMaterialPhoto(null); setRequestSent(true)
  }
  const pickMaterialPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setMaterialPhoto(URL.createObjectURL(file))
    event.target.value = ''
    setRequestSent(false)
  }
  const sendPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setMessages(current => ({
      ...current,
      [chatRoom]: [...current[chatRoom], { id: Date.now(), author: 'Você', time: 'Agora', mine: true, photo: url }],
    }))
    event.target.value = ''
  }
  const confirmReceipt = (id: number) => setRequests(current => current.map(request => request.id === id ? { ...request, status: 'Recebido' } : request))
  const repeatRequest = (request: { item: string; quantity: string }) => {
    const units = ['unidades', 'sacos', 'metros', 'caixas', 'litros', 'kg']
    const [qty, ...rest] = request.quantity.split(' ')
    setMaterial(request.item)
    setQuantity(qty)
    if (rest.length && units.includes(rest.join(' '))) setUnit(rest.join(' '))
    setRequestSent(false)
    const scroll = document.querySelector('.fm-scroll')
    if (scroll) scroll.scrollTop = 0
  }

  const chooseProject = (projectId: number) => {
    setSelectedProjectId(projectId)
    setView('messages')
    setChatRoom('engineer')
    setUnreadSite(3)
    setRequestSent(false)
  }

  if (selectedProjectId === null) return (
    <div className="field-app field-project-picker-app field-mobile-picker">
      <header className="field-header"><Logo compact /><button className="icon-button" onClick={onLogout} title="Sair"><LogOut size={19} /></button></header>
      <main className="field-main project-picker-main">
        <section className="project-picker-heading"><span>ÁREA DO PRESTADOR</span><h1>Escolha uma obra</h1><p>Selecione onde você vai trabalhar agora. As conversas, solicitações e medições serão exibidas de acordo com a obra escolhida.</p></section>
        <div className="assigned-projects">{assignedProjects.map(item => <button key={item.id} onClick={() => chooseProject(item.id)}><span className={`assigned-project-icon ${item.tone}`}><Building2 size={22} /></span><div><span className="assigned-project-status"><i />{item.status}</span><strong>{item.name}</strong><small>{item.location}</small><div className="assigned-project-progress"><span><i style={{ width: `${item.progress}%` }} /></span><strong>{item.progress}%</strong></div><p>Responsável: {item.manager}</p></div><ChevronRight size={19} /></button>)}</div>
        <div className="project-picker-help"><ShieldCheck size={18} /><span><strong>Acesso controlado</strong><small>Você visualiza somente as obras em que está cadastrado.</small></span></div>
      </main>
    </div>
  )

  return (
    <div className="field-app field-mobile">
      <header className="fm-header"><button className="fm-project" onClick={() => { stopRecording(false); setSelectedProjectId(null) }}><span className="fm-project-icon"><Building2 size={21} /></span><span><strong>{project.name}</strong><small>Toque para trocar de obra</small></span><ChevronDown size={20} /></button></header>
      <main className="fm-main">
        {view === 'messages' && <section className="fm-chat">
          <div className="fm-rooms">
            <button className={chatRoom === 'engineer' ? 'active' : ''} onClick={() => selectRoom('engineer')}><span className="fm-room-avatar">{managerInitials}</span><div><strong>Engenheiro</strong><small>{project.manager}</small></div></button>
            <button className={chatRoom === 'site' ? 'active' : ''} onClick={() => selectRoom('site')}><span className="fm-room-avatar group"><Users size={19} /></span><div><strong>Grupo da obra</strong><small>12 pessoas</small></div>{unreadSite > 0 && <em className="fm-unread">{unreadSite}</em>}</button>
          </div>
          <div className="fm-messages" ref={messagesRef}><span className="fm-day">HOJE</span>{messages[chatRoom].map(item => <div key={item.id} className={`fm-bubble ${item.mine ? 'mine' : ''}`}>{chatRoom === 'site' && !item.mine && <strong>{item.author}</strong>}{item.audio ? <AudioMessage seconds={item.audio.seconds} url={item.audio.url} /> : item.photo ? <img className="fm-photo" src={item.photo} alt="Foto enviada" /> : <p>{item.text}</p>}<small>{item.time}</small></div>)}</div>
          {recording ? <div className="fm-compose">
            <button type="button" className="fm-round danger" onClick={() => stopRecording(false)} aria-label="Apagar áudio"><Trash2 size={24} /></button>
            <div className="fm-recording" role="status"><i /><strong>{formatSeconds(recordSeconds)}</strong><span>Gravando áudio</span></div>
            <button type="button" className="fm-round primary" onClick={() => stopRecording(true)} aria-label="Enviar áudio"><Send size={24} /></button>
          </div> : <form className="fm-compose" onSubmit={sendMessage}>
            <button type="button" className="fm-round" onClick={() => photoInputRef.current?.click()} aria-label="Enviar foto"><Camera size={24} /></button>
            <input ref={photoInputRef} type="file" accept="image/*" capture="environment" hidden onChange={sendPhoto} />
            <input value={message} onChange={event => setMessage(event.target.value)} placeholder="Mensagem" />
            {message.trim() ? <button type="submit" className="fm-round primary" aria-label="Enviar mensagem"><Send size={24} /></button> : <button type="button" className="fm-round primary" onClick={startRecording} aria-label="Gravar áudio"><Mic size={24} /></button>}
          </form>}
        </section>}

        {view !== 'messages' && <div className="fm-scroll">

        {view === 'materials' && <section className="field-screen">
          <div className="field-screen-title"><div><span>MATERIAIS</span><h1>Solicitar material</h1><p>Envie o pedido diretamente para o responsável pela obra.</p></div></div>
          <form className="material-form" onSubmit={requestMaterial}><label>Material ou equipamento<input value={material} onChange={event => { setMaterial(event.target.value); setRequestSent(false) }} placeholder="Ex.: Argamassa AC-II" required /></label><div className="material-form-row"><label>Quantidade<input value={quantity} onChange={event => setQuantity(event.target.value)} placeholder="Ex.: 10" required /></label><label>Unidade<select value={unit} onChange={event => setUnit(event.target.value)}><option>unidades</option><option>sacos</option><option>metros</option><option>caixas</option><option>litros</option><option>kg</option></select></label></div><label>Observação<textarea value={details} onChange={event => setDetails(event.target.value)} placeholder="Informe marca, medida ou onde será utilizado." /></label><div className="material-photo">{materialPhoto ? <div className="material-photo-preview"><img src={materialPhoto} alt="Foto do material" /><button type="button" onClick={() => setMaterialPhoto(null)} aria-label="Remover foto"><X size={14} /></button></div> : <button type="button" className="material-photo-add" onClick={() => materialPhotoInputRef.current?.click()}><Camera size={16} />Anexar foto</button>}<input ref={materialPhotoInputRef} type="file" accept="image/*" capture="environment" hidden onChange={pickMaterialPhoto} /></div><label className="urgent-check"><input type="checkbox" checked={urgent} onChange={event => setUrgent(event.target.checked)} /><span><strong>Pedido urgente</strong><small>Marque somente se o trabalho estiver impedido.</small></span></label>{requestSent && <div className="request-success"><CheckCircle2 size={18} />Solicitação enviada para o responsável da obra.</div>}<button className="primary-button material-submit" type="submit">Enviar solicitação <ChevronRight size={17} /></button></form>
          <div className="field-section-heading material-heading"><h2>Meus pedidos</h2><span>{requests.length} solicitações</span></div><div className="material-requests">{requests.map(request => <div key={request.id}><span className="request-icon">{request.photo ? <img className="request-thumb" src={request.photo} alt="" /> : <ClipboardCheck size={19} />}</span><div><strong>{request.item}</strong><small>{request.quantity} · {request.date}</small></div><span className={`request-status ${request.status.toLowerCase().replace(' ', '-')}`}>{request.status}</span><div className="request-actions">{(request.status === 'A caminho' || request.status === 'Entregue') && <button type="button" className="request-confirm" onClick={() => confirmReceipt(request.id)}><Check size={13} />Confirmar recebimento</button>}{request.status === 'Recebido' && <span className="request-received"><CheckCircle2 size={13} />Recebido</span>}<button type="button" className="request-repeat" onClick={() => repeatRequest(request)}><ArrowLeftRight size={13} />Repetir</button></div></div>)}</div>
        </section>}

        {view === 'measurement' && <section className="field-screen">
          <div className="field-screen-title"><div><span>ACESSO INDIVIDUAL</span><h1>Minha medição</h1><p>Confira os serviços registrados e os valores liberados pelo engenheiro.</p></div></div>
          <div className="measurement-summary"><div className="measurement-summary-top"><span><small>MEDIÇÃO ATUAL</small><strong>01 a 15 de setembro</strong></span><span className="measurement-status"><CheckCircle2 size={14} />Aprovada</span></div><div className="measurement-total"><small>VALOR LÍQUIDO PREVISTO</small><strong>R$ 3.284,00</strong><p>Pagamento previsto para 05 de outubro</p></div><div className="contract-progress"><div><span><small>VALOR FECHADO EM CONTRATO</small><strong>R$ 18.000,00</strong></span><span><small>MEDIDO ACUMULADO</small><strong>R$ 6.234,00</strong></span></div><div className="contract-progress-label"><span>Progresso financeiro</span><strong>34,6%</strong></div><div className="contract-progress-track"><span style={{ width: '34.6%' }} /></div><p>R$ 11.766,00 ainda disponíveis no contrato</p></div><div className="measurement-meta"><span><small>Publicado por</small><strong>{project.manager}</strong></span><span><small>Atualizado em</small><strong>29/09 às 10:20</strong></span></div></div>
          <div className="measurement-privacy"><ShieldCheck size={18} /><span><strong>Informação privada</strong><small>Somente você e os responsáveis autorizados podem visualizar estes valores.</small></span></div>
          <div className="field-section-heading measurement-heading"><h2>Serviços medidos</h2><span>3 itens</span></div>
          <div className="measurement-items">
            <article><div><span>01</span><strong>Alvenaria de vedação</strong><small>Pavimento térreo · Setor A</small></div><div className="measurement-values"><span><small>Quantidade</small><strong>86 m²</strong></span><span><small>Valor unitário</small><strong>R$ 24,00</strong></span><span><small>Subtotal</small><strong>R$ 2.064,00</strong></span></div></article>
            <article><div><span>02</span><strong>Reboco interno</strong><small>Suítes 01 e 02</small></div><div className="measurement-values"><span><small>Quantidade</small><strong>40 m²</strong></span><span><small>Valor unitário</small><strong>R$ 22,00</strong></span><span><small>Subtotal</small><strong>R$ 880,00</strong></span></div></article>
            <article><div><span>03</span><strong>Regularização de contrapiso</strong><small>Área de serviço</small></div><div className="measurement-values"><span><small>Quantidade</small><strong>20 m²</strong></span><span><small>Valor unitário</small><strong>R$ 17,00</strong></span><span><small>Subtotal</small><strong>R$ 340,00</strong></span></div></article>
          </div>
          <div className="measurement-breakdown"><div><span>Valor bruto</span><strong>R$ 3.284,00</strong></div><div><span>Descontos</span><strong>R$ 0,00</strong></div><div className="measurement-breakdown-total"><span>Total da medição</span><strong>R$ 3.284,00</strong></div></div>
          <div className="field-section-heading measurement-heading"><h2>Histórico</h2><button>Ver todas</button></div><button className="measurement-history"><span className="request-icon"><FileText size={19} /></span><div><strong>16 a 31 de agosto</strong><small>Pago em 05/09 · 4 serviços</small></div><strong>R$ 2.950,00</strong><ChevronRight size={16} /></button>
          <button className="measurement-help" onClick={() => openChat('engineer')}><MessageCircle size={18} /><span><strong>Dúvida sobre esta medição?</strong><small>Converse diretamente com o engenheiro.</small></span><ChevronRight size={17} /></button>
        </section>}

        {view === 'profile' && <section className="field-screen"><div className="field-profile-card"><div className="avatar profile-avatar">JM</div><h1>João Martins</h1><p>Prestador de serviço</p><div><span><small>Função</small><strong>Pedreiro</strong></span><span><small>Tipo de acesso</small><strong>Prestador de serviço</strong></span><span><small>Obras disponíveis</small><strong>{assignedProjects.length} obras</strong></span></div><button onClick={onLogout}><LogOut size={18} />Sair da Vértia</button></div></section>}
        </div>}
      </main>
      <nav className="fm-nav"><button className={view === 'messages' ? 'active' : ''} onClick={() => goTo('messages')}><MessageCircle size={21} /><span>Conversa</span></button><button className={view === 'materials' ? 'active' : ''} onClick={() => goTo('materials')}><ClipboardCheck size={21} /><span>Material</span></button><button className={view === 'measurement' ? 'active' : ''} onClick={() => goTo('measurement')}><FileText size={21} /><span>Medição</span></button><button className={view === 'profile' ? 'active' : ''} onClick={() => goTo('profile')}><UserRound size={21} /><span>Perfil</span></button></nav>
    </div>
  )
}

function EngineerPortal({ assignedProjects, onLogout }: { assignedProjects: Project[]; onLogout: () => void }) {
  type EngineerSection = 'dashboard' | 'chat' | 'schedule' | 'measurements' | 'materials' | 'documents' | 'diary'
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [section, setSection] = useState<EngineerSection>('dashboard')
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: 'Carlos · Mestre de obras', text: 'A equipe de alvenaria iniciou o setor A.', time: '07:18', mine: false },
    { id: 2, author: 'Marcos · Eletricista', text: 'Os materiais elétricos chegaram e já foram conferidos.', time: '08:06', mine: false },
    { id: 3, author: 'Você', text: 'Perfeito. Enviem as fotos no fim da manhã.', time: '08:10', mine: true },
  ])
  const [diaryForm, setDiaryForm] = useState({ weather: 'Ensolarado', workers: '12', activities: '', occurrences: '' })
  const [diarySaved, setDiarySaved] = useState(false)
  const [measurementPublished, setMeasurementPublished] = useState(false)
  const [measurementForm, setMeasurementForm] = useState({ provider: 'João Martins', period: '01 a 15 de setembro', amount: '3284,00', notes: '' })
  const [materialRequests, setMaterialRequests] = useState([
    { id: 1, item: 'Argamassa AC-II', quantity: '12 sacos', requester: 'João Martins', status: 'Pendente' },
    { id: 2, item: 'Disco de corte 110 mm', quantity: '3 unidades', requester: 'Carlos Mendes', status: 'Aprovado' },
  ])
  const [diaryEntries, setDiaryEntries] = useState([
    { id: 1, date: '28 de setembro de 2026', weather: 'Ensolarado', workers: 12, summary: 'Execução de alvenaria no térreo e passagem das instalações elétricas.', author: 'Rafael Costa' },
    { id: 2, date: '27 de setembro de 2026', weather: 'Parcialmente nublado', workers: 10, summary: 'Conclusão da impermeabilização dos banheiros das suítes.', author: 'Rafael Costa' },
  ])
  const project = assignedProjects.find(item => item.id === selectedProjectId) ?? assignedProjects[0]
  const navItems: Array<{ id: EngineerSection; label: string; icon: typeof Home }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'Chat da equipe', icon: MessageCircle },
    { id: 'schedule', label: 'Cronograma', icon: CalendarDays },
    { id: 'measurements', label: 'Medições', icon: FileText },
    { id: 'materials', label: 'Materiais', icon: FolderOpen },
    { id: 'documents', label: 'Documentos', icon: FolderOpen },
    { id: 'diary', label: 'Diário de obra', icon: FileText },
  ]
  const scheduleItems = [
    { title: 'Alvenaria — pavimento térreo', period: '22 set — 04 out', progress: 76, status: 'Em andamento' },
    { title: 'Instalações elétricas', period: '29 set — 10 out', progress: 35, status: 'Em andamento' },
    { title: 'Revestimentos internos', period: '06 out — 24 out', progress: 0, status: 'Próxima etapa' },
    { title: 'Esquadrias e vidros', period: '20 out — 08 nov', progress: 0, status: 'Planejada' },
  ]
  const chooseProject = (id: number) => { setSelectedProjectId(id); setSection('dashboard'); setDiarySaved(false) }
  const sendTeamMessage = (event: FormEvent) => {
    event.preventDefault()
    if (!message.trim()) return
    setChatMessages(current => [...current, { id: Date.now(), author: 'Você', text: message.trim(), time: 'Agora', mine: true }])
    setMessage('')
  }
  const saveDiary = (event: FormEvent) => {
    event.preventDefault()
    if (!diaryForm.activities.trim()) return
    setDiaryEntries(current => [{ id: Date.now(), date: '29 de setembro de 2026', weather: diaryForm.weather, workers: Number(diaryForm.workers), summary: diaryForm.activities.trim(), author: project.manager }, ...current])
    setDiaryForm(current => ({ ...current, activities: '', occurrences: '' }))
    setDiarySaved(true)
  }
  const publishMeasurement = (event: FormEvent) => {
    event.preventDefault()
    if (!measurementForm.amount.trim()) return
    setMeasurementPublished(true)
  }
  const approveMaterial = (id: number) => setMaterialRequests(current => current.map(request => request.id === id ? { ...request, status: 'Aprovado' } : request))

  if (selectedProjectId === null) return (
    <div className="engineer-app engineer-picker-app"><header className="engineer-header"><Logo compact /><div className="engineer-user"><span>RC</span><div><strong>Rafael Costa</strong><small>Engenheiro</small></div><button className="icon-button" onClick={onLogout}><LogOut size={18} /></button></div></header><main className="engineer-picker-main"><section className="engineer-picker-heading"><span>PORTAL DO ENGENHEIRO</span><h1>Escolha uma obra para gerenciar</h1><p>Cada obra possui dashboard, equipe, cronograma e diário independentes.</p></section><div className="engineer-project-grid">{assignedProjects.map(item => <button key={item.id} onClick={() => chooseProject(item.id)}><span className={`engineer-project-mark ${item.tone}`}><HardHat size={23} /></span><div><span className="engineer-project-status"><i />{item.status}</span><strong>{item.name}</strong><small>{item.location} · Entrega {item.deadline}</small><div className="engineer-project-progress"><span><i style={{ width: `${item.progress}%` }} /></span><b>{item.progress}%</b></div><p>{item.pending} pendências para revisar</p></div><ChevronRight size={19} /></button>)}</div></main></div>
  )

  return (
    <div className="engineer-app">
      <header className="engineer-header"><Logo compact /><button className="engineer-project-switch" onClick={() => setSelectedProjectId(null)}><Building2 size={18} /><span><small>OBRA ATUAL · TROCAR</small><strong>{project.name}</strong></span><ChevronDown size={15} /></button><nav>{navItems.map(item => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}>{item.label}</button>)}</nav><div className="engineer-user"><span>RC</span><div><strong>Rafael Costa</strong><small>Engenheiro</small></div><button className="icon-button" onClick={onLogout}><LogOut size={18} /></button></div></header>
      <main className="engineer-main">
        {section === 'dashboard' && <>
          <section className="engineer-page-heading"><div><span>DASHBOARD DA OBRA</span><h1>{project.name}</h1><p>{project.location} · Atualizado hoje às 10:32</p></div><button className="primary-button" onClick={() => setSection('diary')}><Plus size={17} />Novo diário</button></section>
          <section className="engineer-hero"><div><span className="engineer-live"><i />{project.status}</span><h2>{project.progress}% da obra concluída</h2><p>O avanço está dentro do previsto para esta etapa.</p><div className="engineer-main-progress"><span style={{ width: `${project.progress}%` }} /></div></div><div className="engineer-hero-meta"><span><CalendarDays size={18} /><div><small>Previsão de entrega</small><strong>{project.deadline}</strong></div></span><span><Users size={18} /><div><small>Equipe hoje</small><strong>12 profissionais</strong></div></span></div></section>
          <section className="engineer-performance-grid"><button onClick={() => setSection('schedule')}><div className="performance-heading"><span className="performance-icon physical"><Building2 size={20} /></span><div><small>AVANÇO FÍSICO</small><strong>Obra concluída</strong></div><em>{project.progress}%</em></div><div className="performance-progress"><span style={{ width: `${project.progress}%` }} /></div><p><strong>{project.progress}% executado</strong><span>Meta atual: 70%</span></p></button><button onClick={() => setSection('materials')}><div className="performance-heading"><span className="performance-icon materials"><FolderOpen size={20} /></span><div><small>MATERIAIS</small><strong>Material utilizado</strong></div><em>62,4%</em></div><div className="performance-progress materials"><span style={{ width: '62.4%' }} /></div><p><strong>R$ 92.680 utilizados</strong><span>de R$ 148.500 previstos</span></p></button><button><div className="performance-heading"><span className="performance-icon budget"><ClipboardCheck size={20} /></span><div><small>ORÇAMENTO GERAL</small><strong>Orçamento utilizado</strong></div><em>57,8%</em></div><div className="performance-progress budget"><span style={{ width: '57.8%' }} /></div><p><strong>R$ 548.100 realizados</strong><span>de R$ 948.000 previstos</span></p></button></section>
          <section className="engineer-metrics"><button onClick={() => setSection('schedule')}><span className="metric-icon blue"><CalendarDays size={20} /></span><div><small>ETAPAS ATIVAS</small><strong>2</strong><p>1 próxima etapa</p></div><ChevronRight size={17} /></button><button onClick={() => setSection('chat')}><span className="metric-icon violet"><MessageCircle size={20} /></span><div><small>MENSAGENS</small><strong>5</strong><p>3 não lidas</p></div><ChevronRight size={17} /></button><button onClick={() => setSection('diary')}><span className="metric-icon cyan"><FileText size={20} /></span><div><small>DIÁRIO DE HOJE</small><strong>Pendente</strong><p>Último registro ontem</p></div><ChevronRight size={17} /></button><button><span className="metric-icon orange"><ClipboardCheck size={20} /></span><div><small>PENDÊNCIAS</small><strong>{project.pending}</strong><p>Precisam de revisão</p></div><ChevronRight size={17} /></button></section>
          <section className="engineer-dashboard-grid"><div><div className="engineer-section-heading"><div><h2>Andamento do cronograma</h2><p>Etapas atuais e próximas atividades.</p></div><button onClick={() => setSection('schedule')}>Ver cronograma</button></div><div className="engineer-schedule-preview">{scheduleItems.slice(0, 3).map(item => <div key={item.title}><span className={`schedule-state ${item.progress ? 'active' : ''}`}><i /></span><div><strong>{item.title}</strong><small>{item.period}</small><span className="schedule-mini-progress"><i style={{ width: `${item.progress}%` }} /></span></div><em>{item.progress ? `${item.progress}%` : item.status}</em></div>)}</div></div><aside><div className="engineer-section-heading"><div><h2>Equipe em campo</h2><p>12 profissionais presentes.</p></div></div><div className="engineer-team-list">{[['CM', 'Carlos Mendes', 'Mestre de obras'], ['JM', 'João Martins', 'Pedreiro'], ['MS', 'Marcos Silva', 'Eletricista']].map(person => <div key={person[1]}><span className="avatar">{person[0]}</span><div><strong>{person[1]}</strong><small>{person[2]}</small></div><i /></div>)}</div><button className="engineer-team-chat" onClick={() => setSection('chat')}><MessageCircle size={17} />Abrir chat da equipe</button></aside></section>
        </>}

        {section === 'chat' && <section className="engineer-section-page"><div className="engineer-page-heading"><div><span>COMUNICAÇÃO</span><h1>Chat da equipe</h1><p>Grupo geral dos profissionais vinculados a {project.name}.</p></div></div><div className="engineer-chat-card"><div className="engineer-chat-header"><span className="group-avatar"><Users size={19} /></span><div><strong>{project.name}</strong><small>12 participantes · 8 online</small></div><button><Users size={17} />Ver equipe</button></div><div className="engineer-chat-messages"><span className="chat-date">HOJE</span>{chatMessages.map(item => <div key={item.id} className={`engineer-chat-message ${item.mine ? 'mine' : ''}`}>{!item.mine && <strong>{item.author}</strong>}<p>{item.text}</p><small>{item.time}</small></div>)}</div><form onSubmit={sendTeamMessage}><button type="button"><Plus size={19} /></button><input value={message} onChange={event => setMessage(event.target.value)} placeholder="Mensagem para a equipe" /><button type="submit" className="engineer-send"><ChevronRight size={19} /></button></form></div></section>}

        {section === 'schedule' && <section className="engineer-section-page"><div className="engineer-page-heading"><div><span>PLANEJAMENTO</span><h1>Cronograma da obra</h1><p>Acompanhe as etapas, prazos e percentuais executados.</p></div><button className="primary-button"><Plus size={17} />Nova etapa</button></div><div className="schedule-overview"><div><small>PROGRESSO GERAL</small><strong>{project.progress}%</strong><span><i style={{ width: `${project.progress}%` }} /></span></div><div><small>ENTREGA PREVISTA</small><strong>{project.deadline}</strong><p>Cronograma dentro do prazo</p></div><div><small>ETAPAS</small><strong>2 de 8</strong><p>2 em andamento</p></div></div><div className="schedule-list"><div className="schedule-list-header"><span>ETAPA</span><span>PERÍODO</span><span>PROGRESSO</span><span>STATUS</span></div>{scheduleItems.map((item, index) => <article key={item.title}><div><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong></div><p>{item.period}</p><div className="schedule-progress-cell"><span><i style={{ width: `${item.progress}%` }} /></span><strong>{item.progress}%</strong></div><em className={item.progress ? 'active' : ''}>{item.status}</em></article>)}</div></section>}

        {section === 'measurements' && <section className="engineer-section-page engineer-wide-page"><div className="engineer-page-heading"><div><span>CONTROLE DE PRESTADORES</span><h1>Medições</h1><p>Registre os serviços executados e publique os valores para cada prestador.</p></div></div><div className="engineer-financial-summary"><div><small>CONTRATADO</small><strong>R$ 68.500,00</strong><p>4 prestadores ativos</p></div><div><small>MEDIDO ACUMULADO</small><strong>R$ 24.780,00</strong><p>36,2% dos contratos</p></div><div><small>A PAGAR</small><strong>R$ 8.430,00</strong><p>3 medições aprovadas</p></div></div><div className="measurements-layout"><div><div className="engineer-section-heading"><div><h2>Prestadores e contratos</h2><p>Posição financeira por profissional.</p></div></div><div className="provider-measurements">{[{ initials: 'JM', name: 'João Martins', role: 'Pedreiro', contract: 'R$ 18.000,00', measured: 'R$ 6.234,00', progress: 34.6, status: 'Atualizada' }, { initials: 'MS', name: 'Marcos Silva', role: 'Eletricista', contract: 'R$ 14.500,00', measured: 'R$ 5.800,00', progress: 40, status: 'Pendente' }, { initials: 'AL', name: 'André Lima', role: 'Encanador', contract: 'R$ 12.000,00', measured: 'R$ 4.920,00', progress: 41, status: 'Atualizada' }, { initials: 'CP', name: 'Carlos Pereira', role: 'Gesseiro', contract: 'R$ 24.000,00', measured: 'R$ 7.826,00', progress: 32.6, status: 'Atualizada' }].map(provider => <article key={provider.name}><div className="provider-identity"><span className="avatar">{provider.initials}</span><div><strong>{provider.name}</strong><small>{provider.role}</small></div></div><div className="provider-values"><span><small>Contrato</small><strong>{provider.contract}</strong></span><span><small>Medido</small><strong>{provider.measured}</strong></span></div><div className="provider-progress"><span><i style={{ width: `${provider.progress}%` }} /></span><strong>{provider.progress}%</strong></div><em className={provider.status === 'Pendente' ? 'pending' : ''}>{provider.status}</em></article>)}</div></div><form className="measurement-publish-form" onSubmit={publishMeasurement}><div className="diary-form-heading"><span><FileText size={20} /></span><div><strong>Nova medição</strong><small>Publicar para o prestador</small></div></div><label>Prestador<select value={measurementForm.provider} onChange={event => { setMeasurementForm(current => ({ ...current, provider: event.target.value })); setMeasurementPublished(false) }}><option>João Martins</option><option>Marcos Silva</option><option>André Lima</option><option>Carlos Pereira</option></select></label><label>Período<input value={measurementForm.period} onChange={event => setMeasurementForm(current => ({ ...current, period: event.target.value }))} /></label><label>Valor medido (R$)<input value={measurementForm.amount} onChange={event => { setMeasurementForm(current => ({ ...current, amount: event.target.value })); setMeasurementPublished(false) }} /></label><label>Observações<textarea value={measurementForm.notes} onChange={event => setMeasurementForm(current => ({ ...current, notes: event.target.value }))} placeholder="Descreva os serviços incluídos nesta medição." /></label><button type="button" className="measurement-add-services"><Plus size={17} />Adicionar serviços e quantidades</button>{measurementPublished && <div className="request-success"><CheckCircle2 size={18} />Medição publicada para {measurementForm.provider}.</div>}<button className="primary-button measurement-publish-button" type="submit"><Check size={17} />Publicar medição</button></form></div></section>}

        {section === 'materials' && <section className="engineer-section-page engineer-wide-page"><div className="engineer-page-heading"><div><span>CONTROLE DE CUSTOS</span><h1>Materiais</h1><p>Compare o orçamento previsto com o consumo realizado na obra.</p></div><button className="primary-button"><Plus size={17} />Novo lançamento</button></div><div className="material-budget-hero"><div><small>ORÇAMENTO PREVISTO</small><strong>R$ 148.500,00</strong><p>Materiais previstos para toda a obra</p></div><div><span><small>UTILIZADO</small><strong>R$ 92.680,00</strong></span><span><small>SALDO DISPONÍVEL</small><strong>R$ 55.820,00</strong></span><div className="material-budget-progress-label"><span>Consumo do orçamento</span><strong>62,4%</strong></div><div className="material-budget-progress"><span style={{ width: '62.4%' }} /></div></div></div><div className="engineer-section-heading material-control-heading"><div><h2>Previsto x utilizado por categoria</h2><p>Valores acumulados até a medição atual.</p></div></div><div className="material-category-table"><div className="material-table-head"><span>CATEGORIA</span><span>PREVISTO</span><span>UTILIZADO</span><span>SALDO</span><span>CONSUMO</span></div>{[{ name: 'Estrutura e fundação', forecast: 'R$ 38.000', used: 'R$ 31.400', balance: 'R$ 6.600', progress: 82.6 }, { name: 'Alvenaria', forecast: 'R$ 24.500', used: 'R$ 18.250', balance: 'R$ 6.250', progress: 74.5 }, { name: 'Instalações elétricas', forecast: 'R$ 21.000', used: 'R$ 10.600', balance: 'R$ 10.400', progress: 50.5 }, { name: 'Instalações hidráulicas', forecast: 'R$ 19.000', used: 'R$ 12.430', balance: 'R$ 6.570', progress: 65.4 }, { name: 'Revestimentos e acabamentos', forecast: 'R$ 46.000', used: 'R$ 20.000', balance: 'R$ 26.000', progress: 43.5 }].map(category => <article key={category.name}><strong>{category.name}</strong><span>{category.forecast}</span><span>{category.used}</span><span>{category.balance}</span><div><span><i style={{ width: `${category.progress}%` }} /></span><strong>{category.progress}%</strong></div></article>)}</div><div className="engineer-section-heading material-control-heading"><div><h2>Solicitações da equipe</h2><p>Pedidos enviados pelos profissionais em campo.</p></div></div><div className="engineer-material-requests">{materialRequests.map(request => <article key={request.id}><span className="request-icon"><ClipboardCheck size={19} /></span><div><strong>{request.item}</strong><small>{request.quantity} · Solicitado por {request.requester}</small></div><em className={request.status === 'Aprovado' ? 'approved' : ''}>{request.status}</em>{request.status === 'Pendente' ? <button onClick={() => approveMaterial(request.id)}>Aprovar</button> : <CheckCircle2 size={18} />}</article>)}</div></section>}

        {section === 'documents' && <section className="engineer-section-page engineer-wide-page"><div className="engineer-page-heading"><div><span>ARQUIVOS DA OBRA</span><h1>Documentos</h1><p>Centralize projetos, contratos, relatórios e documentos técnicos.</p></div><button className="primary-button"><Upload size={17} />Enviar arquivo</button></div><div className="engineer-document-categories"><button><span className="document-category-icon projects"><FolderOpen size={21} /></span><div><strong>Projetos</strong><small>12 arquivos</small></div><ChevronRight size={17} /></button><button><span className="document-category-icon contracts"><FileText size={21} /></span><div><strong>Contratos</strong><small>5 arquivos</small></div><ChevronRight size={17} /></button><button><span className="document-category-icon reports"><ClipboardCheck size={21} /></span><div><strong>Relatórios</strong><small>8 arquivos</small></div><ChevronRight size={17} /></button><button><span className="document-category-icon technical"><HardHat size={21} /></span><div><strong>Documentos técnicos</strong><small>7 arquivos</small></div><ChevronRight size={17} /></button></div><div className="engineer-documents-toolbar"><div><h2>Arquivos recentes</h2><p>Últimos documentos adicionados ou atualizados.</p></div><label><Search size={16} /><input placeholder="Buscar documento" /></label></div><div className="engineer-document-table"><div className="engineer-document-head"><span>DOCUMENTO</span><span>CATEGORIA</span><span>ATUALIZAÇÃO</span><span>RESPONSÁVEL</span><span /></div>{[{ name: 'Projeto arquitetônico executivo — V05', type: 'PDF · 8,4 MB', category: 'Projetos', update: 'Hoje, 09:42', owner: 'Rafael Costa' }, { name: 'Contrato de execução da obra', type: 'PDF · 2,1 MB', category: 'Contratos', update: '28 set, 16:10', owner: 'Ana Prado' }, { name: 'Projeto estrutural — fundações', type: 'DWG · 12,7 MB', category: 'Projetos', update: '27 set, 11:25', owner: 'Camila Nunes' }, { name: 'Relatório fotográfico — setembro', type: 'PDF · 18,3 MB', category: 'Relatórios', update: '26 set, 18:02', owner: 'Rafael Costa' }, { name: 'ART de execução', type: 'PDF · 950 KB', category: 'Documentos técnicos', update: '22 set, 10:30', owner: 'Rafael Costa' }].map(document => <article key={document.name}><div><span className="document-file-icon"><FileText size={19} /></span><span><strong>{document.name}</strong><small>{document.type}</small></span></div><em>{document.category}</em><p>{document.update}</p><p>{document.owner}</p><button className="icon-button"><MoreHorizontal size={18} /></button></article>)}</div></section>}

        {section === 'diary' && <section className="engineer-section-page"><div className="engineer-page-heading"><div><span>REGISTRO TÉCNICO</span><h1>Diário de obra</h1><p>Registre equipe, clima, serviços executados e ocorrências do dia.</p></div></div><div className="engineer-diary-grid"><form className="diary-form" onSubmit={saveDiary}><div className="diary-form-heading"><span><FileText size={20} /></span><div><strong>Novo registro</strong><small>29 de setembro de 2026</small></div></div><div className="diary-form-row"><label>Condição do tempo<select value={diaryForm.weather} onChange={event => setDiaryForm(current => ({ ...current, weather: event.target.value }))}><option>Ensolarado</option><option>Parcialmente nublado</option><option>Chuvoso</option></select></label><label>Profissionais em campo<input type="number" min="0" value={diaryForm.workers} onChange={event => setDiaryForm(current => ({ ...current, workers: event.target.value }))} /></label></div><label>Serviços executados<textarea required value={diaryForm.activities} onChange={event => { setDiaryForm(current => ({ ...current, activities: event.target.value })); setDiarySaved(false) }} placeholder="Descreva as atividades realizadas, locais e avanço do dia." /></label><label>Ocorrências e observações<textarea value={diaryForm.occurrences} onChange={event => setDiaryForm(current => ({ ...current, occurrences: event.target.value }))} placeholder="Registre impedimentos, visitas, acidentes ou decisões." /></label><button type="button" className="diary-upload"><Camera size={19} /><span><strong>Adicionar fotos</strong><small>Registre o avanço visual da obra</small></span></button>{diarySaved && <div className="request-success"><CheckCircle2 size={18} />Diário salvo e publicado no histórico.</div>}<button className="primary-button diary-submit" type="submit"><Check size={17} />Salvar diário de obra</button></form><aside className="diary-history"><div className="engineer-section-heading"><div><h2>Registros recentes</h2><p>Histórico da obra selecionada.</p></div></div>{diaryEntries.map(entry => <article key={entry.id}><div className="diary-entry-date"><CalendarDays size={17} /><span><strong>{entry.date}</strong><small>Por {entry.author}</small></span></div><p>{entry.summary}</p><div><span>{entry.weather}</span><span>{entry.workers} profissionais</span></div></article>)}</aside></div></section>}
      </main>
      <nav className="engineer-mobile-nav">{navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}><Icon size={18} />{item.id === 'dashboard' ? 'Início' : item.id === 'schedule' ? 'Cronograma' : item.id === 'measurements' ? 'Medições' : item.id === 'materials' ? 'Materiais' : item.id === 'documents' ? 'Documentos' : item.id === 'diary' ? 'Diário' : 'Chat'}</button> })}</nav>
    </div>
  )
}

function ClientPortal({ project: fixedProject, assignedProjects, updates, onCompany, onLogout }: { project?: Project; assignedProjects?: Project[]; updates: Update[]; onCompany?: () => void; onLogout: () => void }) {
  type ClientSection = 'Resumo' | 'Atualizações' | 'Fotos' | 'Documentos' | 'Aprovações' | 'Chat'
  const availableProjects = assignedProjects ?? (fixedProject ? [fixedProject] : [])
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(fixedProject?.id ?? (availableProjects.length === 1 ? availableProjects[0].id : null))
  const [section, setSection] = useState<ClientSection>('Resumo')
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'adjustment'>('pending')
  const [clientMessage, setClientMessage] = useState('')
  const [clientMessages, setClientMessages] = useState([
    { id: 1, text: 'Olá, Mariana. A instalação dos revestimentos foi iniciada hoje.', mine: false, time: '14:10' },
    { id: 2, text: 'Ótimo! Obrigada pela atualização.', mine: true, time: '14:18' },
  ])
  const project = availableProjects.find(item => item.id === selectedProjectId) ?? availableProjects[0]
  const clientUpdates = updates.filter(update => update.visible)
  const managerInitials = project?.manager.split(' ').slice(0, 2).map(name => name[0]).join('') ?? 'EN'
  const navigate = (next: ClientSection) => setSection(next)
  const sendClientMessage = (event: FormEvent) => {
    event.preventDefault()
    if (!clientMessage.trim()) return
    setClientMessages(current => [...current, { id: Date.now(), text: clientMessage.trim(), mine: true, time: 'Agora' }])
    setClientMessage('')
  }

  if (!project) return null
  if (selectedProjectId === null) return (
    <div className="client-app client-project-picker-app">
      <header className="client-header"><Logo compact /><div className="client-actions"><button className="client-user"><span>MA</span><div><strong>Mariana Alves</strong><small>Cliente</small></div></button><button className="icon-button" onClick={onLogout} title="Sair"><LogOut size={18} /></button></div></header>
      <main className="client-main client-project-picker-main"><section className="client-picker-heading"><span className="eyebrow">PORTAL DO CLIENTE</span><h1>Qual obra deseja acompanhar?</h1><p>Escolha uma obra para consultar o andamento, registros, documentos e decisões.</p></section><div className="client-project-options">{availableProjects.map(item => <button key={item.id} onClick={() => { setSelectedProjectId(item.id); setSection('Resumo') }}><span className={`assigned-project-icon ${item.tone}`}><Building2 size={22} /></span><div><strong>{item.name}</strong><small>{item.location}</small><span className="client-project-progress"><i><b style={{ width: `${item.progress}%` }} /></i><em>{item.progress}% concluída</em></span></div><ChevronRight size={19} /></button>)}</div></main>
    </div>
  )

  return (
    <div className="client-app">
      <header className="client-header">
        <Logo compact />
        <nav>{(['Resumo', 'Atualizações', 'Fotos', 'Documentos', 'Aprovações', 'Chat'] as ClientSection[]).map(item => <button key={item} className={section === item ? 'active' : ''} onClick={() => navigate(item)}>{item}</button>)}</nav>
        <div className="client-actions"><button className="icon-button"><Bell size={19} /></button><button className="client-user" onClick={() => assignedProjects && assignedProjects.length > 1 && setSelectedProjectId(null)}><span>MA</span><div><strong>Mariana Alves</strong><small>{assignedProjects && assignedProjects.length > 1 ? 'Trocar obra' : 'Cliente'}</small></div>{assignedProjects && assignedProjects.length > 1 && <ChevronDown size={15} />}</button><button className="icon-button" onClick={onLogout} title="Sair"><LogOut size={18} /></button></div>
      </header>
      <main className="client-main">
        {onCompany && <div className="client-preview-bar"><span><ShieldCheck size={16} />Você está visualizando o portal como cliente</span><button onClick={onCompany}>Voltar à área da empresa</button></div>}
        <section className="client-welcome"><div><span className="eyebrow">SUA OBRA</span><h1>{project.name}</h1><p>Acompanhe o progresso, as decisões e os registros compartilhados pela equipe.</p></div></section>

        {section === 'Resumo' && <>
          <section className="client-progress-card"><div><span className="client-status"><span />{project.status}</span><h2>{project.progress}% concluída</h2><p>O cronograma segue dentro do planejado.</p></div><div className="progress-visual"><div className="progress-ring" style={{ '--progress': `${project.progress * 3.6}deg` } as CSSProperties}><span>{project.progress}%</span></div><div><small>Previsão de entrega</small><strong>{project.deadline}</strong><span><CalendarDays size={15} />Atualizado hoje</span></div></div></section>
          <section className="client-payment-card"><div className="performance-heading"><span className="performance-icon budget"><ClipboardCheck size={20} /></span><div><small>PAGAMENTOS</small><strong>Valor pago</strong></div><em>57,8%</em></div><div className="performance-progress budget"><span style={{ width: '57.8%' }} /></div><p><strong>R$ 548.100 pagos</strong><span>de R$ 948.000 contratados</span></p></section>
          <section className="client-quick-grid"><button onClick={() => navigate('Fotos')}><span><Camera size={20} /></span><div><strong>Fotos da obra</strong><small>24 imagens disponíveis</small></div><ChevronRight size={17} /></button><button onClick={() => navigate('Documentos')}><span><FolderOpen size={20} /></span><div><strong>Documentos</strong><small>8 arquivos compartilhados</small></div><ChevronRight size={17} /></button><button onClick={() => navigate('Aprovações')}><span><ClipboardCheck size={20} /></span><div><strong>Aprovações</strong><small>{approvalStatus === 'pending' ? '1 item aguardando você' : 'Nenhuma pendência'}</small></div>{approvalStatus === 'pending' && <em>1</em>}<ChevronRight size={17} /></button></section>
          <section className="client-grid"><div className="client-content-column"><div className="client-section-heading"><div><h2>Últimas atualizações</h2><p>O que aconteceu recentemente na sua obra.</p></div><button onClick={() => navigate('Atualizações')}>Ver todas</button></div><div className="client-updates">{clientUpdates.map(item => <ActivityItem key={item.id} item={item} />)}</div></div><aside className="client-side"><div className="client-info-card"><h3>Engenheiro responsável</h3><div className="engineer"><div className="avatar large">{managerInitials}</div><div><strong>{project.manager}</strong><small>Responsável pela sua obra</small></div></div><button onClick={() => navigate('Chat')}><MessageCircle size={16} />Enviar mensagem</button></div><div className={`approval-card client-approval-${approvalStatus}`}><span className="approval-icon"><ClipboardCheck size={20} /></span><div><small>{approvalStatus === 'pending' ? 'APROVAÇÃO PENDENTE' : approvalStatus === 'approved' ? 'APROVADO POR VOCÊ' : 'AJUSTE SOLICITADO'}</small><strong>Projeto luminotécnico</strong><p>{approvalStatus === 'pending' ? 'Revise a nova versão e registre sua decisão.' : 'Sua decisão foi registrada e enviada à equipe.'}</p><button onClick={() => navigate('Aprovações')}>Ver detalhes <ChevronRight size={15} /></button></div></div></aside></section>
        </>}

        {section === 'Atualizações' && <section className="client-library"><div className="client-section-heading"><div><h2>Atualizações da obra</h2><p>Registros publicados pela equipe para você acompanhar.</p></div></div><div className="client-updates">{clientUpdates.map(item => <ActivityItem key={item.id} item={item} />)}</div></section>}

        {section === 'Fotos' && <section className="client-library"><div className="client-section-heading"><div><h2>Fotos da obra</h2><p>Acompanhe visualmente a evolução dos serviços.</p></div><button>Baixar álbum</button></div><div className="client-photo-grid">{['Fachada principal', 'Revestimento da suíte', 'Instalações hidráulicas', 'Área gourmet', 'Forro de gesso', 'Esquadrias'].map((label, index) => <button key={label} className={`client-photo photo-${index + 1}`}><span><Camera size={24} /></span><div><strong>{label}</strong><small>{index < 2 ? 'Hoje' : '28 de setembro'}</small></div></button>)}</div></section>}

        {section === 'Documentos' && <section className="client-library"><div className="client-section-heading"><div><h2>Documentos compartilhados</h2><p>Projetos, contratos e notas fiscais liberados pela equipe.</p></div></div><div className="client-document-list">{[{ name: 'Projeto arquitetônico executivo', meta: 'PDF · 8,4 MB · Atualizado em 26/09' }, { name: 'Cronograma da obra', meta: 'PDF · 1,2 MB · Atualizado em 22/09' }, { name: 'Memorial descritivo', meta: 'PDF · 3,8 MB · Atualizado em 15/09' }, { name: 'Contrato e aditivos', meta: 'PDF · 2,1 MB · Atualizado em 02/09' }].map(document => <button key={document.name}><span><FileText size={20} /></span><div><strong>{document.name}</strong><small>{document.meta}</small></div><ChevronRight size={17} /></button>)}</div><div className="client-section-heading client-invoice-heading"><div><h2>Notas fiscais</h2><p>Notas de materiais e serviços vinculadas à sua obra.</p></div></div><div className="client-document-list client-invoice-list">{[{ name: 'NF 008742 · Concreto Usinado Brasil', meta: 'R$ 18.450 · Emitida em 29/09' }, { name: 'NF 006318 · Revestimentos Aliança', meta: 'R$ 12.480 · Emitida em 24/09' }, { name: 'NF 002096 · Hidráulica Paulista', meta: 'R$ 6.230 · Emitida em 18/09' }].map(note => <button key={note.name}><span><FileText size={20} /></span><div><strong>{note.name}</strong><small>{note.meta}</small></div><ChevronRight size={17} /></button>)}</div></section>}

        {section === 'Aprovações' && <section className="client-library"><div className="client-section-heading"><div><h2>Aprovações</h2><p>Analise itens que precisam da sua decisão.</p></div></div><div className="client-decision-card"><div className="client-decision-top"><span className="approval-icon"><ClipboardCheck size={21} /></span><div><span className="eyebrow">AGUARDANDO SUA DECISÃO</span><h3>Projeto luminotécnico — versão 03</h3><p>A equipe revisou os pontos de iluminação da sala e da área gourmet.</p></div></div><div className="client-decision-file"><FileText size={20} /><span><strong>Projeto_luminotecnico_V03.pdf</strong><small>PDF · 4,7 MB</small></span><button>Visualizar</button></div>{approvalStatus === 'pending' ? <div className="client-decision-actions"><button onClick={() => setApprovalStatus('adjustment')}>Solicitar ajuste</button><button className="approve" onClick={() => setApprovalStatus('approved')}><Check size={17} />Aprovar projeto</button></div> : <div className={`client-decision-result ${approvalStatus}`}><CheckCircle2 size={19} /><span><strong>{approvalStatus === 'approved' ? 'Projeto aprovado' : 'Solicitação de ajuste enviada'}</strong><small>A equipe foi notificada da sua decisão.</small></span></div>}</div></section>}

        {section === 'Chat' && <section className="client-library client-chat-section"><div className="client-section-heading"><div><h2>Chat com o engenheiro</h2><p>Converse diretamente com o responsável pela sua obra.</p></div></div><div className="client-message-card"><div className="client-message-header"><span className="avatar">{managerInitials}</span><div><strong>{project.manager}</strong><small>Engenheiro responsável · online</small></div></div><div className="client-message-list"><span className="chat-date">HOJE</span>{clientMessages.map(item => <div key={item.id} className={item.mine ? 'mine' : ''}><p>{item.text}</p><small>{item.time}</small></div>)}</div><form onSubmit={sendClientMessage}><button type="button" className="client-chat-attach" aria-label="Anexar arquivo"><Plus size={18} /></button><input value={clientMessage} onChange={event => setClientMessage(event.target.value)} placeholder="Escreva uma mensagem" /><button type="submit"><ChevronRight size={18} /></button></form></div><div className="client-chat-note"><ShieldCheck size={17} /><span><strong>Conversa vinculada à obra</strong><small>As mensagens ficam registradas no histórico de {project.name}.</small></span></div></section>}
      </main>
      <nav className="client-mobile-nav"><button className={section === 'Resumo' ? 'active' : ''} onClick={() => navigate('Resumo')}><Home size={19} />Início</button><button className={section === 'Atualizações' ? 'active' : ''} onClick={() => navigate('Atualizações')}><Sparkles size={19} />Atualizações</button><button className={section === 'Fotos' ? 'active' : ''} onClick={() => navigate('Fotos')}><Camera size={19} />Fotos</button><button className={section === 'Documentos' ? 'active' : ''} onClick={() => navigate('Documentos')}><FolderOpen size={19} />Documentos</button><button className={section === 'Aprovações' ? 'active' : ''} onClick={() => navigate('Aprovações')}><ClipboardCheck size={19} />Aprovações</button><button className={section === 'Chat' ? 'active' : ''} onClick={() => navigate('Chat')}><MessageCircle size={19} />Chat</button></nav>
    </div>
  )
}

function NewUpdateModal({ onClose, onSave }: { onClose: () => void; onSave: (update: Update) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visible, setVisible] = useState(true)
  const save = () => {
    if (!title.trim()) return
    onSave({ id: Date.now(), title, description: description || 'Nova atualização registrada na obra.', author: 'Felipe Sales', time: 'Agora', visible, type: 'diario' })
  }
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={event => event.stopPropagation()}>
        <div className="modal-header"><div><span className="eyebrow">REGISTRAR</span><h2>Nova atualização</h2><p>Adicione contexto à linha do tempo da obra.</p></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div>
        <label>Título<input value={title} onChange={event => setTitle(event.target.value)} placeholder="Ex.: Instalação elétrica concluída" autoFocus /></label>
        <label>Descrição<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="O que aconteceu na obra?" rows={4} /></label>
        <button className="upload-area"><Upload size={20} /><span><strong>Adicionar fotos ou documentos</strong><small>PNG, JPG ou PDF até 20 MB</small></span></button>
        <div className="visibility-choice"><div><strong>Visibilidade</strong><p>Defina quem poderá consultar este registro.</p></div><div className="choice-buttons"><button className={!visible ? 'active' : ''} onClick={() => setVisible(false)}><ShieldCheck size={16} />Somente equipe</button><button className={visible ? 'active' : ''} onClick={() => setVisible(true)}><UserRound size={16} />Visível ao cliente</button></div></div>
        <div className="modal-footer"><button className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" onClick={save} disabled={!title.trim()}><Check size={18} />Salvar atualização</button></div>
      </div>
    </div>
  )
}

export default function App() {
  const [role, setRole] = useState<Role | null>(null)
  const [view, setView] = useState<ViewMode>('company')
  const [page, setPage] = useState<Page>('dashboard')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<Update[]>(initialUpdates)
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [modal, setModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const currentProject = useMemo(() => selectedProject ?? projects[0], [selectedProject])

  const openProject = (project: Project) => { setSelectedProject(project); setView('company') }
  const saveUpdate = (update: Update) => { setUpdates(current => [update, ...current]); setModal(false) }
  const logout = () => { setRole(null); setView('company'); setPage('dashboard'); setSelectedProject(null); setModal(false) }

  if (!role) return <LoginScreen onLogin={(nextRole) => { setRole(nextRole); setView(nextRole === 'client' ? 'client' : 'company') }} />
  if (role === 'field') return <FieldPortal assignedProjects={projects.slice(0, 3)} onLogout={logout} />
  if (role === 'engineer') return <EngineerPortal assignedProjects={projects.slice(0, 3)} onLogout={logout} />
  if (role === 'client') return <ClientPortal assignedProjects={projects.slice(0, 2)} updates={updates} onLogout={logout} />
  if (view === 'client') return <ClientPortal project={currentProject} updates={updates} onCompany={() => setView('company')} onLogout={logout} />

  return (
    <div className={`app-shell ${menuOpen ? 'menu-open' : ''}`}>
      <Sidebar page={page} setPage={(next) => { setPage(next); setSelectedProject(null) }} view={view} setView={setView} open={menuOpen} onClose={() => setMenuOpen(false)} role={role} onLogout={logout} crmCount={leads.filter(isOpenLead).length} />
      {menuOpen && <button className="sidebar-overlay" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />}
      <div className="main-shell">
        {selectedProject ? <ProjectDetail project={selectedProject} updates={updates} onBack={() => setSelectedProject(null)} onClient={() => setView('client')} onNewUpdate={() => setModal(true)} /> :
          page === 'dashboard' ? <Dashboard updates={updates} onOpenProject={openProject} onNewUpdate={() => setModal(true)} onMenu={() => setMenuOpen(true)} onNavigate={setPage} /> :
            page === 'projects' ? <ProjectsPage onOpenProject={openProject} onMenu={() => setMenuOpen(true)} /> :
              (['finance', 'cashflow', 'crm', 'inventory', 'invoices', 'administration', 'people'] as Page[]).includes(page) ? <AdminModulePage page={page} onMenu={() => setMenuOpen(true)} onNavigate={setPage} leads={leads} setLeads={setLeads} /> : <GenericPage page={page} updates={updates} onMenu={() => setMenuOpen(true)} />}
      </div>
      {modal && <NewUpdateModal onClose={() => setModal(false)} onSave={saveUpdate} />}
    </div>
  )
}
