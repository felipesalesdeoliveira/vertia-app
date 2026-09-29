# Frontend Vértia

Protótipo navegável da experiência inicial do MVP da Vértia.

## Executar localmente

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Versão publicada

O protótipo é publicado automaticamente no GitHub Pages a cada atualização da
branch `main`.

https://felipesalesdeoliveira.github.io/vertia-app/

## Escopo desta versão

- visão geral da empresa;
- lista e detalhe das obras;
- linha do tempo de atualizações;
- criação simulada de uma atualização;
- controle de visibilidade entre equipe e cliente;
- alternância para o portal do cliente;
- visual responsivo para desktop e celular.

Os dados são fictícios e permanecem somente durante a sessão. Não há backend, autenticação ou persistência nesta etapa.

## Ponto de retomada — 29/09/2026

### Concluído

- página inicial de login criada;
- acesso demonstrativo para administrador, engenheiro, equipe de campo e cliente;
- experiências distintas para área administrativa, campo e portal do cliente;
- seleção entre múltiplas obras autorizadas para o prestador, com opção de trocar a obra atual pelo cabeçalho;
- chats, materiais e medições contextualizados pela obra selecionada, com navegação otimizada para celular;
- chat individual com o engenheiro responsável e chat coletivo com os participantes da obra;
- envio simulado de mensagens nos dois chats;
- solicitação de materiais com quantidade, unidade, observação, urgência e acompanhamento do status;
- medição individual publicada pelo engenheiro, com período, serviços, quantidades, valores unitários, total, previsão de pagamento e histórico;
- portal do cliente com seleção de obra, progresso, prazo previsto, atualizações, fotos, documentos e contato com o engenheiro;
- fluxo demonstrativo de aprovação ou solicitação de ajuste em documentos enviados ao cliente;
- portal do engenheiro com seleção de obra, dashboard individual, equipe presente e indicadores de avanço físico, materiais e orçamento geral;
- chat coletivo da equipe, cronograma por etapas e diário de obra com equipe, clima, atividades, ocorrências, fotos e histórico;
- gestão de medições pelo engenheiro, com contratos por prestador, valores acumulados e publicação individual;
- controle de materiais com orçamento previsto, utilizado, saldo, consumo por categoria e aprovação de solicitações da equipe;
- central de documentos do engenheiro organizada em projetos, contratos, relatórios e documentos técnicos;
- portal administrativo com visão consolidada das obras e indicadores financeiros da empresa;
- módulo financeiro com receitas, despesas, resultado, contas a vencer e desempenho por obra;
- módulo comercial com CRM em formato de pipeline, propostas, negociações e contratos fechados;
- controle de estoque por obra, saldo mínimo, valor armazenado e alertas de reposição;
- gestão de notas fiscais com upload demonstrativo, fornecedor, valor e vínculo direto com a obra;
- área administrativa para colaboradores, permissões, contratos, fornecedores e rotinas internas;
- opção de encerrar a sessão nas áreas internas;
- chamada principal da página de login revisada para comunicar integração, transparência e centralização:
  - **Engenharia · Tecnologia · Conexão**;
  - **Sua obra inteira. Todas as pessoas. Um só lugar.**;
  - **Uma obra, uma única verdade**;
  - **Empresa e cliente lado a lado**;
  - **Tecnologia que acompanha a execução**.

### Estado técnico

- alterações salvas em `src/App.tsx`;
- ícones essenciais incorporados ao próprio frontend para eliminar a dependência que travava o empacotamento;
- build de produção concluído com sucesso pelo comando `npm run build`;
- arquivos finais gerados em `dist/`;
- deploy local ativo em `http://127.0.0.1:5173/`;
- a autenticação ainda é simulada e deverá ser integrada a um backend posteriormente.

### Próximo passo

Revisar visualmente a nova tela de login no endereço local. Em seguida, continuar o refinamento dos textos, espaçamentos e comportamento responsivo.
