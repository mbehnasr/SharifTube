import {useForm} from "react-hook-form";
import {forwardRef, useState} from "react";
import axios from "axios";
import {signIn} from "next-auth/react";
import {Alert} from "react-bootstrap";
import {css} from "@emotion/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const cssAlias = css;
export const PasswordBox = forwardRef(({onChange, onBlur, name, className, id, value}, ref) => {
    const [visible, setVisible] = useState(false);

    return (<div className={'d-flex flex-row ' + className} id={id}>
        <input css={cssAlias`
              border: none;
              padding: 0;
              font-weight: inherit;
              line-height: inherit;
              font-size: inherit;
              color: inherit;
              background: transparent;
              width: 100%;

              &:focus {
                outline: none;
              }`}
               type={visible ? 'text' : 'password'} onChange={onChange} onBlur={onBlur} name={name}
               ref={ref} value={value}/>
        <button type="button" css={cssAlias`
              display: inline-block;
              font-weight: inherit;
              font-size: inherit;
              line-height: inherit;
              color: inherit;
              background: transparent;
              border: none;
              padding: 0;
              transition: all .2s ease-in-out;

              &:focus {
                border: none
              }
            `} onClick={() => setVisible(!visible)}>
            {visible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
        </button>
    </div>)
});
PasswordBox.displayName = 'PasswordBox';

export function SignupForm({onSuccess}) {

    const {register, formState: {errors}, handleSubmit} = useForm();
    const [serverSideErrors, setServerSideErrors] = useState([]);

    function onSubmit(data) {
        axios.post('/api/auth/signup', data)
            .then(res => {
                signIn('user-password', {redirect: false, username: data.username, password: data.password})
                    .then(() => {
                        if (onSuccess) onSuccess(res.data)
                    });
            })
            .catch(err => setServerSideErrors(err.response.data.errors))
    }

    return (<form className="d-flex flex-column" onSubmit={handleSubmit(onSubmit)}>
        {serverSideErrors.length > 0 && <Alert className="p-2" variant="danger">
            <ul className="m-0">{serverSideErrors.map((err, index) => <li key={index}>{err}</li>)}</ul>
        </Alert>}
        <label htmlFor="username">username</label>
        <input id="username" className="form-control shadow-none my-2" {...register('username', {
            required: true,
            validate: async username => {
                try {
                    await axios.get('/api/auth/exists', {params: {username}});
                    return false;
                } catch (e) {
                    return true;
                }
            }
        })}
               placeholder="johnny"/>
        {errors.username?.type === 'required' && <small className="text-danger">username is required</small>}
        {errors.username?.type === 'validate' && <small className="text-danger">username already exists</small>}
        <label htmlFor="password">password</label>
        <PasswordBox id="password" className="form-control my-2" {...register('password', {required: true})}/>
        {errors.password?.type === 'required' && <small className="text-danger">password is required</small>}
        <button type="submit" className="btn m-2 shadow-none">sign up</button>
    </form>)
}

export function AdminSignupForm({onSuccess}) {

    const {register, formState: {errors}, handleSubmit} = useForm();
    const [serverSideErrors, setServerSideErrors] = useState([]);

    function onSubmit(data) {
        axios.post('/api/admin/signup', data)
            .then(res => {
                if (onSuccess) onSuccess(res.data)
            })
            .catch(err => setServerSideErrors(err.response.data.errors))
    }

    return (<form className="d-flex flex-column" onSubmit={handleSubmit(onSubmit)}>
        {serverSideErrors.length > 0 && <Alert className="p-2" variant="danger">
            <ul className="m-0">{serverSideErrors.map((err, index) => <li key={index}>{err}</li>)}</ul>
        </Alert>}
        <label htmlFor="username">username</label>
        <input id="username" className="form-control shadow-none my-2" {...register('username', {
            required: true,
        })}
               placeholder="johnny"/>
        {errors.username && <small className="text-danger">username is required</small>}
        <label htmlFor="password">password</label>
        <PasswordBox id="password" className="form-control my-2" {...register('password', {
            required: true, minLength: 8, validate: {
                hasUpperCase: value => /[A-Z]/.test(value),
                hasLowerCase: value => /[a-z]/.test(value),
                hasNumber: value => /\d/.test(value),
            }
        })}/>
        {errors.password?.type === 'required' && <small className="text-danger">password is required</small>}
        {errors.password?.type === 'minLength' &&
            <small className="text-danger">password should be more than 8 characters</small>}
        {errors.password?.type === 'hasUpperCase' &&
            <small className="text-danger">password should include capital letter</small>}
        {errors.password?.type === 'hasLowerCase' &&
            <small className="text-danger">password should include small letter</small>}
        {errors.password?.type === 'hasNumber' &&
            <small className="text-danger">password should include numbers</small>}
        <button type="submit" className="btn m-2 shadow-none">sign up</button>
    </form>)
}

export function LoginForm({onSuccess}) {
    const {register, handleSubmit} = useForm();
    const [error, setError] = useState("");

    function onSubmit(data) {
        signIn("user-password", {redirect: false, ...data})
            .then(res => {
                if (res.error) setError(res.error);
                else if (onSuccess) onSuccess();
            });
    }

    return (<form className="d-flex flex-column" onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert className="p-2" variant="danger">{error}</Alert>}
        <label htmlFor="username">username</label>
        <input id="username" className="form-control shadow-none my-2" {...register('username')}
               placeholder="johnny"/>
        <label htmlFor="password">password</label>
        <PasswordBox id="password" className="form-control my-2" {...register('password')}/>
        <button type="submit" className="btn m-2 shadow-none">sign in</button>
    </form>)
}