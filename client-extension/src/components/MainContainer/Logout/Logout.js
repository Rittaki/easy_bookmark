import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { useAuthContext } from '../../hooks/useAuthContext';
import './Logout.css';

function Logout(props) {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();
    const { user } = useAuthContext();

    const handleLogout = async () => {
        setError(null);
        setIsPending(true);

        try {
            await signOut(auth);
            dispatch({ type: 'LOGOUT' });

            setIsPending(false);
            setError(null);
        }
        catch (err) {
            console.log(err.message);
            setError(err.message);
            setIsPending(false);
        }
    }

    return (
        <div className='logout-container'>
            <li className="logout">Hello, {user.displayName}</li>
            <li className="logout">
                <button className="logout btn" onClick={handleLogout}><small>Logout</small></button>
            </li>
        </div>
    );
}

export default Logout;