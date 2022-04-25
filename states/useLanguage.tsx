import { useEffect, useState } from "react"
import cookie from 'cookie'
import Cookie from 'js-cookie'
import { NextPageContext } from "next"

export function useLanguage(cookieLanguage: string) {
    var langInitial: number = cookieLanguage ? parseInt(cookieLanguage) : 0
    const [lang, setLangS] = useState<number>(langInitial)
    const setLang = (newLang: number) => {
        Cookie.set("language", newLang.toString())
        setLangS(newLang)
    }
    return { lang, setLang }
}
//TODO:
export function getCookieProp({ req }: NextPageContext) {
    const cookies = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    console.log("cookies", cookies, cookies.language)

    return {
        langCookie: cookies.language
    };
}
