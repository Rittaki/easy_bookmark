import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useHistoryContext } from "../../hooks/useHistoryContext";
import './Logout.css';

function Logout(props) {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();
    const { user } = useAuthContext();
    const { setBackStack } = useHistoryContext();

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
        setBackStack((prevState) => ([{_id: "66a65fac5eddc59b4d8525f6", name: "Home", parentFolder: "", linksNumber: 2, path: "/"}]));
    }

    return (
        <div className='logout-container'>
            <li className="logout" >
                <span className='tt' data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title={`Hello, ${user.displayName}`}
                    style={{}}>
                    <i className="bi bi-person-circle " style={{ color: '#38B6FF', fontSize: '25px' }}></i>
                </span>
            </li>

            <li className="logout">
                <button className="logout btn" style={{paddingLeft: '5px', paddingRight: '5px'}} onClick={handleLogout}>Logout</button>
            </li>
        </div>
    );
}

export default Logout;