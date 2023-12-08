import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    return (
        <AuthContext.Provider value={{loading,setLoading}}>{children}</AuthContext.Provider>
    )
}

export default AuthProvider
