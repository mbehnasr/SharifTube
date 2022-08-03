import Layout from "../components/layout/user";
import Head from "next/head";
import {LoginForm} from "../components/auth/form";
import {useRouter} from "next/router";

export default function LoginPage() {

    const router = useRouter();

    return (
        <Layout className="shadow py-2 d-flex flex-column justify-content-center align-items-center">
            <Head>
                <title>SharifTube - Login</title>
            </Head>
            <h1>Login</h1>
            <p>Please login to continue</p>
            <LoginForm onSuccess={() => router.replace(`/${router.query.redirect || ''}`)} />
        </Layout>
    )
}