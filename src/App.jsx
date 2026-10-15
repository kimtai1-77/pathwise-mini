import { useEffect, useState } from 'react'
import LoginForm from "@/components/logging_in/login-form.jsx"
import SignUpForm from "@/components/logging_in/sign-up-form.jsx"
import ForgotPasswordForm from '@/components/logging_in/forgotPasswordForm.jsx'
import UpdatePasswordForm from '@/components/logging_in/updatePasswordForm.jsx'
import MspDash from '@/components/screens/mspDash.jsx'
import { safeNextPath } from '@/lib/safe-next-path.js'
import { supabase } from '@/lib/supabaseClient.js'
import './App.css'

function App() {
  const [view, setView] = useState(() => {
    const auth = new URLSearchParams(window.location.search).get('auth')
    if (auth === 'confirmed') return 'sign-in'
    if (auth === 'update-password' || window.location.pathname === '/update-password') return 'update-password'
    return 'sign-up'
  })
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get('auth') === 'confirmed') {
      url.searchParams.delete('auth')
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
      supabase.auth.signOut()
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setView('update-password')
      if (event === 'SIGNED_OUT') setView('sign-in')
      setUser(session?.user ?? null)
      setAuthReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLoginSuccess = (userData) => {
    const next = new URLSearchParams(window.location.search).get('next')
    if (next) {
      window.location.href = safeNextPath(next, '/')
      return
    }
    setUser(userData)
  }

  const handlePasswordUpdated = (userData) => {
    window.history.replaceState(null, '', window.location.pathname)
    setUser(userData)
    setView('sign-in')
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) throw error
    setUser(null)
    setView('sign-in')
  }

  return (
      <div className='app-cont'>
        {!authReady ? (
          <p role='status'>Loading your workspace...</p>
        ) : view === 'update-password' ? (
          <UpdatePasswordForm
            onPasswordUpdated={handlePasswordUpdated}
            onSignInClick={(event) => {
              event.preventDefault()
              setView('sign-in')
            }}
          />
        ) : user ? (
          <MspDash user={user} onSignOut={handleSignOut} />
        ) : view === 'forgot-password' ? (
          <ForgotPasswordForm onSignInClick={(event) => {
            event.preventDefault()
            setView('sign-in')
          }} />
        ) : view === 'sign-in' ? (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onForgotPasswordClick={(event) => {
              event.preventDefault()
              setView('forgot-password')
            }}
            onSignUpClick={(event) => {
              event.preventDefault()
              setView('sign-up')
            }}
          />
        ) : (
          <SignUpForm onSignInClick={(event) => {
            event.preventDefault()
            setView('sign-in')
          }} />
        )}
      </div>
    )
}

export default App
