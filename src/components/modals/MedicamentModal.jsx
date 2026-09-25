import { useEffect, useState } from 'react'
import Modal from '../Modal'
import { CATEGORIES, FORMES } from '../../utils'

const empty = {
  nom: '', categorie: '', forme: 'Comprimés', quantite: '', seuil: '',
  prix: '', peremption: '', lot: '', fournisseur: '', notes: '',
}

export default function MedicamentModal({ open, onClose, editing, onSave, saving }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) setForm(editing ? { ...empty, ...editing } : empty)
  }, [open, editing])

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function handleSave() {
    if (!form.nom.trim()) return
    onSave({
      nom: form.nom.trim(),
      categorie: form.categorie || null,
      forme: form.forme || null,
      quantite: parseInt(form.quantite) || 0,
      seuil: parseInt(form.seuil) || 5,
      prix: parseInt(form.prix) || 0,
      peremption: form.peremption || null,
      lot: form.lot.trim() || null,
      fournisseur: form.fournisseur.trim() || null,
      notes: form.notes.trim() || null,
    }, editing?.id)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Modifier le médicament' : 'Nouveau médicament'}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.nom.trim()}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </>}
    >
      <div className="form-grid">
        <div className="form-group full">
          <label>Nom du médicament *</label>
          <input className="form-input" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Ex: Amoxicilline 500mg" />
        </div>
        <div className="form-group">
          <label>Catégorie *</label>
          <select className="form-select" value={form.categorie} onChange={e => set('categorie', e.target.value)}>
            <option value="">Sélectionner...</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Forme</label>
          <select className="form-select" value={form.forme} onChange={e => set('forme', e.target.value)}>
            {FORMES.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Quantité en stock *</label>
          <input className="form-input" type="number" min="0" value={form.quantite} onChange={e => set('quantite', e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label>Seuil minimum d'alerte *</label>
          <input className="form-input" type="number" min="0" value={form.seuil} onChange={e => set('seuil', e.target.value)} placeholder="10" />
        </div>
        <div className="form-group">
          <label>Prix unitaire (FCFA)</label>
          <input className="form-input" type="number" min="0" value={form.prix} onChange={e => set('prix', e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label>Date de péremption</label>
          <input className="form-input" type="date" value={form.peremption || ''} onChange={e => set('peremption', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Numéro de lot</label>
          <input className="form-input" value={form.lot} onChange={e => set('lot', e.target.value)} placeholder="Ex: LOT-2024-001" />
        </div>
        <div className="form-group">
          <label>Fournisseur</label>
          <input className="form-input" value={form.fournisseur} onChange={e => set('fournisseur', e.target.value)} placeholder="Nom du fournisseur" />
        </div>
        <div className="form-group full">
          <label>Notes / Remarques</label>
          <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Informations supplémentaires..." />
        </div>
      </div>
    </Modal>
  )
}
