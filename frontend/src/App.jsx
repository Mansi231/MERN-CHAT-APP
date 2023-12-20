import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import { ROUTES } from './services/routes'
import AuthProvider from './context/AuthProvider'
import "react-toastify/dist/ReactToastify.css";
import ChatProvider from './context/ChatProvider'
import Protected from './components/protected/Protected'
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [count, setCount] = useState(0)

  let clientId = '606117439456-84c768hmuvomgk8j5jl0o7qur84u74v9.apps.googleusercontent.com'
  let clientSecret = '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'
  let apiey = 'AIzaSyDIZSY67W9WKnxNVXe41CwkvdZKbWTOPSw'

  return (
    <div className='flex min-h-screen bg-[url("/background.png")] bg-cover	bg-center	w-screen relative'>
      <AuthProvider>
        <ChatProvider>
          <GoogleOAuthProvider clientId={clientId}>
            <Routes>
              <Route path={ROUTES.HOME} element={<Protected Component={Home} />} />
              <Route path={ROUTES.CHATS} element={<Protected Component={Chat} />} />
            </Routes>
          </GoogleOAuthProvider>
        </ChatProvider>
      </AuthProvider>
    </div>
  )
}

export default App
