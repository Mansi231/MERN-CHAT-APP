import React, { useState } from 'react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'

const Home = () => {

    const [activeTab, setActiveTab] = useState(1)

    return (
        <div className='container justify-center w-screen mx-auto'>
            <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-lg py-4 px-3 justify-center mt-7 mb-3">
                <p className='text-center font-mono text-2xl'>Talk-A-Tive</p>
            </div>
            <div className='max-w-lg mx-auto bg-white shadow-2xl rounded-lg justify-center p-5'>
                <div className='flex justify-between align-middle w-full gap-2'> 
                    <button className={`w-1/2 ${activeTab == 1 ? 'bg-sky-100' : ''} p-2 rounded-full font-sans tracking-widest shadow-inner`} onClick={() => setActiveTab(1)}>Login</button>
                    <button className={`w-1/2 ${activeTab == 2 ? 'bg-sky-100' : ''} p-2 rounded-full font-sans tracking-widest shadow-inner`} onClick={() => setActiveTab(2)}>Sign Up</button>
                </div>
                {activeTab == 1 ? <Login /> : <Signup />}
            </div>
        </div>
    )
}

export default Home
