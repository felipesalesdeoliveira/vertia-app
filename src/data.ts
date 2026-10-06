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
    name: 'Ed. El Greco — Recuperação de fachada',
    client: 'Condomínio Ed. El Greco',
    manager: 'Rafael Costa',
    status: 'Em andamento',
    progress: 33,
    deadline: '20 dez 2026',
    location: 'Florianópolis, SC',
    pending: 8,
    tone: 'violet',
  },
  {
    id: 2,
    name: 'Ed. Allure — Impermeabilização',
    client: 'Condomínio Allure',
    manager: 'Camila Nunes',
    status: 'Atenção',
    progress: 12,
    deadline: '28 fev 2027',
    location: 'Florianópolis, SC',
    pending: 5,
    tone: 'blue',
  },
  {
    id: 3,
    name: 'Ed. Monte Castelo — Pintura predial',
    client: 'Condomínio Monte Castelo',
    manager: 'Rafael Costa',
    status: 'Em andamento',
    progress: 74,
    deadline: '30 nov 2026',
    location: 'São José, SC',
    pending: 2,
    tone: 'cyan',
  },
  {
    id: 4,
    name: 'Sede administrativa — Reforma interna',
    client: 'Cymaco Engenharia',
    manager: 'Bruno Lima',
    status: 'Planejada',
    progress: 0,
    deadline: '15 abr 2027',
    location: 'Florianópolis, SC',
    pending: 1,
    tone: 'navy',
  },
]

export const initialUpdates: Update[] = [
  {
    id: 1,
    title: 'Recuperação estrutural da fachada norte',
    description: 'Tratamento de armadura exposta concluído no 4º ao 7º pavimento. Iniciada a reconstituição do cobrimento.',
    author: 'Rafael Costa',
    time: 'Hoje, 14:30',
    visible: true,
    type: 'foto',
  },
  {
    id: 2,
    title: 'Diário de obra — 28 de setembro',
    description: '6 profissionais em campo. Balancim reposicionado para a face leste. Sem intercorrências.',
    author: 'Mestre de obras',
    time: 'Ontem, 17:42',
    visible: false,
    type: 'diario',
  },
  {
    id: 3,
    title: 'Paleta de cores da fachada revisada',
    description: 'Nova proposta de cores enviada ao síndico. Aguardando aprovação em assembleia.',
    author: 'Camila Nunes',
    time: '27 set, 11:18',
    visible: true,
    type: 'aprovacao',
  },
  {
    id: 4,
    title: 'Nota fiscal de impermeabilizante vinculada',
    description: 'Documento interno adicionado na categoria Impermeabilizações.',
    author: 'Ana Prado',
    time: '26 set, 09:05',
    visible: false,
    type: 'documento',
  },
]
