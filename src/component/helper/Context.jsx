'use client'
import { createContext, useState, useEffect } from "react";
import axios from "axios";


export const Context = createContext()


const catg = [
    {
        id: 1,
        category: 'Phone',
        subcategory: [
            "Samsung", 'Apple', 'Symphony'
        ]
    },
    {
        id: 2,
        category: 'Laptop',
        subcategory: [
            'Hp', 'Dell', 'Lenevo'
        ]
    },
    {
        id: 3,
        category: 'Camera',
        subcategory: [
            'Canon', 'Nikon'
        ]
    }
]

const ContextProvider = ({ children }) => {

    const [categories, setCategories] = useState(catg)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    

    const [cartBar, setCartBar]=useState(false)
    const [menuBar, setMenuBar]=useState(false)
    const [userSidebar, setUserSidebar]=useState(false)
    const [dashSidebar, setDashSidebar]=useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user');
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user session:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await axios.post('/api/user/logout');
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    const contextValue = {
        categories,
        cartBar, setCartBar,menuBar, setMenuBar,userSidebar, setUserSidebar,dashSidebar, setDashSidebar,
        user, setUser, loading, logout

    }
    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider