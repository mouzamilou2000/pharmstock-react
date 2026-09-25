import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function Login({ onRegister }) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setLoading(true)

    const { error: signInError } = await signIn(email, password)

    setLoading(false)

    if (signInError) {
      setError('Email ou mot de passe incorrect.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">💊</div>
          <div>
            <div className="auth-logo-name">PharmStock</div>
            <div className="auth-logo-sub">Gestion de pharmacie</div>
          </div>
        </div>

        <div className="auth-header">
          <h1>Connexion</h1>
          <p>Connectez-vous à votre espace PharmStock</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Adresse email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Mot de passe</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-switch">
          Vous n'avez pas encore de compte ?
          <button type="button" onClick={onRegister}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  )
}