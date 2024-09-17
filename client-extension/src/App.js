import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider } from "react-router-dom";
import './App.css';
import Login from './components/Authentication/Login';
import Navbar from './components/Authentication/Navbar';
import Register from "./components/Authentication/Register";
import { useAuthContext } from './components/hooks/useAuthContext';
import FoldersContainer from './components/MainContainer/FoldersContainer/FoldersContainer';
import PopupStartWindow from "./components/PopupStartWindow";

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
