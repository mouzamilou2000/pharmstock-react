import { useEffect, useState } from 'react'
import Modal from '../Modal'

const todayStr = () => new Date().toISOString().slice(0, 10)
const MOTIFS = ['Vente', 'Ordonnance', 'Périmé / Retrait', 'Don / Autre']

export default function SortieModal({ open, onClose, medicaments, onSave, saving }) {
  const [medId, setMedId] = useState('')
  const [qty, setQty] = useState('')
  const [date, setDate] = useState(todayStr())
  const [motif, setMotif] = useState('Vente')

  useEffect(() => {
    if (open) { setMedId(''); setQty(''); setDate(todayStr()); setMotif('Vente') }
  }, [open])

  const selected = medicaments.find(m => m.id === medId)
  const insuffisant = selected && parseInt(qty) > selected.quantite

  function handleSave() {
    const q = parseInt(qty)
    if (!medId || !q || q <= 0 || insuffisant) return
    onSave({ medId, qty: q, date, motif })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enregistrer une sortie / vente"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !medId || !qty || insuffisant}>
          {saving ? 'Enregistrement…' : 'Enregistrer la sortie'}
        </button>
      </>}
    >
      <div className="form-grid">
        <div className="form-group full">
          <label>Médicament *</label>
          <select className="form-select" value={medId} onChange={e => setMedId(e.target.value)}>
            <option value="">{medicaments.length === 0 ? 'Aucun médicament enregistré' : 'Sélectionner un médicament...'}</option>
            {medicaments.map(m => <option key={m.id} value={m.id}>{m.nom} (qté: {m.quantite})</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Quantité *</label>
          <input className="form-input" type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" />
          {insuffisant && <span style={{ color: 'var(--red)', fontSize: 12 }}>Stock insuffisant (disponible : {selected.quantite})</span>}
        </div>
        <div className="form-group">
          <label>Date</label>
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group full">
          <label>Motif</label>
          <select className="form-select" value={motif} onChange={e => setMotif(e.target.value)}>
            {MOTIFS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  )
}
