import '../styles/globals.css'
import '../styles/bakalari.css'
import type { AppProps } from 'next/app'
import Head from '../utils/Head'
import { LanguageProvider } from '../contexts/language'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <LanguageProvider>
        <Head></Head>
        <Component {...pageProps} />
      </LanguageProvider>
    </>

  )
}

export default MyApp
