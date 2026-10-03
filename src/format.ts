const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })

export const formatNumber = (value: number) => `${value < 0 ? '−' : ''}${integer.format(Math.abs(value))}`

export const formatMoney = (value: number) => `${value < 0 ? '−' : ''}R$ ${integer.format(Math.abs(value))}`

export const formatCompactMoney = (value: number) => {
  const amount = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  if (amount >= 1_000_000) return `${sign}R$ ${(amount / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mi`
  if (amount >= 1_000) return `${sign}R$ ${integer.format(Math.round(amount / 1_000))} mil`
  return `${sign}R$ ${integer.format(amount)}`
}

export const formatPercent = (value: number) => `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`

export const initialsOf = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase()
