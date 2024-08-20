import { createContext, useContext, useState } from "react";

const StatusContext = createContext(null)


export default function StatusProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    return <StatusContext.Provider value={[loading, setLoading, error, setError]}>
        {children}
    </StatusContext.Provider>
}


export const useStatus = () => { return useContext(StatusContext) }