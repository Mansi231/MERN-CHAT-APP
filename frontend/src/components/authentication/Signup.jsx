import React, { useContext, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { client } from '../../services/client';
import { AuthContext } from '../../context/AuthProvider';
import Spinner from '../reusable/Spinner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../services/routes';
import { apiRegister, apiSocialLogin } from '../../redux/actions/ChatAction';
import { useDispatch } from 'react-redux';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Signup = () => {

    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [fields, setFields] = useState({ name: '', email: '', password: '', confirmpassword: '', pic: {} })

    const { loading, setLoading } = useContext(AuthContext);
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const showToast = () => {
        let isToastOpen = true;

        toast.success('Registered Successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: (props) => {
                if (isToastOpen) {
                    navigate(ROUTES?.CHATS)
                }
                else {
                    isToastOpen = false;
                    // Add your custom logic for actual close here
                }
            },
        });
    }

    const submitHandler = async () => {
        setLoading(true)
        if (fields?.password != fields?.confirmpassword) {
            toast.error('password and confirm password should be same!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setLoading(false);
        }
        else if (fields) {
            let formData = new FormData()
            formData.append('name', fields?.name);
            formData.append('email', fields?.email);
            formData.append('password', fields?.password);
            formData.append('pic', fields?.pic);

            dispatch(apiRegister(formData, showToast, setLoading))
            apiRegister(formData, showToast, setLoading)
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialResponse?.access_token}`)
                .then(async (res) => {
                    const { name, email, picture } = res?.data
                    await dispatch(apiSocialLogin({ name: name, email: email, pic: picture, token: credentialResponse?.access_token }, showToast, setLoading))
                })
                .catch((err) => console.log(err));
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    return (
        <div className='flex flex-col gap-3 w-full mt-6'>

            <p className='text-gray-900'>Name <span className='text-red-600'>*</span></p>
            <input value={fields?.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} placeholder='Enter Name' type="text" className='border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm' />

            <p className='text-gray-900'>Email Address <span className='text-red-600'>*</span></p>
            <input value={fields?.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} placeholder='Enter Email Address' type="email" className='border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm' />

            <p className='text-gray-900'>Password <span className='text-red-600'>*</span></p>
            <div className='relative flex flex-row justify-between gap-3'>
                <input value={fields?.password} onChange={(e) => setFields({ ...fields, password: e.target.value })} placeholder='Enter Password' type={!showConfirmPass ? 'password' : 'text'} className='flex-grow border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm' />
                <i className={`${showConfirmPass ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} my-auto hover:cursor-pointer text-lg`} onClick={() => setShowConfirmPass(!showConfirmPass)}></i>
            </div>

            <p className='text-gray-900'>Confirm Password <span className='text-red-600'>*</span></p>
            <div className='relative flex flex-row justify-between gap-3'>
                <input value={fields?.confirmpassword} onChange={(e) => setFields({ ...fields, confirmpassword: e.target.value })} placeholder='Confirm Password' type={!showConfirmPass ? 'password' : 'text'} className='flex-grow border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm' />
                <i className={`${showConfirmPass ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} my-auto hover:cursor-pointer text-lg`} onClick={() => setShowConfirmPass(!showConfirmPass)}></i>
            </div>

            <p className='text-gray-900'>Upload Profile Picture <span className='text-red-600'>*</span></p>
            <input onChange={(e) => setFields({ ...fields, pic: e.target.files[0] })} type="file" className='border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm file:mr-4 file:py-1 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-sky-50 file:text-sky-700
                    hover:file:bg-sky-100'
            />

            <button className='bg-sky-500 rounded p-2 text-white text-sm subpixel-antialiased flex justify-center items-center' onClick={submitHandler}>{loading && <Spinner />}Sign Up</button>
            <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <button onClick={() => googleLogin()}
                className='bg-blue-500 rounded-md py-1 w-full px-2 self-center justify-center flex gap-2 items-center shadow-md shadow-blue-300 shadow-inner border-blue-400 border'>
                <img src="/google.png" alt="image" className='rounded-md w-8 h-8 object-cover' />
                <p className='text-white text-sm subpixel-antialiased'>SignIn With Google</p>
            </button>
            <ToastContainer />

        </div>
    )
}

export default Signup
