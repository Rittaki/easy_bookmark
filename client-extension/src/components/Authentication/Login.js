import { useState } from 'react';
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '../hooks/useAuthContext';
import './Login.css';

function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    const handleLogin = async (email, password) => {
        setError(null);
        setIsPending(true);

        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            dispatch({ type: 'LOGIN', payload: res.user });

            setIsPending(false);
            setError(null);
        }
        catch (err) {
            console.log(err.message)
            setError(err.message);
            setIsPending(false);
        }
    }

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(credentials);

        const email = e.target.email.value;
        const password = e.target.password.value;
        handleLogin(email, password);
    }

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <label htmlFor="email">
                <span>Email</span>
                <input
                    type="email"
                    id="email"
                    onChange={handleChange}
                />
            </label>
            <label htmlFor="password">
                <span>Password</span>
                <input
                    type="password"
                    id="password"
                    onChange={handleChange}
                />
            </label>
            {!isPending && <button className="btn start-button">Login</button>}
            {isPending && <button className="btn" disabled>Loading...</button>}
            {error && <p>{error}</p>}
        </form>
    );
}

export default Login;