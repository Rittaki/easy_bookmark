import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import PopupStartWindow from "./components/PopupStartWindow"
import Register from "./components/Authentication/Register"
import Login from './components/Authentication/Login';
import Navbar from './components/Authentication/Navbar';
import { useAuthContext } from './components/hooks/useAuthContext';

function App() {
  const { authIsReady, user } = useAuthContext();

  console.log('user is', user);

  return (
    <div>
      {authIsReady && (
        <BrowserRouter>
        {!user && <Navbar />}
          
          <Routes>
            <Route path='/popup.html' element={
              user ? (
                <PopupStartWindow />
              ) : (
                <Navigate to="/login" replace={true} />
              )} />
            <Route path="/login" element={
              user ? (
                <Navigate to="/popup.html" replace={true} />
              ) : (
                <Login />
              )} />

            <Route path="/register" element={
              (user && user.displayName) ? (
                <Navigate to="/popup.html" replace={true} />
              ) : (
                <Register />
              )} />

          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
