import { formatDate, formatNum, isPeremptionProche } from '../../utils'
import { IconBox, IconWarn, IconClock, IconCoin, IconCheck } from '../../icons'
import StatutBadge from '../StatutBadge'

export default function Dashboard({ medicaments, setView }) {
  const critique = medicaments.filter(m => m.quantite <= m.seuil)
  const peremp = medicaments.filter(m => isPeremptionProche(m.peremption))
  const valeur = medicaments.reduce((s, m) => s + m.quantite * (m.prix || 0), 0)
  const alertItems = [
    ...critique.map(m => ({ m, type: 'critique' })),
    ...peremp.map(m => ({ m, type: 'peremp' })),
  ].slice(0, 6)
  const recent = [...medicaments].slice(-5).reverse()

  return (
    <div>
      <p className="section-sub">Voici un aperçu de votre pharmacie aujourd'hui.</p>

      <div className="stats-grid">
        <StatCard color="green" label="Total médicaments" value={medicaments.length} sub="références en stock" Icon={IconBox} />
        <StatCard color="red" label="Stock critique" value={critique.length} sub="médicaments urgents" Icon={IconWarn} />
        <StatCard color="gold" label="Péremptions proches" value={peremp.length} sub="dans les 90 jours" Icon={IconClock} />
        <StatCard color="blue" label="Valeur du stock" value={formatNum(valeur)} sub="FCFA estimés" Icon={IconCoin} />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">🔴 Alertes de stock</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setView('alertes')}>Voir tout</button>
          </div>
          <div className="card-body">
            {alertItems.length === 0 ? (
              <div className="empty-state">
                <IconCheck />
                <div className="empty-state-title">Aucune alerte</div>
                <div className="empty-state-text">Votre stock est en bon état</div>
              </div>
            ) : alertItems.map(({ m, type }) => (
              <div className="alert-item" key={m.id + type}>
                <div className={'alert-dot ' + (type === 'critique' ? 'red' : 'gold')} />
                <div>
                  <div className="alert-name">{m.nom}</div>
                  <div className="alert-detail">
                    {type === 'critique' ? `Quantité : ${m.quantite} (seuil : ${m.seuil})` : `Péremption : ${formatDate(m.peremption)}`}
                  </div>
                </div>
                <div className={'alert-right ' + (type === 'critique' ? 'red' : 'gold')}>
                  {type === 'critique' ? 'CRITIQUE' : 'EXPIRE BIENTÔT'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">📦 Médicaments récents</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setView('stock')}>Voir tout</button>
          </div>
          <div className="card-body">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Médicament</th><th>Qté</th><th>Statut</th></tr></thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-soft)', padding: 20 }}>Aucun médicament</td></tr>
                  ) : recent.map(m => (
                    <tr key={m.id}>
                      <td><strong>{m.nom}</strong><br /><small style={{ color: 'var(--text-soft)' }}>{m.forme || ''}</small></td>
                      <td>{m.quantite}</td>
                      <td><StatutBadge m={m} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ color, label, value, sub, Icon }) {
  return (
    <div className={'stat-card ' + color}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
      <div className="stat-icon"><Icon /></div>
    </div>
  )
}
