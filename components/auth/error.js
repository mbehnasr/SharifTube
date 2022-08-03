import Layout from "../layout/user";
import Head from "next/head";

export default function ForbiddenPage() {
    return (
        <Layout className="shadow py-2 d-flex flex-column justify-content-center align-items-center">
            <Head>
                <title>SharifTube - Forbidden</title>
            </Head>
            <h1>Forbidden</h1>
            <p>You are not permitted to view this page</p>
        </Layout>
    )
}