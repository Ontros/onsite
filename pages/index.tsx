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
      description: ['My personal discord bot', 'Můj osobní discord bot'],
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
    // {
    //   title: ['Practising', 'Zkoušení'],
    //   description: ['Used for learning some school things', 'Stránka na učení'],
    //   buttons: [
    //     {
    //       text: ['Take a look', 'Zobrazit stránku'],
    //       redirect: 'https://ontros.github.io/zkouseni'
    //     },
    //     {
    //       text: ['View source code', 'Zobrazit zdrojový kód'],
    //       redirect: 'https://github.com/Ontros/zkouseni/tree/master',
    //     },
    //   ]
    // },
    {
      title: ['This page', 'Tahle stránka'],
      description: ['The site you see right now', 'Stránka, kterou právě vidíte'],
      buttons: [{
        text: ['View source code', 'Zobrazit source code'],
        redirect: 'https://github.com/Ontros/OnSite/tree/master',
      }]
    },
    {
      title: ['FindMyBro'],
      description: ['My app for finding friends for sports', 'Moje aplikace na hledání kamarádů na sportování'],
      buttons: [{
        text: ['AppStore'],
        redirect: 'https://apps.apple.com/us/app/find-my-bro/id6446882567'
      }, {
        text: ['Google Play'],
        redirect: 'https://play.google.com/store/apps/details?id=cz.findmybro.findmybro'
      }]
    },
    {
      title: ['F1 Predictions'],
      description: ['Site for predicting F1 races', 'Stránka na předpovídání F1 závodů'],
      buttons: [{
        text: ['Take a look', 'Zobrazit stránku'],
        redirect: '/f1'
      },
      {
        text: ['View source code', 'Zobrazit source code'],
        redirect: 'https://github.com/Ontros/onsite/tree/main/pages/f1'
      }]
    },
    {
      title: ['Bakaláři'],
      description: ['A frontend to the Bakaláři API', 'Front-end API bakalářů'],
      buttons: [{
        text: ['Take a look', 'Zobrazit stánku'],
        redirect: '/bakalari'
      }]
    },
    {
      title: ['Comeback guessr', 'Comeback guessr'],
      description: ['Guess the comeback episode from a single frame', 'Uhodni comeback epizodu z jednoho obrázku'],
      buttons: [{
        text: ['Take a look', 'Zobrazit stránku'],
        redirect: '/comeback'
      }
      ]
    }
  ];

  return (
    <div className={"container"}>
      <main className={"main"}>
        <h1 className={"title"}>
          Ondřej Stupka Linktree
        </h1>

        <LanguageSelect lang={lang} setLang={setLang} />


        <div className={"grid"}>
          {projects.map((project, index) => {
            return (
              <a key={index} href={project.buttons[0].redirect} className={"card"}>
                <>
                  <h2>{Lang(lang, project.title)} &rarr;</h2>
                  <p>{Lang(lang, project.description)}</p>
                  <div className='redirect-button-container'>
                    {project.buttons.map((button, i) => {
                      return (<Link href={button.redirect} key={i}><button>{Lang(lang, button.text)}</button></Link>);
                    })}
                  </div>
                </>
              </a>
            );
          })}

        </div>
      </main>
    </div>
  );
}

Home.getInitialProps = getCookieProp
export default Home