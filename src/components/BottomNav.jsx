import { BOTTOM_NAV_ITEMS } from '../nav'

export default function BottomNav({ view, setView }) {
  return (
    <div className="bottom-nav">
      {BOTTOM_NAV_ITEMS.map(item => {
        const Icon = item.icon
        return (
          <button
            key={item.key}
            className={'bottom-nav-item' + (view === item.key ? ' active' : '')}
            onClick={() => setView(item.key)}
          >
            <Icon />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
