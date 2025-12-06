//2.1.2021

import Image from 'next/image'

import styles from '../styles/Lang.module.css';

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
        flag: '/gb.svg'
    },
    {
        name: 'Česky',
        flag: '/cz.svg'
    }
    ]

    return (
        <div className={styles.languageSelection} onClick={() => {
            setLang(lang < languages.length - 1 ? lang + 1 : 0)
        }
        }>
            <div className={styles.flagContainer}>
                <Image src={languages[lang].flag}
                    alt="Flag"
                    objectFit='contain'
                    layout='fill' />
            </div>
            {languages[lang].name}
        </div>
    )
}

export { Lang, LanguageSelect }