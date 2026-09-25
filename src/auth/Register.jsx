import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function Register({ onLogin }) {
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await signUp(email, password)

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      return
    }

    setMessage(
      'Compte créé. Vérifiez votre adresse email pour confirmer votre inscription.'
    )
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
          <h1>Créer un compte</h1>
          <p>Créez votre compte PharmStock</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-email">Adresse email</label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Mot de passe</label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm">
              Confirmer le mot de passe
            </label>
            <input
              id="register-confirm"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-switch">
          Vous avez déjà un compte ?
          <button type="button" onClick={onLogin}>
            Se connecter
          </button>
        </div>
      </div>
    </div>
  )
}