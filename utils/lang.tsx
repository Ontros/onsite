//2.1.2021

import FlagCZ from '../public/cz.svg'
import FlagGB from '../public/gb.svg'
import Image from 'next/image'

function Lang(lang: number, array: string[]): string {
    if (array.length === 1) {
        return array[0]
    }

    var ans = array[lang]
    if (ans) {
        return ans
    }
    return "Language error"
}

interface LangProps {
    lang: number;
    setLang: (arg0: number) => void;
}

function LanguageSelect(props: LangProps) {
    const { lang, setLang } = props

    var languages = [{
        name: 'English',
        flag: FlagGB
    },
    {
        name: 'Česky',
        flag: FlagCZ
    }
    ]

    return (
        <div className="language-selection" onClick={() => {
            setLang(lang < languages.length - 1 ? lang + 1 : 0)
        }
        }>
            <Image height={"1.25em"} width={"3em"} src={languages[lang].flag} alt="Flag" className='flag' />
            {languages[lang].name}
        </div>
    )
}

export { Lang, LanguageSelect }