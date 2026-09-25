import Modal from '../Modal'
import { formatDate, formatNum, expiryClass } from '../../utils'

export default function DetailModal({ open, onClose, medicament, onEdit }) {
  if (!medicament) return null
  const m = medicament
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={m.nom}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
        <button className="btn btn-primary" onClick={() => { onClose(); onEdit(m) }}>Modifier</button>
      </>}
    >
      <div className="mini-grid">
        <div className="mini-card"><div className="mini-label">Catégorie</div><div className="mini-value" style={{ fontSize: 15 }}>{m.categorie || '—'}</div></div>
        <div className="mini-card"><div className="mini-label">Forme</div><div className="mini-value" style={{ fontSize: 15 }}>{m.forme || '—'}</div></div>
        <div className="mini-card"><div className="mini-label">Quantité</div><div className="mini-value" style={{ color: m.quantite <= m.seuil ? 'var(--red)' : 'var(--green)' }}>{m.quantite}</div></div>
        <div className="mini-card"><div className="mini-label">Seuil min.</div><div className="mini-value">{m.seuil}</div></div>
        <div className="mini-card"><div className="mini-label">Prix unitaire</div><div className="mini-value" style={{ fontSize: 15 }}>{m.prix ? formatNum(m.prix) + ' FCFA' : '—'}</div></div>
        <div className="mini-card"><div className="mini-label">Valeur stock</div><div className="mini-value" style={{ fontSize: 15 }}>{m.prix ? formatNum(m.quantite * m.prix) + ' FCFA' : '—'}</div></div>
      </div>
      <div style={{ marginTop: 16, padding: 14, background: 'var(--bg)', borderRadius: 8, fontSize: 13 }}>
        <div style={{ marginBottom: 8 }}><strong>N° de lot :</strong> {m.lot || '—'}</div>
        <div style={{ marginBottom: 8 }}><strong>Fournisseur :</strong> {m.fournisseur || '—'}</div>
        <div style={{ marginBottom: m.notes ? 8 : 0 }}><strong>Date de péremption :</strong> <span className={expiryClass(m.peremption)}>{formatDate(m.peremption)}</span></div>
        {m.notes && <div><strong>Notes :</strong> {m.notes}</div>}
      </div>
    </Modal>
  )
}
