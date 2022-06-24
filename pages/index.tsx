import type { NextPage } from 'next'
import Link from 'next/link';
import { useLanguage, getCookieProp } from '../states/useLanguage';
import { Lang, LanguageSelect } from '../utils/lang'
interface Button {
  text: string[];
  redirect: string;
}

interface ProjectInterface {
  title: string[];
  description: string[];
  buttons: Button[];
}

interface ProjectParams {
  project: ProjectInterface;
  index: number;
  lang: number;
  visibleProjectNum: number;
}

interface homeProps {
  langCookie: string
}

const Home: NextPage<homeProps> = ({ langCookie }) => {
  const { lang, setLang } = useLanguage(langCookie)

  const projects: ProjectInterface[] = [
    {
      title: ['OntroBot'],
      description: ['My personal discord bot (currently offline)', 'Můj osobní discord bot (aktuálně offline)'],
      buttons: [
        {
          text: ['Invite to your server', 'Pozvat na server'],
          redirect: 'https://discordapp.com/oauth2/authorize?client_id=610830662353682464&scope=bot&permissions=8'
        },
        {
          text: ['View source code', 'Zobrazit zdrojový kód'],
          redirect: 'https://github.com/Ontros/OntroBot',
        },
      ]
    },
    {
      title: ['Practising', 'Zkoušení'],
      description: ['Used for learning some school things', 'Stránka na učení'],
      buttons: [
        {
          text: ['Take a look', 'Zobrazit stránku'],
          redirect: 'https://ontros.github.io/zkouseni'
        },
        {
          text: ['View source code', 'Zobrazit zdrojový kód'],
          redirect: 'https://github.com/Ontros/zkouseni/tree/master',
        },
      ]
    },
    {
      title: ['This page', 'Tahle stránka'],
      description: ['The site you see right now', 'Stránka, kterou právě vidíte'],
      buttons: [{
        text: ['View source code', 'Zobrazit zdrojový kód'],
        redirect: 'https://github.com/Ontros/OnSite/tree/master',
      }]
    },
    {
      title: ['Bakaláři'],
      description: ['A frontend to Bakaláři API v3', 'Front-end třetí verze API bakaláři'],
      buttons: [{
        text: ['Take a look', 'Zobrazit stánku'],
        redirect: '/bakalari'
      }]
    }
  ]

  return (
    <div className={"container"}>
      <main className={"main"}>
        <h1 className={"title"}>
          Welcome to my website
        </h1>

        <LanguageSelect lang={lang} setLang={setLang} />

        <div className={"description"}>
          My name is Ontro
          <br />
          and these are my projects
        </div>

        <div className={"grid"}>
          {projects.map((project, index) => {
            return (
              <a key={index} href={project.buttons[0].redirect} className={"card"}>
                <>
                  <h2>{Lang(lang, project.title)} &rarr;</h2>
                  <p>{Lang(lang, project.description)}</p>
                  {project.buttons.map((button, i) => {
                    return (<Link passHref href={button.redirect} key={i}><button>{Lang(lang, button.text)}</button></Link>)
                  })}
                </>
              </a>)
          })}

        </div>
      </main>

    </div>
  )
}

Home.getInitialProps = getCookieProp
export default Home