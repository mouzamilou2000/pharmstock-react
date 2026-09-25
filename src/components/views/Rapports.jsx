import { useMemo } from 'react'
import { formatNum } from '../../utils'

export default function Rapports({ medicaments, entrees, sorties }) {
  const now = new Date()
  const valeur = medicaments.reduce((s, m) => s + m.quantite * (m.prix || 0), 0)
  const critique = medicaments.filter(m => m.quantite <= m.seuil).length
  const moisActuel = now.getMonth() + '-' + now.getFullYear()
  const entreesMois = entrees.filter(e => {
    const d = new Date(e.date)
    return (d.getMonth() + '-' + d.getFullYear()) === moisActuel
  }).length

  const parCategorie = useMemo(() => {
    const cats = {}
    medicaments.forEach(m => { cats[m.categorie || 'Autre'] = (cats[m.categorie || 'Autre'] || 0) + 1 })
    return Object.entries(cats).sort((a, b) => b[1] - a[1])
  }, [medicaments])
  const total = medicaments.length || 1

  const topVentes = useMemo(() => {
    const ventes = {}
    sorties.forEach(s => { ventes[s.med_id] = (ventes[s.med_id] || 0) + s.qty })
    return Object.entries(ventes).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [sorties])

  return (
    <div>
      <p className="section-sub">Analyse et statistiques de votre stock pharmaceutique.</p>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card green"><div className="stat-label">Total médicaments</div><div className="stat-value">{medicaments.length}</div></div>
        <div className="stat-card blue"><div className="stat-label">Valeur totale stock</div><div className="stat-value">{formatNum(valeur)}</div><div className="stat-sub">FCFA</div></div>
        <div className="stat-card red"><div className="stat-label">Stock critique</div><div className="stat-value">{critique}</div></div>
        <div className="stat-card gold"><div className="stat-label">Entrées ce mois</div><div className="stat-value">{entreesMois}</div></div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">Stock par catégorie</span></div>
          <div className="card-body" style={{ padding: 16 }}>
            {parCategorie.length === 0 ? (
              <div className="empty-state" style={{ padding: 30 }}><div className="empty-state-text">Aucune donnée</div></div>
            ) : parCategorie.map(([cat, n]) => (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                  <span>{cat}</span><span style={{ fontWeight: 600 }}>{n}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: Math.round(n / total * 100) + '%', background: 'var(--green)' }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Top 5 — médicaments plus vendus</span></div>
          <div className="card-body" style={{ padding: 16 }}>
            {topVentes.length === 0 ? (
              <div className="empty-state" style={{ padding: 30 }}><div className="empty-state-text">Enregistrez des sorties pour voir les statistiques</div></div>
            ) : topVentes.map(([id, qty], i) => {
              const m = medicaments.find(x => x.id === id)
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--green-light)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m ? m.nom : '—'}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>{qty} vendus</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
