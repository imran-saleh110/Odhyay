import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/users/profile')
                setUser(res.data)
            }
            catch (err) {
                setUser(null)
            }
            finally {
                setLoading(false)
            }
    }

    useEffect(() => {
            fetchProfile()
    }, []);

    const signin = async (values) => {
            await axios.post('/api/auth/login', values)
            await fetchProfile()
    }

    const signout = async () => {
            try {
                await axios.post('/api/auth/logout')
            }
            finally {
                setUser(null)
            }
    }

    const value = {
        user,
        isAuthenticated: !!user,  //boolean
        loading,
        signin,
        signout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}