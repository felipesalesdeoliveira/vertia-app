import { useState, type FormEvent } from 'react'
import { Check, Plus, Search } from './icons'
import { initialsOf } from './format'
import { projects } from './data'

const PROFILES = ['Administrador', 'Financeiro', 'Engenheiro', 'Equipe de campo', 'Cliente'] as const
type Profile = typeof PROFILES[number]
type Status = 'Ativo' | 'Inativo' | 'Convite enviado'
type Person = { id: number; name: string; email: string; profile: Profile; scope: string; status: Status }

const PROFILE_DETAILS: Record<Profile, string> = {
  Administrador: 'Acesso completo à empresa',
  Financeiro: 'Financeiro, notas e fluxo de caixa',
  Engenheiro: 'Gestão das obras em que atua',
  'Equipe de campo': 'Chat, materiais e medição própria',
  Cliente: 'Portal com o que a empresa libera',
}

const initialPeople: Person[] = [
  { id: 1, name: 'Guilherme Cybulski', email: 'guilherme@cymaco.com.br', profile: 'Administrador', scope: 'Todas as obras', status: 'Ativo' },
  { id: 2, name: 'Taine Garcia', email: 'taine@cymaco.com.br', profile: 'Administrador', scope: 'Todas as obras', status: 'Ativo' },
  { id: 3, name: 'Suéllen Weber', email: 'suellen@cymaco.com.br', profile: 'Financeiro', scope: 'Todas as obras', status: 'Ativo' },
  { id: 4, name: 'Leonardo Alves', email: 'leonardo@cymaco.com.br', profile: 'Engenheiro', scope: '3 obras', status: 'Ativo' },
  { id: 5, name: 'Felipe Sales', email: 'felipe@cymaco.com.br', profile: 'Administrador', scope: 'Todas as obras', status: 'Ativo' },
  { id: 6, name: 'Carlos Mendes', email: 'carlos.mendes@email.com', profile: 'Equipe de campo', scope: 'Ed. El Greco — Recuperação de fachada', status: 'Ativo' },
  { id: 7, name: 'João Martins', email: 'joao.martins@email.com', profile: 'Equipe de campo', scope: '3 obras', status: 'Ativo' },
  { id: 8, name: 'Marcos Silva', email: 'marcos.silva@email.com', profile: 'Equipe de campo', scope: 'Ed. El Greco — Recuperação de fachada', status: 'Inativo' },
  { id: 9, name: 'Mariana Alves', email: 'mariana.alves@email.com', profile: 'Cliente', scope: 'Ed. El Greco — Recuperação de fachada', status: 'Ativo' },
  { id: 10, name: 'Sérgio Ramos', email: 'sindico@condallure.com.br', profile: 'Cliente', scope: 'Ed. Allure — Impermeabilização', status: 'Ativo' },
  { id: 11, name: 'Helena Duarte', email: 'helena@condmontecastelo.com.br', profile: 'Cliente', scope: 'Ed. Monte Castelo', status: 'Ativo' },
  { id: 12, name: 'Luiza Andrade', email: 'luiza.andrade@email.com', profile: 'Cliente', scope: 'Sede administrativa', status: 'Convite enviado' },
]

const MODULES = ['Dashboard da empresa', 'Obras e cronograma', 'Diário de obra', 'Chat da obra', 'Materiais e estoque', 'Medições', 'Financeiro e fluxo de caixa', 'Notas fiscais', 'CRM', 'Documentos', 'Perfis e acessos', 'Portal do cliente']
const initialPermissions: Record<Profile, string[]> = {
  Administrador: MODULES,
  Financeiro: ['Dashboard da empresa', 'Medições', 'Financeiro e fluxo de caixa', 'Notas fiscais', 'Documentos'],
  Engenheiro: ['Obras e cronograma', 'Diário de obra', 'Chat da obra', 'Materiais e estoque', 'Medições', 'Documentos'],
  'Equipe de campo': ['Chat da obra', 'Materiais e estoque', 'Medições'],
  Cliente: ['Documentos', 'Portal do cliente'],
}

export function ProfilesPage() {
  const [people, setPeople] = useState(initialPeople)
  const [filter, setFilter] = useState<Profile | 'Todos'>('Todos')
  const [query, setQuery] = useState('')
  const [inviting, setInviting] = useState(false)
  const [form, setForm] = useState<{ name: string; email: string; profile: Profile; scope: string }>({ name: '', email: '', profile: 'Engenheiro', scope: projects[0].name })
  const [permissions, setPermissions] = useState(initialPermissions)

  const term = query.trim().toLowerCase()
  const visible = people.filter(person => (filter === 'Todos' || person.profile === filter) && (!term || person.name.toLowerCase().includes(term) || person.email.toLowerCase().includes(term)))
  const update = (id: number, changes: Partial<Person>) => setPeople(current => current.map(person => person.id === id ? { ...person, ...changes } : person))
  const invite = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setPeople(current => [{ id: Date.now(), name: form.name.trim(), email: form.email.trim(), profile: form.profile, scope: form.scope, status: 'Convite enviado' }, ...current])
    setForm(current => ({ ...current, name: '', email: '' }))
    setInviting(false)
    setFilter('Todos')
  }
  const togglePermission = (profile: Profile, module: string) => setPermissions(current => ({
    ...current,
    [profile]: current[profile].includes(module) ? current[profile].filter(item => item !== module) : [...current[profile], module],
  }))

  return (
    <>
      <section className="profile-cards">
        <button className={filter === 'Todos' ? 'active' : ''} aria-pressed={filter === 'Todos'} onClick={() => setFilter('Todos')}><strong>{people.length}</strong><span>Todos os perfis</span><small>Pessoas com acesso à Vértia</small></button>
        {PROFILES.map(profile => <button key={profile} className={filter === profile ? 'active' : ''} aria-pressed={filter === profile} onClick={() => setFilter(profile)}><strong>{people.filter(person => person.profile === profile).length}</strong><span>{profile}</span><small>{PROFILE_DETAILS[profile]}</small></button>)}
      </section>

      <section className="admin-table-panel profile-panel">
        <div className="admin-panel-heading"><div><h2>Pessoas e perfis</h2><p>Defina o perfil de cada pessoa, ative ou desative o acesso e envie convites.</p></div></div>
        <div className="profile-toolbar">
          <label className="kanban-search"><Search size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por nome ou e-mail" aria-label="Buscar pessoas" /></label>
          <button className="primary-button" onClick={() => setInviting(current => !current)}><Plus size={17} />Convidar pessoa</button>
        </div>
        {inviting && <form className="profile-invite" onSubmit={invite}>
          <label>Nome<input value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="Nome completo" required autoFocus /></label>
          <label>E-mail<input type="email" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} placeholder="nome@email.com" required /></label>
          <label>Perfil<select value={form.profile} onChange={event => setForm(current => ({ ...current, profile: event.target.value as Profile }))}>{PROFILES.map(profile => <option key={profile}>{profile}</option>)}</select></label>
          <label>Obra<select value={form.scope} onChange={event => setForm(current => ({ ...current, scope: event.target.value }))}><option>Todas as obras</option>{projects.map(project => <option key={project.id}>{project.name}</option>)}</select></label>
          <div><button type="submit" className="primary-button">Enviar convite</button><button type="button" className="secondary-button" onClick={() => setInviting(false)}>Cancelar</button></div>
        </form>}
        <div className="profile-scroll">
          <table className="profile-table">
            <thead><tr><th scope="col">Pessoa</th><th scope="col">Perfil</th><th scope="col">Obras</th><th scope="col">Situação</th><th scope="col">Acesso</th></tr></thead>
            <tbody>{visible.map(person => <tr key={person.id}>
              <th scope="row"><span className="avatar">{initialsOf(person.name)}</span><span><strong>{person.name}</strong><small>{person.email}</small></span></th>
              <td><select value={person.profile} onChange={event => update(person.id, { profile: event.target.value as Profile })} aria-label={`Perfil de ${person.name}`}>{PROFILES.map(profile => <option key={profile}>{profile}</option>)}</select></td>
              <td>{person.scope}</td>
              <td><em className={`profile-status ${person.status === 'Ativo' ? 'active' : person.status === 'Inativo' ? 'inactive' : 'invited'}`}>{person.status}</em></td>
              <td>{person.status === 'Convite enviado'
                ? <button onClick={() => update(person.id, { status: 'Ativo' })}>Confirmar acesso</button>
                : <button onClick={() => update(person.id, { status: person.status === 'Ativo' ? 'Inativo' : 'Ativo' })}>{person.status === 'Ativo' ? 'Desativar' : 'Reativar'}</button>}</td>
            </tr>)}</tbody>
          </table>
          {!visible.length && <p className="kanban-empty">Nenhuma pessoa encontrada</p>}
        </div>
      </section>

      <section className="admin-table-panel profile-panel">
        <div className="admin-panel-heading"><div><h2>O que cada perfil acessa</h2><p>Marque ou desmarque para ajustar as permissões. O administrador sempre tem acesso completo.</p></div></div>
        <div className="profile-scroll">
          <table className="permission-table">
            <thead><tr><th scope="col">Área</th>{PROFILES.map(profile => <th scope="col" key={profile}>{profile}</th>)}</tr></thead>
            <tbody>{MODULES.map(module => <tr key={module}><th scope="row">{module}</th>{PROFILES.map(profile => {
              const allowed = permissions[profile].includes(module)
              return <td key={profile}><button className={allowed ? 'allowed' : ''} disabled={profile === 'Administrador'} aria-pressed={allowed} aria-label={`${profile}: ${module}`} onClick={() => togglePermission(profile, module)}>{allowed && <Check size={14} strokeWidth={3} />}</button></td>
            })}</tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  )
}
