import { useEffect, useState } from 'react'
import Modal from '../Modal'

const todayStr = () => new Date().toISOString().slice(0, 10)

export default function EntreeModal({ open, onClose, medicaments, onSave, saving }) {
  const [medId, setMedId] = useState('')
  const [qty, setQty] = useState('')
  const [date, setDate] = useState(todayStr())
  const [fournisseur, setFournisseur] = useState('')
  const [lot, setLot] = useState('')

  useEffect(() => {
    if (open) { setMedId(''); setQty(''); setDate(todayStr()); setFournisseur(''); setLot('') }
  }, [open])

  function handleSave() {
    const q = parseInt(qty)
    if (!medId || !q || q <= 0) return
    onSave({ medId, qty: q, date, fournisseur: fournisseur.trim() || null, lot: lot.trim() || null })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enregistrer une entrée de stock"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !medId || !qty}>
          {saving ? 'Enregistrement…' : "Enregistrer l'entrée"}
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
          <label>Quantité reçue *</label>
          <input className="form-input" type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label>Date de réception</label>
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fournisseur</label>
          <input className="form-input" value={fournisseur} onChange={e => setFournisseur(e.target.value)} placeholder="Nom du fournisseur" />
        </div>
        <div className="form-group">
          <label>Numéro de lot</label>
          <input className="form-input" value={lot} onChange={e => setLot(e.target.value)} placeholder="LOT-XXX" />
        </div>
      </div>
    </Modal>
  )
}
