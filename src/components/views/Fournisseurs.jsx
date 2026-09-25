import { IconPlusIn, IconSuppliers } from '../../icons'

export default function Fournisseurs({ fournisseurs, onAdd, onDelete }) {
  return (
    <div>
      <p className="section-sub">Gérez vos fournisseurs et distributeurs pharmaceutiques.</p>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={onAdd}>
          <IconPlusIn strokeWidth={2.5} />
          Ajouter fournisseur
        </button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nom</th><th>Contact</th><th>Téléphone</th><th>Adresse</th><th>Actions</th></tr></thead>
            <tbody>
              {fournisseurs.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.nom}</strong></td>
                  <td>{f.contact || '—'}</td>
                  <td>{f.tel || '—'}</td>
                  <td>{f.adresse || '—'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => onDelete(f)}>Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {fournisseurs.length === 0 && (
          <div className="empty-state">
            <IconSuppliers />
            <div className="empty-state-title">Aucun fournisseur enregistré</div>
          </div>
        )}
      </div>
    </div>
  )
}
