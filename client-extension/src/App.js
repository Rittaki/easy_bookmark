import './App.css';
import { React, Fragment } from "react";
import { BrowserRouter, Routes, Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from "react-router-dom"
import PopupStartWindow from "./components/PopupStartWindow"
import Register from "./components/Authentication/Register"
import Login from './components/Authentication/Login';
import Navbar from './components/Authentication/Navbar';
import { useAuthContext } from './components/hooks/useAuthContext';
import FoldersContainer from './components/MainContainer/FoldersContainer/FoldersContainer';

const Layout = () => {
  const { authIsReady, user } = useAuthContext();

  return (
    <div>
    {!user && <Navbar />}
    <Outlet />
    </div>
  )
}

function App() {
  const { authIsReady, user } = useAuthContext();

  console.log('user is', user);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='popup.html/*' element={
          user ? (
            <PopupStartWindow />
          ) : (
            <Navigate to="/login" replace={true} />
          )} >
          <Route path=":folderName/*" element={<FoldersContainer />} />
        </Route>
        <Route path="login" element={
          user ? (
            <Navigate to="/popup.html" replace={true} />
          ) : (
            <Login />
          )} />

        <Route path="register" element={
          (user && user.displayName) ? (
            <Navigate to="/popup.html" replace={true} />
          ) : (
            <Register />
          )} />

      </Route>
    )
  );

  return (
    <div>
      {authIsReady && (
          <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;
