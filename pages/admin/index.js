import {getUser} from "../../lib/auth";
import {Container} from "react-bootstrap";
import {AdminTabs} from "../../components/auth/tabs";

export default function AdminPanelPage() {

    return (
        <Container className="mt-2">
            <AdminTabs />
        </Container>
    );
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