import '../styles/globals.css'
import {SessionProvider} from "next-auth/react";
import ForbiddenPage from "../components/auth/error";

function App({ Component, pageProps }) {
  return (
      <SessionProvider session={pageProps.session}>
        {pageProps.forbidden ? <ForbiddenPage /> : <Component {...pageProps}/>}
      </SessionProvider>
  )
}

export default App
