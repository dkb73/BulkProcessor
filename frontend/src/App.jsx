import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Body from './components/Body';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import DataViewerPage from './pages/DataViewerPage';
import {Toaster} from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {setUser} from './features/auth/authSlice';
import { authService } from './services/api';

// This is the modern way to configure routes in React Router
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Body />,
    // These are the children pages that will be rendered inside the Body's <Outlet />
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/data',
        element: (
          <ProtectedRoute>
            <DataViewerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
]);

function App() {
  const {token} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(()=>{
    const fetchUser = async ()=>{
      try{
        const res = await authService.getMe(token);
        console.log('User fetched successfully:', res.data.data);
        dispatch(setUser(res.data.data));
      }
      catch(err){
        console.error('failed to fetch user', err);
      }
    }
    if(token){
      fetchUser();
    }
    else{
      console.error('No token found, user not authenticated');
    }
  },[token])
  return (
    // The RouterProvider component makes the router available to the whole app
    <>
      <Toaster/>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;