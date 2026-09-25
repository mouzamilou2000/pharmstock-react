import { useMemo, useState } from 'react'
import { CATEGORIES, formatDate, formatNum, expiryClass } from '../../utils'
import { IconSearch, IconPlusIn, IconBox, IconPrint } from '../../icons'
import StatutBadge from '../StatutBadge'

export default function Stock({ medicaments, onAdd, onEdit, onDelete, onDetail }) {
  const [text, setText] = useState('')
  const [cat, setCat] = useState('')

  const list = useMemo(() => {
    let l = medicaments
    if (text) l = l.filter(m => m.nom.toLowerCase().includes(text.toLowerCase()))
    if (cat) l = l.filter(m => m.categorie === cat)
    return l
  }, [medicaments, text, cat])

  const valeurTotale = list.reduce((s, m) => s + m.quantite * (m.prix || 0), 0)
  const dateImpression = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      <p className="section-sub no-print">Gérez l'ensemble de vos médicaments et produits pharmaceutiques.</p>
      <div className="toolbar no-print">
        <div className="search-wrap">
          <IconSearch />
          <input className="search-input" placeholder="Rechercher un médicament..." value={text} onChange={e => setText(e.target.value)} />
        </div>
        <select className="filter-select" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          <IconPrint />
          Imprimer / PDF
        </button>
        <button className="btn btn-primary" onClick={onAdd}>
          <IconPlusIn strokeWidth={2.5} />
          Nouveau médicament
        </button>
      </div>

      {/* En-tête visible uniquement à l'impression / export PDF */}
      <div className="print-header">
        <div className="print-header-title">💊 PharmStock — Inventaire du stock</div>
        <div className="print-header-meta">
          Édité le {dateImpression}
          {cat && ` · Catégorie : ${cat}`}
          {text && ` · Recherche : "${text}"`}
          {' · '}{list.length} référence{list.length > 1 ? 's' : ''}
          {' · Valeur totale : '}{formatNum(valeurTotale)} FCFA
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Médicament</th><th>Catégorie</th><th>Quantité</th><th>Seuil min.</th>
                <th>Prix unitaire</th><th>Péremption</th><th>Statut</th><th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.nom}</strong>{m.forme && <><br /><small style={{ color: 'var(--text-soft)' }}>{m.forme}</small></>}</td>
                  <td>{m.categorie || '—'}</td>
                  <td><strong>{m.quantite}</strong></td>
                  <td>{m.seuil}</td>
                  <td>{m.prix ? formatNum(m.prix) + ' FCFA' : '—'}</td>
                  <td className={expiryClass(m.peremption)}>{formatDate(m.peremption)}</td>
                  <td><StatutBadge m={m} /></td>
                  <td className="no-print" style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onDetail(m)}>Détail</button>{' '}
                    <button className="btn btn-secondary btn-sm" onClick={() => onEdit(m)}>Modifier</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(m)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && (
          <div className="empty-state no-print">
            <IconBox />
            <div className="empty-state-title">Aucun médicament enregistré</div>
            <div className="empty-state-text">Cliquez sur "Nouveau médicament" pour commencer</div>
          </div>
        )}
      </div>
    </div>
  )
}
