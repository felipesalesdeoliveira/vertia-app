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
