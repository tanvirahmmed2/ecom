'use client'
import { createContext } from "react";


export const Context=createContext()


const ContextProvider = ({children}) => {


    const contextValue={

    }
  return (
    <Context.Provider value={contextValue}>
        {children}
    </Context.Provider>
  )
}

export default ContextProvider