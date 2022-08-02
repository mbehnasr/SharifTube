import {useUser} from "../../hooks/auth";
import {Button, Modal, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {useContext, useState} from "react";
import {AuthTabs} from "../auth/tabs";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {css} from "@emotion/react";
import SearchIcon from '@mui/icons-material/Search';
import SearchContext from "../../context/search";

function SearchBox({className, style}) {
    const router = useRouter();
    const [inputQuery, setInputQuery] = useState('');
    const {q, setQ} = useContext(SearchContext);

    useEffect(() => {
        if (router.query.q) {
            setInputQuery(router.query.q);
            setQ(router.query.q)
        }
    }, [router.query.q]);

    useEffect(() => {
        if (q) {
            setInputQuery(q);
        }
    }, [q])

    const handleSearch = (e) => {
        e.preventDefault();
        setQ(inputQuery);
        router.push(`/?q=${inputQuery}`);
    }

    return <form css={css`
      border: 1px solid #ced4da;
      border-radius: .25rem;
      display: flex;
      align-items: center;
      background: var(--primary-white);
    `} className={className} style={style} onSubmit={handleSearch}>
        <SearchIcon className="mx-2"/>
        <input css={css`
          border: none;
          padding: .6rem .75rem;
          font-weight: 300;
          line-height: 1.5;
          color: var(--primary-input);
          background: transparent;
          width: 100%;

          &:focus {
            outline: none;
          }`} type="text" value={inputQuery} onChange={e => setInputQuery(e.target.value)} placeholder="search something" />
    </form>;
}

export function UserNavBar() {

    const user = useUser();

    const [showLoginModal, setShowLoginModal] = useState(false);

    function handleHideLoginModal() {
        setShowLoginModal(false);
    }

    return <>
        <Navbar expand="sm" className="px-3 py-1 bg-white shadow">
            <Navbar.Toggle className="me-auto" aria-controls="main-navbar-nav"/>
            <Navbar.Collapse id="main-navbar-nav">
                <Nav className="me-auto">
                    {user ? <NavDropdown title={user.username} id="basic-nav-dropdown">
                            <NavDropdown.Divider/>
                            <NavDropdown.Item className="text-right" onClick={() => signOut({redirect: false})}>sign
                                out</NavDropdown.Item>
                        </NavDropdown> :
                        <Button className="shadow-none m-1" variant="outline-secondary"
                                onClick={() => setShowLoginModal(true)}>login / register</Button>}
                    {user && (
                        <Link href="upload" passHref>
                            <Button variant="outline-danger" className="shadow-none m-1">Upload a video</Button>
                        </Link>
                    )}
                </Nav>
                <Nav>
                    <SearchBox />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Modal show={showLoginModal} onHide={handleHideLoginModal}>
            <Modal.Header closeButton/>
            <Modal.Body>
                <AuthTabs onSuccess={handleHideLoginModal}/>
            </Modal.Body>
        </Modal>
    </>
}