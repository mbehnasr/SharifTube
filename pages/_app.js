import '../styles/globals.css'
import {SessionProvider} from "next-auth/react";

function App({ Component, pageProps }) {
  return (
      <SessionProvider session={pageProps.session}>
        {/*{pageProps.forbidden ? <ForbiddenError/> : <Component {...pageProps}/>}*/}
        <Component {...pageProps}/>
      </SessionProvider>
  )
}

export default App
