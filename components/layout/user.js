import {SearchProvider} from "../../context/search";
import {Container} from "react-bootstrap";
import {UserNavBar} from "./navbar";

export default function Layout({children, className}) {
    return (
        <SearchProvider>
            <UserNavBar />
            <Container className={className || "py-2 shadow"}>
                {children}
            </Container>
        </SearchProvider>
    )
}