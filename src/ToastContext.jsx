import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

let uidCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const toast = useCallback((msg, type = '') => {
    const id = ++uidCounter
    setToasts(t => [...t, { id, msg, type, show: false }])
    // déclenche la transition d'entrée
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts(t => t.map(x => x.id === id ? { ...x, show: true } : x))
      })
    })
    timers.current[id] = setTimeout(() => {
      setToasts(t => t.map(x => x.id === id ? { ...x, show: false } : x))
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 300)
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={'toast' + (t.type ? ' ' + t.type : '') + (t.show ? ' show' : '')}>
            <ToastIcon type={t.type} />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastIcon({ type }) {
  if (type === 'success') return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  if (type === 'error') return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être utilisé dans un <ToastProvider>')
  return ctx
}
