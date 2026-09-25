import { useEffect, useState } from 'react'
import Modal from '../Modal'

const empty = { nom: '', contact: '', tel: '', adresse: '' }

export default function FournisseurModal({ open, onClose, onSave, saving }) {
  const [form, setForm] = useState(empty)

  useEffect(() => { if (open) setForm(empty) }, [open])

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function handleSave() {
    if (!form.nom.trim()) return
    onSave({
      nom: form.nom.trim(),
      contact: form.contact.trim() || null,
      tel: form.tel.trim() || null,
      adresse: form.adresse.trim() || null,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter un fournisseur"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.nom.trim()}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </>}
    >
      <div className="form-grid">
        <div className="form-group full">
          <label>Nom du fournisseur *</label>
          <input className="form-input" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Ex: Laborex Sénégal" />
        </div>
        <div className="form-group">
          <label>Contact (personne)</label>
          <input className="form-input" value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="Nom du responsable" />
        </div>
        <div className="form-group">
          <label>Téléphone</label>
          <input className="form-input" type="tel" value={form.tel} onChange={e => set('tel', e.target.value)} placeholder="+221 77 XXX XX XX" />
        </div>
        <div className="form-group full">
          <label>Adresse</label>
          <input className="form-input" value={form.adresse} onChange={e => set('adresse', e.target.value)} placeholder="Ville, quartier..." />
        </div>
      </div>
    </Modal>
  )
}
