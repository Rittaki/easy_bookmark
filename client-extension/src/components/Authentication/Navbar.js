import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import './Navbar.css'

function Navbar() {
    const { user } = useAuthContext();

    return (
        <nav className="navbar">
            <ul>
                <li className="title">EasyBookmark</li>
                {!user && (
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Signup</Link></li>
                    </ul>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;