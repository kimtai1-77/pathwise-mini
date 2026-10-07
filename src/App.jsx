import { useState } from 'react'
import LoginForm from './LoginForm.jsx'
import { BtnSecondary } from './components/ui/buttons/btn-secondary.jsx'
import './App.css'

function App() {
  // Track the current user session (null means logged out)
  const [user, setUser] = useState(null)

  return (
      <div className='app-cont'>
        {user? (
          <div className='dashboard-view'>
            <h2>Welcome to your Dashboard!</h2>
            {/* Render your main app content or router here */}
            <BtnSecondary onClick={() => setUser(null)}>Logout</BtnSecondary>
          </div>

        ) : (
          // pass a callback down to handle successful login
          <LoginForm onLoginSuccess={(userData) => setUser(userData)} />
        )}
      </div>
    )
}

export default App
