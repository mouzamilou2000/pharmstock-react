import { formatDate, isPeremptionProche } from '../../utils'
import { IconCheck } from '../../icons'

export default function Alertes({ medicaments }) {
  const critique = medicaments.filter(m => m.quantite <= m.seuil)
  const peremp = medicaments.filter(m => isPeremptionProche(m.peremption))

  return (
    <div>
      <p className="section-sub">Médicaments nécessitant une attention immédiate.</p>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">🔴 Stock critique (quantité faible)</span></div>
          <div className="card-body">
            {critique.length === 0 ? (
              <div className="empty-state" style={{ padding: 30 }}><IconCheck /><div className="empty-state-title">Aucune alerte critique</div></div>
            ) : critique.map(m => (
              <div className="alert-item" key={m.id}>
                <div className="alert-dot red" />
                <div><div className="alert-name">{m.nom}</div><div className="alert-detail">{m.categorie || ''}</div></div>
                <div className="alert-right red">Qté : {m.quantite} / min {m.seuil}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">🟡 Péremptions proches (&lt; 90 jours)</span></div>
          <div className="card-body">
            {peremp.length === 0 ? (
              <div className="empty-state" style={{ padding: 30 }}><IconCheck /><div className="empty-state-title">Aucune péremption proche</div></div>
            ) : peremp.map(m => (
              <div className="alert-item" key={m.id}>
                <div className="alert-dot gold" />
                <div><div className="alert-name">{m.nom}</div><div className="alert-detail">{m.categorie || ''}</div></div>
                <div className="alert-right gold">{formatDate(m.peremption)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
