import { useState } from 'react'
import BorderGlow from '../components/BorderGlow'
import InputField from '../components/ui/InputField'
import useAuth from '../hooks/useAuth'

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error, setUser } = useAuth()

  const handleLogin = async () => {
    const user = await login({ username, password })
    if (user) {
      console.log('Login berhasil:', user)
      setUser(user)
      onLoginSuccess(user)
      // navigate('/dashboard') ← nanti pakai react-router
    }
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <BorderGlow
        glowColor="220 80 80"
        backgroundColor="#0d0d1a"
        borderRadius={24}
        glowRadius={40}
        glowIntensity={1.2}
        coneSpread={25}
        colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
        className="w-80"
      >
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
              Selamat Datang
            </h2>
            <p style={{ color: '#8888aa', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Masuk ke akun Anda
            </p>
          </div>

          <InputField
            label="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="username kamu"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              background: loading ? '#333' : 'linear-gradient(135deg, #5227FF, #A6C8FF)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.75rem',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </div>
      </BorderGlow>
    </div>
  )
}

export default LoginPage