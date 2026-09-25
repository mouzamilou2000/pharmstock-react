import { NAV_SECTIONS } from '../nav'

export default function Sidebar({ view, setView, open, onClose, critiqueCount, alertesCount }) {
  const counts = { critique: critiqueCount, total: alertesCount }

  return (
    <>
      <div className={'sidebar' + (open ? ' open' : '')} id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">💊</div>
            <div>
              <div className="logo-name">PharmStock</div>
              <div className="logo-sub">Gestion de pharmacie</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map(item => {
                const Icon = item.icon
                const count = item.badgeKey ? counts[item.badgeKey] : 0
                return (
                  <button
                    key={item.key}
                    className={'nav-item' + (view === item.key ? ' active' : '')}
                    onClick={() => { setView(item.key); onClose() }}
                  >
                    <Icon />
                    {item.label}
                    {item.badgeKey && count > 0 && <span className="nav-badge">{count}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="pharmacist-card">
            <div className="pharmacist-avatar">PH</div>
            <div>
              <div className="pharmacist-name">Pharmacien</div>
              <div className="pharmacist-role">Administrateur</div>
            </div>
          </div>
        </div>
      </div>

      <div className={'sidebar-overlay' + (open ? ' show' : '')} onClick={onClose} />
    </>
  )
}
