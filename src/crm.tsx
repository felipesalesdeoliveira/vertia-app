import { useEffect, useState, type CSSProperties, type Dispatch, type DragEvent, type FormEvent, type SetStateAction } from 'react'
import { Plus, Search, X } from './icons'
import { formatCompactMoney, formatMoney, initialsOf } from './format'

export type StageId = 'incoming' | 'contact' | 'visit' | 'proposal' | 'negotiation' | 'won' | 'lost'
type Task = { label: string; when: string; state: 'late' | 'today' | 'next' }
type Note = { id: number; author: string; text: string; time: string }
export type Lead = { id: number; name: string; contact: string; phone: string; value: number; stage: StageId; tags: string[]; owner: string; source: string; task: Task | null; notes: Note[] }

const STAGES: { id: StageId; label: string; color: string }[] = [
  { id: 'incoming', label: 'Leads de entrada', color: '#8f9bb3' },
  { id: 'contact', label: 'Contato inicial', color: '#164cff' },
  { id: 'visit', label: 'Visita técnica', color: '#0f9fb8' },
  { id: 'proposal', label: 'Proposta enviada', color: '#743cff' },
  { id: 'negotiation', label: 'Negociação', color: '#e49b24' },
  { id: 'won', label: 'Fechado · ganho', color: '#16a36a' },
  { id: 'lost', label: 'Fechado · perdido', color: '#e24d5c' },
]
const OPEN_STAGES = STAGES.filter(stage => stage.id !== 'won' && stage.id !== 'lost')
const stageLabel = (id: StageId) => STAGES.find(stage => stage.id === id)?.label ?? ''

export const isOpenLead = (lead: Lead) => lead.stage !== 'won' && lead.stage !== 'lost'

const created = (time: string): Note[] => [{ id: 1, author: 'Sistema', text: 'Lead criado', time }]

export const initialLeads: Lead[] = [
  { id: 101, name: 'Residência Jardins', contact: 'Paulo Mendes', phone: '(11) 98812-4410', value: 180000, stage: 'incoming', tags: ['Residencial'], owner: 'Felipe Sales', source: 'Site', task: null, notes: created('Hoje, 09:12') },
  { id: 102, name: 'Reforma Vila Nova', contact: 'Fernanda Lima', phone: '(11) 97745-1820', value: 130000, stage: 'incoming', tags: ['Reforma'], owner: 'Felipe Sales', source: 'Indicação', task: { label: 'Ligar para qualificar', when: 'Hoje', state: 'today' }, notes: created('Ontem, 16:40') },
  { id: 103, name: 'Cobertura Itaim', contact: 'Juliana Prates', phone: '(11) 99120-3377', value: 95000, stage: 'contact', tags: ['Reforma', 'Alto padrão'], owner: 'Camila Nunes', source: 'Instagram', task: { label: 'Agendar visita', when: 'Amanhã', state: 'next' }, notes: created('28 set, 11:05') },
  { id: 104, name: 'Consultório Moema', contact: 'André Luz', phone: '(11) 98230-6614', value: 160000, stage: 'visit', tags: ['Comercial'], owner: 'Rafael Costa', source: 'Indicação', task: { label: 'Visita técnica às 15h', when: 'Hoje', state: 'today' }, notes: created('26 set, 10:30') },
  { id: 105, name: 'Retrofit Fachada Paulista', contact: 'Condomínio Paulista Prime', phone: '(11) 3284-9050', value: 210000, stage: 'visit', tags: ['Condomínio', 'Retrofit'], owner: 'Camila Nunes', source: 'Site', task: null, notes: created('25 set, 14:18') },
  { id: 106, name: 'Clínica Orbe II', contact: 'Grupo Orbe Saúde', phone: '(11) 3055-7700', value: 240000, stage: 'proposal', tags: ['Comercial', 'Cliente atual'], owner: 'Rafael Costa', source: 'Cliente atual', task: { label: 'Retornar sobre a proposta', when: 'Atrasada 2 dias', state: 'late' }, notes: [{ id: 2, author: 'Rafael Costa', text: 'Proposta enviada por e-mail. Cliente pediu prazo para avaliar com a diretoria.', time: '24 set, 17:20' }, ...created('18 set, 09:00')] },
  { id: 107, name: 'Casa Alphaville', contact: 'Roberto Alves', phone: '(11) 99601-2245', value: 180000, stage: 'proposal', tags: ['Residencial'], owner: 'Felipe Sales', source: 'Indicação', task: { label: 'Fazer follow-up', when: 'Em 2 dias', state: 'next' }, notes: created('20 set, 15:45') },
  { id: 108, name: 'Edifício Horizonte', contact: 'Incorporadora Atlas', phone: '(11) 3170-4400', value: 390000, stage: 'negotiation', tags: ['Predial'], owner: 'Felipe Sales', source: 'Prospecção', task: { label: 'Reunião de fechamento', when: 'Hoje', state: 'today' }, notes: [{ id: 2, author: 'Felipe Sales', text: 'Pediram revisão do cronograma de desembolso.', time: '27 set, 11:10' }, ...created('02 set, 10:00')] },
  { id: 109, name: 'Loja Conceito', contact: 'Studio Forma', phone: '(11) 97311-8090', value: 120000, stage: 'negotiation', tags: ['Comercial'], owner: 'Camila Nunes', source: 'Instagram', task: { label: 'Enviar proposta revisada', when: 'Em 3 dias', state: 'next' }, notes: created('10 set, 13:25') },
  { id: 110, name: 'Residência Moema', contact: 'Carla Souza', phone: '(11) 98455-1203', value: 150000, stage: 'won', tags: ['Residencial'], owner: 'Rafael Costa', source: 'Indicação', task: null, notes: created('05 ago, 09:30') },
  { id: 111, name: 'Escritório Tech', contact: 'Nexo Sistemas', phone: '(11) 3340-2211', value: 90000, stage: 'won', tags: ['Comercial'], owner: 'Felipe Sales', source: 'Site', task: null, notes: created('12 ago, 14:00') },
  { id: 112, name: 'Sobrado Tatuapé', contact: 'Marcelo Dias', phone: '(11) 99870-5512', value: 70000, stage: 'lost', tags: ['Reforma'], owner: 'Camila Nunes', source: 'Site', task: null, notes: [{ id: 2, author: 'Camila Nunes', text: 'Fechou com outra empresa por preço.', time: '15 set, 16:02' }, ...created('20 ago, 10:15')] },
]

const total = (items: Lead[]) => items.reduce((sum, lead) => sum + lead.value, 0)
const taskText = (lead: Lead) => lead.task ? `${lead.task.when} · ${lead.task.label}` : isOpenLead(lead) ? 'Sem tarefa' : 'Concluído'

export function CrmBoard({ leads, setLeads }: { leads: Lead[]; setLeads: Dispatch<SetStateAction<Lead[]>> }) {
  const [view, setView] = useState<'board' | 'list'>('board')
  const [query, setQuery] = useState('')
  const [dragId, setDragId] = useState<number | null>(null)
  const [overStage, setOverStage] = useState<StageId | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)
  const [quickOpen, setQuickOpen] = useState(false)
  const [quickName, setQuickName] = useState('')
  const [quickValue, setQuickValue] = useState('')
  const [note, setNote] = useState('')
  const openLead = leads.find(lead => lead.id === openId) ?? null

  useEffect(() => {
    if (openId === null) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpenId(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId])

  const term = query.trim().toLowerCase()
  const visible = term ? leads.filter(lead => [lead.name, lead.contact, lead.owner, ...lead.tags].some(text => text.toLowerCase().includes(term))) : leads
  const open = leads.filter(isOpenLead)
  const won = leads.filter(lead => lead.stage === 'won')
  const lost = leads.filter(lead => lead.stage === 'lost')
  const advanced = leads.filter(lead => lead.stage === 'proposal' || lead.stage === 'negotiation')

  const moveLead = (id: number, stage: StageId) => setLeads(current => {
    const lead = current.find(item => item.id === id)
    if (!lead || lead.stage === stage) return current
    const moved: Lead = { ...lead, stage, task: stage === 'won' || stage === 'lost' ? null : lead.task, notes: [{ id: Date.now(), author: 'Sistema', text: `Etapa alterada para ${stageLabel(stage)}`, time: 'Agora' }, ...lead.notes] }
    return [moved, ...current.filter(item => item.id !== id)]
  })
  const addLead = (event: FormEvent) => {
    event.preventDefault()
    if (!quickName.trim()) return
    setLeads(current => [{ id: Date.now(), name: quickName.trim(), contact: 'Contato a definir', phone: 'Não informado', value: Number(quickValue.replace(/\D/g, '')) || 0, stage: 'incoming', tags: [], owner: 'Felipe Sales', source: 'Cadastro manual', task: null, notes: created('Agora') }, ...current])
    setQuickName(''); setQuickValue(''); setQuickOpen(false)
  }
  const addNote = (event: FormEvent) => {
    event.preventDefault()
    if (!openLead || !note.trim()) return
    setLeads(current => current.map(lead => lead.id === openLead.id ? { ...lead, notes: [{ id: Date.now(), author: 'Felipe Sales', text: note.trim(), time: 'Agora' }, ...lead.notes] } : lead))
    setNote('')
  }
  const endDrag = () => { setDragId(null); setOverStage(null) }
  const dropTarget = (stage: StageId) => ({
    onDragOver: (event: DragEvent) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setOverStage(stage) },
    onDrop: (event: DragEvent) => { event.preventDefault(); const id = Number(event.dataTransfer.getData('text/plain')) || dragId; if (id) moveLead(id, stage); endDrag() },
  })

  return (
    <>
      <section className="crm-summary">
        <article><small>FUNIL ABERTO</small><strong>{formatMoney(total(open))}</strong><p>{open.length} leads ativos</p></article>
        <article><small>PROPOSTA E NEGOCIAÇÃO</small><strong>{formatMoney(total(advanced))}</strong><p>{advanced.length} leads em fase final</p></article>
        <article><small>TAXA DE CONVERSÃO</small><strong>{won.length + lost.length ? Math.round(won.length / (won.length + lost.length) * 100) : 0}%</strong><p>{won.length} ganhos de {won.length + lost.length} fechados</p></article>
        <article><small>FECHADO · GANHO</small><strong>{formatMoney(total(won))}</strong><p>{won.length} contratos</p></article>
      </section>

      <div className="crm-toolbar kanban-toolbar">
        <div><button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')}>Funil</button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Lista</button></div>
        <label className="kanban-search"><Search size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar lead, contato ou etiqueta" aria-label="Buscar leads" /></label>
        <button className="primary-button" onClick={() => { setView('board'); setQuickOpen(true) }}><Plus size={17} />Novo lead</button>
      </div>

      {view === 'board' && <>
        <p className="kanban-hint">Arraste um card para mudar de etapa. No celular, toque no card e escolha a etapa.</p>
        <section className="kanban">{STAGES.map(stage => {
          const items = visible.filter(lead => lead.stage === stage.id)
          return (
            <div key={stage.id} className={`kanban-column ${overStage === stage.id && dragId !== null ? 'over' : ''}`} style={{ '--stage': stage.color } as CSSProperties} {...dropTarget(stage.id)}>
              <header><strong>{stage.label}</strong><small>{items.length} {items.length === 1 ? 'lead' : 'leads'} · {formatMoney(total(items))}</small></header>
              {stage.id === 'incoming' && (quickOpen
                ? <form className="kanban-quick" onSubmit={addLead}><input value={quickName} onChange={event => setQuickName(event.target.value)} placeholder="Nome do lead" aria-label="Nome do lead" autoFocus /><input value={quickValue} onChange={event => setQuickValue(event.target.value)} placeholder="Valor estimado (R$)" aria-label="Valor estimado" inputMode="numeric" /><div><button type="submit" className="primary-button">Adicionar</button><button type="button" onClick={() => setQuickOpen(false)}>Cancelar</button></div></form>
                : <button className="kanban-add" onClick={() => setQuickOpen(true)}><Plus size={15} />Adição rápida</button>)}
              {items.map(lead => (
                <article key={lead.id} className={`kanban-card ${dragId === lead.id ? 'dragging' : ''}`} draggable role="button" tabIndex={0}
                  onDragStart={event => { event.dataTransfer.setData('text/plain', String(lead.id)); event.dataTransfer.effectAllowed = 'move'; setDragId(lead.id) }}
                  onDragEnd={endDrag} onClick={() => setOpenId(lead.id)} onKeyDown={event => { if (event.key === 'Enter') setOpenId(lead.id) }}>
                  <div className="kanban-card-top"><h3>{lead.name}</h3><strong>{formatCompactMoney(lead.value)}</strong></div>
                  <p>{lead.contact}</p>
                  {lead.tags.length > 0 && <div className="kanban-tags">{lead.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
                  <footer><span className={`kanban-task ${lead.task?.state ?? (isOpenLead(lead) ? 'none' : 'done')}`}><i />{taskText(lead)}</span><span className="avatar" title={`Responsável: ${lead.owner}`}>{initialsOf(lead.owner)}</span></footer>
                </article>
              ))}
              {!items.length && <p className="kanban-empty">{term ? 'Nenhum lead encontrado' : 'Arraste um lead para cá'}</p>}
            </div>
          )
        })}</section>
        {dragId !== null && <div className="kanban-dropbar"><div className={`won ${overStage === 'won' ? 'over' : ''}`} {...dropTarget('won')}>Solte aqui para marcar como ganho</div><div className={`lost ${overStage === 'lost' ? 'over' : ''}`} {...dropTarget('lost')}>Solte aqui para marcar como perdido</div></div>}
      </>}

      {view === 'list' && <section className="admin-table-panel kanban-list">
        <table>
          <thead><tr><th scope="col">Lead</th><th scope="col">Etapa</th><th scope="col">Valor</th><th scope="col">Responsável</th><th scope="col">Próxima tarefa</th></tr></thead>
          <tbody>{visible.map(lead => <tr key={lead.id}>
            <th scope="row"><button onClick={() => setOpenId(lead.id)}><strong>{lead.name}</strong><small>{lead.contact}</small></button></th>
            <td><select value={lead.stage} onChange={event => moveLead(lead.id, event.target.value as StageId)} aria-label={`Etapa de ${lead.name}`}>{STAGES.map(stage => <option key={stage.id} value={stage.id}>{stage.label}</option>)}</select></td>
            <td>{formatMoney(lead.value)}</td>
            <td>{lead.owner}</td>
            <td><span className={`kanban-task ${lead.task?.state ?? (isOpenLead(lead) ? 'none' : 'done')}`}><i />{taskText(lead)}</span></td>
          </tr>)}</tbody>
        </table>
        {!visible.length && <p className="kanban-empty">Nenhum lead encontrado</p>}
      </section>}

      {openLead && <div className="modal-backdrop" onMouseDown={() => setOpenId(null)}>
        <div className="modal lead-modal" role="dialog" aria-modal="true" aria-label={openLead.name} onMouseDown={event => event.stopPropagation()}>
          <div className="modal-header"><div><span className="eyebrow">LEAD #{openLead.id}</span><h2>{openLead.name}</h2><p>{openLead.contact} · {formatMoney(openLead.value)}</p></div><button className="icon-button" onClick={() => setOpenId(null)} aria-label="Fechar"><X size={20} /></button></div>
          <h3>Etapa do funil</h3>
          <div className="lead-stages">{OPEN_STAGES.map(stage => <button key={stage.id} className={openLead.stage === stage.id ? 'active' : ''} style={{ '--stage': stage.color } as CSSProperties} aria-pressed={openLead.stage === stage.id} onClick={() => moveLead(openLead.id, stage.id)}>{stage.label}</button>)}</div>
          <div className="lead-outcome"><button className={`won ${openLead.stage === 'won' ? 'active' : ''}`} aria-pressed={openLead.stage === 'won'} onClick={() => moveLead(openLead.id, 'won')}>Marcar como ganho</button><button className={`lost ${openLead.stage === 'lost' ? 'active' : ''}`} aria-pressed={openLead.stage === 'lost'} onClick={() => moveLead(openLead.id, 'lost')}>Marcar como perdido</button></div>
          <dl className="lead-fields">
            <div><dt>Valor</dt><dd>{formatMoney(openLead.value)}</dd></div>
            <div><dt>Responsável</dt><dd>{openLead.owner}</dd></div>
            <div><dt>Contato</dt><dd>{openLead.contact}</dd></div>
            <div><dt>Telefone</dt><dd>{openLead.phone}</dd></div>
            <div><dt>Origem</dt><dd>{openLead.source}</dd></div>
            <div><dt>Próxima tarefa</dt><dd>{taskText(openLead)}</dd></div>
          </dl>
          <h3>Histórico</h3>
          <form className="lead-note-form" onSubmit={addNote}><input value={note} onChange={event => setNote(event.target.value)} placeholder="Escreva uma nota sobre este lead" aria-label="Nova nota" /><button type="submit" className="primary-button">Adicionar</button></form>
          <ul className="lead-notes">{openLead.notes.map(item => <li key={item.id}><strong>{item.author}</strong><span>{item.text}</span><small>{item.time}</small></li>)}</ul>
        </div>
      </div>}
    </>
  )
}
