import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { ScriptProps } from "next/script";

const LanguageContext = createContext(undefined)

export function LanguageProvider({ children }: ScriptProps) {
    const [lang, setLang] = useState(0) //1 = czech; 0 = english
    useEffect(() => {
        setLang(navigator.language.substring(0, 2).toLowerCase() === 'cs' ? 1 : 0)
    }, [])

    return (
        <LanguageContext.Provider
            //@ts-expect-error
            value={{
                lang, setLang,
            }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    //@ts-expect-error
    const context = useContext<{ lang: number, setLang: Dispatch<SetStateAction<number>> }>(LanguageContext)

    if (!context)
        throw new Error('useLanguage must be inside LanguageProvider')

    return context
}