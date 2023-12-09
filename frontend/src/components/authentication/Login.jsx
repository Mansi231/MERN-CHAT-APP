import React, { useContext, useState } from 'react'
import { client } from '../../services/client';
import { AuthContext } from '../../context/AuthProvider';
import Spinner from '../reusable/Spinner';
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../services/routes';
import {apiLogin} from '../../redux/actions/ChatAction'
import  {useDispatch} from 'react-redux'

const Login = () => {

    const [showPass, setShowPass] = useState(false);
    const [fields, setFields] = useState({ email: '', password: '' })
    const { loading, setLoading } = useContext(AuthContext)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const showToast = () => {
        let isToastOpen = true;

        toast.success('Loggged in Successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: (props) => {
                if (isToastOpen){
                    navigate(ROUTES?.CHATS)
                }
                else {
                    
                    isToastOpen = false;
                    // Add your custom logic for actual close here
                }
            },
        });
    }

    const handleLogin = async () => {
        setLoading(true)
        if (fields?.email && fields?.password) dispatch(apiLogin(fields,showToast,setLoading))
    }

    const getCredential = () => {
        setFields({ email: 'guest@example.com', password: '123456' })
    }

    return (
        <div className='flex flex-col gap-3 w-full mt-6'>
            <p className='text-gray-900'>Email Address <span className='text-red-600'>*</span></p>
            <input value={fields?.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} placeholder='Enter Email Address' type="email" className='border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm' />

            <p className='text-gray-900'>Password <span className='text-red-600'>*</span></p>
            <div className='relative flex flex-row justify-between gap-3'>
                <input value={fields?.password} onChange={(e) => setFields({ ...fields, password: e.target.value })} placeholder='Enter Password' type={!showPass ? 'password' : 'text'} className='flex-grow border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm' />
                <i className={`${showPass ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} my-auto hover:cursor-pointer text-lg`} onClick={() => setShowPass(!showPass)}></i>
            </div>

            <button className='bg-sky-500 rounded p-2 text-white text-sm subpixel-antialiased flex justify-center align-middle gap-2' onClick={handleLogin}>
                {loading && <Spinner />}  Login
            </button>
            <button className='bg-red-400 rounded p-2 text-white text-sm subpixel-antialiased' onClick={getCredential}>Get Guest User Credential</button>
            <ToastContainer />
        </div>
    )
}

export default Login
