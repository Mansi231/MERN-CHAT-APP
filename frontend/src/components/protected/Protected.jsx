import React, { useEffect } from 'react'
import { ROUTES } from '../../services/routes';
import { useLocation, useNavigate } from 'react-router-dom';

const Protected = ({ Component }) => {

    const {pathname} = useLocation()
    const navigate = useNavigate()

    useEffect(() => {

        let user = JSON.parse(localStorage.getItem('userInfo'))
        switch (pathname) {
            case (ROUTES?.HOME):
                user == null  ? navigate(ROUTES?.HOME) : navigate(ROUTES?.CHATS)
                break;
            case (ROUTES?.CHATS):
                user == null  ? navigate(ROUTES?.HOME) : navigate(ROUTES?.CHATS)
                break;
            default:
                break;
        }
    }, [pathname])

    return (
        <>
            <Component />
        </>
    )
}

export default Protected
