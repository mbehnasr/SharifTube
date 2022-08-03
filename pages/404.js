import Layout from "../components/layout/user";
import Head from "next/head";

export default function NotFoundPage() {
    return (
        <Layout className="shadow py-2 d-flex flex-column justify-content-center align-items-center">
            <Head>
                <title>SharifTube - 404</title>
            </Head>
            <h1>404</h1>
            <p>Page not found or is unavailable now :(</p>
        </Layout>
    )
}