import { TITLES } from '../nav'
import { IconMenu, IconPlusIn } from '../icons'
import { useAuth } from '../auth/AuthContext'

export default function Topbar({ view, onMenuClick, onAddClick }) {
  const { user, signOut } = useAuth()

  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className="topbar">
      <button
        className="mobile-menu-btn"
        onClick={onMenuClick}
      >
        <IconMenu />
      </button>

      <span className="topbar-title">
        {TITLES[view] || view}
      </span>

      <span className="topbar-date">
        {date}
      </span>

      <div className="topbar-right">
        <span className="topbar-user">
          {user?.email}
        </span>

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleSignOut}
        >
          Déconnexion
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={onAddClick}
        >
          <IconPlusIn
            width={14}
            height={14}
            strokeWidth={2.5}
          />
          Ajouter
        </button>
      </div>
    </div>
  )
}