export type Project = {
  id: number
  name: string
  client: string
  manager: string
  status: 'Em andamento' | 'Atenção' | 'Planejada'
  progress: number
  deadline: string
  location: string
  pending: number
  tone: string
}

export type Update = {
  id: number
  title: string
  description: string
  author: string
  time: string
  visible: boolean
  type: 'foto' | 'diario' | 'documento' | 'aprovacao'
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Residência Alto de Pinheiros',
    client: 'Mariana Alves',
    manager: 'Rafael Costa',
    status: 'Em andamento',
    progress: 68,
    deadline: '18 out 2026',
    location: 'São Paulo, SP',
    pending: 3,
    tone: 'blue',
  },
  {
    id: 2,
    name: 'Retrofit Edifício Aurora',
    client: 'Condomínio Aurora',
    manager: 'Camila Nunes',
    status: 'Atenção',
    progress: 42,
    deadline: '04 dez 2026',
    location: 'Campinas, SP',
    pending: 7,
    tone: 'violet',
  },
  {
    id: 3,
    name: 'Clínica Vila Madalena',
    client: 'Grupo Orbe Saúde',
    manager: 'Rafael Costa',
    status: 'Em andamento',
    progress: 81,
    deadline: '29 set 2026',
    location: 'São Paulo, SP',
    pending: 1,
    tone: 'cyan',
  },
  {
    id: 4,
    name: 'Casa Serra da Cantareira',
    client: 'Felipe e Luiza',
    manager: 'Bruno Lima',
    status: 'Planejada',
    progress: 12,
    deadline: '15 mar 2027',
    location: 'Mairiporã, SP',
    pending: 2,
    tone: 'navy',
  },
]

export const initialUpdates: Update[] = [
  {
    id: 1,
    title: 'Instalação dos revestimentos iniciada',
    description: 'Equipe iniciou o assentamento no banheiro da suíte e concluiu a preparação das paredes.',
    author: 'Rafael Costa',
    time: 'Hoje, 14:30',
    visible: true,
    type: 'foto',
  },
  {
    id: 2,
    title: 'Diário de obra — 28 de setembro',
    description: '8 profissionais em campo. Instalações hidráulicas testadas sem intercorrências.',
    author: 'João Mendes',
    time: 'Ontem, 17:42',
    visible: false,
    type: 'diario',
  },
  {
    id: 3,
    title: 'Projeto luminotécnico revisado',
    description: 'Nova versão adicionada aos documentos. Aguardando aprovação do cliente.',
    author: 'Camila Nunes',
    time: '27 set, 11:18',
    visible: true,
    type: 'aprovacao',
  },
  {
    id: 4,
    title: 'Nota fiscal vinculada à obra',
    description: 'Documento interno adicionado na categoria Materiais e revestimentos.',
    author: 'Ana Prado',
    time: '26 set, 09:05',
    visible: false,
    type: 'documento',
  },
]
