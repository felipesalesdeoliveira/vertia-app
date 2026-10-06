export type Modules = Record<string, boolean>
export type UserAccess = Record<number, Record<string, boolean>>

export const COMPANY_MODULES = [
  { key: 'crm', label: 'CRM', desc: 'Funil comercial, leads e propostas' },
  { key: 'orcamentos', label: 'Orçamentos', desc: 'Planilhas de orçamento, BDI e propostas' },
  { key: 'finance', label: 'Financeiro', desc: 'Painel financeiro, fluxo de caixa e notas fiscais' },
  { key: 'inventory', label: 'Estoque', desc: 'Materiais, saldos e movimentações' },
  { key: 'fornecedores', label: 'Fornecedores', desc: 'Cadastro e desempenho de prestadores' },
  { key: 'relatorios', label: 'Relatórios', desc: 'Relatórios consolidados e exportação' },
  { key: 'documents', label: 'Documentos', desc: 'Biblioteca de arquivos da empresa' },
  { key: 'approvals', label: 'Aprovações', desc: 'Decisões do cliente nas obras' },
  { key: 'updates', label: 'Atualizações', desc: 'Feed de registros das obras' },
]

export const MODULE_PAGES: Record<string, string[]> = {
  crm: ['crm'],
  orcamentos: ['orcamentos'],
  finance: ['finance', 'cashflow', 'invoices'],
  inventory: ['inventory'],
  fornecedores: ['fornecedores'],
  relatorios: ['relatorios'],
  documents: ['documents'],
  approvals: ['approvals'],
  updates: ['updates'],
}

const moduleOf = (page: string) => Object.keys(MODULE_PAGES).find(key => MODULE_PAGES[key].includes(page))

/** O módulo está contratado pela empresa? Páginas fixas (dashboard, obras…) não pertencem a módulo. */
export const isPageEnabled = (page: string, modules: Modules) => {
  const key = moduleOf(page)
  return !key || modules[key] !== false
}

/** A pessoa logada pode ver esta página? `undefined` = sem restrição individual. */
export const isPageVisibleTo = (page: string, access: Record<string, boolean> | undefined) => {
  if (!access) return true
  const key = moduleOf(page)
  return !key || access[key] !== false
}

/** O que cada perfil enxerga por padrão. O Master ajusta exceções por pessoa. */
export const PROFILE_MODULE_DEFAULTS: Record<string, string[]> = {
  Master: COMPANY_MODULES.map(item => item.key),
  Administrador: COMPANY_MODULES.map(item => item.key),
  Financeiro: ['orcamentos', 'finance', 'inventory', 'fornecedores', 'relatorios', 'documents', 'updates'],
  Engenheiro: ['orcamentos', 'inventory', 'documents', 'approvals', 'updates'],
  'Equipe de campo': [],
  Cliente: [],
}

/** Resolve o acesso efetivo: padrão do perfil, com as exceções do Master por cima. */
export const resolveAccess = (profile: string, overrides: Record<string, boolean> | undefined) => {
  const defaults = PROFILE_MODULE_DEFAULTS[profile] ?? []
  return COMPANY_MODULES.reduce<Record<string, boolean>>((acc, item) => {
    acc[item.key] = overrides?.[item.key] ?? defaults.includes(item.key)
    return acc
  }, {})
}
