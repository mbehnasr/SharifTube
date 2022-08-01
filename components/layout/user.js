import {SearchProvider} from "../../context/search";
import {Container} from "react-bootstrap";

export default function Layout({children}) {
    return (
        <SearchProvider>
            <Container>
                {children}
            </Container>
        </SearchProvider>
    )
}