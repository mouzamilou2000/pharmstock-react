import { formatDate, formatNum } from '../../utils'
import { IconMinus } from '../../icons'

export default function Sorties({ sorties, medicaments, onAdd }) {
  const getMed = (id) => medicaments.find(m => m.id === id)

  return (
    <div>
      <p className="section-sub">Enregistrez les ventes et sorties de médicaments.</p>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={onAdd}>
          <IconMinus strokeWidth={2.5} />
          Nouvelle sortie
        </button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Médicament</th><th>Quantité vendue</th><th>Motif</th><th>Montant</th></tr></thead>
            <tbody>
              {sorties.map(s => {
                const m = getMed(s.med_id)
                const montant = m && m.prix ? formatNum(s.qty * m.prix) + ' FCFA' : '—'
                return (
                  <tr key={s.id}>
                    <td>{formatDate(s.date)}</td>
                    <td>{m ? m.nom : '—'}</td>
                    <td><strong>-{s.qty}</strong></td>
                    <td>{s.motif || '—'}</td>
                    <td>{montant}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {sorties.length === 0 && (
          <div className="empty-state">
            <IconMinus />
            <div className="empty-state-title">Aucune sortie enregistrée</div>
          </div>
        )}
      </div>
    </div>
  )
}
