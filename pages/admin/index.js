import {getUser} from "../../lib/auth";

export default function AdminPanelPage() {
    return (<h1>Admin panel</h1>)
}

export async function getServerSideProps(context) {
    const user = await getUser(context);
    if (!user) return {
        redirect: {
            destination: "/login?redirect=admin",
            permanent: false,
        }
    };
    if (!user.roles.includes("admin")) return {props: {forbidden: true}};
    return {
        props: {}
    }
}