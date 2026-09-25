import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Erreur récupération session:', error)
      }

      if (mounted) {
        setSession(data.session)
        setUser(data.session?.user ?? null)
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email, password) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  async function signUp(email, password) {
    return await supabase.auth.signUp({
      email,
      password,
    })
  }

  async function signOut() {
    return await supabase.auth.signOut()
  }

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider')
  }

  return context
}