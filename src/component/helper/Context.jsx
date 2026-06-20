'use client'
import { createContext, useState } from "react";


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
    

    const [cartBar, setCartBar]=useState(false)
    const [menuBar, setMenuBar]=useState(false)


    const contextValue = {
        categories,
        cartBar, setCartBar,menuBar, setMenuBar

    }
    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider