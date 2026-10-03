import { useState, type ReactNode } from 'react'
import { CalendarDays, CheckCircle2, ClipboardCheck, Sparkles } from './icons'
import { formatCompactMoney, formatMoney, formatNumber, formatPercent } from './format'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const YEARS = [2026, 2025, 2024]
const CURRENT_YEAR = 2026
// Setembro é o último mês fechado; os seguintes são previsão.
const LAST_REALIZED_MONTH = 8
const REVENUE_COLOR = '#164cff'
const EXPENSE_COLOR = '#eb6834'

type FlowGroup = 'in' | 'out' | 'invest' | 'finance'

const FLOW_LINES: { key: string; label: string; group: FlowGroup }[] = [
  { key: 'medicoes', label: 'Medições de obras', group: 'in' },
  { key: 'sinais', label: 'Sinais e adiantamentos', group: 'in' },
  { key: 'aditivos', label: 'Aditivos contratuais', group: 'in' },
  { key: 'outras', label: 'Outras receitas', group: 'in' },
  { key: 'materiais', label: 'Materiais', group: 'out' },
  { key: 'mao', label: 'Mão de obra e prestadores', group: 'out' },
  { key: 'equipamentos', label: 'Equipamentos e locação', group: 'out' },
  { key: 'folha', label: 'Folha administrativa', group: 'out' },
  { key: 'impostos', label: 'Impostos e taxas', group: 'out' },
  { key: 'administrativas', label: 'Despesas administrativas', group: 'out' },
  { key: 'maquinas', label: 'Compra de máquinas e veículos', group: 'invest' },
  { key: 'ativos', label: 'Venda de ativos', group: 'invest' },
  { key: 'emprestimos', label: 'Empréstimos tomados', group: 'finance' },
  { key: 'amortizacao', label: 'Amortização de empréstimos', group: 'finance' },
  { key: 'lucros', label: 'Distribuição de lucros', group: 'finance' },
]

// Dados fictícios e determinísticos: entradas positivas, saídas negativas.
const YEAR_REVENUE: Record<number, number> = { 2022: 1_080_000, 2023: 1_310_000, 2024: 1_540_000, 2025: 1_790_000, 2026: 2_060_000 }
const SEASON = [0.066, 0.07, 0.082, 0.079, 0.086, 0.081, 0.094, 0.088, 0.097, 0.092, 0.088, 0.077]
const FIRST_OPENING_BALANCE = 90_000
const roundTo50 = (value: number) => Math.round(value / 50) * 50

function buildLines(year: number): Record<string, number[]> {
  const total = YEAR_REVENUE[year]
  const seasonal = (share: number, phase: number, sign = 1) => SEASON.map((weight, month) => sign * roundTo50(total * share * weight * (1 + 0.07 * Math.sin(year * 1.7 + month * 2.3 + phase))))
  const monthly = (share: number, sign = 1, decemberFactor = 1) => MONTHS.map((_, month) => sign * roundTo50(total * share / 12 * (month === 11 ? decemberFactor : 1)))
  const inMonths = (months: number[], share: number, sign = 1) => MONTHS.map((_, month) => months.includes(month) ? sign * roundTo50(total * share) : 0)
  return {
    medicoes: seasonal(0.72, 0),
    sinais: seasonal(0.15, 1.3),
    aditivos: seasonal(0.09, 2.1),
    outras: seasonal(0.04, 3.4),
    materiais: seasonal(0.3, 0.8, -1),
    mao: seasonal(0.23, 1.9, -1),
    equipamentos: seasonal(0.05, 2.7, -1),
    folha: monthly(0.07, -1, 1.4),
    impostos: seasonal(0.075, 0.4, -1),
    administrativas: monthly(0.035, -1),
    maquinas: inMonths([2, 7], 0.02, -1),
    ativos: inMonths([5], 0.006),
    emprestimos: inMonths([1], year % 2 === 0 ? 0.04 : 0),
    amortizacao: monthly(0.012, -1),
    lucros: inMonths([5, 11], 0.05, -1),
  }
}

type YearFlow = {
  lines: Record<string, number[]>
  revenue: number[]
  expense: number[]
  operating: number[]
  investing: number[]
  financing: number[]
  net: number[]
  opening: number[]
  closing: number[]
}

function buildYears(): Record<number, YearFlow> {
  const years: Record<number, YearFlow> = {}
  let balance = FIRST_OPENING_BALANCE
  Object.keys(YEAR_REVENUE).map(Number).sort().forEach(year => {
    const lines = buildLines(year)
    const groupSum = (group: FlowGroup) => MONTHS.map((_, month) => FLOW_LINES.filter(line => line.group === group).reduce((sum, line) => sum + lines[line.key][month], 0))
    const revenue = groupSum('in')
    const expense = groupSum('out').map(value => -value)
    const investing = groupSum('invest')
    const financing = groupSum('finance')
    const operating = revenue.map((value, month) => value - expense[month])
    const net = operating.map((value, month) => value + investing[month] + financing[month])
    const opening: number[] = []
    const closing: number[] = []
    net.forEach(value => { opening.push(balance); balance += value; closing.push(balance) })
    years[year] = { lines, revenue, expense, operating, investing, financing, net, opening, closing }
  })
  return years
}

const FLOW = buildYears()
const sum = (values: number[], months?: number[]) => (months ? months.map(month => values[month]) : values).reduce((total, value) => total + value, 0)
const isProjected = (year: number, month: number) => year === CURRENT_YEAR && month > LAST_REALIZED_MONTH
const QUARTERS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]]
const QUARTER_LABELS = ['1º tri', '2º tri', '3º tri', '4º tri']

function niceScale(max: number) {
  const rough = Math.max(max, 1) / 4
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map(factor => factor * magnitude).find(candidate => candidate >= rough) ?? 10 * magnitude
  const top = step * Math.ceil(max / step)
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step) }
}

type Series = { name: string; color: string; values: number[] }
type TooltipRow = { name: string; value: string; color?: string }

function Tooltip({ title, rows, side }: { title: string; rows: TooltipRow[]; side: 'start' | 'end' }) {
  return (
    <span className={`viz-tooltip ${side}`}>
      <b>{title}</b>
      {rows.map(row => <span key={row.name}>{row.color ? <i style={{ background: row.color }} /> : <i className="blank" />}<em>{row.name}</em><strong>{row.value}</strong></span>)}
    </span>
  )
}

function ColumnChart({ categories, series, projectedFrom, notes, summary }: { categories: string[]; series: Series[]; projectedFrom?: number; notes?: string[]; summary?: (index: number) => TooltipRow }) {
  const [active, setActive] = useState<number | null>(null)
  const { top, ticks } = niceScale(Math.max(...series.flatMap(item => item.values)))
  return (
    <div className="viz-chart">
      <div className="viz-y">{ticks.map(tick => <span key={tick} style={{ bottom: `${tick / top * 100}%` }}>{tick ? formatCompactMoney(tick) : '0'}</span>)}</div>
      <div className="viz-plot">
        {ticks.map(tick => <i key={tick} className="viz-grid" style={{ bottom: `${tick / top * 100}%` }} />)}
        <div className="viz-bands">{categories.map((category, index) => {
          const projected = projectedFrom !== undefined && index >= projectedFrom
          const title = `${category}${projected ? ' · previsto' : ''}`
          const rows = [...series.map(item => ({ name: item.name, value: formatMoney(item.values[index]), color: item.color })), ...(summary ? [summary(index)] : [])]
          return (
            <button type="button" key={category} className={`viz-band ${active === index ? 'active' : ''}`} onPointerEnter={() => setActive(index)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} onClick={() => setActive(index)} aria-label={`${title}: ${rows.map(row => `${row.name} ${row.value}`).join(', ')}`}>
              <span className="viz-bars">{series.map(item => <i key={item.name} className={projected ? 'projected' : ''} style={{ height: `${item.values[index] / top * 100}%`, background: item.color }} />)}</span>
              {active === index && <Tooltip title={title} rows={rows} side={index < categories.length / 2 ? 'start' : 'end'} />}
            </button>
          )
        })}</div>
      </div>
      <div className="viz-x">{categories.map((category, index) => <span key={category}>{category}{notes && <small>{notes[index]}</small>}</span>)}</div>
    </div>
  )
}

function BalanceChart({ categories, values, projectedFrom }: { categories: string[]; values: number[]; projectedFrom?: number }) {
  const [active, setActive] = useState<number | null>(null)
  const { top, ticks } = niceScale(Math.max(...values))
  const firstProjected = projectedFrom ?? values.length
  const lastRealized = firstProjected - 1
  const x = (index: number) => (index + 0.5) / values.length * 100
  const points = values.map((value, index) => `${x(index)},${100 - value / top * 100}`)
  return (
    <div className="viz-chart">
      <div className="viz-y">{ticks.map(tick => <span key={tick} style={{ bottom: `${tick / top * 100}%` }}>{tick ? formatCompactMoney(tick) : '0'}</span>)}</div>
      <div className="viz-plot">
        {ticks.map(tick => <i key={tick} className="viz-grid" style={{ bottom: `${tick / top * 100}%` }} />)}
        <svg className="viz-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polygon points={`${x(0)},100 ${points.join(' ')} ${x(values.length - 1)},100`} />
          <polyline points={points.slice(0, firstProjected).join(' ')} />
          {firstProjected < values.length && <polyline className="projected" points={points.slice(lastRealized).join(' ')} />}
        </svg>
        <div className="viz-bands">{categories.map((category, index) => {
          const projected = index >= firstProjected
          const title = `${category}${projected ? ' · previsto' : ''}`
          const value = formatMoney(values[index])
          return (
            <button type="button" key={category} className={`viz-band line ${active === index ? 'active' : ''}`} onPointerEnter={() => setActive(index)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} onClick={() => setActive(index)} aria-label={`${title}: saldo final ${value}`}>
              {(active === index || index === lastRealized) && <i className="viz-dot" style={{ bottom: `${values[index] / top * 100}%` }} />}
              {index === lastRealized && active === null && <span className={`viz-end-label ${index < values.length / 2 ? 'start' : 'end'}`} style={{ bottom: `${values[index] / top * 100}%` }}>{formatCompactMoney(values[index])}</span>}
              {active === index && <Tooltip title={title} rows={[{ name: 'Saldo final', value, color: REVENUE_COLOR }]} side={index < categories.length / 2 ? 'start' : 'end'} />}
            </button>
          )
        })}</div>
      </div>
      <div className="viz-x">{categories.map(category => <span key={category}>{category}</span>)}</div>
    </div>
  )
}

function ChartCard({ title, subtitle, legend, table, children }: { title: string; subtitle: string; legend?: ReactNode; table: { head: string[]; rows: string[][] }; children: ReactNode }) {
  const [showTable, setShowTable] = useState(false)
  return (
    <div className="admin-panel viz-card">
      <div className="admin-panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button onClick={() => setShowTable(current => !current)}>{showTable ? 'Ver gráfico' : 'Ver tabela'}</button></div>
      {showTable
        ? <div className="viz-table"><table><thead><tr>{table.head.map(cell => <th key={cell}>{cell}</th>)}</tr></thead><tbody>{table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index ? <td key={index}>{cell}</td> : <th key={index} scope="row">{cell}</th>)}</tr>)}</tbody></table></div>
        : <>{children}{legend}</>}
    </div>
  )
}

function Legend({ projected }: { projected: boolean }) {
  return <div className="viz-legend"><span><i style={{ background: REVENUE_COLOR }} />Receitas</span><span><i style={{ background: EXPENSE_COLOR }} />Despesas</span>{projected && <span><i className="projected" />Tom claro: previsto</span>}</div>
}

function YearFilter({ year, onChange, children }: { year: number; onChange: (year: number) => void; children?: ReactNode }) {
  return (
    <div className="viz-filters">
      <div role="group" aria-label="Ano"><span>Ano</span>{YEARS.map(option => <button key={option} className={option === year ? 'active' : ''} aria-pressed={option === year} onClick={() => onChange(option)}>{option}</button>)}</div>
      {children}
    </div>
  )
}

const change = (current: number, previous: number) => (current - previous) / Math.abs(previous) * 100
const signed = (value: number, suffix = '%') => `${value >= 0 ? '+' : '−'}${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${suffix}`

export function FinanceOverview() {
  const [year, setYear] = useState(CURRENT_YEAR)
  const flow = FLOW[year]
  const previous = FLOW[year - 1]
  const partial = year === CURRENT_YEAR
  const realizedMonths = MONTHS.map((_, month) => month).filter(month => !isProjected(year, month))
  const period = partial ? `jan–${MONTHS[LAST_REALIZED_MONTH].toLowerCase()} ${year}` : `${year}`
  const comparison = partial ? `vs. jan–${MONTHS[LAST_REALIZED_MONTH].toLowerCase()} ${year - 1}` : `vs. ${year - 1}`

  const revenue = sum(flow.revenue, realizedMonths)
  const expense = sum(flow.expense, realizedMonths)
  const result = revenue - expense
  const margin = result / revenue * 100
  const previousRevenue = sum(previous.revenue, realizedMonths)
  const previousExpense = sum(previous.expense, realizedMonths)
  const previousResult = previousRevenue - previousExpense
  const previousMargin = previousResult / previousRevenue * 100

  const quarterRevenue = QUARTERS.map(months => sum(flow.revenue, months))
  const quarterExpense = QUARTERS.map(months => sum(flow.expense, months))
  const lastYears = [year - 2, year - 1, year]
  const yearRevenue = lastYears.map(item => sum(FLOW[item].revenue))
  const yearExpense = lastYears.map(item => sum(FLOW[item].expense))
  const yearLabels = lastYears.map(item => item === CURRENT_YEAR ? `${item}*` : `${item}`)
  const resultRow = (revenues: number[], expenses: number[]) => (index: number) => ({ name: 'Resultado', value: formatMoney(revenues[index] - expenses[index]) })
  const resultNotes = (revenues: number[], expenses: number[]) => revenues.map((value, index) => `Resultado ${formatCompactMoney(value - expenses[index])}`)
  const rows = (labels: string[], revenues: number[], expenses: number[]) => labels.map((label, index) => [label, formatMoney(revenues[index]), formatMoney(expenses[index]), formatMoney(revenues[index] - expenses[index])])
  const head = (first: string) => [first, 'Receitas', 'Despesas', 'Resultado']

  return (
    <>
      <YearFilter year={year} onChange={setYear}><p>Período: {period}. Comparativo {comparison}.</p></YearFilter>
      <section className="admin-summary-grid">
        <article><span className="admin-summary-icon revenue"><Sparkles size={20} /></span><div><small>RECEITAS</small><strong>{formatMoney(revenue)}</strong><p><b className="delta-good">{signed(change(revenue, previousRevenue))}</b> {comparison}</p></div></article>
        <article><span className="admin-summary-icon expense"><ClipboardCheck size={20} /></span><div><small>DESPESAS</small><strong>{formatMoney(expense)}</strong><p><b className="delta-bad">{signed(change(expense, previousExpense))}</b> {comparison}</p></div></article>
        <article><span className="admin-summary-icon result"><CheckCircle2 size={20} /></span><div><small>RESULTADO</small><strong>{formatMoney(result)}</strong><p><b className={result >= previousResult ? 'delta-good' : 'delta-bad'}>{signed(change(result, previousResult))}</b> {comparison}</p></div></article>
        <article><span className="admin-summary-icon receive"><CalendarDays size={20} /></span><div><small>MARGEM</small><strong>{formatPercent(margin)}</strong><p><b className={margin >= previousMargin ? 'delta-good' : 'delta-bad'}>{signed(margin - previousMargin, ' p.p.')}</b> {comparison}</p></div></article>
      </section>

      <ChartCard title={`Receitas e despesas por mês · ${year}`} subtitle="Entradas e saídas operacionais de cada mês do ano." legend={<Legend projected={partial} />} table={{ head: head('Mês'), rows: rows(MONTHS.map((month, index) => `${month}${isProjected(year, index) ? ' (previsto)' : ''}`), flow.revenue, flow.expense) }}>
        <ColumnChart categories={MONTHS} series={[{ name: 'Receitas', color: REVENUE_COLOR, values: flow.revenue }, { name: 'Despesas', color: EXPENSE_COLOR, values: flow.expense }]} projectedFrom={partial ? LAST_REALIZED_MONTH + 1 : undefined} summary={resultRow(flow.revenue, flow.expense)} />
      </ChartCard>

      <section className="viz-two-columns">
        <ChartCard title={`Por trimestre · ${year}`} subtitle="Soma de cada trimestre e resultado do período." legend={<Legend projected={partial} />} table={{ head: head('Trimestre'), rows: rows(QUARTER_LABELS.map((label, index) => `${label}${partial && index === 3 ? ' (previsto)' : ''}`), quarterRevenue, quarterExpense) }}>
          <ColumnChart categories={QUARTER_LABELS} series={[{ name: 'Receitas', color: REVENUE_COLOR, values: quarterRevenue }, { name: 'Despesas', color: EXPENSE_COLOR, values: quarterExpense }]} projectedFrom={partial ? 3 : undefined} notes={resultNotes(quarterRevenue, quarterExpense)} summary={resultRow(quarterRevenue, quarterExpense)} />
        </ChartCard>
        <ChartCard title="Últimos 3 anos" subtitle={`Total anual de ${lastYears[0]} a ${lastYears[2]}.${partial ? ` *${year} inclui a previsão de out–dez.` : ''}`} legend={<Legend projected={partial} />} table={{ head: head('Ano'), rows: rows(yearLabels, yearRevenue, yearExpense) }}>
          <ColumnChart categories={yearLabels} series={[{ name: 'Receitas', color: REVENUE_COLOR, values: yearRevenue }, { name: 'Despesas', color: EXPENSE_COLOR, values: yearExpense }]} projectedFrom={partial ? 2 : undefined} notes={resultNotes(yearRevenue, yearExpense)} summary={resultRow(yearRevenue, yearExpense)} />
        </ChartCard>
      </section>
    </>
  )
}

type StatementRow = { label: string; kind: 'section' | 'line' | 'subtotal' | 'total' | 'balance'; values?: number[]; total?: number }

export function CashFlow() {
  const [year, setYear] = useState(CURRENT_YEAR)
  const [period, setPeriod] = useState<'month' | 'quarter'>('month')
  const flow = FLOW[year]
  const partial = year === CURRENT_YEAR
  const columns = period === 'month' ? MONTHS.map((label, month) => ({ label, months: [month] })) : QUARTERS.map((months, index) => ({ label: QUARTER_LABELS[index], months }))
  const columnProjected = columns.map(column => column.months.some(month => isProjected(year, month)))
  const flowRow = (label: string, kind: StatementRow['kind'], values: number[]): StatementRow => ({ label, kind, values: columns.map(column => sum(values, column.months)), total: sum(values) })
  const lineRows = (group: FlowGroup) => FLOW_LINES.filter(line => line.group === group).map(line => flowRow(line.label, 'line', flow.lines[line.key]))
  const statement: StatementRow[] = [
    { label: 'Atividades operacionais', kind: 'section' },
    ...lineRows('in'),
    flowRow('Total de entradas', 'subtotal', flow.revenue),
    ...lineRows('out'),
    flowRow('Total de saídas', 'subtotal', flow.expense.map(value => -value)),
    flowRow('Caixa operacional', 'total', flow.operating),
    { label: 'Atividades de investimento', kind: 'section' },
    ...lineRows('invest'),
    flowRow('Caixa de investimentos', 'total', flow.investing),
    { label: 'Atividades de financiamento', kind: 'section' },
    ...lineRows('finance'),
    flowRow('Caixa de financiamentos', 'total', flow.financing),
    { label: 'Resultado do caixa', kind: 'section' },
    flowRow('Variação de caixa', 'total', flow.net),
    { label: 'Saldo inicial', kind: 'balance', values: columns.map(column => flow.opening[column.months[0]]), total: flow.opening[0] },
    { label: 'Saldo final', kind: 'balance', values: columns.map(column => flow.closing[column.months[column.months.length - 1]]), total: flow.closing[11] },
  ]
  const cell = (value: number) => value === 0 ? '–' : formatNumber(value)

  return (
    <>
      <YearFilter year={year} onChange={setYear}>
        <div role="group" aria-label="Período"><span>Período</span><button className={period === 'month' ? 'active' : ''} aria-pressed={period === 'month'} onClick={() => setPeriod('month')}>Mensal</button><button className={period === 'quarter' ? 'active' : ''} aria-pressed={period === 'quarter'} onClick={() => setPeriod('quarter')}>Trimestral</button></div>
      </YearFilter>
      <section className="admin-summary-grid">
        <article><span className="admin-summary-icon receive"><CalendarDays size={20} /></span><div><small>SALDO INICIAL</small><strong>{formatMoney(flow.opening[0])}</strong><p>Em 1º de janeiro de {year}</p></div></article>
        <article><span className="admin-summary-icon revenue"><Sparkles size={20} /></span><div><small>CAIXA OPERACIONAL</small><strong>{formatMoney(sum(flow.operating))}</strong><p>Entradas menos saídas das obras</p></div></article>
        <article><span className="admin-summary-icon expense"><ClipboardCheck size={20} /></span><div><small>INVESTIMENTOS E FINANCIAMENTOS</small><strong>{formatMoney(sum(flow.investing) + sum(flow.financing))}</strong><p>Máquinas, empréstimos e lucros</p></div></article>
        <article><span className="admin-summary-icon result"><CheckCircle2 size={20} /></span><div><small>{partial ? 'SALDO FINAL PREVISTO' : 'SALDO FINAL'}</small><strong>{formatMoney(flow.closing[11])}</strong><p><b className={sum(flow.net) >= 0 ? 'delta-good' : 'delta-bad'}>{signed(change(flow.closing[11], flow.opening[0]))}</b> no ano</p></div></article>
      </section>

      <ChartCard title={`Saldo de caixa · ${year}`} subtitle={partial ? 'Saldo no fim de cada mês. Linha tracejada: previsão de out–dez.' : 'Saldo no fim de cada mês.'} table={{ head: ['Mês', 'Saldo inicial', 'Variação', 'Saldo final'], rows: MONTHS.map((month, index) => [`${month}${isProjected(year, index) ? ' (previsto)' : ''}`, formatMoney(flow.opening[index]), formatMoney(flow.net[index]), formatMoney(flow.closing[index])]) }}>
        <BalanceChart categories={MONTHS} values={flow.closing} projectedFrom={partial ? LAST_REALIZED_MONTH + 1 : undefined} />
      </ChartCard>

      <section className="admin-table-panel cashflow-statement">
        <div className="admin-panel-heading"><div><h2>Demonstrativo de fluxo de caixa · {year}</h2><p>Valores em reais. Saídas aparecem com sinal negativo.{partial ? ' Colunas marcadas como previsto ainda não foram realizadas.' : ''}</p></div></div>
        <div className="cashflow-scroll">
          <table>
            <thead><tr><th scope="col">Conta</th>{columns.map((column, index) => <th scope="col" key={column.label} className={columnProjected[index] ? 'projected' : ''}>{column.label}{columnProjected[index] && <small>previsto</small>}</th>)}<th scope="col">Total</th></tr></thead>
            <tbody>{statement.map(row => row.kind === 'section'
              ? <tr key={row.label} className="section"><th scope="colgroup" colSpan={columns.length + 2}>{row.label}</th></tr>
              : <tr key={row.label} className={row.kind}><th scope="row">{row.label}</th>{row.values!.map((value, index) => <td key={index} className={`${columnProjected[index] ? 'projected' : ''} ${value < 0 ? 'negative' : ''}`}>{cell(value)}</td>)}<td className={row.total! < 0 ? 'negative' : ''}>{cell(row.total!)}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  )
}
