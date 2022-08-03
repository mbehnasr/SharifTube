import {Container} from "react-bootstrap";
import {useState} from "react";
import {AdminSignupForm} from "../../components/auth/form";

export default function AdminSignupPage() {

    const [success, setSuccess] = useState(false);

    return (
        <Container>
            <h1>Admin Signup Page</h1>
            <hr/>
            {success ?
                <h3>Thank for your registration<br/>Your account will be available after a manager verified</h3> :
                <AdminSignupForm onSuccess={() => setSuccess(true)}/>}
        </Container>
    );
}