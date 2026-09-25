export function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleDateString('fr-FR')
}

export function formatNum(n) {
  return Number(n || 0).toLocaleString('fr-FR')
}

export function expiryClass(dateStr) {
  if (!dateStr) return ''
  const diff = (new Date(dateStr) - new Date()) / 86400000
  if (diff < 0) return 'expiry-bad'
  if (diff <= 30) return 'expiry-bad'
  if (diff <= 90) return 'expiry-warn'
  return 'expiry-ok'
}

export function isPeremptionProche(dateStr, days = 90) {
  if (!dateStr) return false
  return (new Date(dateStr) - new Date()) / 86400000 <= days
}

export const CATEGORIES = [
  'Antibiotiques', 'Analgésiques', 'Antipaludéens', 'Vitamines',
  'Gastro-entérologie', 'Dermatologie', 'Autre',
]

export const FORMES = [
  'Comprimés', 'Gélules', 'Sirop', 'Ampoules', 'Pommade', 'Gouttes', 'Sachet', 'Autre',
]
