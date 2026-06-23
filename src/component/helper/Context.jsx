'use client'
import { createContext, useState, useEffect } from "react";
import axios from "axios";


export const Context = createContext()


const ContextProvider = ({ children }) => {

    const [categories, setCategories] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const [cart, setCart]=useState({items:[]})
    

    const [cartbar, setCartbar]=useState(false)
    const [userSidebar, setUserSidebar]=useState(false)
    const [dashSidebar, setDashSidebar]=useState(false)
    const [website, setWebsite] = useState(null)

    const fetchWebsite = async () => {
        try {
            const res = await axios.get('/api/settings');
            if (res.data && res.data.website_id) {
                setWebsite(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch website settings:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/category');
            if (res.data && Array.isArray(res.data)) {
                const parents = res.data.filter(c => c.parent_id === null);
                const nested = parents.map(parent => {
                    const children = res.data.filter(c => c.parent_id === parent.category_id);
                    return {
                        id: parent.category_id,
                        category: parent.name,
                        slug: parent.slug,
                        image: parent.image,
                        subcategory: children.map(child => ({
                            id: child.category_id,
                            name: child.name,
                            slug: child.slug,
                            image: child.image
                        }))
                    };
                });
                setCategories(nested);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

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
        fetchWebsite();
        fetchCategories();
    }, []);

    const logout = async () => {
        try {
            await axios.post('/api/user/logout');
            setUser(null);
            window.location.replace('/login')
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    const contextValue = {
        categories,cart, setCart,
        cartbar, setCartbar,userSidebar, setUserSidebar,dashSidebar, setDashSidebar,
        user, setUser, loading, logout,
        website, fetchWebsite
    }
    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider