import { IconDashboard, IconBox, IconAlert, IconPlusIn, IconMinus, IconSuppliers, IconReports } from './icons'

export const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { key: 'dashboard', label: 'Tableau de bord', icon: IconDashboard },
      { key: 'stock', label: 'Stock & Médicaments', icon: IconBox, badgeKey: 'critique' },
      { key: 'alertes', label: 'Alertes', icon: IconAlert, badgeKey: 'total' },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { key: 'entrees', label: 'Entrées de stock', icon: IconPlusIn },
      { key: 'sorties', label: 'Sorties / Ventes', icon: IconMinus },
      { key: 'fournisseurs', label: 'Fournisseurs', icon: IconSuppliers },
    ],
  },
  {
    label: 'Analyse',
    items: [
      { key: 'rapports', label: 'Rapports', icon: IconReports },
    ],
  },
]

export const BOTTOM_NAV_ITEMS = [
  { key: 'dashboard', label: 'Accueil', icon: IconDashboard },
  { key: 'stock', label: 'Stock', icon: IconBox },
  { key: 'alertes', label: 'Alertes', icon: IconAlert },
  { key: 'sorties', label: 'Ventes', icon: IconMinus },
  { key: 'rapports', label: 'Rapports', icon: IconReports },
]

export const TITLES = {
  dashboard: 'Tableau de bord',
  stock: 'Stock & Médicaments',
  alertes: 'Alertes',
  entrees: 'Entrées de stock',
  sorties: 'Sorties / Ventes',
  fournisseurs: 'Fournisseurs',
  rapports: 'Rapports',
}
