export default function StatutBadge({ m }) {
  if (m.quantite === 0) return <span className="badge badge-red">Épuisé</span>
  if (m.quantite <= m.seuil) return <span className="badge badge-gold">Critique</span>
  return <span className="badge badge-green">En stock</span>
}
