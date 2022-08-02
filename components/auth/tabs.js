import {useState} from "react";
import {Tab, Tabs} from "react-bootstrap";
import {LoginForm, SignupForm} from "./form";

export function AuthTabs({onSuccess}) {
    const [key, setKey] = useState("login");

    return (
        <Tabs
            id="controlled-tab-forms"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            <Tab eventKey="login" title="sign in" tabClassName="text-red preserve-color">
                <LoginForm onSuccess={onSuccess}/>
            </Tab>
            <Tab eventKey="signup" title="sign up" tabClassName="text-red preserve-color">
                <SignupForm onSuccess={onSuccess}/>
            </Tab>
        </Tabs>
    )
}