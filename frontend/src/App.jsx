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

  function App() {
    const [count, setCount] = useState(0)

    return (
      <div className='flex min-h-screen bg-[url("/background.png")] bg-cover	bg-center	w-screen relative'>
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route path={ROUTES.HOME} element={<Protected Component={Home}/>} />
              <Route path={ROUTES.CHATS} element={<Protected Component={Chat}/>} />
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </div>
    )
  }

  export default App
