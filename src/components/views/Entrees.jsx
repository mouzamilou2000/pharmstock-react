import { formatDate } from '../../utils'
import { IconPlusIn } from '../../icons'

export default function Entrees({ entrees, medicaments, onAdd }) {
  const medName = (id) => medicaments.find(m => m.id === id)?.nom || '—'

  return (
    <div>
      <p className="section-sub">Enregistrez les livraisons et approvisionnements reçus.</p>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={onAdd}>
          <IconPlusIn strokeWidth={2.5} />
          Nouvelle entrée
        </button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Médicament</th><th>Quantité reçue</th><th>Fournisseur</th><th>N° Lot</th></tr></thead>
            <tbody>
              {entrees.map(e => (
                <tr key={e.id}>
                  <td>{formatDate(e.date)}</td>
                  <td>{medName(e.med_id)}</td>
                  <td><strong>+{e.qty}</strong></td>
                  <td>{e.fournisseur || '—'}</td>
                  <td>{e.lot || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {entrees.length === 0 && (
          <div className="empty-state">
            <IconPlusIn />
            <div className="empty-state-title">Aucune entrée enregistrée</div>
          </div>
        )}
      </div>
    </div>
  )
}
