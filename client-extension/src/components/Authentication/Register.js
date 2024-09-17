import { useState } from 'react';
import { auth } from '../../firebase/firebase';
import { updateProfile, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '../hooks/useAuthContext';
import './Register.css';

function Register() {
    const [credentials, setCredentials] = useState({ email: '', password: '', displayName: '' });
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    const registerUserToMongodb = (user) => {
        chrome.runtime.sendMessage({
            action: "createUser",
            user: {
                name: user.displayName,
                email: user.email,
                uid: user.uid
            }
        }, (response) => {
            if (response.success) {
                console.log('User added to MongoDB (message from client)', response);
                setError(null);
            }
            else {
                setError(json.error);
            };
        });
    }

    const handleRegister = async (email, password, name) => {
        setError(null);
        setIsPending(true);

        try {
            // signup
            const res = await createUserWithEmailAndPassword(auth, email, password);
            console.log("inside handleRegister:", res.user);

            if (!res) {
                throw new Error('Could not complete signup')
            }

            await updateProfile(res.user, {
                displayName: name
            });
            // add creation of profile to mongodb
            registerUserToMongodb(res.user);
            // dispatch login action
            dispatch({ type: 'LOGIN', payload: res.user });

            setIsPending(false);
            setError(null);

        } catch (err) {
            console.log(err.message);
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
        const displayName = e.target.displayName.value;
        handleRegister(email, password, displayName);
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h2>Register</h2>
            <label htmlFor="email">
                <span>Email</span>
                <input
                    type="email"
                    id="email"
                    onChange={handleChange}
                />
            </label>
            <label htmlFor="displayName">
                <span>Display Name</span>
                <input
                    type="text"
                    id="displayName"
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
            {!isPending && <button className="btn start-button">Sign up</button>}
            {isPending && <button className="btn" disabled>Loading...</button>}
            {error && <p>{error}</p>}
        </form>
    );
}

export default Register;