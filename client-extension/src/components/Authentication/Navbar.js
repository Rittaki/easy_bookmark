import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import './Navbar.css';

function Navbar() {
    const { user } = useAuthContext();

    return (
        <nav className="navbar">
            <ul>
                <li className="title">EasyBookmark</li>
                {!user && (
                    <ul>
                        <li className='nav-link'><NavLink to="/login">Login</NavLink></li>
                        <li className='nav-link'><NavLink to="/register">Signup</NavLink></li>
                    </ul>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;